from rest_framework import serializers
from .models import Recruiter

class RecruiterManagementSerializer(serializers.ModelSerializer):
    class Meta:
        model = Recruiter
        fields = ['id', 'admin', 'name', 'email', 'monthly_budget', 'interviews_scheduled', 'interviews_completed']
        # Add 'admin' and 'monthly_budget' to read_only if you want to handle them in the view
        read_only_fields = ['id', 'admin', 'interviews_scheduled', 'interviews_completed']
        extra_kwargs = {
            'monthly_budget': {'required': False}, # Makes it optional in POST
        }

