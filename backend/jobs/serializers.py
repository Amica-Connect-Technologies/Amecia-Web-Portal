from rest_framework import serializers
from .models import Job, JobApplication
from django.contrib.auth import get_user_model

User = get_user_model()

class JobSerializer(serializers.ModelSerializer):
    created_by = serializers.ReadOnlyField(source='created_by.email')
    total_applications = serializers.SerializerMethodField()
    
    class Meta:
        model = Job
        fields = '__all__'
        read_only_fields = ('created_by', 'created_at', 'updated_at')
    
    def get_total_applications(self, obj):
        return obj.applications.count()

class JobApplicationSerializer(serializers.ModelSerializer):
    applicant = serializers.ReadOnlyField(source='applicant.email')
    job_title = serializers.ReadOnlyField(source='job.title')
    applicant_name = serializers.SerializerMethodField()
    
    class Meta:
        model = JobApplication
        fields = '__all__'
        read_only_fields = ('applicant', 'applied_at', 'status')
    
    def get_applicant_name(self, obj):
        return f"{obj.applicant.first_name} {obj.applicant.last_name}"
    
    def validate(self, data):
        # Check if user already applied
        request = self.context.get('request')
        job = data.get('job')
        
        if JobApplication.objects.filter(job=job, applicant=request.user).exists():
            raise serializers.ValidationError("You have already applied for this job.")
        
        return data