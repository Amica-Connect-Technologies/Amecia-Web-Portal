from rest_framework import generics, status, permissions
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.parsers import MultiPartParser, FormParser, JSONParser
from .models import ClinicProfile, EmployerProfile, JobSeekerProfile
from .serializers import (
    ClinicProfileSerializer,
    EmployerProfileSerializer,
    JobSeekerProfileSerializer
)

class CreateProfileAPIView(APIView):
    permission_classes = [permissions.IsAuthenticated]
    parser_classes = [MultiPartParser, FormParser, JSONParser]
    
    def post(self, request):
        user = request.user
        user_type = user.user_type
        
        # Check if profile already exists
        profile_attr = f'{user_type}_profile'
        if hasattr(user, profile_attr):
            existing_profile = getattr(user, profile_attr)
            return Response(
                {'error': 'Profile already exists', 'profile_id': existing_profile.id},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Create serializer with request context
        serializer_class = None
        if user_type == 'clinic':
            serializer_class = ClinicProfileSerializer
        elif user_type == 'employer':
            serializer_class = EmployerProfileSerializer
        elif user_type == 'job_seeker':
            serializer_class = JobSeekerProfileSerializer
        else:
            return Response(
                {'error': 'Invalid user type'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Create serializer with request context
        serializer = serializer_class(
            data=request.data,
            context={'request': request}
        )
        
        if serializer.is_valid():
            # Save with the current user
            serializer.save(user=user)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        
        # Return validation errors
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class GetUpdateProfileAPIView(APIView):
    permission_classes = [permissions.IsAuthenticated]
    parser_classes = [MultiPartParser, FormParser, JSONParser]
    
    def get(self, request):
        user = request.user
        user_type = user.user_type
        
        if user_type == 'clinic' and hasattr(user, 'clinic_profile'):
            serializer = ClinicProfileSerializer(user.clinic_profile, context={'request': request})
        elif user_type == 'employer' and hasattr(user, 'employer_profile'):
            serializer = EmployerProfileSerializer(user.employer_profile, context={'request': request})
        elif user_type == 'job_seeker' and hasattr(user, 'job_seeker_profile'):
            serializer = JobSeekerProfileSerializer(user.job_seeker_profile, context={'request': request})
        else:
            return Response(
                {'error': 'Profile not found. Please create your profile first.'},
                status=status.HTTP_404_NOT_FOUND
            )
        
        return Response(serializer.data)
    
    def put(self, request):
        user = request.user
        user_type = user.user_type
        
        if user_type == 'clinic' and hasattr(user, 'clinic_profile'):
            serializer = ClinicProfileSerializer(
                user.clinic_profile, 
                data=request.data, 
                partial=True,
                context={'request': request}
            )
        elif user_type == 'employer' and hasattr(user, 'employer_profile'):
            serializer = EmployerProfileSerializer(
                user.employer_profile, 
                data=request.data, 
                partial=True,
                context={'request': request}
            )
        elif user_type == 'job_seeker' and hasattr(user, 'job_seeker_profile'):
            serializer = JobSeekerProfileSerializer(
                user.job_seeker_profile, 
                data=request.data, 
                partial=True,
                context={'request': request}
            )
        else:
            return Response(
                {'error': 'Profile not found. Please create your profile first.'},
                status=status.HTTP_404_NOT_FOUND
            )
        
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)