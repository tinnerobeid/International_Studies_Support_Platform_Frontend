from django.db import migrations, models


def migrate_existing_users(apps, schema_editor):
    User = apps.get_model('accounts', 'User')
    for user in User.objects.all():
        # Use phone_number as username for existing test users
        base = user.phone_number.lstrip('+').replace(' ', '')[:50]
        user.username = base
        parts = (getattr(user, 'full_name', '') or '').split()
        user.first_name = parts[0] if parts else 'User'
        user.last_name = ' '.join(parts[1:]) if len(parts) > 1 else ''
        user.save()


class Migration(migrations.Migration):

    dependencies = [
        ('accounts', '0001_initial'),
    ]

    operations = [
        # Add new fields (nullable first so existing rows don't break)
        migrations.AddField(
            model_name='user',
            name='username',
            field=models.CharField(max_length=50, null=True, blank=True),
        ),
        migrations.AddField(
            model_name='user',
            name='first_name',
            field=models.CharField(max_length=50, default=''),
            preserve_default=False,
        ),
        migrations.AddField(
            model_name='user',
            name='last_name',
            field=models.CharField(max_length=50, default=''),
            preserve_default=False,
        ),
        migrations.AddField(
            model_name='user',
            name='address',
            field=models.CharField(max_length=255, blank=True, default=''),
            preserve_default=False,
        ),
        # Populate username + first/last name from existing full_name / phone
        migrations.RunPython(migrate_existing_users, migrations.RunPython.noop),
        # Now make username unique and non-null
        migrations.AlterField(
            model_name='user',
            name='username',
            field=models.CharField(max_length=50, unique=True),
        ),
        # Remove the old full_name field
        migrations.RemoveField(
            model_name='user',
            name='full_name',
        ),
        # is_verified defaults to True now
        migrations.AlterField(
            model_name='user',
            name='is_verified',
            field=models.BooleanField(default=True),
        ),
    ]
