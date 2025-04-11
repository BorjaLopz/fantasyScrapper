from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import permissions, status
from api.models import ActiveEvent, Game
from api.serializers import ActiveEventSerializer, GameSerializer

class ActiveEventListApiView(APIView):
    permission_classes = [permissions.AllowAny]

    # 1. List all
    def get(self, request, *args, **kargs):
        '''
        List all the active_events
        '''
        active_events = ActiveEvent.objects.all()
        serializer = ActiveEventSerializer(active_events, many=True)

        return Response(serializer.data, status=status.HTTP_200_OK)
    
class ActiveEventDetailsApiView(APIView):
    permission_classes = [permissions.AllowAny]

    def get_object(self, id):
        '''
        Helper method to get the object with given id
        '''
        try:
            return ActiveEvent.objects.get(id=id)
        except ActiveEvent.DoesNotExist:
            return None
    
    # 2. Get
    def get(self, request, id, *args, **kargs):
        '''
        Retrieves the ActiveEvent with given id
        '''
        active_event_instance = self.get_object(id)
        if not active_event_instance:
            return Response({"res": "Object with active_event id does not exists"}, status=status.HTTP_404_NOT_FOUND)
        serializer = ActiveEventSerializer(active_event_instance)
        
        return Response(data=serializer.data, status=status.HTTP_200_OK)

class ActiveEventGamesListApiView(APIView):
    permission_classes = [permissions.AllowAny]

    # 1. List all
    def get(self, request, event_id, *args, **kgars):
        '''
        List all the games given event_id
        '''
        season_rounds = Game.objects.filter(event=event_id)
        serializer = GameSerializer(season_rounds, many=True)

        return Response(data=serializer.data, status=status.HTTP_200_OK)