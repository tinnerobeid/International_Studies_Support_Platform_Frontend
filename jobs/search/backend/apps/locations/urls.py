from django.urls import path
from .views import RegionListView, RegionDistrictsView

urlpatterns = [
    path('regions/', RegionListView.as_view(), name='region-list'),
    path('regions/<int:region_id>/districts/', RegionDistrictsView.as_view(), name='region-districts'),
]
