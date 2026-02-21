from django.shortcuts import render

# Create your views here.
from rest_framework.views import APIView
from rest_framework.response import Response
from django.db.models import Sum
# Import from your different apps
from recruiter.models import Recruiter
from token_usage.models import TokenUsage
from .serializers import RecruiterDashboardSerializer 

class DashboardSummaryView(APIView):
    def get(self, request):
        # 1. Get stats from the token_usage app
        stats = TokenUsage.objects.aggregate(
            total_spend=Sum('cost'),
            total_tokens_used=Sum('total_tokens')
        )

        # 2. Get recruiter data (which nests token data via the serializer)
        recruiters = Recruiter.objects.all()
        serializer = RecruiterDashboardSerializer(recruiters, many=True)

        return Response({
            "overall_stats": stats,
            "recruiter_breakdown": serializer.data
        })