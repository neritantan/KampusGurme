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

from .models import DailyMenu
from .serializers import DailyMenuSerializer, UserRegistrationSerializer
###################################################

class TodayMenuView(APIView):

    permission_classes = (AllowAny, )# you can check the menu without being logged in

    def get(self, request):
        today = timezone.now().date()
        return self.get_menu_response(today)

    def get_menu_response(self, date_obj): # new function for getting menu DRY
        try:
            menu = DailyMenu.objects.get(menu_date=date_obj)
            serializer = DailyMenuSerializer(menu)
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
        return Response({
            'isAuthenticated': True,
            'username': request.user.username,
            'email': request.user.email,
            'total_xp': request.user.total_xp,
            'rank': request.user.rank.rank_name if request.user.rank else "Peçete" # to show in profile
        })

###########################################