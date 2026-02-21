from django.contrib import admin
from django.urls import path, include

urlpatterns = [
    path('admin/', admin.site.urls),
    # This line MUST exist to "point" to your app
    path('api/', include('admin_analytics.urls')), 
]