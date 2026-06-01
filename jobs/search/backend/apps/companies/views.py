from rest_framework import generics, permissions
from rest_framework.exceptions import PermissionDenied
from .models import Company
from .serializers import CompanySerializer, CompanyListSerializer
from core.permissions import IsEmployer


class CompanyListCreateView(generics.ListCreateAPIView):
    queryset = Company.objects.select_related('region', 'industry').all()

    def get_serializer_class(self):
        return CompanyListSerializer if self.request.method == 'GET' else CompanySerializer

    def get_permissions(self):
        return [IsEmployer()] if self.request.method == 'POST' else [permissions.AllowAny()]

    def perform_create(self, serializer):
        serializer.save(owner=self.request.user)


class MyCompaniesView(generics.ListAPIView):
    serializer_class = CompanyListSerializer
    permission_classes = [IsEmployer]

    def get_queryset(self):
        return Company.objects.filter(owner=self.request.user).select_related('region')


class CompanyDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Company.objects.select_related('region', 'industry', 'owner').all()
    serializer_class = CompanySerializer
    lookup_field = 'slug'

    def get_permissions(self):
        return [permissions.AllowAny()] if self.request.method == 'GET' else [permissions.IsAuthenticated()]

    def check_object_permissions(self, request, obj):
        super().check_object_permissions(request, obj)
        if request.method not in ('GET', 'HEAD', 'OPTIONS') and obj.owner != request.user:
            raise PermissionDenied("You do not own this company.")
