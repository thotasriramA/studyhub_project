from django.urls import path

from .views import (
    CommunityDetailView,
    CommunityListCreateView,
    JoinCommunityView,
    LeaveCommunityView,
)

urlpatterns = [
    path('', CommunityListCreateView.as_view(), name='community_list_create'),
    path('<slug:slug>/', CommunityDetailView.as_view(), name='community_detail'),
    path('<slug:slug>/join/', JoinCommunityView.as_view(), name='community_join'),
    path('<slug:slug>/leave/', LeaveCommunityView.as_view(), name='community_leave'),
]
