from rest_framework import serializers
from .models import Job, JobCategory


class JobCategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = JobCategory
        fields = ('id', 'name_en', 'name_sw', 'slug', 'icon')


class JobListSerializer(serializers.ModelSerializer):
    company_name = serializers.CharField(source='company.name', read_only=True)
    company_logo = serializers.ImageField(source='company.logo', read_only=True)
    company_slug = serializers.CharField(source='company.slug', read_only=True)
    region_name = serializers.CharField(source='region.name_en', read_only=True)
    category_name = serializers.CharField(source='category.name_en', read_only=True)
    applications_count = serializers.SerializerMethodField()

    class Meta:
        model = Job
        fields = (
            'id', 'slug', 'title', 'title_sw', 'company_name', 'company_logo',
            'company_slug', 'region_name', 'category_name', 'employment_type',
            'experience_level', 'salary_display', 'cv_required',
            'application_method', 'deadline', 'is_featured',
            'applications_count', 'created_at',
        )

    def get_applications_count(self, obj):
        return obj.applications.count()


class JobDetailSerializer(serializers.ModelSerializer):
    company_name = serializers.CharField(source='company.name', read_only=True)
    company_logo = serializers.ImageField(source='company.logo', read_only=True)
    company_slug = serializers.CharField(source='company.slug', read_only=True)
    company_description = serializers.CharField(source='company.description', read_only=True)
    region_name = serializers.CharField(source='region.name_en', read_only=True)
    region_name_sw = serializers.CharField(source='region.name_sw', read_only=True)
    district_name = serializers.CharField(source='district.name_en', read_only=True)
    district_name_sw = serializers.CharField(source='district.name_sw', read_only=True)
    category_name = serializers.CharField(source='category.name_en', read_only=True)
    category_name_sw = serializers.CharField(source='category.name_sw', read_only=True)
    category_slug = serializers.CharField(source='category.slug', read_only=True)
    applications_count = serializers.SerializerMethodField()

    class Meta:
        model = Job
        fields = (
            'id', 'slug', 'title', 'title_sw', 'description', 'description_sw',
            'requirements', 'requirements_sw',
            'company', 'company_name', 'company_logo', 'company_slug', 'company_description',
            'category', 'category_name', 'category_name_sw', 'category_slug',
            'region', 'region_name', 'region_name_sw', 'district', 'district_name', 'district_name_sw',
            'employment_type', 'experience_level', 'education_level',
            'salary_min', 'salary_max', 'salary_display',
            'cv_required', 'application_method', 'whatsapp_number',
            'contact_email', 'contact_address',
            'deadline', 'positions_available', 'status',
            'views_count', 'applications_count', 'is_featured', 'created_at', 'expires_at',
        )

    def get_applications_count(self, obj):
        return obj.applications.count()


class JobCreateUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Job
        fields = (
            'title', 'title_sw', 'description', 'description_sw',
            'requirements', 'requirements_sw',
            'company', 'category', 'region', 'district',
            'employment_type', 'experience_level', 'education_level',
            'salary_min', 'salary_max', 'salary_display',
            'cv_required', 'application_method', 'whatsapp_number',
            'contact_email', 'contact_address',
            'deadline', 'positions_available', 'status',
        )

    def validate_company(self, company):
        if company.owner != self.context['request'].user:
            raise serializers.ValidationError("You can only post jobs for your own company.")
        return company
