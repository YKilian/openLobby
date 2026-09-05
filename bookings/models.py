from django.db import models

from home.models import Person

# Create your models here.

class Room(models.Model):
    TYPE_CHOICES = [
        ('S', 'Standard'),
        ('P', 'Premium')
    ]
    name = models.CharField(max_length=100)
    number = models.IntegerField()
    type = models.CharField(max_length=1, choices=TYPE_CHOICES, default='S')

    def __str__(self):
        return f"{self.number}"


class Booking(models.Model):
    person = models.ForeignKey(Person, on_delete=models.CASCADE, null=True)
    booking_from = models.DateTimeField()
    booking_to = models.DateTimeField()
    checked_in = models.BooleanField(default=False)
    room = models.ForeignKey(Room, on_delete=models.DO_NOTHING, null=True)

    def __str__(self):
        return f"{self.person} - {self.room}"
