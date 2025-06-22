# Standard library
from io import BytesIO

# Django imports
import requests
from django.contrib.auth import get_user_model
from django.contrib.auth.password_validation import validate_password
from django.contrib.auth.tokens import default_token_generator
from django.core.mail import send_mail
from django.http import HttpResponse
from django.shortcuts import get_object_or_404
from django.utils.encoding import force_bytes, force_str
from django.utils.http import urlsafe_base64_encode, urlsafe_base64_decode
from datetime import datetime
from django.conf import settings

# Third-party
from reportlab.pdfgen import canvas
import qrcode

# DRF imports
from rest_framework import generics, permissions, status, filters
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import (
    AllowAny,
    IsAuthenticated,
    IsAuthenticatedOrReadOnly,
)
from rest_framework_simplejwt.tokens import RefreshToken
from django_filters.rest_framework import DjangoFilterBackend

# App imports
from .models import Trip, Blog, Comment, Tour, TourRating, Booking, ContactMessage, Category
from .serializers import (
    RegisterSerializer,
    UserSerializer,
    TripSerializer,
    BlogSerializer,
    CommentSerializer,
    ContactMessageSerializer,
    TourSerializer,
    TourRatingSerializer,
    BookingSerializer,
    CategorySerializer,
)
from .pagination import TripPagination

User = get_user_model()

# -------------------------------
# 🔐 Authentication Views
# -------------------------------

class RegisterView(generics.CreateAPIView):
    queryset = User.objects.all()
    permission_classes = [AllowAny]
    serializer_class = RegisterSerializer

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()
        refresh = RefreshToken.for_user(user)

        return Response({
            "user": {
                "username": user.username,
                "email": user.email,
            },
            "refresh": str(refresh),
            "access": str(refresh.access_token),
        }, status=status.HTTP_201_CREATED)


class UserProfileView(generics.RetrieveUpdateAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [IsAuthenticated]

    def get_object(self):
        return self.request.user


class ChangePasswordView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        user = request.user
        old_password = request.data.get("old_password")
        new_password = request.data.get("new_password")

        if not user.check_password(old_password):
            return Response({"error": "Wrong old password."}, status=400)

        try:
            validate_password(new_password, user=user)
        except Exception as e:
            return Response({"error": list(e)}, status=400)

        user.set_password(new_password)
        user.save()
        return Response({"success": "Password changed successfully."})


class ForgotPasswordView(APIView):
    def post(self, request):
        email = request.data.get("email")
        if not email:
            return Response({"error": "Email is required"}, status=400)

        try:
            user = User.objects.get(email=email)
        except User.DoesNotExist:
            return Response({"error": "User with this email does not exist"}, status=404)

        uid = urlsafe_base64_encode(force_bytes(user.pk))
        token = default_token_generator.make_token(user)
        reset_link = f"http://localhost:5173/reset-password/{uid}/{token}/"

        send_mail(
            subject="Password Reset Request",
            message=f"Click the link to reset your password: {reset_link}",
            from_email=None,
            recipient_list=[email],
        )

        return Response({"message": "Password reset link sent to your email."})


class ResetPasswordView(APIView):
    def post(self, request, uidb64, token):
        try:
            uid = force_str(urlsafe_base64_decode(uidb64))
            user = User.objects.get(pk=uid)
        except (User.DoesNotExist, ValueError, TypeError):
            return Response({"error": "Invalid UID."}, status=400)

        if not default_token_generator.check_token(user, token):
            return Response({"error": "Invalid or expired token."}, status=400)

        new_password = request.data.get("new_password")
        if not new_password:
            return Response({"error": "New password is required"}, status=400)

        user.set_password(new_password)
        user.save()
        return Response({"message": "Password has been reset successfully."})


# -------------------------------
# 📞 Contact Message View
# -------------------------------

class ContactMessageAPI(APIView):
    def get(self, request):
        messages = ContactMessage.objects.all().order_by('-created_at')
        serializer = ContactMessageSerializer(messages, many=True)
        return Response(serializer.data)

    def post(self, request):
        serializer = ContactMessageSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response({"message": "Message received successfully!"}, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

# -------------------------------
# 📌 Trip Views
# -------------------------------

class TripListCreateView(generics.ListCreateAPIView):
    serializer_class = TripSerializer
    permission_classes = [IsAuthenticated]
    pagination_class = TripPagination
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['start_date', 'end_date', 'budget']
    search_fields = ['title', 'destinations']
    ordering_fields = ['start_date', 'end_date', 'budget']
    ordering = ['start_date']

    def get_queryset(self):
        return Trip.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)


class TripDetailView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = TripSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Trip.objects.filter(user=self.request.user)


# -------------------------------
# 📤 Trip Export Views
# -------------------------------

class ExportTripPDFView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, pk):
        try:
            trip = Trip.objects.get(pk=pk, user=request.user)
        except Trip.DoesNotExist:
            return HttpResponse(status=404)

        response = HttpResponse(content_type='application/pdf')
        response['Content-Disposition'] = f'attachment; filename="trip_{trip.id}.pdf"'

        p = canvas.Canvas(response)
        p.setFont("Helvetica-Bold", 16)
        p.drawString(50, 800, f"Trip Title: {trip.title}")
        p.setFont("Helvetica", 12)
        p.drawString(50, 780, f"Dates: {trip.start_date} to {trip.end_date}")
        p.drawString(50, 760, f"Budget: ${trip.budget}")
        p.drawString(50, 740, "Destinations:")
        y = 720
        for dest in trip.destinations:
            city = dest.get('city', '')
            country = dest.get('country', '')
            p.drawString(70, y, f"- {city}, {country}")
            y -= 20
        p.drawString(50, y - 10, "Itinerary:")
        text = p.beginText(70, y - 30)
        for line in trip.itinerary.split('\n'):
            text.textLine(line)
        p.drawText(text)
        p.showPage()
        p.save()
        return response


class ExportTripQRView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, pk):
        try:
            trip = Trip.objects.get(pk=pk, user=request.user)
        except Trip.DoesNotExist:
            return HttpResponse(status=404)

        trip_url = request.build_absolute_uri(f'/api/trips/{trip.id}/')
        qr_img = qrcode.make(trip_url)
        buffer = BytesIO()
        qr_img.save(buffer)
        buffer.seek(0)
        return HttpResponse(buffer, content_type='image/png')



class CategoryListView(generics.ListAPIView):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer

class BlogListCreateView(generics.ListCreateAPIView):
    serializer_class = BlogSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]

    def get_queryset(self):
        queryset = Blog.objects.all().order_by('-created_at')
        category_slug = self.request.query_params.get('category')
        if category_slug:
            queryset = queryset.filter(category__slug=category_slug)
        return queryset

    def get_serializer_context(self):
        return {'request': self.request}

    def perform_create(self, serializer):
        serializer.save(author=self.request.user)


class BlogDetailView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = BlogSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]
    lookup_field = 'slug'

    def get_queryset(self):
        return Blog.objects.all()

    def get_serializer_context(self):
        return {'request': self.request}

    def get_object(self):
        slug = self.kwargs.get('slug')
        blog = get_object_or_404(Blog.objects.prefetch_related('likes', 'comments__author'), slug=slug)

        session_key = f"viewed_blog_{blog.id}"
        if not self.request.session.get(session_key):
            blog.views += 1
            blog.save(update_fields=['views'])
            self.request.session[session_key] = True

        return blog

class CommentListCreateByBlogView(generics.ListCreateAPIView):
    serializer_class = CommentSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]

    def get_queryset(self):
        blog_id = self.kwargs['blog_id']
        return Comment.objects.filter(blog_id=blog_id)

    def perform_create(self, serializer):
        blog = get_object_or_404(Blog, id=self.kwargs['blog_id'])
        serializer.save(author=self.request.user, blog=blog)

class IsCommentAuthor(permissions.BasePermission):
    def has_object_permission(self, request, view, obj):
        # Only allow the author of the comment to edit/delete
        return obj.author == request.user

class CommentRetrieveUpdateDestroyView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Comment.objects.all()
    serializer_class = CommentSerializer

    def get_permissions(self):
        if self.request.method in ['PUT', 'PATCH', 'DELETE']:
            return [permissions.IsAuthenticated(), IsCommentAuthor()]
        return [permissions.AllowAny()]

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def toggle_like(request, blog_id):
    blog = get_object_or_404(Blog, id=blog_id)
    user = request.user

    if blog.likes.filter(id=user.id).exists():
        blog.likes.remove(user)
        liked = False
    else:
        blog.likes.add(user)
        liked = True

    return Response({
        'liked': liked,
        'likes_count': blog.likes.count()
    })

# -------------------------------
# 🌍 Visa Checker View
# -------------------------------

class VisaCheckerAPI(APIView):
    def post(self, request):
        nationality = request.data.get('nationality')
        destination = request.data.get('destination')

        if not nationality or not destination:
            return Response(
                {"error": "Both nationality and destination are required."},
                status=status.HTTP_400_BAD_REQUEST
            )

        api_url = f"https://rough-sun-2523.fly.dev/visa/{nationality}/{destination}"
        try:
            external_response = requests.get(api_url, timeout=5)
            if external_response.status_code == 200:
                return Response(external_response.json())
            return Response(
                {"error": "Could not fetch visa info from external API."},
                status=external_response.status_code
            )
        except requests.RequestException:
            return Response(
                {"error": "Failed to connect to Visa API."},
                status=status.HTTP_503_SERVICE_UNAVAILABLE
            )

# -------------------------------
# 🌤️ Weather API View
# -------------------------------

class WeatherForecastAPI(APIView):
    def post(self, request):
        city = request.data.get('city')
        if not city:
            return Response({"error": "City is required."}, status=status.HTTP_400_BAD_REQUEST)

        api_key = settings.OPENWEATHER_API_KEY
        if not api_key:
            return Response({"error": "API key not configured."}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

        geo_url = f"http://api.openweathermap.org/geo/1.0/direct?q={city}&limit=1&appid={api_key}"
        try:
            geo_res = requests.get(geo_url, timeout=5)
            geo_data_list = geo_res.json()
            if geo_res.status_code != 200 or not geo_data_list:
                return Response({"error": "Could not get coordinates for the city."}, status=status.HTTP_400_BAD_REQUEST)

            geo_data = geo_data_list[0]
            lat = geo_data['lat']
            lon = geo_data['lon']

        except requests.RequestException:
            return Response({"error": "Failed to connect to geocoding service."}, status=status.HTTP_503_SERVICE_UNAVAILABLE)

        forecast_url = f"http://api.openweathermap.org/data/2.5/forecast?lat={lat}&lon={lon}&appid={api_key}"
        try:
            forecast_res = requests.get(forecast_url, timeout=5)
            if forecast_res.status_code == 200:
                forecast_data = forecast_res.json()
                forecasts = []
                for item in forecast_data.get('list', []):
                    forecasts.append({
                        "datetime": datetime.utcfromtimestamp(item['dt']).strftime('%Y-%m-%d %H:%M:%S'),
                        "temp": item['main']['temp'],
                        "temp_min": item['main']['temp_min'],
                        "temp_max": item['main']['temp_max'],
                        "description": item['weather'][0]['description'],
                        "humidity": item['main']['humidity'],
                        "wind_speed": item['wind']['speed'],
                        "clouds": item['clouds']['all']
                    })

                return Response({
                    "city": forecast_data['city']['name'],
                    "country": forecast_data['city']['country'],
                    "forecasts": forecasts
                })

            return Response({"error": "Could not fetch forecast data."}, status=forecast_res.status_code)

        except requests.RequestException:
            return Response({"error": "Failed to connect to forecast service."}, status=status.HTTP_503_SERVICE_UNAVAILABLE)

# -------------------------------
# 🗺️ Tour List API View
# -------------------------------
class TourListAPIView(generics.ListAPIView):
    queryset = Tour.objects.all()
    serializer_class = TourSerializer

    def get_serializer_context(self):
        return {'request': self.request}

class TourDetailAPIView(generics.RetrieveAPIView):
    queryset = Tour.objects.all()
    serializer_class = TourSerializer

    def get_serializer_context(self):
        return {'request': self.request}

class UserBookingsAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        bookings = Booking.objects.filter(user=request.user).select_related('tour')
        serializer = BookingSerializer(bookings, many=True, context={"request": request})
        return Response(serializer.data)

class BookingCreateAPIView(generics.CreateAPIView):
    queryset = Booking.objects.all()
    serializer_class = BookingSerializer
    permission_classes = [permissions.IsAuthenticated]

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)


class BookingDetailAPIView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = BookingSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        # Only active bookings of logged-in user
        return Booking.objects.filter(user=self.request.user, status='active')

    def destroy(self, request, *args, **kwargs):
        booking = self.get_object()
        booking.status = 'cancelled'  # Soft delete
        booking.save()
        return Response({"detail": "Booking cancelled successfully."}, status=status.HTTP_200_OK)


class BookingByTourAPIView(generics.GenericAPIView):
    serializer_class = BookingSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request, tour_id):
        try:
            booking = Booking.objects.get(user=request.user, tour__id=tour_id, status='active')
            serializer = self.get_serializer(booking)
            return Response(serializer.data)
        except Booking.DoesNotExist:
            return Response({"detail": "Booking not found."}, status=status.HTTP_404_NOT_FOUND)

# Create or Update Rating (one per user per tour)
class TourRatingCreateUpdateAPIView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request, tour_id):
        user = request.user
        rating_value = request.data.get('rating')
        if not rating_value or not (1 <= int(rating_value) <= 5):
            return Response({'error': 'Rating must be between 1 and 5.'}, status=status.HTTP_400_BAD_REQUEST)

        tour = generics.get_object_or_404(Tour, id=tour_id)
        rating_obj, created = TourRating.objects.update_or_create(
            user=user, tour=tour,
            defaults={'rating': rating_value}
        )
        serializer = TourRatingSerializer(rating_obj)
        return Response(serializer.data, status=status.HTTP_201_CREATED)