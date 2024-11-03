from rest_framework import serializers
from django.contrib.auth.models import User
from .models import Profile

class UserSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)
    exp_points = serializers.IntegerField(source='profile.exp_points', read_only=True)

    class Meta:
        model = User
        fields = ['username', 'password', 'first_name', 'last_name', 'email', 'exp_points']
