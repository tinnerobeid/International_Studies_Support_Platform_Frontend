from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny
from rest_framework.response import Response


@api_view(['GET'])
@permission_classes([AllowAny])
def api_root(request):
    return Response({
        'name': 'Search API',
        'version': 'v1',
        'endpoints': {
            'auth': {
                'request_otp': '/api/v1/auth/request-otp/',
                'verify_otp': '/api/v1/auth/verify-otp/',
                'refresh': '/api/v1/auth/refresh/',
                'logout': '/api/v1/auth/logout/',
                'me': '/api/v1/auth/me/',
            },
            'jobs': {
                'list': '/api/v1/jobs/',
                'categories': '/api/v1/jobs/categories/',
                'featured': '/api/v1/jobs/featured/',
                'my_jobs': '/api/v1/jobs/mine/',
                'detail': '/api/v1/jobs/<slug>/',
            },
            'applications': {
                'apply': '/api/v1/applications/',
                'my_applications': '/api/v1/applications/mine/',
                'saved_jobs': '/api/v1/applications/saved/',
                'save_toggle': '/api/v1/applications/save/<job-slug>/',
                'job_applicants': '/api/v1/applications/job/<job-slug>/',
            },
            'companies': {
                'list': '/api/v1/companies/',
                'detail': '/api/v1/companies/<slug>/',
            },
            'locations': {
                'regions': '/api/v1/locations/regions/',
                'districts': '/api/v1/locations/regions/<id>/districts/',
            },
            'admin': '/admin/',
        }
    })


urlpatterns = [
    path('', api_root, name='api-root'),
    path('admin/', admin.site.urls),
    path('api/v1/auth/', include('apps.accounts.urls')),
    path('api/v1/locations/', include('apps.locations.urls')),
    path('api/v1/companies/', include('apps.companies.urls')),
    path('api/v1/jobs/', include('apps.jobs.urls')),
    path('api/v1/applications/', include('apps.applications.urls')),
    path('api/v1/profile/', include('apps.profiles.urls')),
    path('api/v1/alerts/', include('apps.alerts.urls')),
] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
