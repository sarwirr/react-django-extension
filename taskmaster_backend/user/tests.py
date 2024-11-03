from rest_framework.test import APITestCase, APIClient
from rest_framework import status
from django.contrib.auth.models import User
from tasks.models import Task

class UserTests(APITestCase):
    def setUp(self):
        self.admin_user = User.objects.create_superuser(username='admin', password='adminpass', email='admin@example.com')
        self.regular_user = User.objects.create_user(username='johndoe', password='password123', email='johndoe@example.com')
        self.client = APIClient()

    def test_user_registration(self):
        response = self.client.post('/api/users/register/', {
            'username': 'newuser',
            'password': 'newuserpass',
            'email': 'newuser@example.com'
        })
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

    def test_admin_can_create_task_for_any_user(self):
        self.client.force_authenticate(user=self.admin_user)  # Authenticate as admin
        response = self.client.post('/api/tasks/', {
            'title': 'Delegated Task',
            'description': 'Task assigned by admin to another user',
            'difficulty': 'Easy',  # Add required field
            'estimated_time': 60,  # Add required field
            'user': str(self.regular_user.id)  # Assign task to another user
        })
        print(response.data)  # Debugging line to check response data
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

    def test_regular_user_can_only_create_task_for_themselves(self):
        self.client.force_authenticate(user=self.regular_user)  # Authenticate as regular user
        response = self.client.post('/api/tasks/', {
            'title': 'Regular User Task',
            'description': 'Task created by regular user',
            'difficulty': 'Medium',  # Add required field
            'estimated_time': 30,  # Add required field
            'user': str(self.admin_user.id) # Attempt to assign to another user
        })
        print(response.data)  # Debug output
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

class TaskTests(APITestCase):
    def setUp(self):
        self.admin_user = User.objects.create_superuser(username='admin', password='adminpass', email='admin@example.com')
        self.regular_user = User.objects.create_user(username='johndoe', password='password123', email='johndoe@example.com')
        self.task = Task.objects.create(
            title='Sample Task',
            description='Sample description',
            user=self.regular_user,
            estimated_time=30,
            difficulty='Easy'
        )
        self.client = APIClient()

    def test_admin_can_view_all_tasks(self):
        self.client.force_authenticate(user=self.admin_user)  # Authenticate as admin
        response = self.client.get(f'/api/users/{self.regular_user.id}/tasks/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertGreater(len(response.data), 0)

    def test_regular_user_can_only_view_their_tasks(self):
        self.client.force_authenticate(user=self.regular_user)  # Authenticate as regular user
        response = self.client.get('/api/tasks/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        for task in response.data:
            self.assertEqual(task['user'], self.regular_user.id)
