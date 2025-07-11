from rest_framework import serializers
from django.contrib.auth import get_user_model
from django.contrib.auth.password_validation import validate_password
from .models import (
    User, Trip, Hotel, Blog, Comment, EmergencyContact, ContactMessage,
    Tour, TourRating, Booking, Category
)

User = get_user_model()

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'profile_image', 'preferences', 'travel_history', 'nationality']

class TripSerializer(serializers.ModelSerializer):
    class Meta:
        model = Trip
        fields = '__all__'
        read_only_fields = ['user', 'created_at']

class HotelSerializer(serializers.ModelSerializer):
    class Meta:
        model = Hotel
        fields = '__all__'

class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = ['id', 'name', 'slug']

class BlogSerializer(serializers.ModelSerializer):
    author = UserSerializer(read_only=True)
    likes_count = serializers.IntegerField(source='likes.count', read_only=True)
    is_liked = serializers.SerializerMethodField()
    category = CategorySerializer(read_only=True)

    class Meta:
        model = Blog
        fields = [
            'id', 'title', 'slug', 'content', 'thumbnail', 'category',
            'created_at', 'updated_at', 'status', 'tags',
            'views', 'likes_count', 'is_liked', 'author',
        ]
        read_only_fields = [
            'slug', 'created_at', 'updated_at', 'views',
            'likes_count', 'is_liked', 'author',
        ]

    def get_is_liked(self, obj):
        request = self.context.get('request')
        if request and request.user.is_authenticated:
            return obj.likes.filter(id=request.user.id).exists()
        return False

class CommentSerializer(serializers.ModelSerializer):
    author = UserSerializer(read_only=True)
    blog = serializers.PrimaryKeyRelatedField(read_only=True)
    replies = serializers.SerializerMethodField()
    is_liked = serializers.SerializerMethodField()
    likes_count = serializers.SerializerMethodField()

    class Meta:
        model = Comment
        fields = [
            'id', 'blog', 'author', 'text', 'created_at', 'parent',
            'replies', 'is_liked', 'likes_count',
        ]
        read_only_fields = ['blog', 'author', 'created_at', 'replies', 'is_liked', 'likes_count']

    def get_replies(self, obj):
        queryset = obj.replies.all().order_by('created_at')
        return CommentSerializer(queryset, many=True, context=self.context).data

    def get_is_liked(self, obj):
        request = self.context.get('request')
        if request and request.user.is_authenticated:
            return obj.likes.filter(id=request.user.id).exists()
        return False

    def get_likes_count(self, obj):
        return obj.likes.count()

class EmergencyContactSerializer(serializers.ModelSerializer):
    class Meta:
        model = EmergencyContact
        fields = '__all__'

class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, required=True, validators=[validate_password])
    password2 = serializers.CharField(write_only=True, required=True)

    class Meta:
        model = User
        fields = ('username', 'email', 'password', 'password2')
        extra_kwargs = {'email': {'required': True}}

    def validate_email(self, value):
        if User.objects.filter(email=value).exists():
            raise serializers.ValidationError("A user with that email already exists.")
        return value

    def validate(self, attrs):
        if attrs['password'] != attrs['password2']:
            raise serializers.ValidationError({"password": "Passwords do not match."})
        return attrs

    def create(self, validated_data):
        validated_data.pop('password2')
        user = User.objects.create_user(
            username=validated_data['username'],
            email=validated_data['email'],
            password=validated_data['password']
        )
        return user

class ContactMessageSerializer(serializers.ModelSerializer):
    class Meta:
        model = ContactMessage
        fields = '__all__'

class TourSerializer(serializers.ModelSerializer):
    image = serializers.ImageField()
    average_rating = serializers.SerializerMethodField()
    bookings_count = serializers.SerializerMethodField()

    class Meta:
        model = Tour
        fields = [
            'id', 'title', 'city', 'country', 'country_code',
            'days', 'price', 'image', 'type',
            'activities', 'description', 'admission_fee', 'insurance_coverage',
            'language', 'hotel_transfer', 'created_at',
            'average_rating', 'bookings_count',
        ]

    def get_average_rating(self, obj):
        ratings = obj.ratings.all()
        if ratings.exists():
            return round(sum(r.rating for r in ratings) / ratings.count(), 1)
        return 0

    def get_bookings_count(self, obj):
        return obj.bookings.count()

class TourRatingSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)

    class Meta:
        model = TourRating
        fields = ['id', 'user', 'rating', 'created_at']

class BookingSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)
    tour = serializers.PrimaryKeyRelatedField(queryset=Tour.objects.all())
    tour__title = serializers.CharField(source='tour.title', read_only=True)
    tour__price = serializers.DecimalField(source='tour.price', read_only=True, max_digits=10, decimal_places=2)

    class Meta:
        model = Booking
        fields = [
            'id', 'user', 'tour', 'people', 'name', 'email', 'phone', 'booking_date',
            'status', 'booked_at', 'tour__title', 'tour__price',
            'payment_method', 'payment_status', 'payment_amount',
            'payment_date', 'transaction_id',
            'cancellation_reason', 'refunded_amount', 'refund_date', 'refund_reason',
        ]
        read_only_fields = ['payment_status', 'payment_date', 'transaction_id', 'refund_date', 'booked_at']

class TourRatingCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = TourRating
        fields = ['rating']
