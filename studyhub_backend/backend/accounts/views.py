from django.conf import settings
from django.contrib.auth import get_user_model
from django.contrib.auth.tokens import PasswordResetTokenGenerator
from django.core.mail import send_mail
from django.utils.encoding import force_bytes, force_str
from django.utils.http import urlsafe_base64_decode, urlsafe_base64_encode
from rest_framework import generics, permissions, serializers, status
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework.parsers import MultiPartParser, FormParser, JSONParser

from .serializers import LoginSerializer, RegisterSerializer, UserProfileSerializer

User = get_user_model()


# --- Password Reset Serializers ---
class RequestPasswordResetSerializer(serializers.Serializer):
    email = serializers.EmailField()


class SetNewPasswordSerializer(serializers.Serializer):
    password = serializers.CharField(min_length=6, write_only=True)
    uidb64 = serializers.CharField(write_only=True)
    token = serializers.CharField(write_only=True)

    def validate(self, attrs):
        try:
            uid = force_str(urlsafe_base64_decode(attrs['uidb64']))
            user = User.objects.get(pk=uid)
        except (TypeError, ValueError, OverflowError, User.DoesNotExist):
            raise serializers.ValidationError({'non_field_errors': ['Invalid reset link.']})

        if not PasswordResetTokenGenerator().check_token(user, attrs['token']):
            raise serializers.ValidationError({'non_field_errors': ['Token is expired or invalid.']})

        attrs['user'] = user
        return attrs

    def save(self):
        user = self.validated_data['user']
        user.set_password(self.validated_data['password'])
        user.save()
        return user


# --- Password Reset Views ---
class RequestPasswordResetView(APIView):
    permission_classes = [permissions.AllowAny]  # Allows unauthenticated users

    def post(self, request):
        serializer = RequestPasswordResetSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        email = serializer.validated_data['email'].lower()
        user = User.objects.filter(email__iexact=email).first()

        if user:
            uidb64 = urlsafe_base64_encode(force_bytes(user.pk))
            token = PasswordResetTokenGenerator().make_token(user)
            frontend_url = 'http://localhost:5173'  # Update if your Vite/React server runs on another port
            reset_link = f"{frontend_url}/reset-password/{uidb64}/{token}"

            send_mail(
                subject='Reset Your Password - StudyHub',
                message=f'Click the link to reset your password:\n\n{reset_link}',
                from_email=settings.DEFAULT_FROM_EMAIL,
                recipient_list=[email],
                fail_silently=False,
            )

        return Response(
            {'detail': 'If this email is registered, a password reset link has been sent.'},
            status=status.HTTP_200_OK,
        )


class ResetPasswordConfirmView(APIView):
    permission_classes = [permissions.AllowAny]  # Allows unauthenticated users

    def post(self, request):
        serializer = SetNewPasswordSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response({'detail': 'Password reset successful.'}, status=status.HTTP_200_OK)


# --- Auth Views ---
def get_tokens_for_user(user):
    refresh = RefreshToken.for_user(user)
    return {
        'refresh': str(refresh),
        'access': str(refresh.access_token),
    }


class RegisterView(generics.CreateAPIView):
    """POST /api/auth/register/  -> create a new student account"""
    queryset = User.objects.all()
    serializer_class = RegisterSerializer
    permission_classes = [permissions.AllowAny]

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()
        tokens = get_tokens_for_user(user)
        return Response(
            {
                'user': UserProfileSerializer(user).data,
                'tokens': tokens,
            },
            status=status.HTTP_201_CREATED,
        )


class LoginView(APIView):
    """POST /api/auth/login/  -> log in with username & password"""
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        serializer = LoginSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.validated_data['user']
        tokens = get_tokens_for_user(user)
        return Response(
            {
                'user': UserProfileSerializer(user).data,
                'tokens': tokens,
            }
        )


class MyProfileView(generics.RetrieveUpdateAPIView):
    """GET/PUT /api/auth/me/  -> view or edit the logged-in user's profile"""
    serializer_class = UserProfileSerializer
    permission_classes = [permissions.IsAuthenticated]
    parser_classes = [MultiPartParser, FormParser, JSONParser]

    def get_object(self):
        return self.request.user


class UserPublicProfileView(generics.RetrieveAPIView):
    """GET /api/auth/users/<id>/  -> view any student's public profile"""
    queryset = User.objects.all()
    serializer_class = UserProfileSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]