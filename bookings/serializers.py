from rest_framework import serializers
from .models import Booking

class BookingSerializer(serializers.ModelSerializer):
    class Meta:
        model = Booking
        fields = ['id', 'first_name', 'last_name', 'booking_from', 'booking_to', 'checked_in']

    def to_representation(self, instance):
        representation = super().to_representation(instance)
        return {
            "title": f"{representation['last_name']}, {representation['first_name']}",
            "start": representation['booking_from'],
            "end": representation['booking_to'],
            "color": "#28a745" if representation['checked_in'] else "#007bff",
            "extendedProps": {
                "id": representation['id']
            }
        }