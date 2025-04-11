from rest_framework import serializers
from api.models import Game, GameTeam

class GameSerializer(serializers.ModelSerializer):
    class Meta:
        model = GameTeam
        fields = ['id', 'team_id', 'name', 'slug', 'score']

class GameSerializer(serializers.ModelSerializer):
    home = GameSerializer(many=False)
    away = GameSerializer(many=False)
    event = serializers.PrimaryKeyRelatedField(read_only=True)

    class Meta:
        model = Game
        fields = ['id', 'game_id', 'date', 'status', 'home', 'away', 'event']