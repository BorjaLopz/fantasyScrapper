from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import permissions, status

from api.models import Team
from api.serializers import TeamSerializer

class TeamListApiView(APIView):
    permission_classes = [permissions.AllowAny]

    # 1. List all
    def get(self, request, *args, **kgars):
        '''
        List all the teams
        '''
        teams = Team.objects.all()
        serializer = TeamSerializer(teams, many=True)

        return Response(serializer.data, status=status.HTTP_200_OK)
    
class TeamDetailsApiView(APIView):
    permission_classes = [permissions.AllowAny]

    def get_object(self, id):
        '''
        Helper method to get the object with given id
        '''
        try:
            return Team.objects.get(id=id)
        except Team.DoesNotExist:
            return None
    
    # 2. Get
    def get(self, request, id, *args, **kargs):
        '''
        Retrieves the Team with given id
        '''
        team_instance = self.get_object(id)
        if not team_instance:
            return Response({"res": "Object with team id does not exists"}, status=status.HTTP_404_NOT_FOUND)
        serializer = TeamSerializer(team_instance)
        
        return Response(data=serializer.data, status=status.HTTP_200_OK)
    