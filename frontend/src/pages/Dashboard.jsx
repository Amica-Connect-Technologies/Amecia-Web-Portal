import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
// import { profileAPI } from '../../services/api';
import { profileAPI } from '../services/api';
import LoadingSpinner from '../components/Common/LoadingSpinner';
import Alert from '../components/Common/Alert';
import { 
  BuildingOfficeIcon, 
  BriefcaseIcon, 
  UserCircleIcon,
  CheckCircleIcon,
  ExclamationCircleIcon,
  ArrowRightIcon,
} from '@heroicons/react/24/outline';

const Dashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const response = await profileAPI.getProfile();
      setProfile(response.data);
    } catch (err) {
      if (err.response?.status !== 404) {
        setError('Failed to load profile');
      }
    } finally {
      setLoading(false);
    }
  };

  const getUserTypeIcon = () => {
    switch (user?.user_type) {
      case 'clinic':
        return <BuildingOfficeIcon className="w-8 h-8 text-primary-600" />;
      case 'employer':
        return <BriefcaseIcon className="w-8 h-8 text-primary-600" />;
      case 'job_seeker':
        return <UserCircleIcon className="w-8 h-8 text-primary-600" />;
      default:
        return <UserCircleIcon className="w-8 h-8 text-primary-600" />;
    }
  };

  const getUserTypeText = () => {
    return user?.user_type?.replace('_', ' ').toUpperCase() || '';
  };

  const getProfileCompletion = () => {
    if (!profile) return 0;
    // Simple completion calculation
    const fields = Object.values(profile).filter(value => 
      value !== null && value !== '' && value !== undefined
    );
    return Math.round((fields.length / Object.keys(profile).length) * 100);
  };

  const getNextStep = () => {
    if (!profile) {
      return {
        title: 'Complete Your Profile',
        description: 'Set up your profile to start using Arnica Connect',
        buttonText: 'Create Profile',
        action: () => navigate('/create-profile'),
      };
    }

    const completion = getProfileCompletion();
    if (completion < 70) {
      return {
        title: 'Complete Your Profile',
        description: 'Add more details to improve your profile visibility',
        buttonText: 'Edit Profile',
        action: () => navigate('/profile/edit'),
      };
    }

    return {
      title: 'Profile Complete!',
      description: 'Your profile is ready. Start exploring opportunities.',
      buttonText: 'View Profile',
      action: () => navigate('/profile'),
    };
  };

  const nextStep = getNextStep();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {error && (
          <Alert type="error" message={error} className="mb-6" />
        )}

        {/* Welcome Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Welcome back, {user?.email?.split('@')[0]}!
          </h1>
          <p className="mt-2 text-gray-600">
            Here's what's happening with your account today.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Profile Overview */}
          <div className="lg:col-span-2 space-y-8">
            {/* Profile Status Card */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center">
                    {getUserTypeIcon()}
                  </div>
                  <div>
                    <h2 className="text-xl font-semibold text-gray-900">
                      {getUserTypeText()}
                    </h2>
                    <p className="text-gray-500">{user?.email}</p>
                  </div>
                </div>
                <div className={`px-3 py-1 rounded-full text-sm font-medium ${
                  profile ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                }`}>
                  {profile ? 'Profile Created' : 'Profile Incomplete'}
                </div>
              </div>

              {/* Progress Bar */}
              <div className="mb-6">
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-gray-600">Profile Completion</span>
                  <span className="font-medium">{getProfileCompletion()}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-primary-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${getProfileCompletion()}%` }}
                  ></div>
                </div>
              </div>

              {/* Next Steps */}
              <div className={`p-4 rounded-lg ${
                nextStep.title.includes('Complete') 
                  ? 'bg-primary-50 border border-primary-200' 
                  : 'bg-green-50 border border-green-200'
              }`}>
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium text-gray-900">{nextStep.title}</h3>
                    <p className="text-sm text-gray-600 mt-1">{nextStep.description}</p>
                  </div>
                  <button
                    onClick={nextStep.action}
                    className="flex items-center px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition"
                  >
                    {nextStep.buttonText}
                    <ArrowRightIcon className="w-4 h-4 ml-2" />
                  </button>
                </div>
              </div>
            </div>

            {/* Quick Stats */}
            {profile && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {user?.user_type === 'clinic' && (
                  <>
                    <div className="bg-white rounded-xl shadow-lg p-6">
                      <h3 className="text-lg font-medium text-gray-900 mb-2">Clinic Details</h3>
                      <p className="text-3xl font-bold text-primary-600">
                        {profile.number_of_doctors || 0}
                      </p>
                      <p className="text-gray-500">Doctors</p>
                    </div>
                    <div className="bg-white rounded-xl shadow-lg p-6">
                      <h3 className="text-lg font-medium text-gray-900 mb-2">Services</h3>
                      <p className="text-gray-600">
                        {profile.services 
                          ? profile.services.split(',').length 
                          : 0} services
                      </p>
                    </div>
                  </>
                )}

                {user?.user_type === 'job_seeker' && (
                  <>
                    <div className="bg-white rounded-xl shadow-lg p-6">
                      <h3 className="text-lg font-medium text-gray-900 mb-2">Experience</h3>
                      <p className="text-3xl font-bold text-primary-600">
                        {profile.experience_years || 0}
                      </p>
                      <p className="text-gray-500">Years</p>
                    </div>
                    <div className="bg-white rounded-xl shadow-lg p-6">
                      <h3 className="text-lg font-medium text-gray-900 mb-2">Profession</h3>
                      <p className="text-gray-600">{profile.profession || 'Not specified'}</p>
                    </div>
                  </>
                )}
              </div>
            )}
          </div>

          {/* Right Column - Actions */}
          <div className="space-y-8">
            {/* Quick Actions */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
              <div className="space-y-3">
                <button
                  onClick={() => navigate('/profile')}
                  className="w-full flex items-center justify-between p-3 text-left rounded-lg hover:bg-gray-50 transition"
                >
                  <span className="text-gray-700">View Profile</span>
                  <ArrowRightIcon className="w-5 h-5 text-gray-400" />
                </button>
                
                <button
                  onClick={() => navigate('/profile/edit')}
                  className="w-full flex items-center justify-between p-3 text-left rounded-lg hover:bg-gray-50 transition"
                >
                  <span className="text-gray-700">Edit Profile</span>
                  <ArrowRightIcon className="w-5 h-5 text-gray-400" />
                </button>
                
                {user?.user_type === 'job_seeker' && (
                  <button
                    onClick={() => navigate('/jobs')}
                    className="w-full flex items-center justify-between p-3 text-left rounded-lg hover:bg-gray-50 transition"
                  >
                    <span className="text-gray-700">Browse Jobs</span>
                    <ArrowRightIcon className="w-5 h-5 text-gray-400" />
                  </button>
                )}
                
                {user?.user_type === 'employer' && (
                  <button
                    onClick={() => navigate('/post-job')}
                    className="w-full flex items-center justify-between p-3 text-left rounded-lg hover:bg-gray-50 transition"
                  >
                    <span className="text-gray-700">Post a Job</span>
                    <ArrowRightIcon className="w-5 h-5 text-gray-400" />
                  </button>
                )}
              </div>
            </div>

            {/* Recent Activity */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
              <div className="space-y-4">
                <div className="flex items-start">
                  {profile ? (
                    <CheckCircleIcon className="w-5 h-5 text-green-500 mr-3 mt-0.5" />
                  ) : (
                    <ExclamationCircleIcon className="w-5 h-5 text-yellow-500 mr-3 mt-0.5" />
                  )}
                  <div>
                    <p className="text-sm text-gray-900">
                      {profile ? 'Profile completed' : 'Profile setup pending'}
                    </p>
                    <p className="text-xs text-gray-500">
                      {profile ? 'Your profile is live' : 'Complete your profile to get started'}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <CheckCircleIcon className="w-5 h-5 text-green-500 mr-3 mt-0.5" />
                  <div>
                    <p className="text-sm text-gray-900">Account created</p>
                    <p className="text-xs text-gray-500">
                      {new Date(user?.date_joined).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;