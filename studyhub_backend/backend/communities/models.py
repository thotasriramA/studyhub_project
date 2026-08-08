from django.conf import settings
from django.db import models


class Community(models.Model):
    """A subject-wise study group, e.g. 'Python Learners', 'JEE Prep'."""

    name = models.CharField(max_length=100, unique=True)
    slug = models.SlugField(max_length=110, unique=True)
    description = models.TextField(blank=True)
    icon = models.ImageField(upload_to='community_icons/', null=True, blank=True)
    created_by = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True,
        related_name='created_communities',
    )
    members = models.ManyToManyField(
        settings.AUTH_USER_MODEL, related_name='communities', blank=True
    )
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['name']

    def __str__(self):
        return self.name

    @property
    def member_count(self):
        return self.members.count()
