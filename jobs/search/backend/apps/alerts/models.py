from django.db import models
from django.conf import settings


class JobAlert(models.Model):
    EMPLOYMENT_CHOICES = [
        ('', 'Any'),
        ('FULL_TIME', 'Full Time'),
        ('PART_TIME', 'Part Time'),
        ('CONTRACT', 'Contract'),
        ('CASUAL', 'Casual / Daily'),
        ('INTERNSHIP', 'Internship'),
    ]

    seeker = models.ForeignKey(
        settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='job_alerts'
    )
    keyword = models.CharField(max_length=100, blank=True)
    category = models.ForeignKey(
        'jobs.JobCategory', on_delete=models.SET_NULL, null=True, blank=True, related_name='alerts'
    )
    region = models.ForeignKey(
        'locations.TanzaniaRegion', on_delete=models.SET_NULL, null=True, blank=True, related_name='alerts'
    )
    employment_type = models.CharField(max_length=20, choices=EMPLOYMENT_CHOICES, blank=True)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        parts = []
        if self.keyword:
            parts.append(self.keyword)
        if self.category:
            parts.append(self.category.name_en)
        if self.region:
            parts.append(self.region.name_en)
        return f"Alert: {' · '.join(parts) or 'All jobs'} for {self.seeker.username}"
