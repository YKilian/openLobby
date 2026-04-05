from django.db import models

from home.models import Person

# Create your models here.

class Booking(Person):
    booking_from = models.DateTimeField()
    booking_to = models.DateTimeField()
    checked_in = models.BooleanField(default=False)
