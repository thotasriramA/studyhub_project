from django.contrib.auth.models import AbstractUser
from django.db import models


class User(AbstractUser):
    """Custom user model for StudyHub students."""

    EDUCATION_CHOICES = [
        ('school', 'School'),
        ('college', 'College'),
        ('other', 'Other'),
    ]

    bio = models.TextField(max_length=300, blank=True)
    education_level = models.CharField(
        max_length=20, choices=EDUCATION_CHOICES, default='college'
    )
    favorite_subject = models.CharField(max_length=100, blank=True)
    profile_pic = models.ImageField(
        upload_to='profiles/', null=True, blank=True
    )

    def __str__(self):
        return self.username
