from rest_framework.views import APIView
from rest_framework.response import Response
from django.db.models import Sum
from recruiter.models import Recruiter
from token_usage.models import TokenLog
from .models import AdminInfo
from admin_analytics.serializer import RecruiterAnalyticsSerializer # Ensure this is correct

class DashboardOverviewView(APIView):
    def get(self, request):
        # 1. Fetch Global Stats on the fly
        admin = AdminInfo.objects.first()
        total_spend = TokenLog.objects.aggregate(total=Sum('cost_estimate'))['total'] or 0.0
        
        # Calculate remaining credit based on AdminInfo model
        credit_limit = admin.total_credit_limit if admin else 0
        remaining_credit = float(credit_limit) - float(total_spend)

        # 2. Serialize Recruiter Data (with the math logic)
        recruiters = Recruiter.objects.all()
        recruiter_serializer = RecruiterAnalyticsSerializer(recruiters, many=True)
        
        # 3. Return a unified response for React
        return Response({
            "global_stats": {
                "total_network_spend": round(total_spend, 2),
                "remaining_credit": round(remaining_credit, 2),
                "total_recruiters": recruiters.count()
            },
            "recruiters": recruiter_serializer.data
        })