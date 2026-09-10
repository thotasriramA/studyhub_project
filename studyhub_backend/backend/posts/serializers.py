from rest_framework import serializers
from .models import Bookmark, Comment, Like, Post
from rest_framework import serializers
from .models import Post

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
    author = serializers.CharField(source='author.username', read_only=True)
    author_id = serializers.IntegerField(source='author.id', read_only=True)
    image = serializers.SerializerMethodField()
    attachment = serializers.SerializerMethodField()
    like_count = serializers.IntegerField(read_only=True)
    comment_count = serializers.IntegerField(read_only=True)

    class Meta:
        model = Post
        fields = [
            'id', 'author', 'author_id', 'community', 'title', 'content',
            'post_type', 'attachment', 'image', 'created_at',
            'like_count', 'comment_count',
        ]
        read_only_fields = ['id', 'created_at']

    def get_image(self, obj):
        request = self.context.get('request')
        if obj.image and request:
            return request.build_absolute_uri(obj.image.url)
        return None

    def get_attachment(self, obj):
        request = self.context.get('request')
        if obj.attachment and request:
            return request.build_absolute_uri(obj.attachment.url)
        return None

class BookmarkSerializer(serializers.ModelSerializer):
    post_detail = PostSerializer(source='post', read_only=True)

    class Meta:
        model = Bookmark
        fields = ['id', 'post', 'post_detail', 'created_at']
        read_only_fields = ['id', 'created_at']
