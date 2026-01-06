from django.db.models import Count
from accounts.models import User
from profiles.models import ClinicProfile, EmployerProfile, JobSeekerProfile

def admin_stats(request):
    if request.path.startswith('/admin/'):
        stats = {
            'total_users': User.objects.count(),
            'total_clinics': ClinicProfile.objects.count(),
            'total_employers': EmployerProfile.objects.count(),
            'total_jobseekers': JobSeekerProfile.objects.count(),
        }
        return stats
    return {}