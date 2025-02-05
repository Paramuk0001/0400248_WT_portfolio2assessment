# attendance/urls.py

from django.urls import path
from . import views

urlpatterns = [
    path('', views.home, name='home'),
    path('api/students/', views.student_list, name='student_list'),
    path('api/attendance/', views.attendance_list, name='attendance_list'),
    path('api/students/add/', views.add_student, name='add_student'),
    path('api/attendance/mark/', views.mark_attendance, name='mark_attendance'),
]
