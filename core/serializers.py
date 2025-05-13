from rest_framework import serializers
from .models import User, Trip, Hotel, Blog, Comment, EmergencyContact

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'profile_image', 'preferences', 'travel_history']


class TripSerializer(serializers.ModelSerializer):
    class Meta:
        model = Trip
        fields = '__all__'


class HotelSerializer(serializers.ModelSerializer):
    class Meta:
        model = Hotel
        fields = '__all__'


class BlogSerializer(serializers.ModelSerializer):
    author = UserSerializer(read_only=True)
    likes_count = serializers.IntegerField(source='likes.count', read_only=True)

    class Meta:
        model = Blog
        fields = ['id', 'title', 'content', 'author', 'created_at', 'likes_count']


class CommentSerializer(serializers.ModelSerializer):
    author = UserSerializer(read_only=True)

    class Meta:
        model = Comment
        fields = ['id', 'blog', 'text', 'author', 'created_at']


class EmergencyContactSerializer(serializers.ModelSerializer):
    class Meta:
        model = EmergencyContact
        fields = '__all__'
