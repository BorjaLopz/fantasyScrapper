import uuid
from django.db import models

class Competition(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    competition_id = models.IntegerField(default=0)
    name = models.CharField(max_length=150, unique=True)
    slug = models.CharField(max_length=100, unique=True)
    sport = models.CharField(max_length=50)
    currency = models.CharField(max_length=10)