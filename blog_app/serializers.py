from rest_framework import serializers
from .models import Rating

class RatingSerializer(serializers.ModelSerializer):
    class Meta:
        model = Rating
        fields = ['id', 'user', 'blog', 'destination', 'hotel', 'rating']
        read_only_fields = ['user']
