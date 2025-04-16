import uuid
from django.db import models

class Market(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    generated_at = models.DateTimeField(auto_now_add=True)