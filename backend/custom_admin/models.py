from django.db import models
from django.contrib.auth import get_user_model
from profiles.models import ClinicProfile, EmployerProfile, JobSeekerProfile

User = get_user_model()

class AdminDashboardStats(models.Model):
    """Store dashboard statistics for caching"""
    total_users = models.IntegerField(default=0)
    total_clinics = models.IntegerField(default=0)
    total_employers = models.IntegerField(default=0)
    total_job_seekers = models.IntegerField(default=0)
    active_users = models.IntegerField(default=0)
    last_updated = models.DateTimeField(auto_now=True)
    
    class Meta:
        verbose_name_plural = "Dashboard Statistics"
    
    def __str__(self):
        return f"Dashboard Stats - {self.last_updated}"