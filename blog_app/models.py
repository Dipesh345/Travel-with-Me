from django.db import models
from django.contrib.auth.models import User

# Blog Model
class Blog(models.Model):
    title = models.CharField(max_length=255)
    content = models.TextField()
    tags = models.CharField(max_length=255, blank=True)
    destination_name = models.CharField(max_length=255, blank=True)

    def __str__(self):
        return self.title

# Unified Rating Model for Blog, Destination, Hotel
class Rating(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    blog = models.ForeignKey("Blog", on_delete=models.CASCADE, null=True, blank=True)
    destination = models.ForeignKey("Destination", on_delete=models.CASCADE, null=True, blank=True)
    hotel = models.ForeignKey("Hotel", on_delete=models.CASCADE, null=True, blank=True)
    score = models.IntegerField()
    timestamp = models.DateTimeField(auto_now_add=True)

    class Meta:
        constraints = [
            models.UniqueConstraint(
                fields=["user", "blog"], name="unique_user_blog_rating"
            ),
            models.UniqueConstraint(
                fields=["user", "destination"], name="unique_user_destination_rating"
            ),
            models.UniqueConstraint(
                fields=["user", "hotel"], name="unique_user_hotel_rating"
            ),
        ]

    def __str__(self):
        rated = self.blog or self.destination or self.hotel
        return f"{self.user.username} rated {rated} ({self.score})"

# Destination Model
class Destination(models.Model):
    name = models.CharField(max_length=255)
    description = models.TextField()
    location = models.CharField(max_length=255)
    tags = models.CharField(max_length=255, blank=True)

    def __str__(self):
        return self.name

# Hotel Model
class Hotel(models.Model):
    name = models.CharField(max_length=255)
    location = models.CharField(max_length=255)
    tags = models.CharField(max_length=255, blank=True)

    def __str__(self):
        return self.name
