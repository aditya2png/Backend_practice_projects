from django.db import models

# Create your models here.
from django.db import models
from recruiter.models import Recruiter

class TokenLog(models.Model):
    recruiter = models.ForeignKey(Recruiter, on_delete=models.CASCADE, related_name='token_logs')
    # We store input/output separately as they usually have different prices
    input_tokens = models.IntegerField(default=0)
    output_tokens = models.IntegerField(default=0)
    
    # Optional: Track which model was used (GPT-4 vs GPT-3.5) for price accuracy
    model_used = models.CharField(max_length=50, default="gpt-4o")
    
    # Estimated cost in USD at the time of the transaction
    cost_estimate = models.DecimalField(max_digits=10, decimal_places=5, default=0.0)
    
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.recruiter.name} - {self.input_tokens + self.output_tokens} tokens"