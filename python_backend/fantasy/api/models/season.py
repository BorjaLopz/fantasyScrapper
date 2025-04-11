import uuid
from django.db import models

class SeasonPrevious(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    season_id = models.CharField(max_length=20)
    name = models.CharField(max_length=250)
    slug = models.CharField(max_length=20)

class Season(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    season_id = models.CharField(max_length=20)
    name = models.CharField(max_length=250)
    slug = models.CharField(max_length=20)
    previous = models.OneToOneField(
        SeasonPrevious,
        on_delete=models.CASCADE
    )

class SeasonRound(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    round_id = models.IntegerField(default=0)
    name = models.CharField(max_length=250)
    short = models.CharField(max_length=10)
    status = models.CharField(max_length=20)
    season = models.ForeignKey(Season, on_delete=models.CASCADE)