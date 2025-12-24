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
admin.site.register(Meal)
# admin.site.register(MealNutrition) # gives error due to version
# admin.site.register(MealAllergen)  # gives error due to version

# --- USER INTERACTIONS ---
admin.site.register(UserComment)
admin.site.register(ItemRating)
admin.site.register(ActionLog)