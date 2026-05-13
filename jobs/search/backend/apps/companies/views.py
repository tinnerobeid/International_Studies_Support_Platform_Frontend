from rest_framework import generics, permissions
from rest_framework.exceptions import PermissionDenied
from django.shortcuts import get_object_or_404
from .models import Company
from .serializers import CompanySerializer, CompanyListSerializer
from core.permissions import IsEmployer


class CompanyListCreateView(generics.ListCreateAPIView):
    queryset = Company.objects.select_related('region', 'industry').all()

    def get_serializer_class(self):
        if self.request.method == 'GET':
            return CompanyListSerializer
        return CompanySerializer

    def get_permissions(self):
        if self.request.method == 'POST':
            return [IsEmployer()]
        return [permissions.AllowAny()]

    def perform_create(self, serializer):
        serializer.save(owner=self.request.user)


class CompanyDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Company.objects.select_related('region', 'industry', 'owner').all()
    serializer_class = CompanySerializer
    lookup_field = 'slug'

    def get_permissions(self):
        if self.request.method == 'GET':
            return [permissions.AllowAny()]
        return [permissions.IsAuthenticated()]

    def check_object_permissions(self, request, obj):
        super().check_object_permissions(request, obj)
        if request.method not in ('GET', 'HEAD', 'OPTIONS'):
            if obj.owner != request.user:
                raise PermissionDenied("You do not own this company.")
