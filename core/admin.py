from django.contrib import admin
from .models import *

# --- 1. AYAR VE TANIM TABLOLARI ---
admin.site.register(Rank)
admin.site.register(Category)
admin.site.register(Allergen)
admin.site.register(ActionConfig)

# --- 2. YEMEK MENÜSÜ AYARLARI (Özel Kısım) ---

# Bu ayar sayesinde Menü sayfasına girince altta yemek ekleyebileceksin
class MenuContentInline(admin.TabularInline):
    model = MenuContent
    extra = 1 # Kaç tane boş satır göstersin

class DailyMenuAdmin(admin.ModelAdmin):
    inlines = [MenuContentInline] # Yukarıdaki ayarı buraya gömüyoruz
    list_display = ['menu_date', 'created_at'] # Listede tarihi göster

# Günlük Menüyü özel ayarıyla kaydediyoruz
admin.site.register(DailyMenu, DailyMenuAdmin)


# --- 3. DİĞER TABLOLAR ---
admin.site.register(User)
admin.site.register(Meal)
# admin.site.register(MealNutrition) # Hata verirse bunu kapatırsın
# admin.site.register(MealAllergen)  # Hata verirse bunu kapatırsın

# --- 4. KULLANICI ETKİLEŞİMLERİ ---
admin.site.register(UserComment)
admin.site.register(ItemRating)
admin.site.register(ActionLog)