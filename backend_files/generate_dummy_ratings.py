
import os
import django
import random
from datetime import datetime, timedelta

# Setup Django Environment
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings')
django.setup()

from core.models import ItemRating, DailyMenu, User, MenuContent
from django.utils import timezone

def populate_ratings():
    print("🚀 Starting Dummy Rating Population...")

    # Create Dummy Users
    users = []
    for i in range(20):
        u, _ = User.objects.get_or_create(username=f"student_{i}")
        users.append(u)
    
    # Get menus from last 60 days
    today = timezone.now().date()
    start_date = today - timedelta(days=60)
    menus = DailyMenu.objects.filter(menu_date__gte=start_date, menu_date__lte=today)
    
    print(f"Found {menus.count()} menus to rate.")
    total_ratings = 0

    for menu in menus:
        contents = MenuContent.objects.filter(menu=menu)
        meals = [c.meal for c in contents]
        
        if not meals: continue

        # For each day, random 5-15 users vote
        daily_active_users = random.sample(users, random.randint(5, 15))

        for u in daily_active_users:
            for meal in meals:
                # Weighted Random Rating (Higher chance for good ratings)
                roll = random.random()
                if roll < 0.6: score = random.randint(4, 5)
                elif roll < 0.9: score = 3
                else: score = random.randint(1, 2)
                
                # Update or Create
                ItemRating.objects.update_or_create(
                    user=u,
                    menu=menu,
                    meal=meal,
                    defaults={'rating': score} 
                )
                total_ratings += 1
                
        # Hack to distribute created_at over time for trend graphs
        menu_dt = datetime.combine(menu.menu_date, datetime.min.time())
        # Force update created_at to match menu date
        ItemRating.objects.filter(menu=menu).update(created_at=menu_dt)

    print(f"✅ Successfully created/updated {total_ratings} ratings across {menus.count()} menus.")

if __name__ == "__main__":
    populate_ratings()
