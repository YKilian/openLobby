from django.apps import apps
from django.contrib.auth.mixins import LoginRequiredMixin
from django.views.generic import TemplateView
from django.urls import reverse, NoReverseMatch

from django.apps import apps


class AppListView(LoginRequiredMixin, TemplateView):
    template_name = "applist/app_list.html"

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        user = self.request.user
        accessible_apps = []

        for app_config in apps.get_app_configs():
            if hasattr(app_config, 'display_name'):
                req_group = getattr(app_config, 'required_group', None)
                ignore = ['applist', 'home']

                if (not req_group or user.groups.filter(name=req_group).exists()) and app_config.label not in ignore:
                    url_name = f"{app_config.label}:index"

                    try:
                        reverse(url_name)
                        accessible_apps.append({
                            'label': app_config.label,
                            'display_name': app_config.display_name,
                            'description': getattr(app_config, 'description', app_config.label),
                            'icon': getattr(app_config, 'icon', 'bi-app'),
                            'url_name': url_name
                        })
                    except NoReverseMatch:
                        continue

        context['installed_apps'] = accessible_apps
        return context