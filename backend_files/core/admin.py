from django.contrib import admin
from .models import *

# --- SETTINGS AND DEFINITION TABLES ---
admin.site.register(Rank)
admin.site.register(Category)
admin.site.register(Allergen)
admin.site.register(ActionConfig)

# --- MENU CONTENT ---
# for making it easier to add meals to daily menu
class MenuContentInline(admin.TabularInline):
    model = MenuContent
    extra = 1 

class DailyMenuAdmin(admin.ModelAdmin):
    inlines = [MenuContentInline] # daily menu icine gomuluyor
    list_display = ['menu_date', 'created_at'] 

admin.site.register(DailyMenu, DailyMenuAdmin)

# --- OTHER TABLES ---
admin.site.register(User)

# MealNutrition'i Meal icine gommek icin inline tanimi
class MealNutritionInline(admin.StackedInline):
    model = MealNutrition
    can_delete = False
    verbose_name_plural = 'Besin Değerleri'

class MealAdmin(admin.ModelAdmin):
    inlines = [MealNutritionInline] # Besin degerleri artik yemek sayfasinin icinde cikacak
    list_display = ['name', 'category'] # Listede kategori de gorunsun
    search_fields = ['name'] # Isimle arama yapabil
    list_filter = ['category'] # Saga kategori filtresi koy

admin.site.register(Meal, MealAdmin)

# admin.site.register(MealNutrition) # gives error due to version -> Artik MealAdmin icinde, buraya gerek yok
# admin.site.register(MealAllergen)  # gives error due to version -> Ileride bunu da inline yapabiliriz

# --- USER INTERACTIONS ---
admin.site.register(UserComment)
admin.site.register(ItemRating)
admin.site.register(ActionLog)