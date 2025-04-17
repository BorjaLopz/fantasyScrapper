import uuid
from django.db import models

class Match(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    game_week = models.IntegerField(default=0)
    date = models.DateTimeField()
    start_time = models.CharField(max_length=150, null=True)
    home_team = models.CharField(max_length=250)
    away_team = models.CharField(max_length=250)
    score = models.CharField(max_length=20, null=True)
    notes = models.TextField(null=True)