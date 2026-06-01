from rest_framework import generics, permissions
from rest_framework.exceptions import PermissionDenied
from .models import Job, JobCategory
from .serializers import (
    JobListSerializer, JobDetailSerializer,
    JobCreateUpdateSerializer, JobCategorySerializer,
)
from .filters import JobFilter
from core.permissions import IsEmployer


class JobCategoryListView(generics.ListAPIView):
    queryset = JobCategory.objects.filter(is_active=True)
    serializer_class = JobCategorySerializer
    permission_classes = [permissions.AllowAny]


class JobListCreateView(generics.ListCreateAPIView):
    filterset_class = JobFilter
    search_fields = ['title', 'title_sw', 'description', 'company__name']
    ordering_fields = ['created_at', 'deadline', 'salary_min']
    ordering = ['-is_featured', '-created_at']

    def get_queryset(self):
        return Job.objects.filter(status='ACTIVE').select_related('company', 'category', 'region', 'district')

    def get_serializer_class(self):
        return JobCreateUpdateSerializer if self.request.method == 'POST' else JobListSerializer

    def get_permissions(self):
        return [IsEmployer()] if self.request.method == 'POST' else [permissions.AllowAny()]

    def perform_create(self, serializer):
        serializer.save(posted_by=self.request.user)


class JobDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Job.objects.select_related('company', 'category', 'region', 'district', 'posted_by')
    lookup_field = 'slug'

    def get_serializer_class(self):
        return JobCreateUpdateSerializer if self.request.method in ('PUT', 'PATCH') else JobDetailSerializer

    def get_permissions(self):
        return [permissions.AllowAny()] if self.request.method == 'GET' else [permissions.IsAuthenticated()]

    def retrieve(self, request, *args, **kwargs):
        instance = self.get_object()
        Job.objects.filter(pk=instance.pk).update(views_count=instance.views_count + 1)
        return super().retrieve(request, *args, **kwargs)

    def check_object_permissions(self, request, obj):
        super().check_object_permissions(request, obj)
        if request.method not in ('GET', 'HEAD', 'OPTIONS') and obj.posted_by != request.user:
            raise PermissionDenied("You do not own this job posting.")


class MyJobsView(generics.ListAPIView):
    serializer_class = JobListSerializer
    permission_classes = [IsEmployer]

    def get_queryset(self):
        return Job.objects.filter(posted_by=self.request.user).select_related('company', 'category', 'region')


class FeaturedJobsView(generics.ListAPIView):
    serializer_class = JobListSerializer
    permission_classes = [permissions.AllowAny]

    def get_queryset(self):
        return Job.objects.filter(status='ACTIVE', is_featured=True).select_related('company', 'category', 'region')[:10]
