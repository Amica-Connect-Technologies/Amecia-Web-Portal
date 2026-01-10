// EmployerProfileEdit.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
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
  BriefcaseIcon,
  UsersIcon,
  ArrowLeftIcon,
  CameraIcon,
  XMarkIcon
} from '@heroicons/react/24/outline';

const EmployerProfileEdit = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  
  // Get profile data from navigation state or fetch it
  const [initialProfile, setInitialProfile] = useState(location.state?.profile || null);
  
  const [formData, setFormData] = useState({
    company_name: '',
    contact_person: '',
    phone: '',
    address: '',
    industry: '',
    company_size: '',
    website: '',
    description: '',
    company_logo: null,
  });

  const [logoPreview, setLogoPreview] = useState('');
  const [loading, setLoading] = useState(!initialProfile);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  // Fetch profile if not passed in state
  useEffect(() => {
    if (!initialProfile) {
      fetchProfile();
    } else {
      populateForm(initialProfile);
      setLoading(false);
    }
  }, []);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const profileData = await profileAPI.getProfile();
      if (profileData) {
        setInitialProfile(profileData);
        populateForm(profileData);
      } else {
        navigate('/employer/profile/create');
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

  const populateForm = (profile) => {
    setFormData({
      company_name: profile.company_name || '',
      contact_person: profile.contact_person || '',
      phone: profile.phone || '',
      address: profile.address || '',
      industry: profile.industry || '',
      company_size: profile.company_size || '',
      website: profile.website || '',
      description: profile.description || '',
      company_logo: null, // Keep as null, we'll handle preview separately
    });
    
    if (profile.company_logo) {
      setLogoPreview(profile.company_logo);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        setError('File size must be less than 5MB');
        return;
      }
      
      setFormData(prev => ({
        ...prev,
        company_logo: file
      }));
      
      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setLogoPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeLogo = () => {
    setFormData(prev => ({
      ...prev,
      company_logo: null
    }));
    setLogoPreview('');
  };

  const industryOptions = [
    'Medical Equipment',
    'Healthcare',
    'Technology',
    'Finance',
    'Education',
    'Manufacturing',
    'Retail',
    'Hospitality',
    'Construction',
    'Transportation',
    'Other'
  ];

  const companySizeOptions = [
    '1-10 employees',
    '11-50 employees',
    '51-200 employees',
    '201-500 employees',
    '501-1000 employees',
    '1000+ employees'
  ];

  const validateForm = () => {
    if (!formData.company_name.trim()) {
      setError('Company name is required');
      return false;
    }
    if (!formData.contact_person.trim()) {
      setError('Contact person is required');
      return false;
    }
    if (!formData.phone.trim()) {
      setError('Phone number is required');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setSaving(true);
    setError('');
    setSuccessMessage('');

    try {
      const formDataToSend = new FormData();
      
      // Append all form fields
      Object.keys(formData).forEach(key => {
        if (formData[key] !== null && formData[key] !== '') {
          formDataToSend.append(key, formData[key]);
        }
      });

      console.log('Submitting form data:', Object.fromEntries(formDataToSend));
      
      let response;
      if (initialProfile) {
        // Update existing profile
        response = await profileAPI.updateProfile(formDataToSend);
        setSuccessMessage('Profile updated successfully!');
      } else {
        // Create new profile
        response = await profileAPI.createProfile(formDataToSend);
        setSuccessMessage('Profile created successfully!');
      }

      console.log('Profile save response:', response.data);

      // Redirect back to view page after successful save
      setTimeout(() => {
        navigate('/employer/profile');
      }, 1500);

    } catch (error) {
      console.error('Error saving profile:', error.response || error);
      const errorMessage = error.response?.data?.message || 
                          error.response?.data?.detail || 
                          'Failed to save profile. Please try again.';
      setError(errorMessage);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <LoadingSpinner size="lg" />
          <p className="mt-4 text-gray-600">Loading profile data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => navigate('/employer/profile')}
            className="inline-flex items-center text-gray-600 hover:text-gray-900 mb-6"
          >
            <ArrowLeftIcon className="w-4 h-4 mr-2" />
            Back to Profile
          </button>
          
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                {initialProfile ? 'Edit Profile' : 'Create Profile'}
              </h1>
              <p className="mt-2 text-gray-600">
                {initialProfile 
                  ? 'Update your company information below'
                  : 'Fill in your company information to create your profile'}
              </p>
            </div>
            
            <div className="flex items-center">
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                {initialProfile ? 'Editing' : 'Creating New'}
              </span>
            </div>
          </div>
        </div>

        {/* Success Alert */}
        {successMessage && (
          <Alert 
            type="success" 
            message={successMessage} 
            className="mb-6"
            onClose={() => setSuccessMessage('')}
          />
        )}

        {/* Error Alert */}
        {error && (
          <Alert 
            type="error" 
            message={error} 
            className="mb-6"
            onClose={() => setError('')}
          />
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Company Logo Section */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Company Logo</h3>
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
              <div className="flex-shrink-0">
                {logoPreview ? (
                  <div className="relative">
                    <img
                      src={logoPreview}
                      alt="Company logo preview"
                      className="w-32 h-32 rounded-xl object-cover border-2 border-gray-200"
                    />
                    <button
                      type="button"
                      onClick={removeLogo}
                      className="absolute -top-2 -right-2 w-8 h-8 bg-red-100 text-red-600 rounded-full flex items-center justify-center hover:bg-red-200 transition"
                    >
                      <XMarkIcon className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <div className="w-32 h-32 bg-gray-100 rounded-xl border-2 border-dashed border-gray-300 flex flex-col items-center justify-center">
                    <CameraIcon className="w-8 h-8 text-gray-400 mb-2" />
                    <span className="text-sm text-gray-500">No logo</span>
                  </div>
                )}
              </div>
              
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Upload Company Logo
                </label>
                <p className="text-sm text-gray-500 mb-4">
                  Recommended: Square image, at least 400×400 pixels. Max file size: 5MB.
                </p>
                <div className="flex items-center">
                  <label className="px-4 py-2.5 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 cursor-pointer transition">
                    Choose File
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFileChange}
                      className="hidden"
                    />
                  </label>
                  <span className="ml-4 text-sm text-gray-500">
                    {formData.company_logo?.name || 'No file chosen'}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Company Information Section */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-6">Company Information</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Company Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Company Name *
                </label>
                <input
                  type="text"
                  name="company_name"
                  value={formData.company_name}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                  placeholder="Enter company name"
                />
              </div>

              {/* Contact Person */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Contact Person *
                </label>
                <input
                  type="text"
                  name="contact_person"
                  value={formData.contact_person}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                  placeholder="Enter contact person name"
                />
              </div>

              {/* Phone */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Phone Number *
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                  placeholder="+1 (555) 123-4567"
                />
              </div>

              {/* Website */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Website
                </label>
                <input
                  type="url"
                  name="website"
                  value={formData.website}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                  placeholder="https://example.com"
                />
              </div>

              {/* Industry */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Industry
                </label>
                <select
                  name="industry"
                  value={formData.industry}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                >
                  <option value="">Select industry</option>
                  {industryOptions.map((industry) => (
                    <option key={industry} value={industry}>
                      {industry}
                    </option>
                  ))}
                </select>
              </div>

              {/* Company Size */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Company Size
                </label>
                <select
                  name="company_size"
                  value={formData.company_size}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                >
                  <option value="">Select company size</option>
                  {companySizeOptions.map((size) => (
                    <option key={size} value={size}>
                      {size}
                    </option>
                  ))}
                </select>
              </div>

              {/* Address (full width) */}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Address
                </label>
                <input
                  type="text"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                  placeholder="Enter full company address"
                />
              </div>

              {/* Description (full width) */}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Company Description
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows={4}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition resize-none"
                  placeholder="Describe your company, mission, values, etc."
                />
                <p className="mt-2 text-sm text-gray-500">
                  Brief description of your company (max 500 characters)
                </p>
              </div>
            </div>
          </div>

          {/* Form Actions */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex flex-col sm:flex-row sm:justify-between gap-4">
              <div className="text-sm text-gray-500">
                <p className="font-medium">* Required fields</p>
                <p className="mt-1">Please fill all required fields before submitting</p>
              </div>
              
              <div className="flex space-x-4">
                <button
                  type="button"
                  onClick={() => navigate('/employer/profile')}
                  disabled={saving}
                  className="px-6 py-3 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 disabled:opacity-50 transition"
                >
                  Cancel
                </button>
                
                <button
                  type="submit"
                  disabled={saving}
                  className="px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 disabled:opacity-50 transition flex items-center"
                >
                  {saving ? (
                    <>
                      <LoadingSpinner size="sm" className="mr-2" />
                      {initialProfile ? 'Updating...' : 'Creating...'}
                    </>
                  ) : (
                    <>
                      {initialProfile ? 'Update Profile' : 'Create Profile'}
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EmployerProfileEdit;