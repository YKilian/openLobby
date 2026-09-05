from django.contrib import admin
from home.models import Person

# Register your models here.

@admin.register(Person)
class PersonAdmin(admin.ModelAdmin):
    list_display = ('gender', 'first_name', 'last_name', 'date_of_birth', 'email', 'tel')
    list_filter = ('gender', 'first_name', 'last_name', 'date_of_birth', 'email', 'tel')
    search_fields = ('gender', 'first_name', 'last_name', 'date_of_birth', 'email', 'tel')
    ordering = ('gender', 'first_name', 'last_name', 'date_of_birth', 'email', 'tel')
    fields = ('gender', 'first_name', 'last_name', 'date_of_birth', 'email', 'tel')
