from django.db import models
from django.contrib.auth.models import User
import uuid

class Task(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    title = models.CharField(max_length=100)
    description = models.TextField(blank=True)
    difficulty = models.CharField(
        max_length=10,
        choices=[('Easy', 'Easy'), ('Medium', 'Medium'), ('Hard', 'Hard')]
    )
    estimated_time = models.PositiveIntegerField()  # Time in minutes
    completed = models.BooleanField(default=False)
    user = models.ForeignKey(User, on_delete=models.CASCADE)

    def __str__(self):
        return self.title
