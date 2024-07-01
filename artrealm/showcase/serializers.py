from rest_framework import serializers
from django.contrib.auth.models import User
from .models import UserProfile, Artwork, Comment, Rating

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['username', 'password']  # Add more fields as needed

    def create(self, validated_data):
        user = User.objects.create_user(**validated_data)
        return user

class UserProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserProfile
        fields = '__all__' # Add more fields as needed

class ArtworkSerializer(serializers.ModelSerializer):
    artist = UserSerializer()

    class Meta:
        model = Artwork
        fields = '__all__'

class CommentSerializer(serializers.ModelSerializer):
    user = UserSerializer()

    class Meta:
        model = Comment
        fields = '__all__'

class RatingSerializer(serializers.ModelSerializer):
    user = UserSerializer()

    class Meta:
        model = Rating
        fields = '__all__'