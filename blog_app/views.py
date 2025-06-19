from django.shortcuts import render

# Create your views here.
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from .models import Blog, Rating, Destination
from .serializers import BlogSerializer, RatingSerializer, DestinationSerializer, HotelSerializer
from .recommender import user_based_blog_recommendation, recommend_by_destination

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def rate_blog(request):
    user = request.user
    blog_id = request.data.get('blog_id')
    rating = request.data.get('rating')
    rating_obj, _ = Rating.objects.update_or_create(user=user, blog_id=blog_id, defaults={'rating': rating})
    return Response(RatingSerializer(rating_obj).data)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def blog_recommendation(request):
    user = request.user
    blogs = user_based_blog_recommendation(user.id)
    return Response(BlogSerializer(blogs, many=True).data)

@api_view(['GET'])
def recommend_for_destination(request, destination_id):
    result = recommend_by_destination(destination_id)
    return Response({
        "related_destinations": DestinationSerializer(result['related_destinations'], many=True).data,
        "hotels": HotelSerializer(result['hotels'], many=True).data,
        "blogs": BlogSerializer(result['blogs'], many=True).data
    })
