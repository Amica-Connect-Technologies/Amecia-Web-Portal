from django.db import models
from django.conf import settings

class ClinicProfile(models.Model):
    user = models.OneToOneField(
        settings.AUTH_USER_MODEL, 
        on_delete=models.CASCADE, 
        related_name='clinic_profile'
    )
    clinic_name = models.CharField(max_length=255)
    address = models.TextField()
    phone = models.CharField(max_length=20)
    description = models.TextField(blank=True)
    license_number = models.CharField(max_length=100, blank=True)
    established_date = models.DateField(null=True, blank=True)
    website = models.URLField(blank=True)
    
    # Clinic specific fields
    clinic_type = models.CharField(max_length=100, blank=True)  # e.g., Dental, Medical, Veterinary
    number_of_doctors = models.IntegerField(default=0)
    services = models.TextField(blank=True)  # JSON or comma-separated services
    
    # Uploads
    logo = models.ImageField(upload_to='clinics/logos/', blank=True, null=True)
    license_document = models.FileField(upload_to='clinics/licenses/', blank=True, null=True)
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    def __str__(self):
        return self.clinic_name

class EmployerProfile(models.Model):
    user = models.OneToOneField(
        settings.AUTH_USER_MODEL, 
        on_delete=models.CASCADE, 
        related_name='employer_profile'
    )
    company_name = models.CharField(max_length=255)
    contact_person = models.CharField(max_length=255)
    phone = models.CharField(max_length=20)
    address = models.TextField(blank=True)
    industry = models.CharField(max_length=100, blank=True)
    company_size = models.CharField(max_length=50, blank=True)
    website = models.URLField(blank=True)
    
    # Uploads
    company_logo = models.ImageField(upload_to='employers/logos/', blank=True, null=True)
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    def __str__(self):
        return self.company_name

class JobSeekerProfile(models.Model):
    user = models.OneToOneField(
        settings.AUTH_USER_MODEL, 
        on_delete=models.CASCADE, 
        related_name='job_seeker_profile'
    )
    first_name = models.CharField(max_length=100)
    last_name = models.CharField(max_length=100)
    phone = models.CharField(max_length=20, blank=True)
    address = models.TextField(blank=True)
    date_of_birth = models.DateField(null=True, blank=True)
    
    # Professional details
    profession = models.CharField(max_length=100, blank=True)
    experience_years = models.IntegerField(default=0)
    education = models.TextField(blank=True)
    skills = models.TextField(blank=True)  # JSON or comma-separated skills
    
    # Uploads
    profile_picture = models.ImageField(upload_to='job_seekers/profile_pics/', blank=True, null=True)
    resume = models.FileField(upload_to='job_seekers/resumes/', blank=True, null=True)
    certifications = models.FileField(upload_to='job_seekers/certifications/', blank=True, null=True)
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    def __str__(self):
        return f"{self.first_name} {self.last_name}"