docker compose up --build -d

docker compose exec web python manage.py test bookings -v 2