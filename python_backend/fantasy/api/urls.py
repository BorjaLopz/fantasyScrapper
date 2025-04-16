from django.urls import path

from .views import TeamListApiView, TeamDetailsApiView, PlayerListApiView, PlayerDetailsApiView

urlpatterns = [
    path('api/teams', TeamListApiView.as_view()),
    path('api/teams/<uuid:id>', TeamDetailsApiView.as_view()),
    path('api/players', PlayerListApiView.as_view()),
    path('api/players/<uuid:id>', PlayerDetailsApiView.as_view()),
]