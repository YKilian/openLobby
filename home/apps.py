from django.apps import AppConfig


class IndexConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'home'
    display_name = "Main menu"
    description = "Landingpage"
    icon = "bi-house-door"
    required_group = "Premium"
