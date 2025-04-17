import json
from requests import get
from django.db import transaction

from api.models import Team, Player, WeekPoints, Stat, MarketValueHistoric

def get_players_data():
    with transaction.atomic():
        req = get('https://api-fantasy.llt-services.com/api/v4/players?x-lang=es').text
        
        for player in json.loads(req):
            # TEAM
            if (Team.objects.filter(name=player['team']['name'])).first() is None:
                team = player['team']
                data = {
                    'fantasy_id': int(team['id']),
                    'name': team['name'],
                    'slug': team['slug'],
                    'badge': team['badgeColor']
                }

                t = Team(**data)
                t.save()
            
            # PLAYER
            if (Player.objects.filter(fantasy_id=player['id'])).first() is None:
                data = {
                    'fantasy_id': int(player['id']),
                    'name': player['nickname'],
                    'nickname': player['nickname'],
                    'image': player['images']['transparent']['256x256'],
                    'points': player['points'],
                    'average_points': player['averagePoints'],
                    'last_season_points': player['lastSeasonPoints'],
                    'slug': player['nickname'],
                    'position_id': int(player['positionId']),
                    'position': parse_position(int(player['positionId'])),
                    'market_value': 0,
                    'player_status': '',
                    'team': Team.objects.filter(name=player['team']['name']).first()
                }

                p = Player(**data)
                p.save()

                for week_point in player['weekPoints']:
                    data = {
                        'week_number': week_point['weekNumber'],
                        'points': week_point['points'],
                        'player': p
                    }

                    wp = WeekPoints(**data)
                    wp.save()

def get_player_stats():
    with transaction.atomic():
        players = Player.objects.all()
        for player in players:
            req = get(f'https://api-fantasy.llt-services.com/api/v3/player/{player.fantasy_id}?x-lang=es').text
            
            player_json = json.loads(req)
            for stat in player_json['playerStats']:
                if (Stat.objects.filter(week_number=stat['weekNumber'])).filter(player_id=player.id).first() is None:
                    data = {
                        'mins_played': stat['stats']['mins_played'],
                        'goals': stat['stats']['goals'],
                        'goal_assist': stat['stats']['goal_assist'],
                        'offtarget_att_assist': stat['stats']['offtarget_att_assist'],
                        'pen_area_entries': stat['stats']['pen_area_entries'],
                        'penalty_won': stat['stats']['penalty_won'],
                        'penalty_save': stat['stats']['penalty_save'],
                        'saves': stat['stats']['saves'],
                        'effective_clearance': stat['stats']['effective_clearance'],
                        'penalty_failed': stat['stats']['penalty_failed'],
                        'own_goals': stat['stats']['own_goals'],
                        'goals_conceded': stat['stats']['goals_conceded'],
                        'yellow_card': stat['stats']['yellow_card'],
                        'second_yellow_card': stat['stats']['second_yellow_card'],
                        'red_card': stat['stats']['red_card'],
                        'total_scoring_att': stat['stats']['total_scoring_att'],
                        'won_contest': stat['stats']['won_contest'],
                        'ball_recovery': stat['stats']['ball_recovery'],
                        'poss_lost_all': stat['stats']['poss_lost_all'],
                        'penalty_conceded': stat['stats']['penalty_conceded'],
                        'marca_points': stat['stats']['marca_points'],
                        'week_number': stat['weekNumber'],
                        'total_points': stat['totalPoints'],
                        'is_in_ideal_formation': stat['isInIdealFormation'],
                        'player': player
                    }

                    st = Stat(**data)
                    st.save()

            Player.objects.filter(fantasy_id=player.fantasy_id).update(name=player_json['name'], market_value=player_json['marketValue'], player_status=player_json['playerStatus'])

def get_player_market():
    with transaction.atomic():
        players = Player.objects.all()
        for player in players:
            req = get(f'https://api-fantasy.llt-services.com/api/v3/player/{player.fantasy_id}/market-value?x-lang=es').text
            
            for market in json.loads(req):
                if (MarketValueHistoric.objects.filter(date=market['date'])).filter(player_id=player.id).first() is None:
                    data = {
                        'lfp_id': market['lfpId'],
                        'market_value': market['marketValue'],
                        'date': market['date'],
                        'player': player
                    }

                    mvh = MarketValueHistoric(**data)
                    mvh.save()
        
def delete_players_out_of_league():
    with transaction.atomic():
        Player.objects.filter(player_status="out_of_league").delete()
        
def parse_position(position):
    if position == 1:
        return 'portero'
    elif position == 2:
        return 'defensa'
    elif position == 3:
        return 'mediocentro'
    else:
        return 'delantero'
