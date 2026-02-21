from django.db import models
import uuid
from recruiter.models import Recruiter
# Create your models here.
class TokenUsage(models.Model):
    # Links directly to the Recruiter for easy cost tracking
    recruiter = models.ForeignKey(
        Recruiter, 
        on_delete=models.CASCADE, 
        related_name='token_logs'
    )
    input_tokens = models.IntegerField()
    output_tokens = models.IntegerField()
    total_tokens = models.IntegerField(editable=False) # Auto-calculated
    cost = models.DecimalField(max_digits=10, decimal_places=4)
    created_at = models.DateTimeField(auto_now_add=True)

    def save(self, *args, **kwargs):
        # Dynamic calculation happens here before hitting PGSQL
        self.total_tokens = self.input_tokens + self.output_tokens
        super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.recruiter.name} - {self.total_tokens} tokens"