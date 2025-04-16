from rest_framework import serializers

from api.models import Market

class MarketSerializer(serializers.ModelSerializer):
    class Meta:
        model = Market
        fields = ['id', 'generated_at']
