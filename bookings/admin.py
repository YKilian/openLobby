from django.contrib import admin

from bookings.models import Booking

# Register your models here.
class BookingAdmin(admin.ModelAdmin):
    # Felder, die in der Listenansicht angezeigt werden
    list_display = ('first_name', 'last_name', 'booking_from', 'booking_to')
    # Felder, nach denen gefiltert werden kann
    list_filter = ('booking_from', 'booking_to')
    # Felder, nach denen gesucht werden kann
    search_fields = ('first_name', 'last_name', 'email')
    # Felder, die in der Bearbeitungsansicht angezeigt werden
    # fields = ('first_name', 'last_name', 'email', 'booking_from', 'booking_to')
    # # Felder, die nur lesbar sind
    # readonly_fields = ('email',)
    # Standard-Sortierung
    ordering = ('-booking_from',)

admin.site.register(Booking, BookingAdmin)
