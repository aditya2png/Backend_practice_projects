from django.contrib import admin
from django.urls import path, include

urlpatterns = [
    path('admin/', admin.site.urls),
    
    # Recruiter Management (Add/List)
    path('api/recruiter-service/', include('recruiter.urls')),
    
    # Admin Analytics (Math/Charts/Global Stats)
    path('api/analytics/', include('admin_analytics.urls')),
]