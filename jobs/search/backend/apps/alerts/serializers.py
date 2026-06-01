from rest_framework import serializers
from .models import JobAlert


class JobAlertSerializer(serializers.ModelSerializer):
    category_name = serializers.CharField(source='category.name_en', read_only=True, default='')
    region_name = serializers.CharField(source='region.name_en', read_only=True, default='')

    class Meta:
        model = JobAlert
        fields = (
            'id', 'keyword', 'category', 'category_name',
            'region', 'region_name', 'employment_type',
            'is_active', 'created_at',
        )
        read_only_fields = ('id', 'created_at')
