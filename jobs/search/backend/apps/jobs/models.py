import uuid
from django.db import models
from django.utils import timezone
from django.utils.text import slugify
from django.conf import settings


class JobCategory(models.Model):
    name_en = models.CharField(max_length=100)
    name_sw = models.CharField(max_length=100)
    slug = models.SlugField(unique=True)
    icon = models.CharField(max_length=50, blank=True)
    is_active = models.BooleanField(default=True)

    class Meta:
        verbose_name_plural = 'Job Categories'
        ordering = ['name_en']

    def __str__(self):
        return self.name_en


class Job(models.Model):
    EMPLOYMENT_TYPE = [
        ('FULL_TIME', 'Full Time'),
        ('PART_TIME', 'Part Time'),
        ('CONTRACT', 'Contract'),
        ('CASUAL', 'Casual / Daily'),
        ('INTERNSHIP', 'Internship'),
        ('VOLUNTEER', 'Volunteer'),
    ]
    EXPERIENCE_LEVEL = [
        ('NO_EXPERIENCE', 'No Experience Required'),
        ('JUNIOR', 'Junior (0–2 years)'),
        ('MID', 'Mid-Level (2–5 years)'),
        ('SENIOR', 'Senior (5+ years)'),
        ('EXECUTIVE', 'Executive'),
    ]
    EDUCATION_LEVEL = [
        ('NONE', 'No Formal Education'),
        ('PRIMARY', 'Primary School'),
        ('O_LEVEL', 'Ordinary Level (Form 4)'),
        ('A_LEVEL', 'Advanced Level (Form 6)'),
        ('CERTIFICATE', 'Certificate'),
        ('DIPLOMA', 'Diploma'),
        ('DEGREE', "Bachelor's Degree"),
        ('MASTERS', "Master's Degree"),
        ('PHD', 'PhD'),
    ]
    APPLICATION_METHOD = [
        ('IN_APP', 'Apply via Search App'),
        ('WHATSAPP', 'Apply via WhatsApp'),
        ('EMAIL', 'Apply via Email'),
        ('WALK_IN', 'Walk-In Application'),
    ]
    STATUS = [
        ('DRAFT', 'Draft'),
        ('ACTIVE', 'Active'),
        ('CLOSED', 'Closed'),
        ('EXPIRED', 'Expired'),
    ]

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    company = models.ForeignKey('companies.Company', on_delete=models.CASCADE, related_name='jobs')
    posted_by = models.ForeignKey('accounts.User', on_delete=models.CASCADE, related_name='posted_jobs')
    category = models.ForeignKey(JobCategory, on_delete=models.SET_NULL, null=True, related_name='jobs')
    region = models.ForeignKey('locations.TanzaniaRegion', on_delete=models.SET_NULL, null=True, related_name='jobs')
    district = models.ForeignKey('locations.District', on_delete=models.SET_NULL, null=True, blank=True, related_name='jobs')

    title = models.CharField(max_length=200)
    title_sw = models.CharField(max_length=200, blank=True)
    slug = models.SlugField(max_length=240, unique=True, blank=True)
    description = models.TextField()
    description_sw = models.TextField(blank=True)
    requirements = models.TextField(blank=True)
    requirements_sw = models.TextField(blank=True)

    employment_type = models.CharField(max_length=20, choices=EMPLOYMENT_TYPE, default='FULL_TIME')
    experience_level = models.CharField(max_length=20, choices=EXPERIENCE_LEVEL, default='NO_EXPERIENCE')
    education_level = models.CharField(max_length=20, choices=EDUCATION_LEVEL, default='NONE')

    salary_min = models.DecimalField(max_digits=12, decimal_places=0, null=True, blank=True)
    salary_max = models.DecimalField(max_digits=12, decimal_places=0, null=True, blank=True)
    salary_display = models.CharField(max_length=100, blank=True)

    cv_required = models.BooleanField(default=False)
    application_method = models.CharField(max_length=20, choices=APPLICATION_METHOD, default='IN_APP')
    whatsapp_number = models.CharField(max_length=20, blank=True)
    contact_email = models.EmailField(blank=True)
    contact_address = models.CharField(max_length=255, blank=True)

    deadline = models.DateField(null=True, blank=True)
    positions_available = models.PositiveIntegerField(default=1)
    status = models.CharField(max_length=10, choices=STATUS, default='ACTIVE')
    views_count = models.PositiveIntegerField(default=0)
    is_featured = models.BooleanField(default=False)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    expires_at = models.DateTimeField(null=True, blank=True)

    class Meta:
        ordering = ['-is_featured', '-created_at']
        indexes = [
            models.Index(fields=['status', '-created_at']),
            models.Index(fields=['region', 'category', 'status']),
            models.Index(fields=['company']),
        ]

    def save(self, *args, **kwargs):
        if not self.slug:
            base = slugify(self.title)
            slug = base
            n = 1
            while Job.objects.filter(slug=slug).exclude(pk=self.pk).exists():
                slug = f"{base}-{n}"
                n += 1
            self.slug = slug

        if not self.expires_at:
            expiry_days = getattr(settings, 'JOB_EXPIRY_DAYS', 60)
            self.expires_at = timezone.now() + timezone.timedelta(days=expiry_days)

        super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.title} @ {self.company.name}"
