from django.urls import path
from .views import convert_currency_api

urlpatterns = [
    path('api/convert/', convert_currency_api, name='convert_currency_api'),
]
