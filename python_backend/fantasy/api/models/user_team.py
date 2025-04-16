import uuid
from django.db import models
from django.contrib.auth.models import User

class UserTeam(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    formation = models.CharField(max_length=15, default="4-4-2")

    user = models.OneToOneField(User, on_delete=models.CASCADE)