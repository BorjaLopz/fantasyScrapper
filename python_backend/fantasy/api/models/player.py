import uuid
from django.db import models
from .competition import Competition
from .team import Team
from .report import ReportPoints

class Player(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    player_id = models.IntegerField(default=0)
    name = models.CharField(max_length=100, unique=True)
    country = models.CharField(max_length=100, unique=True)
    birthday = models.CharField(max_length=100, unique=True)
    slug = models.CharField(max_length=100, unique=True)
    position = models.IntegerField(default=0)
    price = models.IntegerField(default=0)
    price_increment = models.IntegerField(default=0)
    status = models.CharField(max_length=50)
    played_home = models.IntegerField(default=0)
    played_away = models.IntegerField(default=0)
    points = models.IntegerField(default=0)
    points_home = models.IntegerField(default=0)
    points_away = models.IntegerField(default=0)
    points_last_season = models.IntegerField(default=0)
    probable_in = models.IntegerField(default=0)

    competition = models.ForeignKey(Competition, on_delete=models.CASCADE)
    team = models.ForeignKey(Team, on_delete=models.CASCADE)

class PlayerPrice(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    date = models.IntegerField(default=0)
    price = models.IntegerField(default=0)
    player = models.ForeignKey(Player, on_delete=models.CASCADE)

class PlayerSeason(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    season_id = models.IntegerField(default=0)
    name = models.CharField(max_length=150)
    slug = models.CharField(max_length=150)
    games = models.IntegerField(default=0)
    points = models.ForeignKey(ReportPoints, on_delete=models.CASCADE)
    competition = models.OneToOneField(
        Competition,
        on_delete=models.CASCADE
    )
    player = models.ForeignKey(Player, on_delete=models.CASCADE)

class PlayerAnalysisRanking(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    position = models.IntegerField(default=0)
    last_season = models.IntegerField(default=0)

class PlayerPrediction(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    succesful_passes = models.FloatField(default=0.0)
    unsuccesful_passes = models.FloatField(default=0.0)
    dribbles = models.FloatField(default=0.0)
    defensive_duel_won = models.FloatField(default=0.0)
    interceptions = models.FloatField(default=0.0)
    recoveries = models.FloatField(default=0.0)
    second_plays = models.FloatField(default=0.0)
    clearances = models.FloatField(default=0.0)
    aerial_won = models.FloatField(default=0.0)
    aerial_lost = models.FloatField(default=0.0)
    foot_shot = models.FloatField(default=0.0)
    foot_goal = models.FloatField(default=0.0)
    head_shot = models.FloatField(default=0.0)
    head_goal = models.FloatField(default=0.0)
    foul_made = models.FloatField(default=0.0)
    foul_received = models.FloatField(default=0.0)
    carries = models.FloatField(default=0.0)
    forward_passes = models.FloatField(default=0.0)
    back_passes = models.FloatField(default=0.0)
    assists = models.FloatField(default=0.0)
    second_assists = models.FloatField(default=0.0)
    crosses = models.FloatField(default=0.0)
    through_passes = models.FloatField(default=0.0)
    switches_of_play = models.FloatField(default=0.0)
    date = models.FloatField(default=0.0)

class PlayerAnalysis(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    ranking = models.OneToOneField(PlayerAnalysisRanking, on_delete=models.CASCADE)
    pending_games = models.IntegerField(default=0)
    predictions = models.OneToOneField(PlayerPrediction, on_delete=models.CASCADE)
    player = models.OneToOneField(Player, on_delete=models.CASCADE)
