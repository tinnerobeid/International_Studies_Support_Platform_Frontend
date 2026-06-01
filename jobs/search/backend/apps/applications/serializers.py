from rest_framework import serializers
from .models import Application, SavedJob
from apps.jobs.serializers import JobListSerializer


class ApplicationCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Application
        fields = ('job', 'cover_letter', 'cv_file', 'cv_url')

    def validate(self, data):
        job = data.get('job')
        if job and job.cv_required and not data.get('cv_file') and not data.get('cv_url'):
            raise serializers.ValidationError(
                {'cv_file': 'This job requires a CV. Upload a file or provide a link.'}
            )
        return data

    def validate_cv_file(self, value):
        if value:
            if value.size > 5 * 1024 * 1024:
                raise serializers.ValidationError("CV must be under 5MB.")
            allowed = [
                'application/pdf', 'application/msword',
                'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
            ]
            if value.content_type not in allowed:
                raise serializers.ValidationError("Only PDF or Word documents accepted.")
        return value


class ApplicationSerializer(serializers.ModelSerializer):
    job_title = serializers.CharField(source='job.title', read_only=True)
    job_slug = serializers.CharField(source='job.slug', read_only=True)
    company_name = serializers.CharField(source='job.company.name', read_only=True)
    company_logo = serializers.ImageField(source='job.company.logo', read_only=True)
    applicant_name = serializers.CharField(source='applicant.full_name', read_only=True)
    applicant_phone = serializers.CharField(source='applicant.phone_number', read_only=True)

    class Meta:
        model = Application
        fields = (
            'id', 'job', 'job_title', 'job_slug', 'company_name', 'company_logo',
            'applicant', 'applicant_name', 'applicant_phone',
            'cover_letter', 'cv_file', 'cv_url',
            'status', 'applied_at', 'updated_at',
        )
        read_only_fields = ('id', 'applicant', 'status', 'applied_at', 'updated_at')


class ApplicationStatusUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Application
        fields = ('status', 'employer_notes')


class SavedJobSerializer(serializers.ModelSerializer):
    job = JobListSerializer(read_only=True)

    class Meta:
        model = SavedJob
        fields = ('id', 'job', 'saved_at')
