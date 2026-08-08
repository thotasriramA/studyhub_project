from rest_framework import generics, permissions, status
from rest_framework.response import Response
from rest_framework.views import APIView

from .models import Community
from .serializers import CommunitySerializer


class CommunityListCreateView(generics.ListCreateAPIView):
    """
    GET  /api/communities/       -> list all study communities
    POST /api/communities/       -> create a new community (auto-joins creator)
    """
    queryset = Community.objects.all()
    serializer_class = CommunitySerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]

    def get_context(self):
        return {'request': self.request}

    def get_serializer_context(self):
        return {'request': self.request}


class CommunityDetailView(generics.RetrieveAPIView):
    """GET /api/communities/<slug>/ -> community details"""
    queryset = Community.objects.all()
    serializer_class = CommunitySerializer
    lookup_field = 'slug'
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]

    def get_serializer_context(self):
        return {'request': self.request}


class JoinCommunityView(APIView):
    """POST /api/communities/<slug>/join/ -> join this community"""
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request, slug):
        try:
            community = Community.objects.get(slug=slug)
        except Community.DoesNotExist:
            return Response({'detail': 'Community not found'}, status=404)
        community.members.add(request.user)
        return Response({'detail': f'Joined {community.name}'}, status=200)


class LeaveCommunityView(APIView):
    """POST /api/communities/<slug>/leave/ -> leave this community"""
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request, slug):
        try:
            community = Community.objects.get(slug=slug)
        except Community.DoesNotExist:
            return Response({'detail': 'Community not found'}, status=404)
        community.members.remove(request.user)
        return Response({'detail': f'Left {community.name}'}, status=200)
