from rest_framework import permissions
from django.apps import apps


class IsPremiumUser(permissions.BasePermission):
    def has_permission(self, request, view):
        if not request.user or not request.user.is_authenticated:
            return False

        # Dynamisch die Gruppe aus der AppConfig holen
        app_name = request.resolver_match.app_name
        app_config = apps.get_app_config(app_name)
        required_group = getattr(app_config, 'required_group', None)

        if not required_group:
            return True

        return request.user.groups.filter(name=required_group).exists()