from django.urls import path
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from .views import (
    RegisterView, UserProfileView, ChangePasswordView,
    ForgotPasswordView, ResetPasswordView,
    TripListCreateView, TripDetailView, ExportTripPDFView, ExportTripQRView,
    BlogListCreateView, BlogDetailView, CommentListCreateByBlogView, toggle_like,
)

urlpatterns = [
    # Authentication
    path('auth/token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('auth/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('auth/register/', RegisterView.as_view(), name='register'),
    path('auth/profile/', UserProfileView.as_view(), name='user_profile'),
    path('auth/change-password/', ChangePasswordView.as_view(), name='change-password'),
    path('auth/forgot-password/', ForgotPasswordView.as_view(), name='forgot-password'),
    path('auth/reset-password/<uidb64>/<token>/', ResetPasswordView.as_view(), name='reset-password'),

    # Trips
    path('trips/', TripListCreateView.as_view(), name='trip-list-create'),
    path('trips/<int:pk>/', TripDetailView.as_view(), name='trip-detail'),
    path('trips/<int:pk>/export/pdf/', ExportTripPDFView.as_view(), name='trip-export-pdf'),
    path('trips/<int:pk>/export/qr/', ExportTripQRView.as_view(), name='trip-export-qr'),

    # Blogs & Comments
    path('blogs/', BlogListCreateView.as_view(), name='blog-list-create'),
    path('blogs/<int:pk>/', BlogDetailView.as_view(), name='blog-detail'),
    path('blogs/<int:blog_id>/comments/', CommentListCreateByBlogView.as_view(), name='blog-comments'),
    path('blogs/<int:blog_id>/like/', toggle_like, name='blog-like-toggle'),
]
