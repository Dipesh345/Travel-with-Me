from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import User, Trip, Hotel, Blog, Comment, EmergencyContact, ContactMessage, Tour

admin.site.register(User, UserAdmin)
admin.site.register(Trip)
admin.site.register(Hotel)
admin.site.register(Blog)
admin.site.register(Comment)
admin.site.register(EmergencyContact)
admin.site.register(ContactMessage)

@admin.register(Tour)
class TourAdmin(admin.ModelAdmin):
    list_display = ['title', 'country', 'price', 'days', 'type']
    search_fields = ['title', 'country']
    list_filter = ['type', 'country']