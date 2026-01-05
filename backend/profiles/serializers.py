from rest_framework import serializers
from .models import ClinicProfile, EmployerProfile, JobSeekerProfile
from django.conf import settings

class ClinicProfileSerializer(serializers.ModelSerializer):
    logo = serializers.ImageField(required=False, allow_null=True)
    license_document = serializers.FileField(required=False, allow_null=True)
    
    class Meta:
        model = ClinicProfile
        fields = '__all__'
        read_only_fields = ('user', 'created_at', 'updated_at')
    
    def validate_user(self, value):
        if value.user_type != 'clinic':
            raise serializers.ValidationError("User must be of type 'clinic'.")
        return value
    
    def create(self, validated_data):
        # Ensure user is set from context
        request = self.context.get('request')
        if request and request.user:
            validated_data['user'] = request.user
        return super().create(validated_data)

class EmployerProfileSerializer(serializers.ModelSerializer):
    company_logo = serializers.ImageField(required=False, allow_null=True)
    
    class Meta:
        model = EmployerProfile
        fields = '__all__'
        read_only_fields = ('user', 'created_at', 'updated_at')
    
    def validate_user(self, value):
        if value.user_type != 'employer':
            raise serializers.ValidationError("User must be of type 'employer'.")
        return value
    
    def create(self, validated_data):
        request = self.context.get('request')
        if request and request.user:
            validated_data['user'] = request.user
        return super().create(validated_data)

class JobSeekerProfileSerializer(serializers.ModelSerializer):
    profile_picture = serializers.ImageField(required=False, allow_null=True)
    resume = serializers.FileField(required=False, allow_null=True)
    certifications = serializers.FileField(required=False, allow_null=True)
    
    class Meta:
        model = JobSeekerProfile
        fields = '__all__'
        read_only_fields = ('user', 'created_at', 'updated_at')
    
    def validate_user(self, value):
        if value.user_type != 'job_seeker':
            raise serializers.ValidationError("User must be of type 'job_seeker'.")
        return value
    
    def create(self, validated_data):
        request = self.context.get('request')
        if request and request.user:
            validated_data['user'] = request.user
        return super().create(validated_data)