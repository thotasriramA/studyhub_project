from django.db.models import Q
from rest_framework import generics, permissions, status
from rest_framework.response import Response
from rest_framework.views import APIView

from .models import Bookmark, Comment, Like, Post
from .serializers import BookmarkSerializer, CommentSerializer, PostSerializer


class IsAuthorOrReadOnly(permissions.BasePermission):
    """Only the person who created a post/comment can edit or delete it."""

    def has_object_permission(self, request, view, obj):
        if request.method in permissions.SAFE_METHODS:
            return True
        return obj.author == request.user


class PostListCreateView(generics.ListCreateAPIView):
    """
    GET  /api/posts/?community=<slug>&search=<text>  -> feed (all or by community, searchable)
    POST /api/posts/                                  -> create a new post
    """
    serializer_class = PostSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]

    def get_queryset(self):
        qs = Post.objects.all().select_related('author', 'community')
        community_slug = self.request.query_params.get('community')
        search = self.request.query_params.get('search')
        post_type = self.request.query_params.get('type')
        if community_slug:
            qs = qs.filter(community__slug=community_slug)
        if post_type:
            qs = qs.filter(post_type=post_type)
        if search:
            qs = qs.filter(
                Q(title__icontains=search)
                | Q(content__icontains=search)
                | Q(community__name__icontains=search)
            )
        return qs

    def get_serializer_context(self):
        return {'request': self.request}


class PostDetailView(generics.RetrieveUpdateDestroyAPIView):
    """GET/PUT/DELETE /api/posts/<id>/"""
    queryset = Post.objects.all()
    serializer_class = PostSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly, IsAuthorOrReadOnly]

    def get_serializer_context(self):
        return {'request': self.request}


class ToggleLikeView(APIView):
    """POST /api/posts/<id>/like/  -> like if not liked, unlike if already liked"""
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request, pk):
        try:
            post = Post.objects.get(pk=pk)
        except Post.DoesNotExist:
            return Response({'detail': 'Post not found'}, status=404)

        like, created = Like.objects.get_or_create(post=post, user=request.user)
        if not created:
            like.delete()
            return Response({'liked': False, 'like_count': post.like_count})
        return Response({'liked': True, 'like_count': post.like_count})


class ToggleBookmarkView(APIView):
    """POST /api/posts/<id>/bookmark/ -> bookmark / un-bookmark a post"""
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request, pk):
        try:
            post = Post.objects.get(pk=pk)
        except Post.DoesNotExist:
            return Response({'detail': 'Post not found'}, status=404)

        bookmark, created = Bookmark.objects.get_or_create(post=post, user=request.user)
        if not created:
            bookmark.delete()
            return Response({'bookmarked': False})
        return Response({'bookmarked': True})


class MyBookmarksView(generics.ListAPIView):
    """GET /api/posts/bookmarks/ -> list of posts I've saved"""
    serializer_class = BookmarkSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Bookmark.objects.filter(user=self.request.user).select_related('post')


class CommentListCreateView(generics.ListCreateAPIView):
    """
    GET  /api/posts/<post_id>/comments/  -> list comments on a post
    POST /api/posts/<post_id>/comments/  -> add a comment
    """
    serializer_class = CommentSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]

    def get_queryset(self):
        return Comment.objects.filter(post_id=self.kwargs['post_id'])

    def perform_create(self, serializer):
        serializer.save(author=self.request.user, post_id=self.kwargs['post_id'])


class CommentDeleteView(generics.DestroyAPIView):
    """DELETE /api/posts/comments/<id>/"""
    queryset = Comment.objects.all()
    serializer_class = CommentSerializer
    permission_classes = [permissions.IsAuthenticated, IsAuthorOrReadOnly]

class UserPostsView(generics.ListAPIView):
    """GET /api/posts/user/<user_id>/  -> all posts created by a specific user"""
    serializer_class = PostSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]

    def get_queryset(self):
        return Post.objects.filter(
            author_id=self.kwargs['user_id']
        ).select_related('author', 'community')

    def get_serializer_context(self):
        return {'request': self.request}
