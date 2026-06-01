from rest_framework import generics, permissions, status
from rest_framework.response import Response
from rest_framework.views import APIView
from django.shortcuts import get_object_or_404

from .models import SeekerProfile, WorkExperience, Education, Skill, SeekerSkill, SeekerCV
from .serializers import (
    SeekerProfileSerializer, WorkExperienceSerializer, EducationSerializer,
    SkillSerializer, SeekerSkillSerializer, SeekerCVSerializer,
    DiscoverableSeekerSerializer,
)


class IsSeeker(permissions.BasePermission):
    def has_permission(self, request, view):
        return request.user.is_authenticated and request.user.role == 'SEEKER'


class IsEmployer(permissions.BasePermission):
    def has_permission(self, request, view):
        return request.user.is_authenticated and request.user.role == 'EMPLOYER'


class SeekerProfileView(APIView):
    permission_classes = [IsSeeker]

    def _get_or_create_profile(self, user):
        profile, _ = SeekerProfile.objects.get_or_create(user=user)
        return profile

    def get(self, request):
        profile = self._get_or_create_profile(request.user)
        return Response(SeekerProfileSerializer(profile).data)

    def patch(self, request):
        profile = self._get_or_create_profile(request.user)
        serializer = SeekerProfileSerializer(profile, data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(serializer.data)


class WorkExperienceListCreateView(generics.ListCreateAPIView):
    serializer_class = WorkExperienceSerializer
    permission_classes = [IsSeeker]

    def get_queryset(self):
        return WorkExperience.objects.filter(seeker=self.request.user)

    def perform_create(self, serializer):
        serializer.save(seeker=self.request.user)


class WorkExperienceDetailView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = WorkExperienceSerializer
    permission_classes = [IsSeeker]
    http_method_names = ['get', 'patch', 'delete']

    def get_queryset(self):
        return WorkExperience.objects.filter(seeker=self.request.user)


class EducationListCreateView(generics.ListCreateAPIView):
    serializer_class = EducationSerializer
    permission_classes = [IsSeeker]

    def get_queryset(self):
        return Education.objects.filter(seeker=self.request.user)

    def perform_create(self, serializer):
        serializer.save(seeker=self.request.user)


class EducationDetailView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = EducationSerializer
    permission_classes = [IsSeeker]
    http_method_names = ['get', 'patch', 'delete']

    def get_queryset(self):
        return Education.objects.filter(seeker=self.request.user)


class SkillListView(generics.ListAPIView):
    serializer_class = SkillSerializer
    permission_classes = [permissions.IsAuthenticated]
    queryset = Skill.objects.all()
    search_fields = ['name_en', 'name_sw']


class SeekerSkillListCreateView(generics.ListCreateAPIView):
    serializer_class = SeekerSkillSerializer
    permission_classes = [IsSeeker]

    def get_queryset(self):
        return SeekerSkill.objects.filter(seeker=self.request.user).select_related('skill')


class SeekerSkillDeleteView(generics.DestroyAPIView):
    permission_classes = [IsSeeker]

    def get_queryset(self):
        return SeekerSkill.objects.filter(seeker=self.request.user)


class SeekerCVListCreateView(generics.ListCreateAPIView):
    serializer_class = SeekerCVSerializer
    permission_classes = [IsSeeker]

    def get_queryset(self):
        return SeekerCV.objects.filter(seeker=self.request.user)


class SeekerCVDeleteView(generics.DestroyAPIView):
    permission_classes = [IsSeeker]

    def get_queryset(self):
        return SeekerCV.objects.filter(seeker=self.request.user)


class DiscoverableSeekerListView(generics.ListAPIView):
    serializer_class = DiscoverableSeekerSerializer
    permission_classes = [IsEmployer]
    search_fields = ['user__first_name', 'user__last_name', 'bio']
    filterset_fields = []

    def get_queryset(self):
        qs = SeekerProfile.objects.filter(
            is_discoverable=True
        ).select_related('user', 'user__region').prefetch_related(
            'user__skills__skill', 'user__work_experience', 'user__education'
        )
        region = self.request.query_params.get('region')
        if region:
            qs = qs.filter(user__region_id=region)
        return qs
