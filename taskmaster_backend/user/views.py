from rest_framework import status, generics, permissions
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from django.contrib.auth.models import User
from .serializers import UserSerializer
from tasks.models import Task
from tasks.serializers import TaskSerializer
from rest_framework.permissions import AllowAny
from .models import Profile

@api_view(['POST'])
@permission_classes([AllowAny]) 
def register_user(request):
    serializer = UserSerializer(data=request.data)
    if serializer.is_valid():
        user = User.objects.create_user(
            username=serializer.validated_data['username'],
            password=serializer.validated_data['password'],
            first_name=serializer.validated_data.get('first_name', ''),
            last_name=serializer.validated_data.get('last_name', ''),
            email=serializer.validated_data.get('email', '')
        )
        # Create a profile with default exp_points for the new user
        Profile.objects.create(user=user, exp_points=0)

        return Response({"message": "User registered successfully"}, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET'])
@permission_classes([permissions.IsAuthenticated])
def get_user_details(request):
    user = request.user
    serializer = UserSerializer(user)
    return Response(serializer.data)


class UserListView(generics.ListAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [permissions.IsAdminUser]  

    def list(self, request, *args, **kwargs):
        response = super().list(request, *args, **kwargs)
        for user in response.data:
            user_instance = User.objects.get(username=user['username'])
            user['id'] = user_instance.id 
            user['exp_points'] = user_instance.profile.exp_points 
        return response


class UserDeleteView(generics.DestroyAPIView):
    queryset = User.objects.all()
    permission_classes = [permissions.IsAdminUser]  

    def delete(self, request, *args, **kwargs):
        response = super().delete(request, *args, **kwargs)
        if response.status_code == 204:
            return Response({"message": "User deleted successfully"}, status=status.HTTP_204_NO_CONTENT)
        return response

@api_view(['PUT'])
@permission_classes([permissions.IsAuthenticated])
def update_exp_points(request):
    user = request.user
    exp_points = request.data.get('exp_points')

    if exp_points is not None:
        try:
            profile = user.profile
            profile.exp_points = exp_points
            profile.save()
            return Response({"message": "EXP points updated successfully"}, status=status.HTTP_200_OK)
        except Profile.DoesNotExist:
            return Response({"error": "Profile not found"}, status=status.HTTP_404_NOT_FOUND)
    return Response({"error": "Invalid data"}, status=status.HTTP_400_BAD_REQUEST)


class UserTasksView(generics.ListAPIView):
    serializer_class = TaskSerializer
    permission_classes = [permissions.IsAdminUser]  

    def get_queryset(self):
        user_id = self.kwargs['user_id']
        return Task.objects.filter(user_id=user_id)
