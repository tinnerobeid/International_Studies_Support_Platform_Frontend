from rest_framework import serializers
from .models import TanzaniaRegion, District


class DistrictSerializer(serializers.ModelSerializer):
    class Meta:
        model = District
        fields = ('id', 'name_en', 'name_sw', 'slug')


class RegionSerializer(serializers.ModelSerializer):
    class Meta:
        model = TanzaniaRegion
        fields = ('id', 'name_en', 'name_sw', 'slug', 'is_mainland')


class RegionDetailSerializer(serializers.ModelSerializer):
    districts = DistrictSerializer(many=True, read_only=True)

    class Meta:
        model = TanzaniaRegion
        fields = ('id', 'name_en', 'name_sw', 'slug', 'is_mainland', 'districts')
