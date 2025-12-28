from django.utils import timezone
from datetime import datetime

from django.contrib.auth import authenticate, login, logout
from django.middleware.csrf import get_token
from django.views.decorators.csrf import ensure_csrf_cookie 
from django.utils.decorators import method_decorator

from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import AllowAny, IsAuthenticated

from .models import DailyMenu, UserComment, ItemRating, CommentVote
from django.db.models import F                                      # For preventing race conditions    
from .serializers import DailyMenuSerializer, UserRegistrationSerializer, UserCommentSerializer, ItemRatingSerializer
###################################################

class TodayMenuView(APIView):

    permission_classes = (AllowAny, )# you can check the menu without being logged in

    def get(self, request):
        today = timezone.now().date()
        return self.get_menu_response(today)

    def get_menu_response(self, date_obj): # new function for getting menu DRY
        try:
            from .models import DailyMenu, ItemRating
            from django.db.models import Avg
            
            menu = DailyMenu.objects.get(menu_date=date_obj)
            
            # --- OPTIMIZATION START ---
            
            # 1. Pre-fetch Average Ratings for ALL meals in this menu
            # Result: { meal_id: 4.5, meal_id_2: 3.2, ... }
            avg_ratings = ItemRating.objects.filter(menu=menu).values('meal').annotate(avg_rating=Avg('rating'))
            avg_ratings_map = {item['meal']: round(item['avg_rating'], 1) for item in avg_ratings}

            # 2. Pre-fetch User Ratings for ALL meals in this menu (if logged in)
            # Result: { meal_id: 5, meal_id_2: 3, ... }
            user_ratings_map = {}
            if self.request.user.is_authenticated:
                user_ratings = ItemRating.objects.filter(menu=menu, user=self.request.user).values('meal', 'rating')
                user_ratings_map = {item['meal']: item['rating'] for item in user_ratings}

            # --- OPTIMIZATION END ---

            context = {
                'request': self.request,
                'avg_ratings_map': avg_ratings_map,
                'user_ratings_map': user_ratings_map
            }
            
            serializer = DailyMenuSerializer(menu, context=context)
            return Response(serializer.data, status=status.HTTP_200_OK)
        except DailyMenu.DoesNotExist:
            return Response(
                {"error": f"{date_obj} tarihinde yemek çıkmadı aga, aç kaldık."},
                status=status.HTTP_404_NOT_FOUND
            )

class MenuByDateView(TodayMenuView):
    
    permission_classes = (AllowAny, )

    def get(self, request, date_str): # translates the date string to date object/ YYYY-MM-DD format
        try:
            date_obj = datetime.strptime(date_str, '%Y-%m-%d').date()
            return self.get_menu_response(date_obj) # calls the get_menu_response function for the specific date
        except ValueError:
            return Response(
                {"error": "Geçersiz tarih formatı"},
                status=status.HTTP_400_BAD_REQUEST
            )

class MonthlyMenuMainDishesView(APIView): # for calender view
    permission_classes = (AllowAny, )

    def get(self, request):
        today = datetime.now().date()
        year = today.year
        month = today.month
        
        menus = DailyMenu.objects.filter(menu_date__year=year, menu_date__month=month).order_by('menu_date')
        
        data = []

        for menu in menus:
            from .models import MenuContent

            main_dish_content = MenuContent.objects.filter(
                menu=menu,
                meal__category__name__in=["Ana Yemek", "main"] 
            ).select_related('meal').first()

            if main_dish_content:
                data.append({
                    "date": menu.menu_date,
                    "main_dish": {
                        "id": main_dish_content.meal.meal_id,
                        "name": main_dish_content.meal.name,
                        "image": main_dish_content.meal.image_url
                    }
                })
        
        return Response(data)

###################################################

# User Views

#CSRF Token 
@method_decorator(ensure_csrf_cookie, name='dispatch')
class GetCSRFToken(APIView):
    permission_classes = (AllowAny, )
    # Ensure CSRF cookie is set when user visits the page # FRONTEND should implement this
    def get(self, request):
        return Response({'success': 'CSRF cookie set'})

#register
class RegisterView(APIView):
    # register user using UserRegistrationSerializer
    permission_classes = (AllowAny, )

    def post(self, request): # request should come from FRONTEND
        serializer = UserRegistrationSerializer(data=request.data) # serializer will validate the data
        if serializer.is_valid():
            serializer.save() 
            
            # 201 CREATED
            return Response({'detail': 'Kayit basarili! Giris yapabilirsiniz.'}, status=status.HTTP_201_CREATED)
        else:
            # 400 BAD REQUEST
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

#login
class LoginView(APIView):
    permission_classes = (AllowAny, )

    def post(self, request): #FRONTEND should send username and password
        username = request.data.get('username')
        password = request.data.get('password')

        user = authenticate(username=username, password=password)

        if user is not None:
            login(request, user)
            return Response({'detail': f'Welcome {user.username}!'}, status=status.HTTP_200_OK)
        else:
            return Response({'detail': 'Invalid credentials'}, status=status.HTTP_401_UNAUTHORIZED)
            
#logout
class LogoutView(APIView):
    def post(self, request):
        try:
            logout(request)
            return Response({'detail': 'Logout successful'}, status=status.HTTP_200_OK)
        except:
            return Response({'detail': 'Sorry, something went wrong'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

#check auth
class CheckAuthView(APIView):
    
    permission_classes = (IsAuthenticated, )
    
    def get(self, request):
        from .models import Rank
        
        # Calculate next rank xp
        current_xp = request.user.total_xp
        next_rank = Rank.objects.filter(min_xp__gt=current_xp).order_by('min_xp').first()
        next_rank_xp = next_rank.min_xp if next_rank else None

        return Response({
            'isAuthenticated': True,
            'username': request.user.username,
            'email': request.user.email,
            'total_xp': request.user.total_xp,
            'next_rank_xp': next_rank_xp,
            'next_rank_xp': next_rank_xp,
            'rank': request.user.rank.rank_name if request.user.rank else "Peçete",
            'rank_level': request.user.rank.rank_id if request.user.rank else 0
        })

###########################################
# Social Views

class CommentView(APIView):
    
    def get_permissions(self): # everybody can get comments, but only authenticated users can post comments
        if self.request.method == 'GET':
            return [AllowAny()]
        return [IsAuthenticated()]

    def get(self, request, menu_id): # get comments for a specific menu

        comments = UserComment.objects.filter(menu_id=menu_id).order_by('-upvotes', '-created_at')
        serializer = UserCommentSerializer(comments, many=True, context={'request': request})
        return Response(serializer.data)

    def post(self, request, menu_id): # post a comment

        data = request.data.copy()
        data['menu'] = menu_id
        
        serializer = UserCommentSerializer(data=data)
        if serializer.is_valid():

            serializer.save(user=request.user)
            
            # Anti-Spam only gives XP for first 3 comments
            files_count = UserComment.objects.filter(user=request.user, menu_id=menu_id).count()
            if files_count <= 3:
                request.user.add_xp('WRITE_COMMENT')
            
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


#rating
class RatingView(APIView):
    permission_classes = (IsAuthenticated, )

    def post(self, request, menu_id):
        from django.db.models import Avg
        data = request.data.copy()
        data['menu'] = menu_id
        meal_id = data.get('meal')
        
        # check if exists
        existing_rating = ItemRating.objects.filter(user=request.user, menu_id=menu_id, meal_id=meal_id).first()

        response_data = None
        status_code = status.HTTP_200_OK

        if existing_rating:
            # update if exists
            serializer = ItemRatingSerializer(existing_rating, data=data)
            if serializer.is_valid():
                serializer.save()
                response_data = serializer.data
                status_code = status.HTTP_200_OK
        else:
            # create if doesn't exist
            serializer = ItemRatingSerializer(data=data)
            if serializer.is_valid():
                serializer.save(user=request.user)

                request.user.add_xp('MEAL_RATING') # add xp for rating
                response_data = serializer.data
                status_code = status.HTTP_201_CREATED
        
        if response_data:
            # Calculate new average
            ratings = ItemRating.objects.filter(meal_id=meal_id, menu_id=menu_id)
            avg = ratings.aggregate(Avg('rating'))['rating__avg']
            new_avg = round(avg, 1) if avg else 0
            response_data['new_average'] = new_avg
            return Response(response_data, status=status_code)
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


# Upvote/Downvote logic
class VoteCommentView(APIView):
    permission_classes = (IsAuthenticated, )

    def post(self, request, comment_id):
        # Default to UP if not provided
        vote_type = request.data.get('vote_type', 'UP') 
        if vote_type not in ['UP', 'DOWN']:
            return Response({"error": "Invalid vote type. Use UP or DOWN"}, status=status.HTTP_400_BAD_REQUEST)

        try:
            comment = UserComment.objects.get(comment_id=comment_id)
        except UserComment.DoesNotExist:
             return Response({"error": "Yorum bulunamadi"}, status=status.HTTP_404_NOT_FOUND)

        existing_vote = CommentVote.objects.filter(user=request.user, comment=comment).first()

        if existing_vote:
            if existing_vote.vote_type == vote_type:

                existing_vote.delete()
                

                if vote_type == 'UP':
                    comment.upvotes = F('upvotes') - 1
                else:
                    comment.downvotes = F('downvotes') - 1
                
                comment.save()

                comment.refresh_from_db()
                return Response({"status": "removed", "upvotes": comment.upvotes, "downvotes": comment.downvotes}, status=status.HTTP_200_OK)
            
            else:
                old_type = existing_vote.vote_type
                existing_vote.vote_type = vote_type
                existing_vote.save()
                
                if vote_type == 'UP':
                    comment.upvotes = F('upvotes') + 1
                    comment.downvotes = F('downvotes') - 1
                    # Give XP to comment owner for receiving UP (Check: Don't give XP to self)
                    if comment.user and comment.user != request.user: 
                        comment.user.add_xp('RECEIVE_UPVOTE')
                else:
                    comment.upvotes = F('upvotes') - 1
                    comment.downvotes = F('downvotes') + 1
                
                comment.save()
                comment.refresh_from_db()
                return Response({"status": "switched", "upvotes": comment.upvotes, "downvotes": comment.downvotes}, status=status.HTTP_200_OK)

        else:
            CommentVote.objects.create(user=request.user, comment=comment, vote_type=vote_type)
            
            if vote_type == 'UP':
                comment.upvotes = F('upvotes') + 1
                # Give XP to comment owner
                if comment.user and comment.user != request.user: 
                    comment.user.add_xp('RECEIVE_UPVOTE')
            else:
                comment.downvotes = F('downvotes') + 1

            comment.save()
            comment.refresh_from_db()
            return Response({"status": "created", "upvotes": comment.upvotes, "downvotes": comment.downvotes}, status=status.HTTP_201_CREATED)

# Leaderboard View
class LeaderboardView(APIView):
    permission_classes = (AllowAny, )

    def get(self, request):
        # Top 20 users by XP
        from .models import User
        users = User.objects.order_by('-total_xp')[:20]
        data = []
        for i, user in enumerate(users):
            data.append({
                "rank": i + 1,
                "username": user.username,
                "xp": user.total_xp,
                "xp": user.total_xp,
                "badge": user.rank.rank_name if user.rank else "Çaylak",
                "rank_level": user.rank.rank_id if user.rank else 0,
                "avatar_initial": user.username[0].upper() if user.username else "?"
            })
            
        # --- Self Rank Calculation ---
        self_data = None
        if request.user.is_authenticated:
            my_xp = request.user.total_xp
            # Rank is count of people with strictly more XP + 1
            my_rank = User.objects.filter(total_xp__gt=my_xp).count() + 1
            
            self_data = {
                "rank": my_rank,
                "username": request.user.username,
                "xp": request.user.total_xp,
                "badge": request.user.rank.rank_name if request.user.rank else "Çaylak",
                "rank_level": request.user.rank.rank_id if request.user.rank else 0,
                "avatar_initial": request.user.username[0].upper() if request.user.username else "?"
            }

        return Response({
            "leaders": data,
            "self": self_data
        }, status=status.HTTP_200_OK)

# User Activity View (Profile)
class UserActivityView(APIView):
    permission_classes = (IsAuthenticated, )

    def get(self, request):
        user = request.user
        
        # 1. User Comments
        comments = UserComment.objects.filter(user=user).select_related('subject_meal').order_by('-created_at')
        comments_data = []
        for c in comments:
            comments_data.append({
                "id": c.comment_id,
                "text": c.comment_text,
                "target": c.subject_meal.name if c.subject_meal else "Genel",
                "date": c.created_at.date(), # Format handled by DRF usually but manual here
                "upvotes": c.upvotes,
                "downvotes": c.downvotes
            })

        # 2. User Ratings
        ratings = ItemRating.objects.filter(user=user).select_related('meal').order_by('-created_at')
        ratings_data = []
        for r in ratings:
            ratings_data.append({
                "id": r.rating_id,
                "name": r.meal.name if r.meal else "Bilinmeyen Yemek",
                "rating": r.rating,
                "date": r.created_at.date(),
                "img": r.meal.image_url if r.meal else ""
            })

        return Response({
            "comments": comments_data,
            "ratings": ratings_data
        }, status=status.HTTP_200_OK)

# --- DASHBOARD VIEWS ---

class DashboardStatsView(APIView):
    # Only admins or special users should see this? For now AllowAny
    permission_classes = (AllowAny, ) 

    def get(self, request):
        from django.db.models import Avg, Count
        from django.utils import timezone
        import datetime

        today = timezone.now().date()
        yesterday = today - datetime.timedelta(days=1)

        # 1. Total Votes (Today)
        today_ratings_qs = ItemRating.objects.filter(created_at__date=today)
        total_votes = today_ratings_qs.count()

        # 2. Average Score (Today)
        today_avg = today_ratings_qs.aggregate(Avg('rating'))['rating__avg'] or 0
        today_avg = round(today_avg, 2)

        # 3. Yesterday Comparison
        yesterday_ratings_qs = ItemRating.objects.filter(created_at__date=yesterday)
        yesterday_avg = yesterday_ratings_qs.aggregate(Avg('rating'))['rating__avg'] or 0
        
        diff_percent = 0
        if yesterday_avg > 0:
            diff_percent = ((today_avg - yesterday_avg) / yesterday_avg) * 100
        elif today_avg > 0:
            diff_percent = 100 
        
        diff_percent = round(diff_percent, 1)

        # 4. Lowest Rated Meal (Today)
        # Find the meal with lowest avg rating in today's menu
        worst_meal_data = None
        try:
            todays_menu = DailyMenu.objects.filter(menu_date=today).first()
            if todays_menu:
                # Find worst meal in this menu
                worst_meal = ItemRating.objects.filter(menu=todays_menu)\
                    .values('meal__name', 'meal__image_url')\
                    .annotate(avg=Avg('rating'))\
                    .order_by('avg').first()
                
                if worst_meal:
                    worst_meal_data = {
                        "name": worst_meal['meal__name'],
                        "score": round(worst_meal['avg'], 1),
                        "image": worst_meal.get('meal__image_url')
                    }
        except Exception:
            pass

        return Response({
            "total_votes": total_votes,
            "today_avg": today_avg,
            "yesterday_avg": round(yesterday_avg, 2),
            "diff_percent": diff_percent,
            "worst_meal": worst_meal_data
        }, status=status.HTTP_200_OK)

class DashboardAnalyticsView(APIView):
    permission_classes = (AllowAny, )

    def get(self, request):
        from django.db.models import Avg, Count
        from django.db.models.functions import TruncDate
        from django.utils import timezone
        import datetime

        today = timezone.now().date()
        thirty_days_ago = today - datetime.timedelta(days=30)
        
        # 1. Trend Chart (Last 30 Days)
        # Group by Date, Calculate Avg Rating
        trend_data = ItemRating.objects.filter(created_at__date__gte=thirty_days_ago)\
            .values('created_at__date')\
            .annotate(avg_score=Avg('rating'), count=Count('rating_id'))\
            .order_by('created_at__date')
        
        # Format for frontend [ {date: '2024-10-01', score: 4.2}, ... ]
        chart_data = []
        for entry in trend_data:
            chart_data.append({
                "date": entry['created_at__date'].strftime('%Y-%m-%d'),
                "score": round(entry['avg_score'], 1),
                "votes": entry['count']
            })

        # 2. Sentiment Distribution (This Month)
        this_month_start = today.replace(day=1)
        month_ratings = ItemRating.objects.filter(created_at__date__gte=this_month_start)
        
        positive = month_ratings.filter(rating__gte=3).count()
        negative = month_ratings.filter(rating__lt=3).count()
        
        sentiment_data = [
            {"name": "Pozitif (3+)", "value": positive},
            {"name": "Negatif (<3)", "value": negative}
        ]

        return Response({
            "trend_chart": chart_data,
            "sentiment_chart": sentiment_data
        }, status=status.HTTP_200_OK)