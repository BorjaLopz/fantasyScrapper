import uuid
from django.db import models
from django.contrib.postgres.fields import ArrayField

class Player(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    fantasy_id = models.IntegerField(default=0)
    name = models.CharField(max_length=250)
    nickname = models.CharField(max_length=250)
    image = models.TextField(null=True)
    points = models.FloatField(default=0.0)
    average_points = models.FloatField(default=0.0)
    last_season_points = models.FloatField(default=0.0, null=True)
    slug = models.CharField(max_length=100)
    position_id = models.IntegerField(default=1)
    position = models.CharField(max_length=20, null=True)
    market_value = models.FloatField(default=0.0)
    player_status = models.CharField(max_length=35, null=True)

class Stat(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    mins_played = ArrayField(models.IntegerField(default=0))
    goals =  ArrayField(models.IntegerField(default=0))
    goal_assist =  ArrayField(models.IntegerField(default=0))
    offtarget_att_assist =  ArrayField(models.IntegerField(default=0))
    pen_area_entries =  ArrayField(models.IntegerField(default=0))
    penalty_won =  ArrayField(models.IntegerField(default=0))
    penalty_save =  ArrayField(models.IntegerField(default=0))
    saves =  ArrayField(models.IntegerField(default=0))
    effective_clearance =  ArrayField(models.IntegerField(default=0))
    penalty_failed =  ArrayField(models.IntegerField(default=0))
    own_goals =  ArrayField(models.IntegerField(default=0))
    goals_conceded =  ArrayField(models.IntegerField(default=0))
    yellow_card =  ArrayField(models.IntegerField(default=0))
    second_yellow_card =  ArrayField(models.IntegerField(default=0))
    red_card =  ArrayField(models.IntegerField(default=0))
    total_scoring_att =  ArrayField(models.IntegerField(default=0))
    won_contest =  ArrayField(models.IntegerField(default=0))
    ball_recovery =  ArrayField(models.IntegerField(default=0))
    poss_lost_all =  ArrayField(models.IntegerField(default=0))
    penalty_conceded =  ArrayField(models.IntegerField(default=0))
    marca_points =  ArrayField(models.IntegerField(default=0))
    week_number = models.IntegerField(default=0)
    total_points = models.FloatField(default=0.0)
    is_in_ideal_formation = models.BooleanField(default=False)

    player = models.ForeignKey(Player, on_delete=models.CASCADE)

class MarketValueHistoric(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    lfp_id = models.IntegerField(default=0)
    market_value = models.FloatField(default=0)
    date = models.DateTimeField()

    player = models.ForeignKey(Player, on_delete=models.CASCADE)

class WeekPoints(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    week_number = models.IntegerField(default=0)
    points = models.FloatField(default=0.0)

    player = models.ForeignKey(Player, on_delete=models.CASCADE)

