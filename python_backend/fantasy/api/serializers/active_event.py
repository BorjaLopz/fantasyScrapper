from rest_framework import serializers
from api.models import ActiveEvent

class ActiveEventSerializer(serializers.ModelSerializer):
    class Meta:
        model = ActiveEvent
        fields = ['id', 'event_id', 'name', 'short', 'status', 'start', 'end', 'type']