from rest_framework import serializers
from .models import *

# Serializers used for converting model instances to JSON and vice versa. 

class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = ['category_id', 'name']

class MealNutritionSerializer(serializers.ModelSerializer):
    class Meta:
        model = MealNutrition
        fields = ['calories', 'protein', 'carbs', 'fat']

class MealSerializer(serializers.ModelSerializer):
    category = CategorySerializer(read_only=True)
    mealnutrition = MealNutritionSerializer(read_only=True)
    
    rating = serializers.SerializerMethodField()
    user_rating = serializers.SerializerMethodField()

    class Meta:
        model = Meal
        fields = ['meal_id', 'name', 'description', 'image_url', 'category', 'mealnutrition', 'rating', 'user_rating']

    def get_rating(self, obj):
        from django.db.models import Avg
        menu_id = self.context.get('menu_id')
        if not menu_id:
             return 0 # Fallback
             
        ratings = ItemRating.objects.filter(meal=obj, menu_id=menu_id) # Filter by Meal AND Menu
        avg = ratings.aggregate(Avg('rating'))['rating__avg']
        return round(avg, 1) if avg else 0

    def get_user_rating(self, obj):
        request = self.context.get('request')
        menu_id = self.context.get('menu_id')

        if request and request.user.is_authenticated and menu_id:
            rating_obj = ItemRating.objects.filter(user=request.user, meal=obj, menu_id=menu_id).first()
            return rating_obj.rating if rating_obj else 0
        return 0

class DailyMenuSerializer(serializers.ModelSerializer):
    meals = serializers.SerializerMethodField()
    class Meta:
        model = DailyMenu
        fields = ['menu_id', 'menu_date', 'meals']
    def get_meals(self, obj):
        menu_contents = MenuContent.objects.filter(menu=obj) 
        meals = [content.meal for content in menu_contents] 
        # Pass request AND menu_id to MealSerializer context
        context = self.context.copy()
        context['menu_id'] = obj.menu_id
        return MealSerializer(meals, many=True, context=context).data

# work in progress for user interactions and other things

# User registration serializers and stuff

from django.contrib.auth import get_user_model
from django.contrib.auth.password_validation import validate_password

User = get_user_model()

class UserRegistrationSerializer(serializers.ModelSerializer):
    #Serializer for user registration takes JSON data and creates a new user instance
    password = serializers.CharField(write_only=True, required=True, validators=[validate_password])
    password_confirm = serializers.CharField(write_only=True, required=True)
    email = serializers.EmailField(required=True) 
    
    class Meta:
        model = User
        fields = ['username', 'password', 'password_confirm', 'email']

    def validate(self, attrs): # for password confirmation
        if attrs['password'] != attrs['password_confirm']:
            raise serializers.ValidationError({"password": "Sifreler uyusmuyor!"})
        return attrs

    def create(self, validated_data): # for creating user
        validated_data.pop('password_confirm')
        user = User.objects.create_user(
            username=validated_data['username'],
            password=validated_data['password'],
            email=validated_data['email']
        )
        return user
        
################################ Social Serializers ################################

class UserCommentSerializer(serializers.ModelSerializer):

    username = serializers.CharField(source='user.username', read_only=True)
    user_vote = serializers.SerializerMethodField()

    class Meta:

        model = UserComment
        
        fields = ['comment_id', 'username', 'menu', 'subject_meal', 'comment_text', 'upvotes', 'downvotes', 'user_vote', 'created_at']
        read_only_fields = ['comment_id', 'username', 'upvotes', 'downvotes', 'created_at']
        
    
        extra_kwargs = {
            'subject_meal': {'required': False, 'allow_null': True}
        }

    def get_user_vote(self, obj):
        request = self.context.get('request')
        if request and request.user.is_authenticated:
            # We need to find if there is a VOte for this comment by this user
            from .models import CommentVote
            vote = CommentVote.objects.filter(user=request.user, comment=obj).first()
            return vote.vote_type if vote else None
        return None

from django.core.validators import MinValueValidator, MaxValueValidator

class ItemRatingSerializer(serializers.ModelSerializer):
    rating = serializers.IntegerField(validators=[MinValueValidator(1), MaxValueValidator(5)])
    
    class Meta:
        model = ItemRating
        fields = ['rating_id', 'menu', 'meal', 'rating']