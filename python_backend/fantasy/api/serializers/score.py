from rest_framework import serializers
from api.models import Score

class ScoreSerializer(serializers.ModelSerializer):
    class Meta:
        model = Score
        fields = ["score_id", "name", "kind"]

