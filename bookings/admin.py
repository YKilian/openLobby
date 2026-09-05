from django.contrib import admin
from bookings.models import Booking
from bookings.models import Room

@admin.register(Booking)
class BookingAdmin(admin.ModelAdmin):
    # Felder, die in der Listenansicht angezeigt werden
    list_display = ('person_first_name', 'person_last_name', 'person_email', 'booking_from', 'booking_to', 'room', 'checked_in')

    # Felder, nach denen gefiltert werden kann
    list_filter = ('booking_from', 'booking_to', 'room__type', 'checked_in')

    # Felder, nach denen gesucht werden kann
    search_fields = ('person__first_name', 'person__last_name', 'person__email', 'room__number')

    # Standard-Sortierung
    ordering = ('-booking_from',)

    # Methoden zur Anzeige der Personendaten
    def person_first_name(self, obj):
        return obj.person.first_name
    person_first_name.short_description = 'First Name'

    def person_last_name(self, obj):
        return obj.person.last_name
    person_last_name.short_description = 'Last Name'

    def person_email(self, obj):
        return obj.person.email
    person_email.short_description = 'Email'

@admin.register(Room)
class RoomAdmin(admin.ModelAdmin):
    list_display = ('name', 'number', 'type')
    list_filter = ('type',)
    search_fields = ('name','number', 'type')
    ordering = ('-number',)