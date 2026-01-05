from django.contrib import admin
from django.utils.html import format_html
from .models import ClinicProfile, EmployerProfile, JobSeekerProfile

@admin.register(ClinicProfile)
class ClinicProfileAdmin(admin.ModelAdmin):
    list_display = ('clinic_name', 'get_user_email', 'clinic_type', 'phone', 'get_city', 'has_logo')
    list_filter = ('clinic_type', 'created_at')
    search_fields = ('clinic_name', 'user__email', 'address', 'phone')
    readonly_fields = ('created_at', 'updated_at', 'logo_preview', 'get_user_email')
    
    # Fields to show in add/edit form
    fieldsets = (
        ('User Connection', {
            'fields': ('user', 'get_user_email')
        }),
        ('Basic Information', {
            'fields': ('clinic_name', 'clinic_type', 'description')
        }),
        ('Contact Details', {
            'fields': ('address', 'phone', 'website')
        }),
        ('Business Information', {
            'fields': ('license_number', 'established_date', 'number_of_doctors', 'services')
        }),
        ('Documents & Media', {
            'fields': ('logo', 'logo_preview', 'license_document')
        }),
        ('System Information', {
            'fields': ('created_at', 'updated_at'),
            'classes': ('collapse',)
        }),
    )
    
    def get_user_email(self, obj):
        """Display user email as a read-only field"""
        if obj.user:
            return obj.user.email
        return "No user assigned"
    get_user_email.short_description = 'User Email'
    
    def logo_preview(self, obj):
        if obj.logo:
            return format_html('<img src="{}" width="100" height="100" style="object-fit: cover; border-radius: 5px;" />', obj.logo.url)
        return "No logo uploaded"
    logo_preview.short_description = 'Logo Preview'
    
    def get_city(self, obj):
        """Extract city from address for list display"""
        if obj.address and ',' in obj.address:
            return obj.address.split(',')[-1].strip()
        return '-'
    get_city.short_description = 'City'
    
    def has_logo(self, obj):
        if obj.logo:
            return format_html('<span style="color: green;">✓</span>')
        return format_html('<span style="color: gray;">✗</span>')
    has_logo.short_description = 'Logo'

@admin.register(EmployerProfile)
class EmployerProfileAdmin(admin.ModelAdmin):
    list_display = ('company_name', 'get_user_email', 'contact_person', 'industry', 'phone', 'has_logo')
    list_filter = ('industry', 'created_at')
    search_fields = ('company_name', 'user__email', 'contact_person')
    readonly_fields = ('created_at', 'updated_at', 'logo_preview', 'get_user_email')
    
    fieldsets = (
        ('User Connection', {
            'fields': ('user', 'get_user_email')
        }),
        ('Company Information', {
            'fields': ('company_name', 'industry', 'company_size')
        }),
        ('Contact Details', {
            'fields': ('contact_person', 'phone', 'address', 'website')
        }),
        ('Media', {
            'fields': ('company_logo', 'logo_preview')
        }),
        ('System Information', {
            'fields': ('created_at', 'updated_at'),
            'classes': ('collapse',)
        }),
    )
    
    def get_user_email(self, obj):
        if obj.user:
            return obj.user.email
        return "No user assigned"
    get_user_email.short_description = 'User Email'
    
    def logo_preview(self, obj):
        if obj.company_logo:
            return format_html('<img src="{}" width="100" height="100" style="object-fit: cover; border-radius: 5px;" />', obj.company_logo.url)
        return "No logo uploaded"
    logo_preview.short_description = 'Logo Preview'
    
    def has_logo(self, obj):
        if obj.company_logo:
            return format_html('<span style="color: green;">✓</span>')
        return format_html('<span style="color: gray;">✗</span>')
    has_logo.short_description = 'Logo'

@admin.register(JobSeekerProfile)
class JobSeekerProfileAdmin(admin.ModelAdmin):
    list_display = ('full_name', 'get_user_email', 'profession', 'get_experience', 'phone', 'has_resume')
    list_filter = ('profession', 'experience_years', 'created_at')
    search_fields = ('first_name', 'last_name', 'user__email', 'profession', 'skills')
    readonly_fields = ('created_at', 'updated_at', 'profile_pic_preview', 'resume_link', 'certifications_link', 'get_user_email')
    
    fieldsets = (
        ('User Connection', {
            'fields': ('user', 'get_user_email')
        }),
        ('Personal Information', {
            'fields': ('first_name', 'last_name', 'date_of_birth', 'phone', 'address')
        }),
        ('Professional Details', {
            'fields': ('profession', 'experience_years', 'education', 'skills')
        }),
        ('Documents & Media', {
            'fields': ('profile_picture', 'profile_pic_preview', 'resume', 'resume_link', 'certifications', 'certifications_link')
        }),
        ('System Information', {
            'fields': ('created_at', 'updated_at'),
            'classes': ('collapse',)
        }),
    )
    
    def full_name(self, obj):
        return f"{obj.first_name} {obj.last_name}"
    full_name.short_description = 'Full Name'
    
    def get_user_email(self, obj):
        if obj.user:
            return obj.user.email
        return "No user assigned"
    get_user_email.short_description = 'User Email'
    
    def get_experience(self, obj):
        return f"{obj.experience_years} years"
    get_experience.short_description = 'Experience'
    
    def profile_pic_preview(self, obj):
        if obj.profile_picture:
            return format_html('<img src="{}" width="100" height="100" style="object-fit: cover; border-radius: 50%;" />', obj.profile_picture.url)
        return "No profile picture"
    profile_pic_preview.short_description = 'Profile Picture Preview'
    
    def resume_link(self, obj):
        if obj.resume:
            return format_html('<a href="{}" target="_blank" style="background: #4CAF50; color: white; padding: 5px 10px; text-decoration: none; border-radius: 3px;">Download Resume</a>', obj.resume.url)
        return "No resume uploaded"
    resume_link.short_description = 'Resume'
    
    def certifications_link(self, obj):
        if obj.certifications:
            return format_html('<a href="{}" target="_blank" style="background: #2196F3; color: white; padding: 5px 10px; text-decoration: none; border-radius: 3px;">Download Certifications</a>', obj.certifications.url)
        return "No certifications uploaded"
    certifications_link.short_description = 'Certifications'
    
    def has_resume(self, obj):
        if obj.resume:
            return format_html('<span style="color: green;">✓</span>')
        return format_html('<span style="color: gray;">✗</span>')
    has_resume.short_description = 'Resume'