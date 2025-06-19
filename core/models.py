from django.contrib.auth.models import AbstractUser
from django.db import models
from django.utils import timezone

class User(AbstractUser):
    email = models.EmailField(unique=True)
    profile_image = models.ImageField(upload_to='profiles/', null=True, blank=True)
    preferences = models.JSONField(default=dict, blank=True)  # e.g. preferred destinations
    travel_history = models.JSONField(default=list, blank=True)

    def __str__(self):
        return self.username


class Trip(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='trips')
    title = models.CharField(max_length=255)
    start_date = models.DateField()
    end_date = models.DateField()
    destinations = models.JSONField()  # e.g. [{'city': 'Paris', 'country': 'France'}]
    budget = models.DecimalField(max_digits=10, decimal_places=2)
    itinerary = models.TextField(blank=True)  # plain text or markdown
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.user.username}'s trip to {self.destinations}"


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


from django.utils.text import slugify
import itertools

class Blog(models.Model):
    author = models.ForeignKey(User, on_delete=models.CASCADE, related_name='blogs')
    title = models.CharField(max_length=255)
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

class Comment(models.Model):
    blog = models.ForeignKey(Blog, on_delete=models.CASCADE, related_name='comments')
    author = models.ForeignKey(User, on_delete=models.CASCADE)
    text = models.TextField()
    created_at = models.DateTimeField(default=timezone.now)

    def __str__(self):
        return f"Comment by {self.author.username}"


class EmergencyContact(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    name = models.CharField(max_length=100)
    phone = models.CharField(max_length=20)
    email = models.EmailField()

    def __str__(self):
        return f"Emergency Contact for {self.user.username}"

class ContactMessage(models.Model):
    full_name = models.CharField(max_length=100)
    email = models.EmailField()
    phone = models.CharField(max_length=20)
    subject = models.CharField(max_length=150)
    message = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.full_name} - {self.subject}"
    
class Tour(models.Model):
    TOUR_TYPES = [
        ('Luxury', 'Luxury'),
        ('Premium', 'Premium'),
        ('Normal', 'Normal'),
        ('Adventure', 'Adventure'),
        ('Cultural', 'Cultural'),
    ]

    title = models.CharField(max_length=255)
    country = models.CharField(max_length=100)
    days = models.PositiveIntegerField()
    price = models.DecimalField(max_digits=10, decimal_places=2)
    image = models.ImageField(upload_to='tours/')
    type = models.CharField(max_length=50, choices=TOUR_TYPES)
    activities = models.JSONField(default=list, blank=True)  # e.g. ["Boating", "Kayaking"]
    description = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.title

class ContactMessage(models.Model):
    full_name = models.CharField(max_length=100)
    email = models.EmailField()
    phone = models.CharField(max_length=20)
    subject = models.CharField(max_length=150)
    message = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.full_name} - {self.subject}"
    
class Tour(models.Model):
    TOUR_TYPES = [
        ('Luxury', 'Luxury'),
        ('Premium', 'Premium'),
        ('Normal', 'Normal'),
        ('Adventure', 'Adventure'),
        ('Cultural', 'Cultural'),
    ]

    title = models.CharField(max_length=255)
    country = models.CharField(max_length=100)
    days = models.PositiveIntegerField()
    price = models.DecimalField(max_digits=10, decimal_places=2)
    image = models.ImageField(upload_to='tours/')
    type = models.CharField(max_length=50, choices=TOUR_TYPES)
    activities = models.JSONField(default=list, blank=True)  # e.g. ["Boating", "Kayaking"]
    description = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.title