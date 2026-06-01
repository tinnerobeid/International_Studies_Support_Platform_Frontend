from django.urls import path
from .views import (
    SeekerProfileView,
    WorkExperienceListCreateView, WorkExperienceDetailView,
    EducationListCreateView, EducationDetailView,
    SkillListView, SeekerSkillListCreateView, SeekerSkillDeleteView,
    SeekerCVListCreateView, SeekerCVDeleteView,
    DiscoverableSeekerListView,
)

urlpatterns = [
    path('', SeekerProfileView.as_view(), name='seeker-profile'),
    path('experience/', WorkExperienceListCreateView.as_view(), name='work-experience-list'),
    path('experience/<int:pk>/', WorkExperienceDetailView.as_view(), name='work-experience-detail'),
    path('education/', EducationListCreateView.as_view(), name='education-list'),
    path('education/<int:pk>/', EducationDetailView.as_view(), name='education-detail'),
    path('skills/', SkillListView.as_view(), name='skill-catalog'),
    path('my-skills/', SeekerSkillListCreateView.as_view(), name='seeker-skill-list'),
    path('my-skills/<int:pk>/', SeekerSkillDeleteView.as_view(), name='seeker-skill-delete'),
    path('cvs/', SeekerCVListCreateView.as_view(), name='cv-list'),
    path('cvs/<int:pk>/', SeekerCVDeleteView.as_view(), name='cv-delete'),
    path('seekers/', DiscoverableSeekerListView.as_view(), name='discoverable-seekers'),
]
