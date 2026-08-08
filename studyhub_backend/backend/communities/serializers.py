from django.utils.text import slugify
from rest_framework import serializers

from .models import Community


class CommunitySerializer(serializers.ModelSerializer):
    member_count = serializers.ReadOnlyField()
    is_member = serializers.SerializerMethodField()

    class Meta:
        model = Community
        fields = [
            'id', 'name', 'slug', 'description', 'icon',
            'member_count', 'is_member', 'created_at',
        ]
        read_only_fields = ['id', 'slug', 'created_at']

    def get_is_member(self, obj):
        request = self.context.get('request')
        if request and request.user.is_authenticated:
            return obj.members.filter(id=request.user.id).exists()
        return False

    def create(self, validated_data):
        validated_data['slug'] = slugify(validated_data['name'])
        request = self.context.get('request')
        community = Community.objects.create(
            created_by=request.user if request else None, **validated_data
        )
        # creator auto-joins their own community
        if request:
            community.members.add(request.user)
        return community
