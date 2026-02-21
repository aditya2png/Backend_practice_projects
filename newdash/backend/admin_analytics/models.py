from django.db import models

# Create your models here.
from django.db import models
import uuid

class AdminInfo(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    name = models.CharField(max_length=255)
    email = models.EmailField(unique=True)
    total_credit_limit = models.DecimalField(max_digits=12, decimal_places=2, default=5000.00)

    def __str__(self):
        return self.name

class InterviewRecord(models.Model):
    # Links the performance score to a specific recruiter
    recruiter = models.ForeignKey('recruiter.Recruiter', on_delete=models.CASCADE, related_name='interviews')
    candidate_name = models.CharField(max_length=255)
    
    # The AI-generated score (e.g., 0.0 to 10.0)
    ai_score = models.FloatField(default=0.0)
    
    is_completed = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.candidate_name} - Score: {self.ai_score}"