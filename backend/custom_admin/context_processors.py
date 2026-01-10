from accounts.models import User
from profiles.models import ClinicProfile, EmployerProfile, JobSeekerProfile

def admin_stats(request):
    """Add admin statistics to all templates"""
    if request.path.startswith('/admin-custom/'):
        return {
            'total_users': User.objects.count(),
            'total_clinics': ClinicProfile.objects.count(),
            'total_employers': EmployerProfile.objects.count(),
            'total_job_seekers': JobSeekerProfile.objects.count(),
        }
    return {}