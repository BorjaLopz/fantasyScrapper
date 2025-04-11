from django.urls import path

from .views import ScoreListApiView, SeasonListApiView, SeasonDetailsApiView, SeasonRoundListApiView, ActiveEventDetailsApiView, ActiveEventGamesListApiView, ActiveEventListApiView

urlpatterns = [
    path('api/score', ScoreListApiView.as_view()),
    path('api/season', SeasonListApiView.as_view()),
    path('api/season/<uuid:id>', SeasonDetailsApiView.as_view()),
    path('api/season/<uuid:season_id>/rounds', SeasonRoundListApiView.as_view()),
    path('api/active-event', ActiveEventListApiView.as_view()),
    path('api/active-event/<uuid:id>', ActiveEventDetailsApiView.as_view()),
    path('api/active-event/<uuid:event_id>/games', ActiveEventGamesListApiView.as_view()),
]