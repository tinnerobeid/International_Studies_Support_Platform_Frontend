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
    region_name = serializers.SerializerMethodField()
    category_name = serializers.SerializerMethodField()
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

    def get_region_name(self, obj):
        if not obj.region:
            return None
        return obj.region.name_en

    def get_category_name(self, obj):
        if not obj.category:
            return None
        return obj.category.name_en

    def get_applications_count(self, obj):
        return obj.applications.count()


class JobDetailSerializer(serializers.ModelSerializer):
    company_name = serializers.CharField(source='company.name', read_only=True)
    company_logo = serializers.ImageField(source='company.logo', read_only=True)
    company_slug = serializers.CharField(source='company.slug', read_only=True)
    company_description = serializers.CharField(source='company.description', read_only=True)
    region_name = serializers.SerializerMethodField()
    district_name = serializers.SerializerMethodField()
    category_name = serializers.SerializerMethodField()
    category_slug = serializers.SerializerMethodField()

    class Meta:
        model = Job
        fields = (
            'id', 'slug', 'title', 'title_sw', 'description', 'description_sw',
            'requirements', 'requirements_sw',
            'company', 'company_name', 'company_logo', 'company_slug', 'company_description',
            'category', 'category_name', 'category_slug',
            'region', 'region_name', 'district', 'district_name',
            'employment_type', 'experience_level', 'education_level',
            'salary_min', 'salary_max', 'salary_display',
            'cv_required', 'application_method', 'whatsapp_number',
            'contact_email', 'contact_address',
            'deadline', 'positions_available', 'status',
            'views_count', 'is_featured', 'created_at', 'expires_at',
        )

    def get_region_name(self, obj):
        if not obj.region:
            return None
        return {'en': obj.region.name_en, 'sw': obj.region.name_sw}

    def get_district_name(self, obj):
        if not obj.district:
            return None
        return {'en': obj.district.name_en, 'sw': obj.district.name_sw}

    def get_category_name(self, obj):
        if not obj.category:
            return None
        return {'en': obj.category.name_en, 'sw': obj.category.name_sw}

    def get_category_slug(self, obj):
        return obj.category.slug if obj.category else None


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
        user = self.context['request'].user
        if company.owner != user:
            raise serializers.ValidationError("You can only post jobs for your own company.")
        return company
