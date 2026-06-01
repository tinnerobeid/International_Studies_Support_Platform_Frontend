from django.contrib import admin
from .models import TanzaniaRegion, District


@admin.register(TanzaniaRegion)
class TanzaniaRegionAdmin(admin.ModelAdmin):
    list_display = ('name_en', 'name_sw', 'is_mainland', 'order')
    list_filter = ('is_mainland',)


@admin.register(District)
class DistrictAdmin(admin.ModelAdmin):
    list_display = ('name_en', 'region')
    list_filter = ('region',)
    search_fields = ('name_en',)
