from rest_framework import generics, permissions
from .models import JobAlert
from .serializers import JobAlertSerializer


class IsSeeker(permissions.BasePermission):
    def has_permission(self, request, view):
        return request.user.is_authenticated and request.user.role == 'SEEKER'


class JobAlertListCreateView(generics.ListCreateAPIView):
    serializer_class = JobAlertSerializer
    permission_classes = [IsSeeker]

    def get_queryset(self):
        return JobAlert.objects.filter(seeker=self.request.user)

    def perform_create(self, serializer):
        serializer.save(seeker=self.request.user)


class JobAlertDetailView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = JobAlertSerializer
    permission_classes = [IsSeeker]
    http_method_names = ['get', 'patch', 'delete']

    def get_queryset(self):
        return JobAlert.objects.filter(seeker=self.request.user)
