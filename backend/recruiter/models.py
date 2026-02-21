from django.db import models
import uuid
from admin_analytics.models import AdminInfo
# Create your models here.
class Recruiter(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    # The Foreign Key links this Recruiter to a specific Admin
    admin = models.ForeignKey(
        AdminInfo, 
        on_delete=models.CASCADE, 
        related_name='recruiters'
    )
    name = models.CharField(max_length=255)
    email = models.EmailField(unique=True)
    interviews_scheduled = models.IntegerField(default=0)
    interviews_completed = models.IntegerField(default=0)

    def __str__(self):
        return f"{self.name} ({self.admin.name}'s Team)"