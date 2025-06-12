# Standard library
from io import BytesIO

# Django imports
from django.contrib.auth import get_user_model
from django.contrib.auth.password_validation import validate_password
from django.contrib.auth.tokens import default_token_generator
from django.core.mail import send_mail
from django.http import HttpResponse
from django.shortcuts import get_object_or_404
from django.utils.encoding import force_bytes, force_str
from django.utils.http import urlsafe_base64_encode, urlsafe_base64_decode

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
from .models import Trip, Blog, Comment
from .serializers import (
    RegisterSerializer,
    UserSerializer,
    TripSerializer,
    BlogSerializer,
    CommentSerializer,
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


class BlogListCreateView(generics.ListCreateAPIView):
    serializer_class = BlogSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]
    queryset = Blog.objects.all().order_by('-created_at')

    def get_serializer_context(self):
        return {'request': self.request}

    def perform_create(self, serializer):
        serializer.save(author=self.request.user)


class BlogDetailView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = BlogSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]

    def get_queryset(self):
        return Blog.objects.all()

    def get_serializer_context(self):
        return {'request': self.request}

    def get_object(self):
        blog = super().get_object()
        blog.views += 1
        blog.save(update_fields=['views'])
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
