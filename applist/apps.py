from django.apps import AppConfig


class ApplistConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'applist'
    display_name = "Applist"
    description = "List all apps, you can access"
    icon = "bi-view-list"
    required_group = "Premium"
