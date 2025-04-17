from rest_framework import serializers

from api.models import Match

class MatchSerializer(serializers.ModelSerializer):
    class Meta:
        model = Match
        fields = ['id', 'game_week', 'date', 'start_time', 'home_team', 'away_team', 'score', 'notes']
