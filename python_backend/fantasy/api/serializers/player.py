from rest_framework import serializers

from api.models import Player, Stat, MarketValueHistoric
from .team import TeamSerializer
from .market import MarketSerializer
from .user_team import UserTeamSerializer

class PlayerSerializer(serializers.ModelSerializer):
    team = TeamSerializer(many=False)
    market = MarketSerializer(many=False)
    user_team = UserTeamSerializer(many=False)

    class Meta:
        model = Player
        fields = ['id', 'fantasy_id', 'name', 'nickname', 'image', 'points', 'average_points', 'last_season_points', 'slug', 'position_id', 'position', 'market_value', 'player_status', 'line_up_name', 'line_up_index', 'team', 'market', 'user_team']

class StatSerializer(serializers.ModelSerializer):
    player = serializers.PrimaryKeyRelatedField(many=False, read_only=True)

    class Meta:
        model = Stat
        fields = ['id', 'mins_played', 'goals', 'goal_assist', 'offtarget_att_assist', 'pen_area_entries', 'penalty_won', 'penalty_save', 'saves', 'effective_clearance', 'penalty_failed', 'own_goals', 'goals_conceded', 'yellow_card', 'second_yellow_card', 'red_card', 'total_scoring_att', 'won_contest', 'ball_recovery', 'poss_lost_all', 'penalty_conceded', 'marca_points', 'week_number', 'total_points', 'is_in_ideal_formation', 'player']

class MarketValueHistoricSerializer(serializers.ModelSerializer):
    player = serializers.PrimaryKeyRelatedField(many=False, read_only=True)

    class Meta:
        model = MarketValueHistoric
        fields = ['id', 'lfp_id', 'market_value', 'date', 'player']
