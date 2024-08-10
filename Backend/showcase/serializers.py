from rest_framework import serializers

class UserSerializer(serializers.Serializer):
    username = serializers.CharField(max_length=150)
    email = serializers.EmailField()
    password = serializers.CharField(max_length=128)
    first_name = serializers.CharField(max_length=30)
    last_name = serializers.CharField(max_length=30)
    bio = serializers.CharField()
    user_type = serializers.IntegerField()
