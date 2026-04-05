from django.urls import path

from .views import BookingView, booking_list, update_checkin

app_name = "bookings"
urlpatterns = [
    path("", BookingView.as_view(), name="index"),
    path('api/bookings/', booking_list, name='booking-list'),
    path('api/bookings/<int:booking_id>/checkin/', update_checkin, name='update-checkin'),
]