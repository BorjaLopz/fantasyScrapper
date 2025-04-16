# Generated by Django 5.2 on 2025-04-16 13:09

import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ("api", "0004_alter_player_position"),
    ]

    operations = [
        migrations.AddField(
            model_name="player",
            name="team",
            field=models.ForeignKey(
                default=0, on_delete=django.db.models.deletion.CASCADE, to="api.team"
            ),
            preserve_default=False,
        ),
    ]
