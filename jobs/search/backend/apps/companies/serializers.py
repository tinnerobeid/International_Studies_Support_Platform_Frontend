from rest_framework import serializers
from .models import Company


class CompanyListSerializer(serializers.ModelSerializer):
    region_name = serializers.SerializerMethodField()
    active_jobs_count = serializers.SerializerMethodField()

    class Meta:
        model = Company
        fields = ('id', 'name', 'slug', 'logo', 'region_name', 'industry', 'active_jobs_count', 'is_verified')

    def get_region_name(self, obj):
        return obj.region.name_en if obj.region else None

    def get_active_jobs_count(self, obj):
        return obj.jobs.filter(status='ACTIVE').count()


class CompanySerializer(serializers.ModelSerializer):
    owner_name = serializers.CharField(source='owner.full_name', read_only=True)
    region_name = serializers.SerializerMethodField()
    active_jobs_count = serializers.SerializerMethodField()

    class Meta:
        model = Company
        fields = (
            'id', 'name', 'name_sw', 'slug', 'description', 'description_sw',
            'logo', 'website', 'phone_number', 'email', 'region', 'region_name',
            'address', 'industry', 'employee_count', 'is_verified',
            'owner_name', 'active_jobs_count', 'created_at',
        )
        read_only_fields = ('id', 'slug', 'owner_name', 'is_verified', 'created_at')

    def get_region_name(self, obj):
        if not obj.region:
            return None
        request = self.context.get('request')
        lang = request.user.preferred_language if (request and request.user.is_authenticated) else 'en'
        return obj.region.name_sw if lang == 'sw' else obj.region.name_en

    def get_active_jobs_count(self, obj):
        return obj.jobs.filter(status='ACTIVE').count()
