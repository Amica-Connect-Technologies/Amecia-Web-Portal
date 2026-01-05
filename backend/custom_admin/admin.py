from django.contrib import admin
from .models import AdminDashboardStats

@admin.register(AdminDashboardStats)
class AdminDashboardStatsAdmin(admin.ModelAdmin):
    list_display = ('total_users', 'total_clinics', 'total_employers', 
                    'total_job_seekers', 'active_users', 'last_updated', )
    readonly_fields = ('total_users', 'total_clinics', 'total_employers',
                       'total_job_seekers', 'active_users', 'last_updated')