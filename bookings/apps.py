from django.apps import AppConfig


class BookingsConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'bookings'
    display_name = "Bookings"
    description = "See all guest-bookings"
    icon = "bi-calendar-range"
    required_group = "Premium"
