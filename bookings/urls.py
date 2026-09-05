from django.urls import path

from .views import BookingView, booking_list, update_checkin, update_note

app_name = "bookings"
urlpatterns = [
    path("", BookingView.as_view(), name="index"),
    path('api/bookings/', booking_list, name='booking-list'),
    path('api/bookings/<int:booking_id>/checkin/', update_checkin, name='update-checkin'),
    path('api/bookings/<int:booking_id>/update_note/', update_note, name='update-note'),
]