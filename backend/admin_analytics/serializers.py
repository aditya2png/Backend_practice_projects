from django.db.models import Sum
from rest_framework import serializers
from recruiter.models import Recruiter
from token_usage.models import TokenUsage

class RecruiterDashboardSerializer(serializers.ModelSerializer):
    # Calculated fields for the charts
    total_input_tokens = serializers.SerializerMethodField()
    total_output_tokens = serializers.SerializerMethodField()
    total_spent = serializers.SerializerMethodField()
    
    class Meta:
        model = Recruiter
        # Added 'interviews_scheduled' to compare with completed for the chart
        fields = [
            'id', 'name', 'email', 
            'interviews_scheduled', 'interviews_completed', 
            'total_input_tokens', 'total_output_tokens', 'total_spent'
        ]

    def get_total_input_tokens(self, obj):
        return TokenUsage.objects.filter(recruiter=obj).aggregate(Sum('input_tokens'))['input_tokens__sum'] or 0

    def get_total_output_tokens(self, obj):
        return TokenUsage.objects.filter(recruiter=obj).aggregate(Sum('output_tokens'))['output_tokens__sum'] or 0

    def get_total_spent(self, obj):
        return TokenUsage.objects.filter(recruiter=obj).aggregate(Sum('cost'))['cost__sum'] or 0