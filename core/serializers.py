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
