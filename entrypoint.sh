#!/bin/sh

echo "Waiting for database..."
while ! nc -z db 5432; do
  sleep 0.1
done
echo "Database is ready"

echo "Creating migrations for home and bookings..."
python manage.py makemigrations home --noinput
python manage.py makemigrations bookings --noinput

echo "Execute migration for home app first..."
python manage.py migrate home --noinput

echo "Execute migration for all apps..."
python manage.py migrate --noinput

echo "Collect static data..."
python manage.py collectstatic --noinput

echo "Setup Admin and Groups..."
python manage.py shell -c "
from django.contrib.auth import get_user_model
from django.contrib.auth.models import Group
from home.models import Person

User = get_user_model()

admin, _ = User.objects.get_or_create(
    username='admin',
    defaults={
        'first_name': 'admin',
        'email': 'admin@example.com',
        'is_superuser': True,
        'is_staff': True
    }
)
admin.set_password('admin')
admin.save()

group, _ = Group.objects.get_or_create(name='Premium')
admin.groups.add(group)
"

echo "Start Server..."
exec "$@"