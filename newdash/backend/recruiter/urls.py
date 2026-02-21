from django.urls import path
from .views import RecruiterListCreateView, RecruiterDetailedList

urlpatterns = [
    # GET: fetch all, POST: create new
    # URL: /api/recruiters/
    path('', RecruiterListCreateView.as_view(), name='recruiter-list-create'),
    
    # GET: fetch one, DELETE: remove one
    # URL: /api/recruiters/5/
    path('<uuid:pk>/', RecruiterDetailedList.as_view(), name='recruiter-detail'),
]