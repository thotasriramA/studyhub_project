from django.contrib.auth import authenticate
from rest_framework import serializers

from .models import User

from django.contrib.auth import get_user_model
from django.contrib.auth.tokens import PasswordResetTokenGenerator
from django.utils.encoding import force_bytes, force_str
from django.utils.http import urlsafe_base64_decode
from rest_framework import serializers


User = get_user_model()


class RequestPasswordResetSerializer(serializers.Serializer):
    email = serializers.EmailField()

    def validate_email(self, value):
        return value.lower()


class SetNewPasswordSerializer(serializers.Serializer):
    password = serializers.CharField(min_length=6, write_only=True)
    uidb64 = serializers.CharField(write_only=True)
    token = serializers.CharField(write_only=True)

    def validate(self, attrs):
        try:
            uid = force_str(urlsafe_base64_decode(attrs['uidb64']))
            user = User.objects.get(pk=uid)
        except (TypeError, ValueError, OverflowError, User.DoesNotExist):
            raise serializers.ValidationError({'non_field_errors': ['Invalid reset link or user does not exist.']})

        token_generator = PasswordResetTokenGenerator()
        if not token_generator.check_token(user, attrs['token']):
            raise serializers.ValidationError({'non_field_errors': ['The reset token is invalid or has expired.']})

        attrs['user'] = user
        return attrs

    def save(self, **kwargs):
        user = self.validated_data['user']
        user.set_password(self.validated_data['password'])
        user.save()
        return user


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
    profile_pic = serializers.ImageField(
        required=False,
        allow_null=True
    )

    class Meta:
        model = User
        fields = [
            'id',
            'username',
            'email',
            'bio',
            'education_level',
            'favorite_subject',
            'profile_pic',
        ]
        read_only_fields = ['id', 'username']

    