from django.urls import path
from .views import TodayMenuView

urlpatterns = [
    path('today/', TodayMenuView.as_view(), name='today-menu'),
]