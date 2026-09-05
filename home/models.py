from django.db import models


class Person(models.Model):
    GENDER_CHOICES = [
        ('M', 'Male'),
        ('F', 'Female'),
        ('NB', 'Non-Binary'),
        ('O', "Other"),
        ('P', 'Prefer not to Answer')
    ]
    gender = models.CharField(max_length=2, choices=GENDER_CHOICES)
    first_name = models.CharField(max_length=100)
    last_name = models.CharField(max_length=100)
    date_of_birth = models.DateField()
    email = models.EmailField()
    tel = models.CharField(max_length=100)

    def __str__(self):
        return f"{self.first_name} {self.last_name}"
