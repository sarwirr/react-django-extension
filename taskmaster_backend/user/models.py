from django.db import models
from django.contrib.auth.models import User

class Profile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    exp_points = models.PositiveIntegerField(default=0)  # New field for experience points

    def __str__(self):
        return f"{self.user.username}'s Profile"
