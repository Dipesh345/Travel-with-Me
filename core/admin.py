from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import (
    User,
    Trip,
    Hotel,
    Blog,
    Comment,
    EmergencyContact,
    ContactMessage,
    Tour,
    Booking,
    Category,
)

# Register User with default UserAdmin
admin.site.register(User, UserAdmin)

# Register models with default ModelAdmin
admin.site.register(Trip)
admin.site.register(Hotel)
admin.site.register(Blog)
admin.site.register(Comment)
admin.site.register(EmergencyContact)
admin.site.register(ContactMessage)
admin.site.register(Booking)
admin.site.register(Category)

# Custom admin for Tour model
@admin.register(Tour)
class TourAdmin(admin.ModelAdmin):
    list_display = ('title', 'city', 'country', 'type', 'price')
    search_fields = ('title', 'city', 'country')
