from django.db import models

# Create your models here.

import uuid
from admin_analytics.models import AdminInfo

class Recruiter(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    admin = models.ForeignKey(
        AdminInfo, 
        on_delete=models.CASCADE, 
        related_name='recruiters'
    )
    name = models.CharField(max_length=255)
    email = models.EmailField(unique=True)
    # Budget setting for the "Burn Rate" / "Runway" calculation
    monthly_budget = models.DecimalField(max_digits=10, decimal_places=2, default=500.00)
    
    interviews_scheduled = models.IntegerField(default=0)
    interviews_completed = models.IntegerField(default=0)

    def __str__(self):
        return f"{self.name} ({self.admin.name}'s Team)"