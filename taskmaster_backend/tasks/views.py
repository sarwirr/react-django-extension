from rest_framework import generics, permissions, status
from rest_framework.response import Response
from rest_framework_simplejwt.views import TokenObtainPairView
from django.contrib.auth.models import User
from .models import Task
from .serializers import TaskSerializer, UserSerializer
from rest_framework.exceptions import PermissionDenied


class IsOwnerOrAdmin(permissions.BasePermission):
    def has_object_permission(self, request, view, obj):
        return request.user == obj.user or request.user.is_staff


class TaskListCreateView(generics.ListCreateAPIView):
    queryset = Task.objects.all()
    serializer_class = TaskSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        # Admins can see all tasks; regular users only their own
        if self.request.user.is_staff:
            return Task.objects.all()
        return Task.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        # Only admin can delegate tasks to another user
        if self.request.user.is_staff:
            user_id = self.request.data.get('user')
            if user_id:
                try:
                    user = User.objects.get(pk=user_id)
                except User.DoesNotExist:
                    raise ValidationError({"user": "User does not exist"})
                serializer.save(user=user)
            else:
                serializer.save(user=self.request.user)
        else:
            # Regular users can only create tasks for themselves
            if 'user' in self.request.data and str(self.request.data['user']) != str(self.request.user.id):
                raise PermissionDenied("You do not have permission to create tasks for other users.")
            serializer.save(user=self.request.user)

class TaskDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Task.objects.all()
    serializer_class = TaskSerializer
    permission_classes = [permissions.IsAuthenticated, IsOwnerOrAdmin]

    def destroy(self, request, *args, **kwargs):
        # Get the task object to delete
        task = self.get_object()
        self.perform_destroy(task)
        # Return a custom message after deletion
        return Response(
            {"detail": f"Task '{task.title}' was deleted successfully."},
            status=status.HTTP_200_OK
        )


class CustomTokenObtainPairView(TokenObtainPairView):
    serializer_class = UserSerializer
