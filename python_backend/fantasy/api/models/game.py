import uuid
from django.db import models
from .active_event import ActiveEvent

class GameTeam(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    team_id = models.IntegerField(default=0)
    name = models.CharField(max_length=50)
    slug = models.CharField(max_length=10)
    score = models.CharField(max_length=10, null=True)

class Game(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    game_id = models.IntegerField(default=0)
    date = models.IntegerField(default=0)
    status = models.CharField(max_length=20)
    home = models.OneToOneField(
        GameTeam,
        on_delete=models.CASCADE,
        related_name='game_home'
    )
    away = models.OneToOneField(
        GameTeam,
        on_delete=models.CASCADE,
        related_name='game_away'
    )
    event = models.ForeignKey(ActiveEvent, on_delete=models.CASCADE)