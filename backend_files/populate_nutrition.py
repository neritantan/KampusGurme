import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings')
django.setup()

from core.models import Meal, MealNutrition, Category

def populate():
    missing_meals = Meal.objects.filter(mealnutrition__isnull=True)
    print(f"Found {missing_meals.count()} meals with missing nutrition info.")

    count = 0
    for meal in missing_meals:
        name = meal.name.lower()
        cat_name = meal.category.name.lower() if meal.category else ""
        
        # Default defaults
        kcal, prot, carb, fat = 250, 10, 30, 10

        # Logic based on Category or Name
        if 'çorba' in cat_name or 'corba' in cat_name or 'soup' in cat_name or 'çorba' in name:
            kcal, prot, carb, fat = 150, 5, 15, 5
        elif 'ana' in cat_name or 'main' in cat_name:
            if 'tavuk' in name or 'köfte' in name or 'et' in name or 'kebab' in name:
                 kcal, prot, carb, fat = 550, 35, 20, 30
            else: # Veggie main
                 kcal, prot, carb, fat = 400, 12, 45, 18
        elif 'pilav' in name or 'makarna' in name or 'börek' in name or 'erişte' in name:
            kcal, prot, carb, fat = 320, 6, 55, 8
        elif 'salata' in cat_name or 'salad' in cat_name or 'cacık' in name:
            kcal, prot, carb, fat = 90, 3, 10, 5
        elif 'tatlı' in cat_name or 'desert' in cat_name or 'puding' in name or 'helva' in name:
            kcal, prot, carb, fat = 380, 4, 65, 12
        elif 'meyve' in cat_name or 'fruit' in cat_name or 'elma' in name or 'mandalina' in name:
            kcal, prot, carb, fat = 60, 1, 15, 0
        elif 'yoğurt' in name or 'ayran' in name:
            kcal, prot, carb, fat = 120, 6, 8, 7

        MealNutrition.objects.create(
            meal=meal,
            calories=kcal,
            protein=prot,
            carbs=carb,
            fat=fat
        )
        print(f"Added info for: {meal.name} ({kcal} kcal)")
        count += 1

    print(f"Successfully populated nutrition for {count} meals.")

if __name__ == '__main__':
    populate()
