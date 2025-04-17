from rest_framework import serializers

from api.models import UserTeam

class UserTeamSerializer(serializers.ModelSerializer):
    user = serializers.PrimaryKeyRelatedField(many=False, read_only=True)

    class Meta:
        model = UserTeam
        fields = ['id', 'formation', 'user']
