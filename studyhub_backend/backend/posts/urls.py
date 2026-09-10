from django.urls import path

from .views import (
    CommentDeleteView,
    CommentListCreateView,
    MyBookmarksView,
    PostDetailView,
    PostListCreateView,
    ToggleBookmarkView,
    ToggleLikeView,
    UserPostsView,
)

urlpatterns = [
    path('', PostListCreateView.as_view(), name='post_list_create'),
    path('bookmarks/', MyBookmarksView.as_view(), name='my_bookmarks'),
    path('user/<int:user_id>/', UserPostsView.as_view(), name='user_posts'),
    path('comments/<int:pk>/', CommentDeleteView.as_view(), name='comment_delete'),
    path('<int:pk>/', PostDetailView.as_view(), name='post_detail'),
    path('<int:pk>/like/', ToggleLikeView.as_view(), name='post_like'),
    path('<int:pk>/bookmark/', ToggleBookmarkView.as_view(), name='post_bookmark'),
    path('<int:post_id>/comments/', CommentListCreateView.as_view(), name='comment_list_create'),
]