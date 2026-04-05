from django.shortcuts import render
from django.views import View
from django.contrib.auth.mixins import LoginRequiredMixin, UserPassesTestMixin
from django.apps import apps

class IndexView(LoginRequiredMixin, UserPassesTestMixin, View):
    template_name = "home/home.html"

    def test_func(self):
        app_config = apps.get_app_config(self.request.resolver_match.app_name)

        required_group = getattr(app_config, 'required_group', None)

        if not required_group:
            return True
        return self.request.user.groups.filter(name=required_group).exists()

    def get(self, request):
        return render(request, self.template_name, {'user': request.user,})