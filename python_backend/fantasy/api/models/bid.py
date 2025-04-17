import uuid
from django.db import models
from django.contrib.auth.models import User

from .market import Market
from .player import Player

class Bid(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    bid = models.FloatField(default=0.0)

    market = models.ForeignKey(Market, on_delete=models.CASCADE)
    player = models.ForeignKey(Player, on_delete=models.CASCADE)
    user = models.ForeignKey(User, on_delete=models.CASCADE)