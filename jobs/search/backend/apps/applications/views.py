from rest_framework import generics, permissions, status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.exceptions import PermissionDenied, ValidationError
from django.shortcuts import get_object_or_404
from .models import Application, SavedJob
from .serializers import (
    ApplicationCreateSerializer, ApplicationSerializer,
    ApplicationStatusUpdateSerializer, SavedJobSerializer,
)
from apps.jobs.models import Job
from core.permissions import IsEmployer


class ApplyView(generics.CreateAPIView):
    serializer_class = ApplicationCreateSerializer
    permission_classes = [permissions.IsAuthenticated]

    def perform_create(self, serializer):
        job = serializer.validated_data['job']
        if job.status != 'ACTIVE':
            raise ValidationError({'job': 'This job is no longer accepting applications.'})
        if Application.objects.filter(job=job, applicant=self.request.user).exists():
            raise ValidationError({'job': 'You have already applied for this job.'})
        serializer.save(applicant=self.request.user)

    def create(self, request, *args, **kwargs):
        super().create(request, *args, **kwargs)
        return Response({'detail': 'Application submitted successfully.'}, status=status.HTTP_201_CREATED)


class MyApplicationsView(generics.ListAPIView):
    serializer_class = ApplicationSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Application.objects.filter(applicant=self.request.user).select_related(
            'job', 'job__company'
        )


class JobApplicationsView(generics.ListAPIView):
    serializer_class = ApplicationSerializer
    permission_classes = [IsEmployer]

    def get_queryset(self):
        job = get_object_or_404(Job, slug=self.kwargs['job_slug'], posted_by=self.request.user)
        Application.objects.filter(job=job, status='SUBMITTED').update(status='VIEWED')
        return Application.objects.filter(job=job).select_related('applicant', 'applicant__region')


class ApplicationDetailView(generics.RetrieveDestroyAPIView):
    serializer_class = ApplicationSerializer
    permission_classes = [permissions.IsAuthenticated]
    lookup_field = 'id'

    def get_queryset(self):
        return Application.objects.select_related('job', 'applicant', 'job__company')

    def check_object_permissions(self, request, obj):
        super().check_object_permissions(request, obj)
        if obj.applicant != request.user and obj.job.posted_by != request.user:
            raise PermissionDenied("No permission to view this application.")

    def destroy(self, request, *args, **kwargs):
        instance = self.get_object()
        if instance.applicant != request.user:
            raise PermissionDenied("Only the applicant can withdraw.")
        instance.delete()
        return Response({'detail': 'Application withdrawn.'}, status=status.HTTP_204_NO_CONTENT)


class ApplicationStatusUpdateView(generics.UpdateAPIView):
    serializer_class = ApplicationStatusUpdateSerializer
    permission_classes = [IsEmployer]
    lookup_field = 'id'

    def get_queryset(self):
        return Application.objects.filter(job__posted_by=self.request.user)


class SaveJobToggleView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request, job_slug):
        job = get_object_or_404(Job, slug=job_slug, status='ACTIVE')
        saved, created = SavedJob.objects.get_or_create(user=request.user, job=job)
        if not created:
            saved.delete()
            return Response({'saved': False, 'detail': 'Removed from saved.'})
        return Response({'saved': True, 'detail': 'Job saved.'}, status=status.HTTP_201_CREATED)


class SavedJobsView(generics.ListAPIView):
    serializer_class = SavedJobSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return SavedJob.objects.filter(user=self.request.user).select_related(
            'job', 'job__company', 'job__region', 'job__category'
        )
