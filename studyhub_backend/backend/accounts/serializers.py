from django.contrib.auth import authenticate
from rest_framework import serializers

from .models import User


class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, min_length=6)

    class Meta:
        model = User
        fields = [
            'id', 'username', 'email', 'password',
            'education_level', 'favorite_subject',
        ]

    def create(self, validated_data):
        user = User.objects.create_user(
            username=validated_data['username'],
            email=validated_data.get('email', ''),
            password=validated_data['password'],
            education_level=validated_data.get('education_level', 'college'),
            favorite_subject=validated_data.get('favorite_subject', ''),
        )
        return user


class LoginSerializer(serializers.Serializer):
    username = serializers.CharField()
    password = serializers.CharField(write_only=True)

    def validate(self, attrs):
        user = authenticate(
            username=attrs.get('username'), password=attrs.get('password')
        )
        if not user:
            raise serializers.ValidationError('Invalid username or password')
        attrs['user'] = user
        return attrs


class UserProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = [
            'id', 'username', 'email', 'bio',
            'education_level', 'favorite_subject', 'profile_pic',
        ]
        read_only_fields = ['id', 'username']
