import uuid
from django.db import models

class Score(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    score_id = models.IntegerField()
    name = models.CharField(max_length=100, unique=True)
    kind = models.CharField(max_length=50, unique=True)

    def __str__(self):
        return super().__str__()