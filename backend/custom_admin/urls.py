from django.urls import path
from . import views

app_name = 'custom_admin'

urlpatterns = [
    path('', views.admin_dashboard, name='dashboard'),
    path('dashboard/', views.admin_dashboard, name='dashboard'),
    path('users/', views.manage_users, name='manage_users'),
    path('users/<int:user_id>/', views.user_detail, name='user_detail'),
    path('clinics/', views.manage_clinics, name='manage_clinics'),
    path('employers/', views.manage_employers, name='manage_employers'),
    path('job-seekers/', views.manage_job_seekers, name='manage_job_seekers'),
    path('toggle-user/<int:user_id>/', views.toggle_user_status, name='toggle_user_status'),
    path('delete-user/<int:user_id>/', views.delete_user, name='delete_user'),
    path('export-users-csv/', views.export_users_csv, name='export_users_csv'),
    path('api/dashboard-stats/', views.get_dashboard_stats, name='dashboard_stats'),
]