from rest_framework import serializers

from api.models import Player, Stat, MarketValueHistoric

class StatSerializer(serializers.ModelSerializer):
    class Meta:
        model = Stat
        fields = ['id', 'mins_played', 'goals', 'goal_assist', 'offtarget_att_assist', 'pen_area_entries', 'penalty_won', 'penalty_save', 'saves', 'effective_clearance', 'penalty_failed', 'own_goals', 'goals_conceded', 'yellow_card', 'second_yellow_card', 'red_card', 'total_scoring_att', 'won_contest', 'ball_recovery', 'poss_lost_all', 'penalty_conceded', 'marca_points', 'week_number', 'total_points', 'is_in_ideal_formation']

class MarketValueHistoricSerializer(serializers.ModelSerializer):
    class Meta:
        model = MarketValueHistoric
        fields = ['id', 'lfp_id', 'market_value', 'date']

class PlayerSerializer(serializers.ModelSerializer):
    stats = StatSerializer(many=True)
    market_historic = MarketValueHistoricSerializer(many=True)

    class Meta:
        model = Player
        fields = ['id', 'fantasy_id', 'name', 'nickname', 'image', 'points', 'week_points', 'average_points', 'last_season_points', 'slug', 'position_id', 'position', 'market_value', 'player_status', 'stats', 'market_historic']
