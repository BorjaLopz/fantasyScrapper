from rest_framework import serializers

from api.models import Bid

class BidSerializer(serializers.ModelSerializer):
    market = serializers.PrimaryKeyRelatedField(many=False, read_only=True)
    player = serializers.PrimaryKeyRelatedField(many=False, read_only=True)
    user = serializers.PrimaryKeyRelatedField(many=False, read_only=True)

    class Meta:
        model = Bid
        fields = ['id', 'bid', 'market', 'player', 'user']
