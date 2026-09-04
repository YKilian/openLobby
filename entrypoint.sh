#!/bin/sh

echo "Waiting for database..."
while ! nc -z db 5432; do
  sleep 0.1
done
echo "Database is ready"

echo "Execute migration..."
python manage.py migrate --noinput

echo "Collect static data..."
python manage.py collectstatic --noinput

echo "Setup Admin and Groups..."
python manage.py shell -c "from django.contrib.auth import get_user_model; from django.contrib.auth.models import Group; User = get_user_model(); admin, _ = User.objects.get_or_create(username='admin', first_name='admin', defaults={'email': 'admin@example.com', 'is_superuser': True, 'is_staff': True}); admin.set_password('admin'); admin.save(); group, _ = Group.objects.get_or_create(name='Premium'); admin.groups.add(group)"

echo "Start Server..."
exec "$@"