import phonenumbers
from rest_framework import serializers
from .models import User


def normalize_phone(phone):
    try:
        parsed = phonenumbers.parse(phone, 'TZ')
        if not phonenumbers.is_valid_number(parsed):
            raise serializers.ValidationError("Invalid Tanzanian phone number.")
        return phonenumbers.format_number(parsed, phonenumbers.PhoneNumberFormat.E164)
    except phonenumbers.NumberParseException:
        raise serializers.ValidationError("Invalid phone number format.")


class RequestOTPSerializer(serializers.Serializer):
    phone_number = serializers.CharField(max_length=20)
    purpose = serializers.ChoiceField(choices=['LOGIN', 'REGISTER'], default='LOGIN')

    def validate_phone_number(self, value):
        return normalize_phone(value)


class VerifyOTPSerializer(serializers.Serializer):
    phone_number = serializers.CharField(max_length=20)
    code = serializers.CharField(max_length=6, min_length=6)
    purpose = serializers.ChoiceField(choices=['LOGIN', 'REGISTER'], default='LOGIN')
    # Required only on REGISTER
    full_name = serializers.CharField(max_length=150, required=False)
    role = serializers.ChoiceField(choices=['JOB_SEEKER', 'EMPLOYER'], required=False)

    def validate_phone_number(self, value):
        return normalize_phone(value)

    def validate(self, data):
        if data.get('purpose') == 'REGISTER':
            if not data.get('full_name'):
                raise serializers.ValidationError({'full_name': 'Required for registration.'})
            if not data.get('role'):
                raise serializers.ValidationError({'role': 'Required for registration.'})
        return data


class UserSerializer(serializers.ModelSerializer):
    region_name = serializers.SerializerMethodField()

    class Meta:
        model = User
        fields = (
            'id', 'phone_number', 'email', 'full_name', 'role',
            'preferred_language', 'profile_photo', 'region', 'region_name',
            'is_verified', 'date_joined'
        )
        read_only_fields = ('id', 'phone_number', 'role', 'is_verified', 'date_joined')

    def get_region_name(self, obj):
        if obj.region:
            lang = obj.preferred_language
            return obj.region.name_sw if lang == 'sw' else obj.region.name_en
        return None


class UpdateProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('full_name', 'email', 'preferred_language', 'profile_photo', 'region')
