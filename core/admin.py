from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import User, Trip, Hotel, Blog, Comment, EmergencyContact

admin.site.register(User, UserAdmin)
admin.site.register(Trip)
admin.site.register(Hotel)
admin.site.register(Blog)
admin.site.register(Comment)
admin.site.register(EmergencyContact)
