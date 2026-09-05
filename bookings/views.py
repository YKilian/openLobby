from django.shortcuts import render
from django.views import View
from django.contrib.auth.mixins import LoginRequiredMixin, UserPassesTestMixin
from django.apps import apps
from rest_framework.decorators import api_view, permission_classes, parser_classes
from rest_framework.response import Response
from rest_framework.parsers import BaseParser
from django.views.decorators.http import require_POST
from django.views.decorators.csrf import csrf_exempt
from .models import Booking
import json
from django.conf import settings
from django.utils import timezone

from .models import Booking
from .serializers import BookingSerializer
from .models import Booking
from home.permissions import IsPremiumUser

# Create your views here.

class PlainTextParser(BaseParser):
    media_type = 'text/plain'

    def parse(self, stream, media_type=None, parser_context=None):
        return stream.read().decode('utf-8')
class BookingView(LoginRequiredMixin, UserPassesTestMixin, View):
    template_name = "bookings/booking.html"

    def test_func(self):
        app_config = apps.get_app_config(self.request.resolver_match.app_name)

        required_group = getattr(app_config, 'required_group', None)

        if not required_group:
            return True
        return self.request.user.groups.filter(name=required_group).exists()

    def get(self, request):
        now = timezone.now()
        bookings = Booking.objects.filter(booking_to__gte=now).order_by('booking_from')

        return render(request, self.template_name, {'bookings': bookings, 'TIME_ZONE': settings.TIME_ZONE})


@api_view(['GET'])
@permission_classes([IsPremiumUser])
def booking_list(request):
    bookings = Booking.objects.all()
    serializer = BookingSerializer(bookings, many=True)
    return Response(serializer.data)

@api_view(['POST'])
@csrf_exempt
@permission_classes([IsPremiumUser])
def update_checkin(request, booking_id):
    try:
        booking = Booking.objects.get(id=booking_id)
        booking.checked_in = True
        booking.save()
        return Response({'success': True, 'booking_id': booking_id})
    except Booking.DoesNotExist:
        return Response({'success': False, 'error': 'Booking not found'}, status=404)
    except Exception as e:
        return Response({'success': False, 'error': str(e)}, status=500)


@api_view(['POST'])
@csrf_exempt
@parser_classes([PlainTextParser])
@permission_classes([IsPremiumUser])
def update_note(request, booking_id):
    try:
        booking = Booking.objects.get(id=booking_id)
        booking.note = request.data
        booking.save()
        return Response({'success': True})
    except Booking.DoesNotExist:
        return Response({'success': False, 'error': 'Booking not found'}, status=404)
    except Exception as e:
        return Response({'success': False, 'error': str(e)}, status=500)