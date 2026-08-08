from django.urls import path
from rest_framework_simplejwt.views import TokenRefreshView

from .views import LoginView, MyProfileView, RegisterView, UserPublicProfileView

urlpatterns = [
    path('register/', RegisterView.as_view(), name='register'),
    path('login/', LoginView.as_view(), name='login'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('me/', MyProfileView.as_view(), name='my_profile'),
    path('users/<int:pk>/', UserPublicProfileView.as_view(), name='user_profile'),
]
