from django.urls import path
from .views import (
    ApplyView, MyApplicationsView, JobApplicationsView,
    ApplicationDetailView, ApplicationStatusUpdateView,
    SaveJobToggleView, SavedJobsView
)

urlpatterns = [
    path('', ApplyView.as_view(), name='apply'),
    path('mine/', MyApplicationsView.as_view(), name='my-applications'),
    path('saved/', SavedJobsView.as_view(), name='saved-jobs'),
    path('job/<slug:job_slug>/', JobApplicationsView.as_view(), name='job-applications'),
    path('<uuid:id>/', ApplicationDetailView.as_view(), name='application-detail'),
    path('<uuid:id>/status/', ApplicationStatusUpdateView.as_view(), name='application-status'),
    path('save/<slug:job_slug>/', SaveJobToggleView.as_view(), name='save-job'),
]
