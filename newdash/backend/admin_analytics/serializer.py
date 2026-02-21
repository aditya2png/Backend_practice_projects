from rest_framework import serializers
from django.db.models import Sum, Avg, F
from recruiter.models import Recruiter
from token_usage.models import TokenLog # Confirmed name from your \dt
from .models import InterviewRecord

class RecruiterAnalyticsSerializer(serializers.ModelSerializer):
    # Calculations performed on the fly
    total_spent = serializers.SerializerMethodField()
    avg_score = serializers.SerializerMethodField()
    efficiency_ratio = serializers.SerializerMethodField()

    class Meta:
        model = Recruiter
        fields = [
            'id', 'name', 'interviews_completed', 
            'total_spent', 'avg_score', 'efficiency_ratio'
        ]

    def get_total_spent(self, obj):
        # Summing cost_estimate from TokenLog table
        stats = TokenLog.objects.filter(recruiter=obj).aggregate(total=Sum('cost_estimate'))
        return stats['total'] or 0.0

    def get_avg_score(self, obj):
        # Averaging score from InterviewRecord table
        stats = obj.interviews.aggregate(avg=Avg('ai_score'))
        return round(stats['avg'] or 0.0, 2)

    def get_efficiency_ratio(self, obj):
        # Tokens per Interview calculation
        tokens = TokenLog.objects.filter(recruiter=obj).aggregate(
            total=Sum(F('input_tokens') + F('output_tokens'))
        )
        count = obj.interviews_completed or 1
        return (tokens['total'] or 0) // count