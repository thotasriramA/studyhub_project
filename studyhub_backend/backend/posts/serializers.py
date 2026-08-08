from rest_framework import serializers

from .models import Bookmark, Comment, Like, Post


class CommentSerializer(serializers.ModelSerializer):
    author_username = serializers.ReadOnlyField(source='author.username')
    author_profile_pic = serializers.ImageField(
        source='author.profile_pic', read_only=True
    )

    class Meta:
        model = Comment
        fields = [
            'id', 'post', 'author', 'author_username',
            'author_profile_pic', 'text', 'created_at',
        ]
        read_only_fields = ['id', 'post', 'author', 'created_at']


class PostSerializer(serializers.ModelSerializer):
    author_username = serializers.ReadOnlyField(source='author.username')
    author_profile_pic = serializers.ImageField(
        source='author.profile_pic', read_only=True
    )
    community_name = serializers.ReadOnlyField(source='community.name')
    like_count = serializers.ReadOnlyField()
    comment_count = serializers.ReadOnlyField()
    is_liked = serializers.SerializerMethodField()
    is_bookmarked = serializers.SerializerMethodField()
    comments = CommentSerializer(many=True, read_only=True)

    class Meta:
        model = Post
        fields = [
            'id', 'author', 'author_username', 'author_profile_pic',
            'community', 'community_name', 'title', 'content',
            'post_type', 'attachment', 'image', 'created_at',
            'like_count', 'comment_count', 'is_liked', 'is_bookmarked',
            'comments',
        ]
        read_only_fields = ['id', 'author', 'created_at']

    def get_is_liked(self, obj):
        request = self.context.get('request')
        if request and request.user.is_authenticated:
            return obj.likes.filter(user=request.user).exists()
        return False

    def get_is_bookmarked(self, obj):
        request = self.context.get('request')
        if request and request.user.is_authenticated:
            return obj.bookmarks.filter(user=request.user).exists()
        return False

    def create(self, validated_data):
        request = self.context.get('request')
        return Post.objects.create(author=request.user, **validated_data)


class BookmarkSerializer(serializers.ModelSerializer):
    post_detail = PostSerializer(source='post', read_only=True)

    class Meta:
        model = Bookmark
        fields = ['id', 'post', 'post_detail', 'created_at']
        read_only_fields = ['id', 'created_at']
