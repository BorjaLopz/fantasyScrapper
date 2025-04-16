import uuid
from django.db import models

class Team(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    fantasy_id = models.IntegerField(default=0)
    name = models.CharField(max_length=250, unique=True)
    slug = models.CharField(max_length=150, unique=True)
    badge = models.TextField(null=True)
    