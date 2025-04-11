import uuid
from django.db import models

class ActiveEvent(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    event_id = models.IntegerField(default=0)
    name = models.CharField(max_length=50)
    short = models.CharField(max_length=10)
    status = models.CharField(max_length=20)
    start = models.IntegerField(default=0)
    end = models.IntegerField(default=0)
    type = models.CharField(max_length=20)