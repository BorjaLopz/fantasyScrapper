from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import permissions, status
from api.models import Season, SeasonRound, SeasonPrevious
from api.serializers import SeasonSerializer, SeasonPreviousSerializer, SeasonRoundSerializer

class SeasonListApiView(APIView):
    permission_classes = [permissions.AllowAny]

    # 1. List all
    def get(self, request, *args, **kgars):
        '''
        List all the seasons
        '''
        seasons = Season.objects.all()
        serializer = SeasonSerializer(seasons, many=True)

        return Response(serializer.data, status=status.HTTP_200_OK)
    
class SeasonDetailsApiView(APIView):
    permission_classes = [permissions.AllowAny]

    def get_object(self, id):
        '''
        Helper method to get the object with given id
        '''
        try:
            return Season.objects.get(id=id)
        except Season.DoesNotExist:
            return None
    
    # 2. Get
    def get(self, request, id, *args, **kargs):
        '''
        Retrieves the Season with given id
        '''
        season_instance = self.get_object(id)
        if not season_instance:
            return Response({"res": "Object with season id does not exists"}, status=status.HTTP_404_NOT_FOUND)
        serializer = SeasonSerializer(season_instance)
        
        return Response(data=serializer.data, status=status.HTTP_200_OK)
    
class SeasonRoundListApiView(APIView):
    permission_classes = [permissions.AllowAny]

    # 1. List all
    def get(self, request, season_id, *args, **kgars):
        '''
        List all the seasons rounds given season_id
        '''
        season_rounds = SeasonRound.objects.filter(season=season_id)
        serializer = SeasonRoundSerializer(season_rounds, many=True)

        return Response(data=serializer.data, status=status.HTTP_200_OK)