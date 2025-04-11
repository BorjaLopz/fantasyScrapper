from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import permissions, status
from api.models import Score
from api.serializers import ScoreSerializer

class ScoreListApiView(APIView):
    # permission_classes = [permissions.IsAuthenticated]
    permission_classes = [permissions.AllowAny]

    # 1. List all
    def get(self, request, *args, **kargs):
        '''
        List all the scores
        '''
        scores = Score.objects
        serializer = ScoreSerializer(scores, many=True)

        return Response(serializer.data, status=status.HTTP_200_OK)
    
    # 2. Create
    def post(self, request, *args, **kwargs):
        '''
        Create the Score with given score data
        '''
        data = {
            'score_id': request.data.get('id'),
            'name': request.data.get('name'),
            'kind': request.data.get('kind')
        }
        serializer = ScoreSerializer(data=data)
        if serializer.is_valid():
            serializer.save()

            return Response(serializer.data, status=status.HTTP_201_CREATED)
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)