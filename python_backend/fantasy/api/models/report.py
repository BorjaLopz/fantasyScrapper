import uuid
from django.db import models
from .game import GameTeam

class ReportMatchRound(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    round_id = models.IntegerField(default=0)
    name = models.CharField(max_length=250)
    short = models.CharField(max_length=10)

class ReportMatch(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    match_id = models.IntegerField(default=0)
    date = models.IntegerField(default=0)
    status = models.CharField(max_length=20)
    home = models.OneToOneField(
        GameTeam,
        on_delete=models.CASCADE,
        related_name='report_match_home'
    )
    away = models.OneToOneField(
        GameTeam,
        on_delete=models.CASCADE,
        related_name='report_match_away'
    )
    round = models.OneToOneField(
        ReportMatchRound,
        on_delete=models.CASCADE
    )

class ReportPoints(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    score = models.IntegerField(default=0)
    points = models.IntegerField(default=0)

class ReportRawStats(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    pos_4 = models.BooleanField(default=False)
    price = models.IntegerField(default=0)
    score_1 = models.IntegerField(default=0)
    score_2 = models.IntegerField(default=0)
    score_5 = models.IntegerField(default=0)
    score_3 = models.IntegerField(default=0)
    score_6 = models.IntegerField(default=0)
    round_phase = models.IntegerField(default=0)
    away = models.BooleanField(default=False)
    home_score = models.IntegerField(default=0)
    away_score = models.IntegerField(default=0)
    tie = models.BooleanField(default=False)
    clean_sheet = models.BooleanField(default=False)
    minutes_played = models.IntegerField(default=0)
    picas = models.IntegerField(default=0)
    sofascore = models.FloatField(default=0.0)

class Report(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    home = models.BooleanField(default=False)
    match = models.OneToOneField(ReportMatch, on_delete=models.CASCADE)
    points = models.ForeignKey(ReportPoints, on_delete=models.CASCADE)
    raw_stats = models.OneToOneField(ReportRawStats, on_delete=models.CASCADE)