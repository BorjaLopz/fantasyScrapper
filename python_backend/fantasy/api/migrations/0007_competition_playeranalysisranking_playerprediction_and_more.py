# Generated by Django 5.2 on 2025-04-11 11:55

import django.db.models.deletion
import uuid
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ("api", "0006_alter_gameteam_score"),
    ]

    operations = [
        migrations.CreateModel(
            name="Competition",
            fields=[
                (
                    "id",
                    models.UUIDField(
                        default=uuid.uuid4,
                        editable=False,
                        primary_key=True,
                        serialize=False,
                    ),
                ),
                ("competition_id", models.IntegerField(default=0)),
                ("name", models.CharField(max_length=150, unique=True)),
                ("slug", models.CharField(max_length=100, unique=True)),
                ("sport", models.CharField(max_length=50)),
                ("currency", models.CharField(max_length=10)),
            ],
        ),
        migrations.CreateModel(
            name="PlayerAnalysisRanking",
            fields=[
                (
                    "id",
                    models.UUIDField(
                        default=uuid.uuid4,
                        editable=False,
                        primary_key=True,
                        serialize=False,
                    ),
                ),
                ("position", models.IntegerField(default=0)),
                ("last_season", models.IntegerField(default=0)),
            ],
        ),
        migrations.CreateModel(
            name="PlayerPrediction",
            fields=[
                (
                    "id",
                    models.UUIDField(
                        default=uuid.uuid4,
                        editable=False,
                        primary_key=True,
                        serialize=False,
                    ),
                ),
                ("succesful_passes", models.FloatField(default=0.0)),
                ("unsuccesful_passes", models.FloatField(default=0.0)),
                ("dribbles", models.FloatField(default=0.0)),
                ("defensive_duel_won", models.FloatField(default=0.0)),
                ("interceptions", models.FloatField(default=0.0)),
                ("recoveries", models.FloatField(default=0.0)),
                ("second_plays", models.FloatField(default=0.0)),
                ("clearances", models.FloatField(default=0.0)),
                ("aerial_won", models.FloatField(default=0.0)),
                ("aerial_lost", models.FloatField(default=0.0)),
                ("foot_shot", models.FloatField(default=0.0)),
                ("foot_goal", models.FloatField(default=0.0)),
                ("head_shot", models.FloatField(default=0.0)),
                ("head_goal", models.FloatField(default=0.0)),
                ("foul_made", models.FloatField(default=0.0)),
                ("foul_received", models.FloatField(default=0.0)),
                ("carries", models.FloatField(default=0.0)),
                ("forward_passes", models.FloatField(default=0.0)),
                ("back_passes", models.FloatField(default=0.0)),
                ("assists", models.FloatField(default=0.0)),
                ("second_assists", models.FloatField(default=0.0)),
                ("crosses", models.FloatField(default=0.0)),
                ("through_passes", models.FloatField(default=0.0)),
                ("switches_of_play", models.FloatField(default=0.0)),
                ("date", models.FloatField(default=0.0)),
            ],
        ),
        migrations.CreateModel(
            name="ReportMatchRound",
            fields=[
                (
                    "id",
                    models.UUIDField(
                        default=uuid.uuid4,
                        editable=False,
                        primary_key=True,
                        serialize=False,
                    ),
                ),
                ("round_id", models.IntegerField(default=0)),
                ("name", models.CharField(max_length=250)),
                ("short", models.CharField(max_length=10)),
            ],
        ),
        migrations.CreateModel(
            name="ReportPoints",
            fields=[
                (
                    "id",
                    models.UUIDField(
                        default=uuid.uuid4,
                        editable=False,
                        primary_key=True,
                        serialize=False,
                    ),
                ),
                ("score", models.IntegerField(default=0)),
                ("points", models.IntegerField(default=0)),
            ],
        ),
        migrations.CreateModel(
            name="ReportRawStats",
            fields=[
                (
                    "id",
                    models.UUIDField(
                        default=uuid.uuid4,
                        editable=False,
                        primary_key=True,
                        serialize=False,
                    ),
                ),
                ("pos_4", models.BooleanField(default=False)),
                ("price", models.IntegerField(default=0)),
                ("score_1", models.IntegerField(default=0)),
                ("score_2", models.IntegerField(default=0)),
                ("score_5", models.IntegerField(default=0)),
                ("score_3", models.IntegerField(default=0)),
                ("score_6", models.IntegerField(default=0)),
                ("round_phase", models.IntegerField(default=0)),
                ("away", models.BooleanField(default=False)),
                ("home_score", models.IntegerField(default=0)),
                ("away_score", models.IntegerField(default=0)),
                ("tie", models.BooleanField(default=False)),
                ("clean_sheet", models.BooleanField(default=False)),
                ("minutes_played", models.IntegerField(default=0)),
                ("picas", models.IntegerField(default=0)),
                ("sofascore", models.FloatField(default=0.0)),
            ],
        ),
        migrations.CreateModel(
            name="Team",
            fields=[
                (
                    "id",
                    models.UUIDField(
                        default=uuid.uuid4,
                        editable=False,
                        primary_key=True,
                        serialize=False,
                    ),
                ),
                ("team_id", models.IntegerField(default=0)),
                ("name", models.CharField(max_length=250, unique=True)),
                ("slug", models.CharField(max_length=150, unique=True)),
            ],
        ),
        migrations.CreateModel(
            name="TeamGameRound",
            fields=[
                (
                    "id",
                    models.UUIDField(
                        default=uuid.uuid4,
                        editable=False,
                        primary_key=True,
                        serialize=False,
                    ),
                ),
                ("name", models.CharField(max_length=150)),
                ("short", models.CharField(max_length=10)),
            ],
        ),
        migrations.AlterField(
            model_name="game",
            name="away",
            field=models.OneToOneField(
                on_delete=django.db.models.deletion.CASCADE,
                related_name="game_away",
                to="api.gameteam",
            ),
        ),
        migrations.AlterField(
            model_name="game",
            name="home",
            field=models.OneToOneField(
                on_delete=django.db.models.deletion.CASCADE,
                related_name="game_home",
                to="api.gameteam",
            ),
        ),
        migrations.CreateModel(
            name="Player",
            fields=[
                (
                    "id",
                    models.UUIDField(
                        default=uuid.uuid4,
                        editable=False,
                        primary_key=True,
                        serialize=False,
                    ),
                ),
                ("player_id", models.IntegerField(default=0)),
                ("name", models.CharField(max_length=100, unique=True)),
                ("country", models.CharField(max_length=100, unique=True)),
                ("birthday", models.CharField(max_length=100, unique=True)),
                ("slug", models.CharField(max_length=100, unique=True)),
                ("position", models.IntegerField(default=0)),
                ("price", models.IntegerField(default=0)),
                ("price_increment", models.IntegerField(default=0)),
                ("status", models.CharField(max_length=50)),
                ("played_home", models.IntegerField(default=0)),
                ("played_away", models.IntegerField(default=0)),
                ("points", models.IntegerField(default=0)),
                ("points_home", models.IntegerField(default=0)),
                ("points_away", models.IntegerField(default=0)),
                ("points_last_season", models.IntegerField(default=0)),
                ("probable_in", models.IntegerField(default=0)),
                (
                    "competition",
                    models.ForeignKey(
                        on_delete=django.db.models.deletion.CASCADE,
                        to="api.competition",
                    ),
                ),
                (
                    "team",
                    models.ForeignKey(
                        on_delete=django.db.models.deletion.CASCADE, to="api.team"
                    ),
                ),
            ],
        ),
        migrations.CreateModel(
            name="PlayerAnalysis",
            fields=[
                (
                    "id",
                    models.UUIDField(
                        default=uuid.uuid4,
                        editable=False,
                        primary_key=True,
                        serialize=False,
                    ),
                ),
                ("pending_games", models.IntegerField(default=0)),
                (
                    "player",
                    models.OneToOneField(
                        on_delete=django.db.models.deletion.CASCADE, to="api.player"
                    ),
                ),
                (
                    "ranking",
                    models.OneToOneField(
                        on_delete=django.db.models.deletion.CASCADE,
                        to="api.playeranalysisranking",
                    ),
                ),
                (
                    "predictions",
                    models.OneToOneField(
                        on_delete=django.db.models.deletion.CASCADE,
                        to="api.playerprediction",
                    ),
                ),
            ],
        ),
        migrations.CreateModel(
            name="PlayerPrice",
            fields=[
                (
                    "id",
                    models.UUIDField(
                        default=uuid.uuid4,
                        editable=False,
                        primary_key=True,
                        serialize=False,
                    ),
                ),
                ("date", models.IntegerField(default=0)),
                ("price", models.IntegerField(default=0)),
                (
                    "player",
                    models.ForeignKey(
                        on_delete=django.db.models.deletion.CASCADE, to="api.player"
                    ),
                ),
            ],
        ),
        migrations.CreateModel(
            name="ReportMatch",
            fields=[
                (
                    "id",
                    models.UUIDField(
                        default=uuid.uuid4,
                        editable=False,
                        primary_key=True,
                        serialize=False,
                    ),
                ),
                ("match_id", models.IntegerField(default=0)),
                ("date", models.IntegerField(default=0)),
                ("status", models.CharField(max_length=20)),
                (
                    "away",
                    models.OneToOneField(
                        on_delete=django.db.models.deletion.CASCADE,
                        related_name="report_match_away",
                        to="api.gameteam",
                    ),
                ),
                (
                    "home",
                    models.OneToOneField(
                        on_delete=django.db.models.deletion.CASCADE,
                        related_name="report_match_home",
                        to="api.gameteam",
                    ),
                ),
                (
                    "round",
                    models.OneToOneField(
                        on_delete=django.db.models.deletion.CASCADE,
                        to="api.reportmatchround",
                    ),
                ),
            ],
        ),
        migrations.CreateModel(
            name="PlayerSeason",
            fields=[
                (
                    "id",
                    models.UUIDField(
                        default=uuid.uuid4,
                        editable=False,
                        primary_key=True,
                        serialize=False,
                    ),
                ),
                ("season_id", models.IntegerField(default=0)),
                ("name", models.CharField(max_length=150)),
                ("slug", models.CharField(max_length=150)),
                ("games", models.IntegerField(default=0)),
                (
                    "competition",
                    models.OneToOneField(
                        on_delete=django.db.models.deletion.CASCADE,
                        to="api.competition",
                    ),
                ),
                (
                    "player",
                    models.ForeignKey(
                        on_delete=django.db.models.deletion.CASCADE, to="api.player"
                    ),
                ),
                (
                    "points",
                    models.ForeignKey(
                        on_delete=django.db.models.deletion.CASCADE,
                        to="api.reportpoints",
                    ),
                ),
            ],
        ),
        migrations.CreateModel(
            name="Report",
            fields=[
                (
                    "id",
                    models.UUIDField(
                        default=uuid.uuid4,
                        editable=False,
                        primary_key=True,
                        serialize=False,
                    ),
                ),
                ("home", models.BooleanField(default=False)),
                (
                    "match",
                    models.OneToOneField(
                        on_delete=django.db.models.deletion.CASCADE,
                        to="api.reportmatch",
                    ),
                ),
                (
                    "points",
                    models.ForeignKey(
                        on_delete=django.db.models.deletion.CASCADE,
                        to="api.reportpoints",
                    ),
                ),
                (
                    "raw_stats",
                    models.OneToOneField(
                        on_delete=django.db.models.deletion.CASCADE,
                        to="api.reportrawstats",
                    ),
                ),
            ],
        ),
        migrations.CreateModel(
            name="TeamNextGame",
            fields=[
                (
                    "id",
                    models.UUIDField(
                        default=uuid.uuid4,
                        editable=False,
                        primary_key=True,
                        serialize=False,
                    ),
                ),
                (
                    "away",
                    models.ForeignKey(
                        on_delete=django.db.models.deletion.CASCADE,
                        related_name="team_next_away",
                        to="api.gameteam",
                    ),
                ),
                (
                    "home",
                    models.ForeignKey(
                        on_delete=django.db.models.deletion.CASCADE,
                        related_name="team_next_home",
                        to="api.gameteam",
                    ),
                ),
                (
                    "round",
                    models.ForeignKey(
                        on_delete=django.db.models.deletion.CASCADE,
                        to="api.teamgameround",
                    ),
                ),
                (
                    "team",
                    models.ForeignKey(
                        on_delete=django.db.models.deletion.CASCADE, to="api.team"
                    ),
                ),
            ],
        ),
    ]
