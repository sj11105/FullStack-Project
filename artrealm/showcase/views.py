# showcase/views.py
from rest_framework import viewsets
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from django.contrib.auth.models import User
from .models import Artwork, Comment, Rating, UserProfile, Role  # Corrected import path for models
from .serializers import ArtworkSerializer, CommentSerializer, RatingSerializer, UserProfileSerializer, UserSerializer  # Corrected import path for serializers
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from django.urls import path

class ArtworkViewSet(viewsets.ModelViewSet):
    queryset = Artwork.objects.all()
    serializer_class = ArtworkSerializer

class CommentViewSet(viewsets.ModelViewSet):
    queryset = Comment.objects.all()
    serializer_class = CommentSerializer

class RatingViewSet(viewsets.ModelViewSet):
    queryset = Rating.objects.all()
    serializer_class = RatingSerializer

class UserProfileViewSet(viewsets.ModelViewSet):
    queryset = UserProfile.objects.all()
    serializer_class = UserProfileSerializer

# Authentication views
urlpatterns = [
    path('api/token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
]

@api_view(['POST'])
def register_user(request):
    serializer = UserSerializer(data=request.data)
    if serializer.is_valid():
        user = serializer.save()

        # Create a user profile for the registered user
        role_id = request.data.get('role_id')  # Assuming role_id is sent in request data
        if role_id:
            role = Role.objects.get(pk=role_id)
        else:
            role = None  # Handle if no role_id is provided

        UserProfile.objects.create(user=user, role=role)

        return Response(serializer.data, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
