from django.urls import path
from .views import CompanyListCreateView, CompanyDetailView, MyCompaniesView

urlpatterns = [
    path('', CompanyListCreateView.as_view(), name='company-list'),
    path('mine/', MyCompaniesView.as_view(), name='my-companies'),
    path('<slug:slug>/', CompanyDetailView.as_view(), name='company-detail'),
]
