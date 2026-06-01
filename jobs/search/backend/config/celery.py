import os
from celery import Celery
from celery.schedules import crontab

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings.base')

app = Celery('search')
app.config_from_object('django.conf:settings', namespace='CELERY')
app.autodiscover_tasks()


@app.on_after_configure.connect
def setup_periodic_tasks(sender, **kwargs):
    sender.add_periodic_task(
        crontab(hour=0, minute=0),
        expire_old_jobs.s(),
        name='expire-old-jobs-daily',
    )


@app.task
def expire_old_jobs():
    from django.utils import timezone
    from apps.jobs.models import Job
    count = Job.objects.filter(status='ACTIVE', expires_at__lt=timezone.now()).update(status='EXPIRED')
    return f"Expired {count} jobs"
