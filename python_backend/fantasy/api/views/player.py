from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import permissions, status

from api.models import Player, Stat, MarketValueHistoric
from api.serializers import PlayerSerializer, StatSerializer, MarketValueHistoricSerializer

class PlayerListApiView(APIView):
    permission_classes = [permissions.AllowAny]

    # 1. List all
    def get(self, request, *args, **kgars):
        '''
        List all the players
        '''
        players = Player.objects.all()
        serializer = PlayerSerializer(players, many=True)

        return Response(serializer.data, status=status.HTTP_200_OK)
    
class PlayerDetailsApiView(APIView):
    permission_classes = [permissions.AllowAny]

    def get_object(self, id):
        '''
        Helper method to get the object with given id
        '''
        try:
            return Player.objects.get(id=id)
        except Player.DoesNotExist:
            return None
    
    # 2. Get
    def get(self, request, id, *args, **kargs):
        '''
        Retrieves the Player with given id
        '''
        player_instance = self.get_object(id)
        if not player_instance:
            return Response({"res": "Object with player id does not exists"}, status=status.HTTP_404_NOT_FOUND)
        serializer = PlayerSerializer(player_instance)
        
        return Response(data=serializer.data, status=status.HTTP_200_OK)
    
class PlayerStatsDetailsApiView(APIView):
    permission_classes = [permissions.AllowAny]
    
    # 2. Get
    def get(self, request, id, *args, **kargs):
        '''
        Get all stats based on player id
        '''
        stats = Stat.objects.filter(player_id=id)
        serializer = StatSerializer(stats, many=True)

        return Response(serializer.data, status=status.HTTP_200_OK)
    
class PlayerMarketDetailsApiView(APIView):
    permission_classes = [permissions.AllowAny]
    
    # 2. Get
    def get(self, request, id, *args, **kargs):
        '''
        Get all market values based on player id
        '''
        market_values = MarketValueHistoric.objects.filter(player_id=id)
        serializer = MarketValueHistoricSerializer(market_values, many=True)

        return Response(serializer.data, status=status.HTTP_200_OK)
    