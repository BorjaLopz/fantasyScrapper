from rest_framework import serializers
from api.models import Season, SeasonRound, SeasonPrevious

class SeasonPreviousSerializer(serializers.ModelSerializer):
    class Meta:
        model = SeasonPrevious
        fields = ['id', 'season_id', 'name', 'slug']

class SeasonSerializer(serializers.ModelSerializer):
    previous = SeasonPreviousSerializer(many=False)

    class Meta:
        model = Season
        fields = ['id', 'season_id', 'name', 'slug', 'previous']

class SeasonRoundSerializer(serializers.ModelSerializer):
    season = serializers.PrimaryKeyRelatedField(
        many=False,
        read_only=True
    )

    class Meta:
        model = SeasonRound
        fields = ['id', 'round_id', 'name', 'short', 'status', 'season']