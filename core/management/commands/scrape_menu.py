import requests
from bs4 import BeautifulSoup
from django.core.management.base import BaseCommand
from core.models import DailyMenu, Meal, Category, MenuContent
from datetime import datetime
import re

class Command(BaseCommand):
    help = 'Sivas BTÜ menüsünü çeker (Kategoriler: soup, main, side, other).'

    def handle(self, *args, **options):
        # --- 1. KATEGORİLERİ İNGİLİZCE (GENEL) OLUŞTUR ---
        # Artık "Tatlı" kategorisine Ayran girmeyecek, hepsi "other" olacak.
        cat_soup, _ = Category.objects.get_or_create(name="soup")
        cat_main, _ = Category.objects.get_or_create(name="main")
        cat_side, _ = Category.objects.get_or_create(name="side")
        cat_other, _ = Category.objects.get_or_create(name="other")

        # --- 2. SİTEYE BAĞLAN ---
        url = "https://www.sivas.edu.tr/yemek-listesi"
        self.stdout.write("🌍 Siteye bağlanılıyor...")
        
        try:
            response = requests.get(url, timeout=10)
            if response.status_code != 200:
                self.stdout.write(self.style.ERROR(f'❌ Hata: Site {response.status_code} kodu döndü.'))
                return
            html_content = response.content
        except Exception as e:
            self.stdout.write(self.style.ERROR(f'❌ Bağlantı hatası: {str(e)}'))
            return

        soup = BeautifulSoup(html_content, 'html.parser')
        
        month_map = {
            'Ocak': 1, 'Şubat': 2, 'Mart': 3, 'Nisan': 4, 'Mayıs': 5, 'Haziran': 6,
            'Temmuz': 7, 'Ağustos': 8, 'Eylül': 9, 'Ekim': 10, 'Kasım': 11, 'Aralık': 12
        }

        day_containers = soup.find_all('div', class_='yemekhane-primary')
        
        if not day_containers:
            self.stdout.write(self.style.WARNING('⚠️ Menü kutusu bulunamadı!'))
            return

        count = 0
        for container in day_containers:
            # --- TARİH ---
            date_span = container.find('span', class_='yemekhane-title')
            if not date_span: continue
            
            date_text = date_span.get_text(strip=True) 
            match = re.search(r'(\d{1,2})\s+(\w+)\s+(\d{4})', date_text)
            
            if match:
                day, month_name, year = int(match.group(1)), match.group(2), int(match.group(3))
                if month_name not in month_map: continue 
                
                menu_date = datetime(year, month_map[month_name], day).date()
                daily_menu, created = DailyMenu.objects.get_or_create(menu_date=menu_date)
                if created: self.stdout.write(f'📅 Tarih: {menu_date}')

                # --- YEMEKLER ---
                food_list = container.find('ul', class_='list-group-yemekhane')
                if food_list:
                    items = food_list.find_all('li')
                    
                    # Sayacı sıfırla
                    valid_item_index = 0

                    for item in items:
                        # Badge temizliği (sadece isimden silmek için)
                        badge = item.find('span', class_='badge')
                        badge_text = badge.get_text() if badge else ""
                        
                        meal_name = item.get_text(strip=True).replace(badge_text, '').strip()
                        
                        if not meal_name: continue

                        # 1. Ekmek Kontrolü
                        if "EKMEK" in meal_name.upper() or "ROLL" in meal_name.upper():
                            continue

                        # 2. İsim Formatlama
                        meal_name = meal_name.replace("İ", "i").replace("I", "ı").lower().title()

                        # 3. KATEGORİ ATAMA (soup, main, side, other)
                        target_category = None
                        
                        if valid_item_index == 0:
                            target_category = cat_soup
                        elif valid_item_index == 1:
                            target_category = cat_main
                        elif valid_item_index == 2:
                            target_category = cat_side
                        else:
                            # 3. index ve sonrası (Salata, Tatlı, Yoğurt, İçecek hepsi buraya)
                            target_category = cat_other

                        # 4. Yemeği Kaydet
                        meal_obj, created = Meal.objects.get_or_create(
                            name=meal_name,
                            defaults={'category': target_category}
                        )
                        
                        # Kategori yanlışsa düzelt (Örn: Eskiden 'main' olan şimdi 'other' sırasındaysa)
                        if not created and meal_obj.category != target_category:
                            meal_obj.category = target_category
                            meal_obj.save()

                        # 5. Menüye Bağla
                        MenuContent.objects.get_or_create(
                            menu=daily_menu,
                            meal=meal_obj
                        )
                        
                        valid_item_index += 1
                        count += 1

        self.stdout.write(self.style.SUCCESS(f'✅ İŞLEM TAMAM! {count} yemek eklendi. Kategoriler: soup, main, side, other.'))