import uuid
from django.db import models


class Application(models.Model):
    STATUS_CHOICES = [
        ('SUBMITTED', 'Submitted'),
        ('VIEWED', 'Viewed'),
        ('SHORTLISTED', 'Shortlisted'),
        ('REJECTED', 'Rejected'),
        ('HIRED', 'Hired'),
    ]

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    job = models.ForeignKey('jobs.Job', on_delete=models.CASCADE, related_name='applications')
    applicant = models.ForeignKey('accounts.User', on_delete=models.CASCADE, related_name='applications')
    cover_letter = models.TextField(blank=True)
    cv_file = models.FileField(upload_to='cvs/', blank=True, null=True)
    cv_url = models.URLField(blank=True)
    status = models.CharField(max_length=15, choices=STATUS_CHOICES, default='SUBMITTED')
    employer_notes = models.TextField(blank=True)
    applied_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-applied_at']
        unique_together = ('job', 'applicant')

    def __str__(self):
        return f"{self.applicant.full_name} → {self.job.title}"


class SavedJob(models.Model):
    user = models.ForeignKey('accounts.User', on_delete=models.CASCADE, related_name='saved_jobs')
    job = models.ForeignKey('jobs.Job', on_delete=models.CASCADE, related_name='saved_by')
    saved_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('user', 'job')
        ordering = ['-saved_at']

    def __str__(self):
        return f"{self.user.full_name} saved {self.job.title}"
