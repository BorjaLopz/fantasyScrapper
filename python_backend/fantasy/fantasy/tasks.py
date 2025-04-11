import json
from requests import get
from django.db import transaction
from api.models import Score, Season, SeasonRound, SeasonPrevious, ActiveEvent, Game, GameTeam

url_all_players = "https://biwenger.as.com/api/v2/competitions/la-liga/data?lang=es&score=5"

def get_players_data():
    with transaction.atomic():
        req = get(url_all_players).text
        json_data = json.loads(req)['data']
        
        # SCORES
        for score in json_data['scores']:
            data = {
                'score_id': score['id'],
                'name': score['name'],
                'kind': score['kind']
            }
            if Score.objects.filter(name=data['name']).first() is None:
                s = Score(**data)
                s.save()
        
        # SEASON
        season = json_data['season']
        if Season.objects.filter(name=season['name']).first() is None:
            previous = season['previous']
            previous_data = {
                'season_id': previous['id'],
                'name': previous['name'],
                'slug': previous['slug'],
            }
            sp = SeasonPrevious(**previous_data)
            sp.save()

            season_data = {
                'season_id': season['id'],
                'name': season['name'],
                'slug': season['slug'],
                'previous': sp
            }
            s = Season(**season_data)
            s.save()

            for round in season['rounds']:
                data = {
                    'round_id': round['id'],
                    'name': round['name'],
                    'short': round['short'],
                    'status': round['status'],
                    'season': s
                }
                r = SeasonRound(**data)
                r.save()

        # ACTIVE EVENT
        for active_event in json_data['activeEvents']:
            if ActiveEvent.objects.filter(name=active_event['name']).first() is None:
                data = {
                    'event_id': active_event['id'],
                    'name': active_event['name'],
                    'short': active_event['short'],
                    'status': active_event['status'],
                    'start': active_event['start'],
                    'end': active_event['end'],
                    'type': active_event['type'],
                }

                ae = ActiveEvent(**data)
                ae.save()

                for game in active_event['games']:
                    gt_home = GameTeam.objects.filter(team_id=game['home']['id']).first()
                    if gt_home is None:
                        data = {
                            'team_id': game['home']['id'],
                            'name': game['home']['name'],
                            'slug': game['home']['slug'],
                            'score': game['home']['score']
                        }
                        gt_home = GameTeam(**data)
                        gt_home.save()
                    else:
                        gt_home.update(score=game['home']['score'])

                    gt_away = GameTeam.objects.filter(team_id=game['away']['id']).first()
                    if gt_away is None:
                        data = {
                            'team_id': game['away']['id'],
                            'name': game['away']['name'],
                            'slug': game['away']['slug'],
                            'score': game['away']['score']
                        }
                        gt_away = GameTeam(**data)
                        gt_away.save()
                    else:
                        gt_away.update(score=game['away']['score'])
                    
                    data = {
                        'game_id': game['id'],
                        'date': game['date'],
                        'status': game['status'],
                        'home': gt_home,
                        'away': gt_away,
                        'event': ae
                    }
                    
                    g = Game(**data)
                    g.save()



