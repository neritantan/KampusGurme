from django.urls import path

from .views import TodayMenuView, RegisterView, LoginView, LogoutView, CheckAuthView, GetCSRFToken, MenuByDateView, MonthlyMenuMainDishesView, CommentView, RatingView, VoteCommentView

urlpatterns = [
    #Get Menus
    path('menu/today/', TodayMenuView.as_view(), name='today-menu'),
    path('menu/calendar/', MonthlyMenuMainDishesView.as_view(), name='menu-calendar'),
    path('menu/<str:date_str>/', MenuByDateView.as_view(), name='menu-by-date'),

    # Social Endpoints
    path('menu/<int:menu_id>/comment/', CommentView.as_view(), name='menu_comment'),
    path('menu/<int:menu_id>/rate/', RatingView.as_view(), name='menu_rate'),
    path('social/vote/<int:comment_id>/', VoteCommentView.as_view(), name='comment_vote'),

    # Auth Endpoints
    path('auth/register/', RegisterView.as_view(), name='register'),
    path('auth/login/', LoginView.as_view(), name='login'),
    path('auth/logout/', LogoutView.as_view(), name='logout'),
    path('auth/check/', CheckAuthView.as_view(), name='check_auth'),
    path('auth/csrf/', GetCSRFToken.as_view(), name='get_csrf'),
]