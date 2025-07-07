from django.urls import path
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from .views import (
    RegisterView, UserProfileView, ChangePasswordView,
    ForgotPasswordView, ResetPasswordView,
    TripListCreateView, TripDetailView, ExportTripPDFView, ExportTripQRView,
    BlogListCreateView, BlogDetailView, CommentListCreateByBlogView, toggle_like,
    VisaCheckerAPI, WeatherForecastAPI, ContactMessageAPI,
    TourListAPIView, TourDetailAPIView, TourRatingCreateUpdateAPIView,
    BookingCreateAPIView, BookingDetailAPIView, BookingByTourAPIView,
    UserBookingsAPIView, CategoryListView, CommentRetrieveUpdateDestroyView,
    toggle_comment_like, BookingPaymentUpdateAPIView,
    CreatePaymentIntentView, VerifyPayPalPaymentView, ExchangeRateAPIView
)

urlpatterns = [
    # --------------------
    # Authentication URLs
    # --------------------
    path('auth/token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('auth/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('auth/register/', RegisterView.as_view(), name='register'),
    path('auth/profile/', UserProfileView.as_view(), name='user_profile'),
    path('users/<int:pk>/', UserProfileView.as_view(), name='user-detail'),
    path('auth/change-password/', ChangePasswordView.as_view(), name='change-password'),
    path('auth/forgot-password/', ForgotPasswordView.as_view(), name='forgot-password'),
    path('auth/reset-password/<uidb64>/<token>/', ResetPasswordView.as_view(), name='reset-password'),

    # --------------------
    # Trip URLs
    # --------------------
    path('trips/', TripListCreateView.as_view(), name='trip-list-create'),
    path('trips/<int:pk>/', TripDetailView.as_view(), name='trip-detail'),
    path('trips/<int:pk>/export/pdf/', ExportTripPDFView.as_view(), name='trip-export-pdf'),
    path('trips/<int:pk>/export/qr/', ExportTripQRView.as_view(), name='trip-export-qr'),

    # --------------------
    # Category URLs
    # --------------------
    path('categories/', CategoryListView.as_view(), name='category-list'),

    # --------------------
    # Blog & Comment URLs
    # --------------------
    path('blogs/', BlogListCreateView.as_view(), name='blog-list-create'),
    path('blogs/<slug:slug>/', BlogDetailView.as_view(), name='blog-detail'),
    path('blogs/<int:blog_id>/comments/', CommentListCreateByBlogView.as_view(), name='blog-comments'),
    path('blogs/comments/<int:pk>/', CommentRetrieveUpdateDestroyView.as_view(), name='comment-detail'),

    # Likes for blogs and comments
    path('blogs/<int:blog_id>/like/', toggle_like, name='blog-like-toggle'),
    path('blogs/comments/<int:comment_id>/like/', toggle_comment_like, name='toggle_comment_like'),

    # --------------------
    # Miscellaneous APIs
    # --------------------
    path('visa-checker/', VisaCheckerAPI.as_view(), name='visa_checker'),
    path('weather/', WeatherForecastAPI.as_view(), name='weather_api'),
    path('contact/', ContactMessageAPI.as_view(), name='contact-message'),

    # --------------------
    # Tour URLs
    # --------------------
    path('tours/', TourListAPIView.as_view(), name='tour-list'),
    path('tours/<int:pk>/', TourDetailAPIView.as_view(), name='tour-detail'),
    path('tours/<int:tour_id>/rate/', TourRatingCreateUpdateAPIView.as_view(), name='tour-rate'),

    # --------------------
    # Booking URLs
    # --------------------
    path('bookings/', UserBookingsAPIView.as_view(), name='user-bookings'),
    path('bookings/create/', BookingCreateAPIView.as_view(), name='create-booking'),
    path('bookings/<int:pk>/', BookingDetailAPIView.as_view(), name='booking-detail'),
    path('bookings/by-tour/<int:tour_id>/', BookingByTourAPIView.as_view(), name='booking-by-tour'),
    path('bookings/<int:pk>/pay/', BookingPaymentUpdateAPIView.as_view(), name='booking-payment-update'),

    # --------------------
    # Payment URLs
    # --------------------
    path('payments/create-payment-intent/', CreatePaymentIntentView.as_view(), name='create-payment-intent'),
    path('payments/verify-paypal-payment/', VerifyPayPalPaymentView.as_view(), name='verify-paypal'),

    # --------------------
    # Currency Exchange Rate API
    # --------------------
    path('exchange-rate/', ExchangeRateAPIView.as_view(), name='exchange_rate'),
]
