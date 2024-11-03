from django.urls import path
from .views import register_user,update_exp_points, UserListView, UserDeleteView, UserTasksView, get_user_details

urlpatterns = [
    path('register/', register_user, name='register-user'),
    path('', UserListView.as_view(), name='user-list'),  
    path('<int:pk>/delete/', UserDeleteView.as_view(), name='user-delete'),  
    path('<int:user_id>/tasks/', UserTasksView.as_view(), name='user-tasks'),
    path('me/', get_user_details, name='user-details'),  
    path('update-exp/', update_exp_points, name='update-exp'),
]
