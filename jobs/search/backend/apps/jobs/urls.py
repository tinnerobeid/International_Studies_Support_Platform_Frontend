from django.urls import path
from .views import JobCategoryListView, JobListCreateView, JobDetailView, MyJobsView, FeaturedJobsView

urlpatterns = [
    path('', JobListCreateView.as_view(), name='job-list'),
    path('categories/', JobCategoryListView.as_view(), name='job-categories'),
    path('featured/', FeaturedJobsView.as_view(), name='job-featured'),
    path('mine/', MyJobsView.as_view(), name='my-jobs'),
    path('<slug:slug>/', JobDetailView.as_view(), name='job-detail'),
]
