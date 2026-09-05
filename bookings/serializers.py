from rest_framework import serializers
from .models import Booking, Person, Room


class PersonSerializer(serializers.ModelSerializer):
    class Meta:
        model = Person
        fields = '__all__'


class RoomSerializer(serializers.ModelSerializer):
    class Meta:
        model = Room
        fields = '__all__'


class BookingSerializer(serializers.ModelSerializer):
    person = PersonSerializer(read_only=True)
    room = RoomSerializer(read_only=True)

    class Meta:
        model = Booking
        fields = '__all__'

    def to_representation(self, instance):
        representation = super().to_representation(instance)

        return {
            "title": f"{representation['person']['last_name']}, {representation['person']['first_name']}",
            "start": representation['booking_from'],
            "end": representation['booking_to'],
            "color": "#28a745" if representation['checked_in'] else "#007bff",
            "extendedProps": {
                "id": representation['id']
            }
        }