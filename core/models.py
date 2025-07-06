from django.contrib.auth.models import AbstractUser
from django.db import models
from django.utils import timezone
from django.utils.text import slugify
import itertools

# Custom User model
class User(AbstractUser):
    email = models.EmailField(unique=True)
    profile_image = models.ImageField(upload_to='profiles/', null=True, blank=True)
    preferences = models.JSONField(default=dict, blank=True)  # e.g. preferred destinations
    travel_history = models.JSONField(default=list, blank=True)
    nationality = models.CharField(
        max_length=2, blank=True, null=True,
        help_text="ISO country code, e.g. 'US'"
    )

    def __str__(self):
        return self.username

# Optional: User's own custom trips (separate from Tours)
class Trip(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='trips')
    title = models.CharField(max_length=255)
    start_date = models.DateField()
    end_date = models.DateField()
    destinations = models.JSONField()  # Example: [{'city': 'Paris', 'country': 'France'}]
    budget = models.DecimalField(max_digits=10, decimal_places=2)
    itinerary = models.TextField(blank=True)  # Plain text or markdown
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.user.username}'s trip to {self.destinations}"

# Hotel model
class Hotel(models.Model):
    name = models.CharField(max_length=255)
    location = models.CharField(max_length=255)
    price_per_night = models.DecimalField(max_digits=7, decimal_places=2)
    rating = models.FloatField()
    description = models.TextField()
    image = models.ImageField(upload_to='hotels/', blank=True, null=True)
    google_place_id = models.CharField(max_length=100, blank=True, null=True)

    def __str__(self):
        return self.name

# Blog post category
class Category(models.Model):
    name = models.CharField(max_length=100, unique=True)
    slug = models.SlugField(unique=True, blank=True)

    def __str__(self):
        return self.name

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.name)
        super().save(*args, **kwargs)

# Blog model
class Blog(models.Model):
    author = models.ForeignKey(User, on_delete=models.CASCADE, related_name='blogs')
    title = models.CharField(max_length=255)
    category = models.ForeignKey(Category, on_delete=models.SET_NULL, null=True, blank=True, related_name='blogs')
    slug = models.SlugField(unique=True, blank=True)
    content = models.TextField()
    thumbnail = models.ImageField(upload_to='blog_thumbnails/', blank=True, null=True)
    created_at = models.DateTimeField(default=timezone.now)
    updated_at = models.DateTimeField(auto_now=True)
    status = models.CharField(max_length=10, choices=[('draft', 'Draft'), ('published', 'Published')], default='draft')
    tags = models.CharField(max_length=255, blank=True)
    views = models.PositiveIntegerField(default=0)
    likes = models.ManyToManyField(User, related_name='liked_blogs', blank=True)

    def __str__(self):
        return self.title

    def save(self, *args, **kwargs):
        if not self.slug:
            base_slug = slugify(self.title)
            slug = base_slug
            for i in itertools.count(1):
                if not Blog.objects.filter(slug=slug).exists():
                    break
                slug = f"{base_slug}-{i}"
            self.slug = slug
        super().save(*args, **kwargs)

# Blog comments with threading
class Comment(models.Model):
    blog = models.ForeignKey('Blog', on_delete=models.CASCADE, related_name='comments')
    author = models.ForeignKey(User, on_delete=models.CASCADE)
    text = models.TextField()
    parent = models.ForeignKey('self', null=True, blank=True, related_name='replies', on_delete=models.CASCADE)
    likes = models.ManyToManyField(User, related_name='liked_comments', blank=True)
    created_at = models.DateTimeField(default=timezone.now)

    def __str__(self):
        return f"Comment by {self.author.username}"

    def is_reply(self):
        return self.parent is not None

# Emergency contact for user
class EmergencyContact(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    name = models.CharField(max_length=100)
    phone = models.CharField(max_length=20)
    email = models.EmailField()

    def __str__(self):
        return f"Emergency Contact for {self.user.username}"

# Contact messages from visitors
class ContactMessage(models.Model):
    full_name = models.CharField(max_length=100)
    email = models.EmailField()
    phone = models.CharField(max_length=20)
    subject = models.CharField(max_length=150)
    message = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.full_name} - {self.subject}"

# Main Tour model
class Tour(models.Model):
    TOUR_TYPES = [
        ('Luxury', 'Luxury'),
        ('Premium', 'Premium'),
        ('Normal', 'Normal'),
        ('Adventure', 'Adventure'),
        ('Cultural', 'Cultural'),
    ]

    title = models.CharField(max_length=255)
    city = models.CharField(max_length=100)
    country = models.CharField(max_length=100)
    country_code = models.CharField(
        max_length=2, blank=True, null=True,
        help_text="ISO 3166-1 alpha-2 code e.g. 'NP'"
    )
    days = models.PositiveIntegerField()
    price = models.DecimalField(max_digits=10, decimal_places=2)
    currency = models.CharField(max_length=3, default='USD', help_text="ISO 4217 currency code")
    image = models.ImageField(upload_to='tours/')
    type = models.CharField(max_length=50, choices=TOUR_TYPES)
    activities = models.JSONField(default=list, blank=True)
    description = models.TextField(blank=True)
    admission_fee = models.BooleanField(default=False)
    insurance_coverage = models.CharField(max_length=100, default="Not Covered")
    language = models.CharField(max_length=100, default="English")
    hotel_transfer = models.BooleanField(default=False)
    capacity = models.PositiveIntegerField(default=0, help_text="Max people (0 = unlimited)")
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('title', 'city', 'country')

    def __str__(self):
        return self.title

# Booking model for tours
class Booking(models.Model):
    STATUS_CHOICES = [
        ('pending', 'Pending'),      # booked but payment not done
        ('confirmed', 'Confirmed'),  # payment received, booking confirmed
        ('cancelled', 'Cancelled'),
        ('completed', 'Completed'),
        ('refunded', 'Refunded'),    # fully refunded
        ('partial_refunded', 'Partial Refunded'),
    ]

    PAYMENT_METHODS = [
        ('paypal', 'PayPal'),
        ('stripe', 'Stripe'),
        ('cash', 'Cash'),
    ]

    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='bookings')
    tour = models.ForeignKey(Tour, on_delete=models.CASCADE, related_name='bookings')
    people = models.PositiveIntegerField(default=1)

    name = models.CharField(max_length=255, null=True, blank=True)  
    email = models.EmailField(null=True, blank=True)
    phone = models.CharField(max_length=20, null=True, blank=True)

    booking_date = models.DateField(null=True, blank=True)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')
    booked_at = models.DateTimeField(auto_now_add=True)

    # Payment details
    payment_method = models.CharField(max_length=20, choices=PAYMENT_METHODS, null=True, blank=True)
    payment_status = models.CharField(max_length=20, default='pending')  # e.g. pending, paid, failed
    payment_amount = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    payment_date = models.DateTimeField(null=True, blank=True)
    transaction_id = models.CharField(max_length=100, null=True, blank=True)

    # Refund details
    refunded_amount = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    refund_date = models.DateTimeField(null=True, blank=True)
    refund_reason = models.TextField(blank=True, null=True)

    cancellation_reason = models.TextField(blank=True, null=True)

    class Meta:
        unique_together = ('user', 'tour', 'booking_date')

    def __str__(self):
        return f"{self.user.username} booked {self.tour.title} on {self.booking_date}"

    @property
    def is_fully_paid(self):
        return self.payment_status == 'paid' and self.payment_amount >= (self.tour.price * self.people)

    @property
    def is_fully_refunded(self):
        return self.refunded_amount >= self.payment_amount and self.refund_date is not None

# Ratings for tours by users
class TourRating(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    tour = models.ForeignKey(Tour, on_delete=models.CASCADE, related_name='ratings')
    rating = models.PositiveSmallIntegerField()
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('user', 'tour')

    def __str__(self):
        return f"{self.user.username} rated {self.tour.title} - {self.rating}"
