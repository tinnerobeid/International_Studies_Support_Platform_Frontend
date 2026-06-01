import django_filters
from .models import Job


class JobFilter(django_filters.FilterSet):
    region = django_filters.NumberFilter(field_name='region__id')
    category = django_filters.CharFilter(field_name='category__slug')
    employment_type = django_filters.CharFilter(field_name='employment_type')
    experience_level = django_filters.CharFilter(field_name='experience_level')
    cv_required = django_filters.BooleanFilter(field_name='cv_required')
    company = django_filters.CharFilter(field_name='company__slug')
    salary_min = django_filters.NumberFilter(field_name='salary_min', lookup_expr='gte')
    salary_max = django_filters.NumberFilter(field_name='salary_max', lookup_expr='lte')

    class Meta:
        model = Job
        fields = ['region', 'category', 'employment_type', 'experience_level', 'cv_required', 'company']
