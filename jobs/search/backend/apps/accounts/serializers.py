from rest_framework import serializers
from django.contrib.auth import authenticate
from .models import User


class RegisterSerializer(serializers.Serializer):
    username = serializers.CharField(max_length=50)
    password = serializers.CharField(min_length=6, write_only=True)
    first_name = serializers.CharField(max_length=50)
    last_name = serializers.CharField(max_length=50)
    phone_number = serializers.CharField(max_length=20)
    address = serializers.CharField(max_length=255, required=False, allow_blank=True)
    role = serializers.ChoiceField(choices=['JOB_SEEKER', 'EMPLOYER'], default='JOB_SEEKER')

    def validate_username(self, value):
        if User.objects.filter(username=value).exists():
            raise serializers.ValidationError("Username already taken.")
        return value.lower()

    def validate_phone_number(self, value):
        cleaned = value.replace(' ', '').replace('-', '')
        if User.objects.filter(phone_number=cleaned).exists():
            raise serializers.ValidationError("Phone number already registered.")
        return cleaned


class LoginSerializer(serializers.Serializer):
    username = serializers.CharField()
    password = serializers.CharField()


class UserSerializer(serializers.ModelSerializer):
    full_name = serializers.SerializerMethodField()
    region_name = serializers.SerializerMethodField()

    class Meta:
        model = User
        fields = (
            'id', 'username', 'first_name', 'last_name', 'full_name',
            'phone_number', 'address', 'email', 'role',
            'preferred_language', 'profile_photo', 'region', 'region_name',
            'is_verified', 'date_joined',
        )
        read_only_fields = ('id', 'username', 'role', 'is_verified', 'date_joined')

    def get_full_name(self, obj):
        return obj.full_name

    def get_region_name(self, obj):
        if obj.region:
            return obj.region.name_sw if obj.preferred_language == 'sw' else obj.region.name_en
        return None


class UpdateProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('first_name', 'last_name', 'phone_number', 'address',
                  'email', 'preferred_language', 'profile_photo', 'region')
