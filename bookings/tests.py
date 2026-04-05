from django.test import TestCase, Client
from django.urls import reverse
from django.contrib.auth import get_user_model
from django.contrib.auth.models import Group
from .models import Booking
import json

User = get_user_model()


class BookingTest(TestCase):
    def setUp(self):
        # 1. User und Gruppe erstellen
        self.admin = User.objects.create_superuser('admin', 'admin@test.com', 'pass')
        self.premium_group = Group.objects.create(name='Premium')
        self.admin.groups.add(self.premium_group)

        # 2. Test-Buchung anlegen
        self.booking = Booking.objects.create(
            first_name="Max",
            last_name="Mustermann",
            date_of_birth="1990-01-01",
            email='max.mustermann@test.com',
            tel='+49 12345678900',
            booking_from="2026-05-01T10:00:00Z",
            booking_to="2026-05-01T12:00:00Z",
            checked_in=False
        )
        self.client = Client()
        self.client.force_login(self.admin)

    def test_calendar_api_returns_json(self):
        """Checks if the calendar API returns JSON data."""
        # Namespace 'bookings' + Name 'booking-list'
        url = reverse('bookings:booking-list')
        response = self.client.get(url)

        self.assertEqual(response.status_code, 200)
        data = response.json()
        self.assertTrue(len(data) > 0)
        # Hinweis: Prüfe, ob dein Serializer wirklich 'title' liefert
        # oder ob es dort anders heißt (z.B. 'name')
        self.assertEqual(data[0]['title'], "Mustermann, Max")

    def test_checkin_ajax_updates_status(self):
        """Check if checkin-status is updated via AJAX request."""
        # Namespace 'bookings' + Name 'update-checkin'
        # WICHTIG: Dein URL-Parameter heißt 'booking_id', nicht 'pk'
        url = reverse('bookings:update-checkin', kwargs={'booking_id': self.booking.id})

        response = self.client.post(
            url,
            data=json.dumps({'checked_in': True}),
            content_type='application/json',
            HTTP_X_REQUESTED_WITH='XMLHttpRequest'
        )

        self.assertEqual(response.status_code, 200)
        self.assertTrue(response.json()['success'])
        self.booking.refresh_from_db()
        self.assertTrue(self.booking.checked_in)

    def test_access_denied_for_non_premium(self):
        """User without Premium-Group should not be able to see the bookings."""
        low_level_user = User.objects.create_user('guest', 'guest@test.com', 'pass')
        self.client.force_login(low_level_user)

        # Namespace 'bookings' + Name 'index'
        url = reverse('bookings:index')
        response = self.client.get(url)

        self.assertEqual(response.status_code, 403)

    def test_access_denied_for_non_premium_via_api(self):
        """User without Premium-Group should not be able to see the bookings via api."""
        low_level_user = User.objects.create_user('guest', 'guest@test.com', 'pass')
        self.client.force_login(low_level_user)

        # Namespace 'bookings' + Name 'index'
        url = reverse('bookings:booking-list')
        response = self.client.get(url)

        self.assertEqual(response.json(), {"detail":"You do not have permission to perform this action."})