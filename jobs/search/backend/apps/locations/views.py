from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import AllowAny
from django.shortcuts import get_object_or_404
from .models import TanzaniaRegion
from .serializers import RegionSerializer, RegionDetailSerializer


class RegionListView(APIView):
    permission_classes = [AllowAny]

    def get(self, request):
        regions = TanzaniaRegion.objects.all()
        return Response(RegionSerializer(regions, many=True).data)


class RegionDistrictsView(APIView):
    permission_classes = [AllowAny]

    def get(self, request, region_id):
        region = get_object_or_404(TanzaniaRegion, pk=region_id)
        return Response(RegionDetailSerializer(region).data)
