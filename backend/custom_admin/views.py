from django.shortcuts import render, redirect, get_object_or_404
from django.contrib.auth.decorators import login_required, user_passes_test
from django.contrib.admin.views.decorators import staff_member_required
from django.http import JsonResponse, HttpResponse
from django.db.models import Count, Q, Sum
from django.utils import timezone
from datetime import timedelta
import json
from collections import defaultdict
from accounts.models import User
from profiles.models import ClinicProfile, EmployerProfile, JobSeekerProfile
from .models import AdminDashboardStats

def is_admin(user):
    return user.is_staff and user.is_superuser

@login_required
@user_passes_test(is_admin)
def admin_dashboard(request):
    """Main admin dashboard view"""
    # Get statistics
    total_users = User.objects.count()
    active_users = User.objects.filter(is_active=True).count()
    new_users_today = User.objects.filter(date_joined__date=timezone.now().date()).count()
    new_users_week = User.objects.filter(
        date_joined__gte=timezone.now() - timedelta(days=7)
    ).count()
    
    # User type distribution
    user_type_stats = User.objects.values('user_type').annotate(
        count=Count('id')
    ).order_by('-count')
    
    # Profile completion stats
    total_clinics = ClinicProfile.objects.count()
    total_employers = EmployerProfile.objects.count()
    total_job_seekers = JobSeekerProfile.objects.count()
    
    # Calculate profiles without users
    profiles_without_users = User.objects.filter(
        Q(clinic_profile__isnull=True) & 
        Q(employer_profile__isnull=True) & 
        Q(job_seeker_profile__isnull=True)
    ).count()
    
    # Recent activity
    recent_users = User.objects.order_by('-date_joined')[:10]
    
    # Daily user registrations for chart
    today = timezone.now().date()
    date_range = [today - timedelta(days=i) for i in range(30, -1, -1)]
    
    daily_registrations = []
    for date in date_range:
        count = User.objects.filter(date_joined__date=date).count()
        daily_registrations.append({
            'date': date.strftime('%Y-%m-%d'),
            'count': count
        })
    
    context = {
        'total_users': total_users,
        'active_users': active_users,
        'new_users_today': new_users_today,
        'new_users_week': new_users_week,
        'user_type_stats': user_type_stats,
        'total_clinics': total_clinics,
        'total_employers': total_employers,
        'total_job_seekers': total_job_seekers,
        'profiles_without_users': profiles_without_users,
        'recent_users': recent_users,
        'daily_registrations': json.dumps(daily_registrations),
    }
    
    return render(request, 'custom_admin/dashboard.html', context)

@login_required
@user_passes_test(is_admin)
def manage_users(request):
    """User management view"""
    users = User.objects.all().order_by('-date_joined')
    
    # Filtering
    user_type = request.GET.get('user_type', '')
    if user_type:
        users = users.filter(user_type=user_type)
    
    is_active = request.GET.get('is_active', '')
    if is_active:
        users = users.filter(is_active=is_active == 'true')
    
    search = request.GET.get('search', '')
    if search:
        users = users.filter(
            Q(email__icontains=search) |
            Q(user_type__icontains=search)
        )
    
    context = {
        'users': users,
        'user_types': User.USER_TYPE_CHOICES,
        'filters': {
            'user_type': user_type,
            'is_active': is_active,
            'search': search,
        }
    }
    
    return render(request, 'custom_admin/manage_users.html', context)

@login_required
@user_passes_test(is_admin)
def user_detail(request, user_id):
    """User detail view"""
    user = get_object_or_404(User, id=user_id)
    
    context = {
        'user': user,
    }
    
    # Add profile data based on user type
    if user.user_type == 'clinic' and hasattr(user, 'clinic_profile'):
        context['profile'] = user.clinic_profile
        context['profile_type'] = 'clinic'
    elif user.user_type == 'employer' and hasattr(user, 'employer_profile'):
        context['profile'] = user.employer_profile
        context['profile_type'] = 'employer'
    elif user.user_type == 'job_seeker' and hasattr(user, 'job_seeker_profile'):
        context['profile'] = user.job_seeker_profile
        context['profile_type'] = 'job_seeker'
    
    return render(request, 'custom_admin/user_detail.html', context)

@login_required
@user_passes_test(is_admin)
def manage_clinics(request):
    """Clinic management view"""
    clinics = ClinicProfile.objects.all().select_related('user').order_by('-created_at')
    
    # Filtering
    clinic_type = request.GET.get('clinic_type', '')
    if clinic_type:
        clinics = clinics.filter(clinic_type__icontains=clinic_type)
    
    search = request.GET.get('search', '')
    if search:
        clinics = clinics.filter(
            Q(clinic_name__icontains=search) |
            Q(user__email__icontains=search) |
            Q(address__icontains=search)
        )
    
    context = {
        'clinics': clinics,
    }
    
    return render(request, 'custom_admin/manage_clinics.html', context)

@login_required
@user_passes_test(is_admin)
def manage_employers(request):
    """Employer management view"""
    employers = EmployerProfile.objects.all().select_related('user').order_by('-created_at')
    
    # Filtering
    industry = request.GET.get('industry', '')
    if industry:
        employers = employers.filter(industry__icontains=industry)
    
    search = request.GET.get('search', '')
    if search:
        employers = employers.filter(
            Q(company_name__icontains=search) |
            Q(user__email__icontains=search) |
            Q(contact_person__icontains=search)
        )
    
    context = {
        'employers': employers,
    }
    
    return render(request, 'custom_admin/manage_employers.html', context)

@login_required
@user_passes_test(is_admin)
def manage_job_seekers(request):
    """Job Seeker management view"""
    job_seekers = JobSeekerProfile.objects.all().select_related('user').order_by('-created_at')
    
    # Filtering
    profession = request.GET.get('profession', '')
    if profession:
        job_seekers = job_seekers.filter(profession__icontains=profession)
    
    min_experience = request.GET.get('min_experience', '')
    if min_experience:
        job_seekers = job_seekers.filter(experience_years__gte=min_experience)
    
    search = request.GET.get('search', '')
    if search:
        job_seekers = job_seekers.filter(
            Q(first_name__icontains=search) |
            Q(last_name__icontains=search) |
            Q(user__email__icontains=search) |
            Q(profession__icontains=search)
        )
    
    context = {
        'job_seekers': job_seekers,
    }
    
    return render(request, 'custom_admin/manage_job_seekers.html', context)

@login_required
@user_passes_test(is_admin)
def toggle_user_status(request, user_id):
    """Toggle user active status"""
    if request.method == 'POST':
        user = get_object_or_404(User, id=user_id)
        user.is_active = not user.is_active
        user.save()
        
        return JsonResponse({
            'success': True,
            'is_active': user.is_active,
            'message': f'User {"activated" if user.is_active else "deactivated"} successfully'
        })
    
    return JsonResponse({'success': False, 'error': 'Invalid request'})

@login_required
@user_passes_test(is_admin)
def export_users_csv(request):
    """Export users to CSV"""
    import csv
    from django.http import HttpResponse
    
    response = HttpResponse(content_type='text/csv')
    response['Content-Disposition'] = 'attachment; filename="users.csv"'
    
    writer = csv.writer(response)
    writer.writerow(['Email', 'User Type', 'Date Joined', 'Is Active', 'Is Staff'])
    
    users = User.objects.all()
    for user in users:
        writer.writerow([
            user.email,
            user.user_type,
            user.date_joined,
            user.is_active,
            user.is_staff
        ])
    
    return response

@login_required
@user_passes_test(is_admin)
def get_dashboard_stats(request):
    """API endpoint for dashboard statistics"""
    stats = {
        'total_users': User.objects.count(),
        'active_users': User.objects.filter(is_active=True).count(),
        'total_clinics': ClinicProfile.objects.count(),
        'total_employers': EmployerProfile.objects.count(),
        'total_job_seekers': JobSeekerProfile.objects.count(),
    }
    
    return JsonResponse(stats)

@login_required
@user_passes_test(is_admin)
def delete_user(request, user_id):
    """Delete user"""
    if request.method == 'POST':
        user = get_object_or_404(User, id=user_id)
        email = user.email
        user.delete()
        
        return JsonResponse({
            'success': True,
            'message': f'User {email} deleted successfully'
        })
    
    return JsonResponse({'success': False, 'error': 'Invalid request'})