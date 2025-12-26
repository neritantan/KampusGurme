from django.urls import path

from .views import TodayMenuView, RegisterView, LoginView, LogoutView, CheckAuthView, GetCSRFToken 

urlpatterns = [
    #Get Today's Menu
    path('today/', TodayMenuView.as_view(), name='today-menu'),

    # Auth Endpoints
    path('auth/register/', RegisterView.as_view(), name='register'),
    path('auth/login/', LoginView.as_view(), name='login'),
    path('auth/logout/', LogoutView.as_view(), name='logout'),
    path('auth/check/', CheckAuthView.as_view(), name='check_auth'),
    path('auth/csrf/', GetCSRFToken.as_view(), name='get_csrf'),
]