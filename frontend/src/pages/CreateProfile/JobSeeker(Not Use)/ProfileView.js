import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { profileAPI } from '../../services/api';
import { 
  UserIcon, 
  AcademicCapIcon, 
  BriefcaseIcon,
  CalendarIcon,
  PhoneIcon,
  MapPinIcon,
  EnvelopeIcon,
  DocumentTextIcon,
  PencilIcon
} from '@heroicons/react/24/outline';
import LoadingSpinner from '../../components/Common/LoadingSpinner';
import Alert from '../../components/Common/Alert';

const ProfileView = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const response = await profileAPI.getProfile();
      setProfile(response);
    } catch (error) {
      console.error('Error fetching profile:', error);
      setError('Failed to load profile');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Not specified';
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

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Alert type="error" message={error} />
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-4xl mx-auto text-center">
          <div className="bg-white rounded-xl shadow-lg p-8">
            <UserIcon className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">No Profile Found</h2>
            <p className="text-gray-600 mb-6">You haven't created a profile yet.</p>
            <button
              onClick={() => navigate('/profile/create')}
              className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition"
            >
              Create Profile
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">My Profile</h1>
            <p className="text-gray-600 mt-2">View and manage your professional profile</p>
          </div>
          <button
            onClick={() => navigate('/profile/edit')}
            className="bg-white text-blue-600 px-4 py-2 rounded-lg border border-blue-600 hover:bg-blue-50 transition flex items-center"
          >
            <PencilIcon className="w-4 h-4 mr-2" />
            Edit Profile
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Personal Info & Documents */}
          <div className="lg:col-span-1 space-y-6">
            {/* Profile Card */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="text-center">
                {profile.profile_picture ? (
                  <img
                    src={profile.profile_picture}
                    alt="Profile"
                    className="w-32 h-32 rounded-full mx-auto mb-4 object-cover"
                  />
                ) : (
                  <div className="w-32 h-32 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <UserIcon className="w-16 h-16 text-blue-600" />
                  </div>
                )}
                <h2 className="text-xl font-bold text-gray-900">
                  {profile.first_name} {profile.last_name}
                </h2>
                <p className="text-blue-600 font-medium">{profile.profession}</p>
                <p className="text-gray-600 mt-2">{profile.experience_years} years of experience</p>
              </div>

              <div className="mt-6 space-y-4">
                <div className="flex items-center text-gray-600">
                  <EnvelopeIcon className="w-5 h-5 mr-3" />
                  <span>{user?.email}</span>
                </div>
                {profile.phone && (
                  <div className="flex items-center text-gray-600">
                    <PhoneIcon className="w-5 h-5 mr-3" />
                    <span>{profile.phone}</span>
                  </div>
                )}
                {profile.address && (
                  <div className="flex items-center text-gray-600">
                    <MapPinIcon className="w-5 h-5 mr-3" />
                    <span>{profile.address}</span>
                  </div>
                )}
                {profile.date_of_birth && (
                  <div className="flex items-center text-gray-600">
                    <CalendarIcon className="w-5 h-5 mr-3" />
                    <span>{formatDate(profile.date_of_birth)}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Documents Card */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Documents</h3>
              <div className="space-y-4">
                {profile.resume && (
                  <a
                    href={profile.resume}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50 transition"
                  >
                    <div className="flex items-center">
                      <DocumentTextIcon className="w-5 h-5 text-gray-400 mr-3" />
                      <span>Resume</span>
                    </div>
                    <span className="text-sm text-blue-600">View</span>
                  </a>
                )}
                {profile.certifications && (
                  <a
                    href={profile.certifications}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50 transition"
                  >
                    <div className="flex items-center">
                      <AcademicCapIcon className="w-5 h-5 text-gray-400 mr-3" />
                      <span>Certifications</span>
                    </div>
                    <span className="text-sm text-blue-600">View</span>
                  </a>
                )}
              </div>
            </div>
          </div>

          {/* Right Column - Professional Details */}
          <div className="lg:col-span-2 space-y-6">
            {/* Professional Information */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-6">Professional Information</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <h4 className="text-sm font-medium text-gray-500 mb-1">Profession</h4>
                  <p className="text-lg font-medium text-gray-900">{profile.profession}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-500 mb-1">Experience</h4>
                  <p className="text-lg font-medium text-gray-900">{profile.experience_years} years</p>
                </div>
              </div>

              {profile.education && (
                <div className="mb-6">
                  <h4 className="text-sm font-medium text-gray-500 mb-2 flex items-center">
                    <AcademicCapIcon className="w-4 h-4 mr-2" />
                    Education
                  </h4>
                  <p className="text-gray-700 whitespace-pre-line">{profile.education}</p>
                </div>
              )}

              {profile.skills && (
                <div>
                  <h4 className="text-sm font-medium text-gray-500 mb-2 flex items-center">
                    <BriefcaseIcon className="w-4 h-4 mr-2" />
                    Skills
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {profile.skills.split(',').map((skill, index) => (
                      <span
                        key={index}
                        className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
                      >
                        {skill.trim()}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Recent Applications (Optional) */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-semibold text-gray-900">Recent Applications</h3>
                <button
                  onClick={() => navigate('/jobs')}
                  className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                >
                  View All
                </button>
              </div>
              <p className="text-gray-600 text-center py-4">
                No applications yet. <button
                  onClick={() => navigate('/jobs')}
                  className="text-blue-600 hover:text-blue-800 font-medium"
                >
                  Browse jobs
                </button> to get started.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileView;