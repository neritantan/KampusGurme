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
    class Meta:
        model = Meal
        fields = ['meal_id', 'name', 'description', 'image_url', 'category', 'mealnutrition']

class DailyMenuSerializer(serializers.ModelSerializer):
    meals = serializers.SerializerMethodField()
    class Meta:
        model = DailyMenu
        fields = ['menu_id', 'menu_date', 'meals']
    def get_meals(self, obj):
        menu_contents = MenuContent.objects.filter(menu=obj) 
        meals = [content.meal for content in menu_contents] # get all the meals from specific MenuContent record
        return MealSerializer(meals, many=True).data # all in one

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

    class Meta:

        model = UserComment
        
        fields = ['comment_id', 'username', 'menu', 'subject_meal', 'comment_text', 'upvotes', 'downvotes', 'created_at']
        read_only_fields = ['comment_id', 'username', 'upvotes', 'downvotes', 'created_at']
        
    
        extra_kwargs = {
            'subject_meal': {'required': False, 'allow_null': True}
        }

from django.core.validators import MinValueValidator, MaxValueValidator

class ItemRatingSerializer(serializers.ModelSerializer):
    rating = serializers.IntegerField(validators=[MinValueValidator(1), MaxValueValidator(5)])
    
    class Meta:
        model = ItemRating
        fields = ['rating_id', 'menu', 'meal', 'rating']