import json
from requests import get
from django.db import transaction
from api.models import Score, Season, SeasonRound, SeasonPrevious, ActiveEvent, Game, GameTeam
from api.models.competition import Competition
from api.models.team import Team
from api.models.player import Player

url_all_players = "https://biwenger.as.com/api/v2/competitions/la-liga/data?lang=es&score=2"

def get_players_data():
    with transaction.atomic():
        req = get(url_all_players).text
        json_data = json.loads(req)['data']
        json_meta = json.loads(req)['meta']
        
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

        # COMPETITIONS
        for competition in json_meta['competitions']:
            if Competition.objects.filter(name=competition['name']).first() is None:
                data = {
                    'competition_id': competition['id'],
                    'name': competition['name'],
                    'slug': competition['slug'],
                    'sport': competition['sport'],
                    'currency': competition['currency']
                }

                c = Competition(**data)
                c.save()
        
        # TEAMS
        for _, team in json_data['teams'].items():
            if Team.objects.filter(team_id=team['id']).first() is not None:
                data = {
                    'team_id': team['id'],
                    'name': team['name'],
                    'slug': team['slug']
                }
                
                c = Team(**data)
                c.save()

        # PLAYERS
        for player_id, player in json_data['players'].items():
            player_req = get(f"https://cf.biwenger.com/api/v2/players/la-liga/{player_id}?lang=es&fields=*,team,fitness,reports(points,home,events,status(status,statusInfo),match(*,round,home,away),star),prices,competition,seasons,news,threads").text
            print('player_req', player_req)
            # player_json_data = json.loads(player_req)['data']
            # merged = dict()
            # merged.update(player)
            # merged.update(player_json_data)
            # print('merged', merged)

            # if Player.objects.filter(player_id=player['id']).first() is None:
            #     data = {
            #         'player_id': player['id'],
            #         'name': player['name'],
            #         'slug': player['slug'],
            #         'position': player['position'],
            #         'price': player['price'],
            #         'country': player['country'],
            #         'birthday': player['birthday'],
            #         'status': player['status'],
            #         'status_info': player['statusInfo'],
            #         'price_increment': player['priceIncrement'],
            #         'played_home': player['playedHome'],
            #         'played_away': player['playedAway'],
            #         'points': player['points'],
            #         'points_home': player['pointsHome'],
            #         'points_away': player['pointsAway'],
            #         'points_last_season': player['pointsLastSeason'],
            #         'probable_in': player['probableIn'],
            #         'team': Team.objects.filter(team_id=player['teamID']).first(),
            #     }
                
            #     p = Player(**data)
            #     p.save()
            # else:
                # p = Player.objects.filter(player_id=player['id']).first()
                # print('p', p)
                # p.name = player['name']
                # p.slug = player['slug']
                # p.position = player['position']
                # p.price = player['price']
                # p.country = player['country']
                # p.birthday = player['birthday']
                # p.status = player['status']
                # p.status_info = player['statusInfo']
                # p.price_increment = player['priceIncrement']
                # p.played_home = player['playedHome']
                # p.played_away = player['playedAway']
                # p.points = player['points']
                # p.points_home = player['pointsHome']
                # p.points_away = player['pointsAway']
                # p.points_last_season = player['pointsLastSeason']
                # p.probable_in = player['probableIn']

                # p.team = Team.objects.filter(team_id=player['teamID']).first()
                # p.save()
