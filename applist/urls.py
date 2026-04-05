from django.urls import path

from . import views

app_name = "applist"
urlpatterns = [
    path("", views.AppListView.as_view(), name="index"),
]