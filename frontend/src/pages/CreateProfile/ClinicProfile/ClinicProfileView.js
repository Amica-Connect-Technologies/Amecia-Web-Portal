import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { profileAPI } from '../../../services/api';
import { useAuth } from '../../../context/AuthContext';
import LoadingSpinner from '../../../components/Common/LoadingSpinner';
import Alert from '../../../components/Common/Alert';
import {
  BuildingOfficeIcon,
  MapPinIcon,
  PhoneIcon,
  CalendarIcon,
  UsersIcon,
  GlobeAltIcon,
  DocumentIcon,
  PencilIcon,
  ArrowLeftIcon,
  CurrencyDollarIcon,
  UserIcon,
  StarIcon,
  EnvelopeIcon,
  IdentificationIcon,
  CheckBadgeIcon,
  ClockIcon,
  LinkIcon,
  PhotoIcon,
} from '@heroicons/react/24/outline';

const ClinicProfileView = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      setError('');
      const response = await profileAPI.getProfile();
      let profileData;

      if (response?.data) {
        profileData = response.data;
      } else if (response) {
        profileData = response;
      }

      if (profileData && Object.keys(profileData).length > 0) {
        const hasClinicFields = profileData.clinic_name || profileData.clinic_type || profileData.address;
        if (hasClinicFields) {
          setProfile(profileData);
        } else {
          setError('Profile found but missing clinic information. Please edit your profile.');
        }
      } else {
        setError('No clinic profile found. Please create your clinic profile.');
      }
    } catch (err) {
      console.error('Error:', err);
      if (err.response?.status === 404) {
        setError('Profile not found. Please create your clinic profile.');
      } else if (err.message?.includes('Network Error')) {
        setError('Network error. Please check your connection.');
      } else {
        setError('Failed to load profile. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleEditProfile = () => navigate('/clinic/profile/edit');
  const handleRetry = () => fetchProfile();

  // Helper functions
  const getLogoUrl = () => {
    if (profile?.logo) {
      return profile.logo.startsWith('http') ? profile.logo : `http://127.0.0.1:8000${profile.logo}`;
    }
    return null;
  };

  const getLicenseUrl = () => {
    if (profile?.license_document) {
      return profile.license_document.startsWith('http') 
        ? profile.license_document 
        : `http://127.0.0.1:8000${profile.license_document}`;
    }
    return null;
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Not specified';
    try {
      return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    } catch {
      return dateString;
    }
  };

  // Icon mapping for different field types
  const fieldIcons = {
    clinic_name: BuildingOfficeIcon,
    clinic_type: IdentificationIcon,
    address: MapPinIcon,
    phone: PhoneIcon,
    email: EnvelopeIcon,
    website: GlobeAltIcon,
    established_date: CalendarIcon,
    license_number: DocumentIcon,
    contact_person: UserIcon,
    consultation_fee: CurrencyDollarIcon,
    specialties: StarIcon,
    operating_hours: ClockIcon,
    facilities: CheckBadgeIcon,
  };

  // Organize fields into logical groups
  const fieldGroups = {
    basic: ['clinic_name', 'clinic_type', 'contact_person', 'established_date'],
    contact: ['address', 'phone', 'email', 'website'],
    professional: ['license_number', 'specialties', 'consultation_fee'],
    additional: ['operating_hours', 'facilities', 'description'],
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <LoadingSpinner size="lg" />
          <p className="mt-4 text-gray-600">Loading clinic profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => navigate('/dashboard')}
            className="inline-flex items-center text-gray-600 hover:text-gray-900 transition-colors mb-6 group"
          >
            <ArrowLeftIcon className="w-5 h-5 mr-2 group-hover:-translate-x-1 transition-transform" />
            Back to Dashboard
          </button>
          
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Clinic Profile</h1>
              <p className="mt-1 text-gray-600">
                Manage your clinic's public information and settings
              </p>
            </div>
            {profile && (
              <button
                onClick={handleEditProfile}
                className="flex items-center px-5 py-2.5 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all shadow-lg hover:shadow-xl active:scale-[0.98]"
              >
                <PencilIcon className="w-5 h-5 mr-2" />
                Edit Profile
              </button>
            )}
          </div>
        </div>

        {error && !profile ? (
          <div className="text-center py-16 bg-white rounded-2xl shadow-sm">
            <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-to-r from-blue-100 to-indigo-100 flex items-center justify-center">
              <BuildingOfficeIcon className="w-10 h-10 text-blue-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No Clinic Profile Found</h3>
            <p className="text-gray-600 mb-6 max-w-md mx-auto">{error}</p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <button
                onClick={handleRetry}
                className="px-6 py-2.5 border-2 border-gray-300 rounded-xl text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Retry Loading
              </button>
              <button
                onClick={() => navigate('/create/profile/clinic')}
                className="px-6 py-2.5 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all shadow-lg"
              >
                Create Clinic Profile
              </button>
            </div>
          </div>
        ) : profile ? (
          <div className="space-y-8">
            {/* Clinic Profile Header */}
            <div className="bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-800 rounded-2xl shadow-2xl overflow-hidden">
              <div className="p-8">
                <div className="flex flex-col lg:flex-row items-center lg:items-start gap-8">
                  {/* Logo Section */}
                  <div className="relative">
                    <div className="w-32 h-32 bg-white/20 backdrop-blur-sm rounded-2xl border-2 border-white/30 overflow-hidden shadow-2xl">
                      {getLogoUrl() ? (
                        <img 
                          src={getLogoUrl()} 
                          alt={`${profile.clinic_name || 'Clinic'} Logo`}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            e.target.style.display = 'none';
                            e.target.parentElement.className = 'w-32 h-32 bg-white/20 backdrop-blur-sm rounded-2xl border-2 border-white/30 flex items-center justify-center';
                          }}
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <PhotoIcon className="w-16 h-16 text-white/80" />
                        </div>
                      )}
                    </div>
                    {profile.is_verified && (
                      <div className="absolute -bottom-2 -right-2 bg-green-500 text-white px-3 py-1 rounded-full text-xs font-semibold flex items-center shadow-lg">
                        <CheckBadgeIcon className="w-4 h-4 mr-1" />
                        Verified
                      </div>
                    )}
                  </div>

                  {/* Clinic Info */}
                  <div className="flex-1 text-center lg:text-left">
                    <div className="inline-flex items-center px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full mb-4">
                      <span className="text-white/90 text-sm font-medium">
                        {profile.clinic_type || ''}
                      </span>
                    </div>
                    <h1 className="text-4xl font-bold text-white mb-3">{profile.clinic_name}</h1>
                    <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 text-white/90">
                      {profile.address && (
                        <div className="flex items-center">
                          <MapPinIcon className="w-5 h-5 mr-2" />
                          <span>{profile.address}</span>
                        </div>
                      )}
                      {profile.phone && (
                        <div className="flex items-center">
                          <PhoneIcon className="w-5 h-5 mr-2" />
                          <span>{profile.phone}</span>
                        </div>
                      )}
                      {profile.established_date && (
                        <div className="flex items-center">
                          <CalendarIcon className="w-5 h-5 mr-2" />
                          <span>Est. {formatDate(profile.established_date)}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Main Content */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Left Column - Key Information */}
              <div className="lg:col-span-2 space-y-8">
                {/* Tabs */}
                <div className="bg-white rounded-2xl shadow-lg">
                  <div className="border-b border-gray-200">
                    <nav className="flex space-x-1 p-2" aria-label="Tabs">
                      {['overview', 'contact', 'professional'].map((tab) => (
                        <button
                          key={tab}
                          onClick={() => setActiveTab(tab)}
                          className={`px-6 py-3 rounded-lg text-sm font-medium transition-all ${
                            activeTab === tab
                              ? 'bg-blue-50 text-blue-700 border-b-2 border-blue-600'
                              : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                          }`}
                        >
                          {tab.charAt(0).toUpperCase() + tab.slice(1)}
                        </button>
                      ))}
                    </nav>
                  </div>

                  {/* Tab Content */}
                  <div className="p-6">
                    {activeTab === 'overview' && (
                      <div className="space-y-6">
                        {fieldGroups.basic.map((field) => (
                          profile[field] && (
                            <div key={field} className="flex items-start p-4 hover:bg-gray-50 rounded-xl transition-colors">
                              <div className="flex-shrink-0 w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center mr-4">
                                {React.createElement(fieldIcons[field] || DocumentIcon, {
                                  className: "w-6 h-6 text-blue-600"
                                })}
                              </div>
                              <div className="flex-1">
                                <h3 className="text-sm font-medium text-gray-500 capitalize mb-1">
                                  {field.replace(/_/g, ' ')}
                                </h3>
                                <p className="text-gray-900 font-medium">
                                  {field === 'established_date' ? formatDate(profile[field]) : profile[field]}
                                </p>
                              </div>
                            </div>
                          )
                        ))}
                      </div>
                    )}

                    {activeTab === 'contact' && (
                      <div className="space-y-6">
                        {fieldGroups.contact.map((field) => (
                          profile[field] && (
                            <div key={field} className="flex items-start p-4 hover:bg-gray-50 rounded-xl transition-colors">
                              <div className="flex-shrink-0 w-10 h-10 bg-green-50 rounded-lg flex items-center justify-center mr-4">
                                {React.createElement(fieldIcons[field] || GlobeAltIcon, {
                                  className: "w-6 h-6 text-green-600"
                                })}
                              </div>
                              <div className="flex-1">
                                <h3 className="text-sm font-medium text-gray-500 capitalize mb-1">
                                  {field.replace(/_/g, ' ')}
                                </h3>
                                <p className="text-gray-900 font-medium">
                                  {profile[field]}
                                </p>
                              </div>
                            </div>
                          )
                        ))}
                      </div>
                    )}

                    {activeTab === 'professional' && (
                      <div className="space-y-6">
                        {fieldGroups.professional.map((field) => (
                          profile[field] && (
                            <div key={field} className="flex items-start p-4 hover:bg-gray-50 rounded-xl transition-colors">
                              <div className="flex-shrink-0 w-10 h-10 bg-purple-50 rounded-lg flex items-center justify-center mr-4">
                                {React.createElement(fieldIcons[field] || StarIcon, {
                                  className: "w-6 h-6 text-purple-600"
                                })}
                              </div>
                              <div className="flex-1">
                                <h3 className="text-sm font-medium text-gray-500 capitalize mb-1">
                                  {field.replace(/_/g, ' ')}
                                </h3>
                                <p className="text-gray-900 font-medium">
                                  {field === 'consultation_fee' ? `$${profile[field]}` : profile[field]}
                                </p>
                              </div>
                            </div>
                          )
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                {/* Additional Information */}
                {fieldGroups.additional.some(field => profile[field]) && (
                  <div className="bg-white rounded-2xl shadow-lg p-6">
                    <h2 className="text-lg font-semibold text-gray-900 mb-4">Additional Information</h2>
                    <div className="space-y-4">
                      {fieldGroups.additional.map((field) => (
                        profile[field] && (
                          <div key={field}>
                            <h3 className="text-sm font-medium text-gray-700 mb-2 capitalize">
                              {field.replace(/_/g, ' ')}
                            </h3>
                            <p className="text-gray-600 bg-gray-50 p-4 rounded-lg">
                              {profile[field]}
                            </p>
                          </div>
                        )
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Right Column - Documents & Actions */}
              <div className="space-y-8">
                {/* License Document */}
                {getLicenseUrl() && (
                  <div className="bg-white rounded-2xl shadow-lg p-6">
                    <div className="flex items-center mb-4">
                      <DocumentIcon className="w-6 h-6 text-gray-700 mr-3" />
                      <h3 className="text-lg font-semibold text-gray-900">License Document</h3>
                    </div>
                    <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-4 border-2 border-dashed border-blue-200">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center">
                          <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center mr-3">
                            <DocumentIcon className="w-6 h-6 text-blue-600" />
                          </div>
                          <div>
                            <p className="font-medium text-gray-900">Medical License</p>
                            <p className="text-sm text-gray-500">Valid until {formatDate(profile.license_expiry)}</p>
                          </div>
                        </div>
                      </div>
                      <a
                        href={getLicenseUrl()}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center text-blue-600 hover:text-blue-800 font-medium"
                      >
                        <LinkIcon className="w-4 h-4 mr-2" />
                        View Document
                      </a>
                    </div>
                  </div>
                )}

                {/* Quick Stats */}
                <div className="bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl shadow-lg p-6 text-white">
                  <h3 className="text-lg font-semibold mb-4">Profile Status</h3>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-blue-100">Profile Completion</span>
                      <span className="font-bold">85%</span>
                    </div>
                    <div className="w-full bg-white/20 rounded-full h-2">
                      <div className="bg-white h-2 rounded-full w-4/5"></div>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-blue-100">Last Updated</span>
                      <span className="font-medium">{formatDate(profile.updated_at)}</span>
                    </div>
                  </div>
                </div>

                {/* Quick Actions */}
                <div className="bg-white rounded-2xl shadow-lg p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
                  <div className="space-y-3">
                    <button
                      onClick={() => navigate('/dashboard')}
                      className="w-full flex items-center justify-between p-3 text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
                    >
                      <span>View Dashboard</span>
                      <ArrowLeftIcon className="w-5 h-5" />
                    </button>
                    <button
                      onClick={handleEditProfile}
                      className="w-full flex items-center justify-between p-3 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                    >
                      <span>Edit Profile</span>
                      <PencilIcon className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => window.print()}
                      className="w-full flex items-center justify-between p-3 text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
                    >
                      <span>Print Profile</span>
                      <DocumentIcon className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
};

export default ClinicProfileView;