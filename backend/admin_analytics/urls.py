from django.urls import path
from admin_analytics.views import DashboardSummaryView

urlpatterns = [
    # If this is 'dashboard/stats/', and the main one is 'api/'
    # The full URL becomes /api/dashboard/stats/
    path('dashboard/stats/', DashboardSummaryView.as_view(), name='dashboard-stats'),
]