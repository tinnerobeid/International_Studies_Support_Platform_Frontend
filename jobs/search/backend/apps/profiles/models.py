from django.db import models
from django.conf import settings


class SeekerProfile(models.Model):
    GENDER_CHOICES = [('M', 'Male'), ('F', 'Female'), ('O', 'Other')]

    user = models.OneToOneField(
        settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='seeker_profile'
    )
    bio = models.TextField(max_length=400, blank=True)
    profile_photo = models.ImageField(upload_to='profile_photos/', blank=True, null=True)
    date_of_birth = models.DateField(null=True, blank=True)
    gender = models.CharField(max_length=1, choices=GENDER_CHOICES, blank=True)
    is_discoverable = models.BooleanField(default=True)
    profile_views = models.PositiveIntegerField(default=0)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"Profile: {self.user.username}"


class WorkExperience(models.Model):
    seeker = models.ForeignKey(
        settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='work_experience'
    )
    job_title = models.CharField(max_length=100)
    company_name = models.CharField(max_length=150)
    start_date = models.DateField()
    end_date = models.DateField(null=True, blank=True)
    is_current = models.BooleanField(default=False)
    description = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-start_date']

    def __str__(self):
        return f"{self.job_title} at {self.company_name}"


class Education(models.Model):
    LEVEL_CHOICES = [
        ('PRIMARY', 'Primary School'),
        ('O_LEVEL', 'Ordinary Level (Form 4)'),
        ('A_LEVEL', 'Advanced Level (Form 6)'),
        ('CERTIFICATE', 'Certificate'),
        ('DIPLOMA', 'Diploma'),
        ('DEGREE', "Bachelor's Degree"),
        ('MASTERS', "Master's Degree"),
        ('PHD', 'PhD'),
    ]

    seeker = models.ForeignKey(
        settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='education'
    )
    institution_name = models.CharField(max_length=200)
    level = models.CharField(max_length=15, choices=LEVEL_CHOICES)
    field_of_study = models.CharField(max_length=100, blank=True)
    start_year = models.PositiveSmallIntegerField()
    end_year = models.PositiveSmallIntegerField(null=True, blank=True)
    grade = models.CharField(max_length=50, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-start_year']

    def __str__(self):
        return f"{self.level} at {self.institution_name}"


class Skill(models.Model):
    name_en = models.CharField(max_length=60, unique=True)
    name_sw = models.CharField(max_length=60, blank=True)

    class Meta:
        ordering = ['name_en']

    def __str__(self):
        return self.name_en


class SeekerSkill(models.Model):
    LEVEL_CHOICES = [
        ('BEGINNER', 'Beginner'),
        ('INTERMEDIATE', 'Intermediate'),
        ('EXPERT', 'Expert'),
    ]

    seeker = models.ForeignKey(
        settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='skills'
    )
    skill = models.ForeignKey(Skill, on_delete=models.CASCADE, related_name='seekers')
    level = models.CharField(max_length=15, choices=LEVEL_CHOICES, default='INTERMEDIATE')

    class Meta:
        unique_together = ('seeker', 'skill')

    def __str__(self):
        return f"{self.seeker.username} — {self.skill.name_en}"


class SeekerCV(models.Model):
    seeker = models.ForeignKey(
        settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='cvs'
    )
    file = models.FileField(upload_to='cvs/uploads/')
    original_filename = models.CharField(max_length=200, blank=True)
    uploaded_at = models.DateTimeField(auto_now_add=True)
    is_primary = models.BooleanField(default=True)

    class Meta:
        ordering = ['-uploaded_at']

    def __str__(self):
        return f"CV: {self.seeker.username} ({self.uploaded_at.date()})"
