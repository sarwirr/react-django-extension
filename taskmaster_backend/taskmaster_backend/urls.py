from django.contrib import admin
from django.urls import path, include

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include('tasks.urls')),
    path('api/tasks/', include('tasks.urls')),
    path('api/users/', include('user.urls')),
]
