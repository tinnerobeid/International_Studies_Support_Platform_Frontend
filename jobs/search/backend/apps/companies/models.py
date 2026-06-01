import uuid
from django.db import models
from django.utils.text import slugify


class Company(models.Model):
    SIZE_CHOICES = [
        ('1-10', '1–10'),
        ('11-50', '11–50'),
        ('51-200', '51–200'),
        ('201-500', '201–500'),
        ('500+', '500+'),
    ]

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    owner = models.ForeignKey('accounts.User', on_delete=models.CASCADE, related_name='companies')
    name = models.CharField(max_length=200)
    name_sw = models.CharField(max_length=200, blank=True)
    slug = models.SlugField(max_length=220, unique=True, blank=True)
    description = models.TextField(blank=True)
    description_sw = models.TextField(blank=True)
    logo = models.ImageField(upload_to='company_logos/', blank=True, null=True)
    website = models.URLField(blank=True)
    phone_number = models.CharField(max_length=20, blank=True)
    email = models.EmailField(blank=True)
    region = models.ForeignKey(
        'locations.TanzaniaRegion', on_delete=models.SET_NULL,
        null=True, blank=True, related_name='companies'
    )
    address = models.CharField(max_length=255, blank=True)
    industry = models.ForeignKey(
        'jobs.JobCategory', on_delete=models.SET_NULL,
        null=True, blank=True, related_name='companies'
    )
    employee_count = models.CharField(max_length=10, choices=SIZE_CHOICES, blank=True)
    is_verified = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name_plural = 'Companies'
        ordering = ['-created_at']

    def save(self, *args, **kwargs):
        if not self.slug:
            base = slugify(self.name)
            slug, n = base, 1
            while Company.objects.filter(slug=slug).exclude(pk=self.pk).exists():
                slug = f"{base}-{n}"
                n += 1
            self.slug = slug
        super().save(*args, **kwargs)

    def __str__(self):
        return self.name
