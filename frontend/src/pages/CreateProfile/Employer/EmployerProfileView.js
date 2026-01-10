import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext';
import LoadingSpinner from '../../../components/Common/LoadingSpinner';
import Alert from '../../../components/Common/Alert';
import { profileAPI } from '../../../services/api';
import { 
  BuildingOfficeIcon, 
  UserIcon, 
  PhoneIcon, 
  MapPinIcon,
  GlobeAltIcon,
  PencilIcon,
  BriefcaseIcon,
  UsersIcon,
  DocumentTextIcon
} from '@heroicons/react/24/outline';

const EmployerProfileView = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchProfile();
  }, []);

  // In your EmployerProfileView.js fetchProfile function, update it like this:
const fetchProfile = async () => {
  try {
    setLoading(true);
    const profileData = await profileAPI.getProfile(); // This now returns the profile directly
    if (profileData) {
      setProfile(profileData);
    }
  } catch (error) {
    console.error('Error fetching profile:', error);
    if (error.response?.status === 404) {
      navigate('/employer/profile/create');
    } else {
      setError('Failed to load profile. Please try again.');
    }
  } finally {
    setLoading(false);
  }
};

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <BuildingOfficeIcon className="mx-auto h-16 w-16 text-gray-400" />
          <h3 className="mt-4 text-lg font-medium text-gray-900">No profile found</h3>
          <p className="mt-2 text-gray-600">Please create your employer profile first.</p>
          <button
            onClick={() => navigate('/employer/profile/create')}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Create Profile
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Company Profile</h1>
              <p className="mt-2 text-gray-600">View and manage your company information</p>
            </div>
            <button
              onClick={() => navigate('/employer/profile/edit')}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center"
            >
              <PencilIcon className="w-4 h-4 mr-2" />
              Edit Profile
            </button>
          </div>
        </div>

        {error && (
          <Alert type="error" message={error} className="mb-6" />
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Company Info */}
          <div className="lg:col-span-2 space-y-6">
            {/* Company Card */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="flex items-start space-x-6">
                {profile.company_logo ? (
                  <img
                    src={profile.company_logo}
                    alt={profile.company_name}
                    className="w-24 h-24 rounded-lg object-cover border"
                  />
                ) : (
                  <div className="w-24 h-24 bg-blue-100 rounded-lg flex items-center justify-center">
                    <BuildingOfficeIcon className="w-12 h-12 text-blue-600" />
                  </div>
                )}
                
                <div className="flex-1">
                  <div className="flex justify-between items-start">
                    <div>
                      <h2 className="text-2xl font-bold text-gray-900">{profile.company_name}</h2>
                      <div className="flex items-center mt-2 space-x-4">
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                          <BriefcaseIcon className="w-4 h-4 mr-1" />
                          {profile.industry}
                        </span>
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                          <UsersIcon className="w-4 h-4 mr-1" />
                          {profile.company_size}
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  {profile.description && (
                    <div className="mt-6">
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">About Us</h3>
                      <p className="text-gray-600 whitespace-pre-line">{profile.description}</p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Contact Information */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-6">Contact Information</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="flex items-start space-x-3">
                    <UserIcon className="w-5 h-5 text-gray-400 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-gray-500">Contact Person</p>
                      <p className="text-gray-900">{profile.contact_person}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-3">
                    <PhoneIcon className="w-5 h-5 text-gray-400 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-gray-500">Phone Number</p>
                      <p className="text-gray-900">{profile.phone}</p>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div className="flex items-start space-x-3">
                    <MapPinIcon className="w-5 h-5 text-gray-400 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-gray-500">Address</p>
                      <p className="text-gray-900">{profile.address || 'Not specified'}</p>
                    </div>
                  </div>
                  
                  {profile.website && (
                    <div className="flex items-start space-x-3">
                      <GlobeAltIcon className="w-5 h-5 text-gray-400 mt-0.5" />
                      <div>
                        <p className="text-sm font-medium text-gray-500">Website</p>
                        <a 
                          href={profile.website} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:underline"
                        >
                          {profile.website}
                        </a>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Stats & Info */}
          <div className="space-y-6">
            {/* Profile Status */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Profile Status</h3>
              
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Profile Completion</span>
                  <span className="font-semibold text-green-600">100%</span>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Member Since</span>
                  <span className="font-medium">
                    {formatDate(profile.created_at || profile.updated_at)}
                  </span>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Last Updated</span>
                  <span className="font-medium">
                    {formatDate(profile.updated_at)}
                  </span>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
              
              <div className="space-y-3">
                <button
                  onClick={() => navigate('/employer/jobs/create')}
                  className="w-full text-left px-4 py-3 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition flex items-center"
                >
                  <DocumentTextIcon className="w-5 h-5 mr-3" />
                  Post a New Job
                </button>
                
                <button
                  onClick={() => navigate('/employer/jobs')}
                  className="w-full text-left px-4 py-3 bg-gray-50 text-gray-700 rounded-lg hover:bg-gray-100 transition flex items-center"
                >
                  <BriefcaseIcon className="w-5 h-5 mr-3" />
                  View Posted Jobs
                </button>
                
                <button
                  onClick={() => navigate('/dashboard')}
                  className="w-full text-left px-4 py-3 bg-gray-50 text-gray-700 rounded-lg hover:bg-gray-100 transition flex items-center"
                >
                  <UsersIcon className="w-5 h-5 mr-3" />
                  Dashboard
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmployerProfileView;