from django.contrib import admin
from .models import Company


@admin.register(Company)
class CompanyAdmin(admin.ModelAdmin):
    list_display = ('name', 'owner', 'region', 'is_verified', 'created_at')
    list_filter = ('is_verified', 'region')
    search_fields = ('name', 'owner__phone_number')
    prepopulated_fields = {'slug': ('name',)}
