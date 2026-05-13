@echo off
echo === Search Backend Setup ===

python -m venv venv
call venv\Scripts\activate

pip install -r requirements/base.txt

copy .env.example .env
echo .env created - edit DB settings if needed

python manage.py migrate
python manage.py loaddata apps/locations/fixtures/regions.json
python manage.py loaddata apps/jobs/fixtures/categories.json

echo.
echo === Setup complete! ===
echo Run: python manage.py runserver
echo Admin: python manage.py createsuperuser
