from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from .models import User, OTPVerification


@admin.register(User)
class UserAdmin(BaseUserAdmin):
    list_display = ('phone_number', 'full_name', 'role', 'is_verified', 'date_joined')
    list_filter = ('role', 'is_verified', 'preferred_language')
    search_fields = ('phone_number', 'full_name', 'email')
    ordering = ('-date_joined',)
    fieldsets = (
        (None, {'fields': ('phone_number', 'password')}),
        ('Personal Info', {'fields': ('full_name', 'email', 'profile_photo', 'region')}),
        ('Preferences', {'fields': ('role', 'preferred_language')}),
        ('Status', {'fields': ('is_active', 'is_staff', 'is_verified', 'is_superuser')}),
    )
    add_fieldsets = (
        (None, {'fields': ('phone_number', 'full_name', 'role', 'password1', 'password2')}),
    )


@admin.register(OTPVerification)
class OTPVerificationAdmin(admin.ModelAdmin):
    list_display = ('phone_number', 'purpose', 'is_used', 'expires_at', 'created_at')
    list_filter = ('purpose', 'is_used')
    search_fields = ('phone_number',)
