import uuid
from django.db import models
from .game import GameTeam

class Team(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    team_id = models.IntegerField(default=0)
    name = models.CharField(max_length=250, unique=True)
    slug = models.CharField(max_length=150, unique=True)

class TeamGameRound(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    name = models.CharField(max_length=150)
    short = models.CharField(max_length=10)

class TeamNextGame(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    round = models.ForeignKey(TeamGameRound, on_delete=models.CASCADE)
    home = models.ForeignKey(GameTeam, on_delete=models.CASCADE, related_name='team_next_home')
    away = models.ForeignKey(GameTeam, on_delete=models.CASCADE, related_name='team_next_away')
    team = models.ForeignKey(Team, on_delete=models.CASCADE)
