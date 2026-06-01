from django.contrib import admin
from .models import Job, JobCategory


@admin.register(JobCategory)
class JobCategoryAdmin(admin.ModelAdmin):
    list_display = ('name_en', 'name_sw', 'slug', 'is_active')
    prepopulated_fields = {'slug': ('name_en',)}


@admin.register(Job)
class JobAdmin(admin.ModelAdmin):
    list_display = ('title', 'company', 'region', 'employment_type', 'status', 'is_featured', 'created_at')
    list_filter = ('status', 'employment_type', 'cv_required', 'is_featured')
    search_fields = ('title', 'company__name')
    list_editable = ('status', 'is_featured')
    raw_id_fields = ('company', 'posted_by')
