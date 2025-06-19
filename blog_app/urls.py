from django.urls import path
from . import views

urlpatterns = [
    path('rate/', views.rate_blog),
    path('recommend/blogs/', views.blog_recommendation),
    path('recommend/destination/<int:destination_id>/', views.recommend_for_destination),
]
