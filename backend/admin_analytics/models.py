from django.db import models
import uuid
# Create your models here.
class AdminInfo(models.Model):
    # UUID as primary key prevents predictable IDs in your URL/API
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    name = models.CharField(max_length=255)
    email = models.EmailField(unique=True)

    def __str__(self):
        return self.name