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
  GlobeAltIcon,
  DocumentIcon,
  ArrowLeftIcon,
  CurrencyDollarIcon,
  UserIcon,
  StarIcon,
  EnvelopeIcon,
  IdentificationIcon,
  ClockIcon,
  PhotoIcon,
  XMarkIcon,
  CloudArrowUpIcon,
  CheckCircleIcon,
  ExclamationCircleIcon,
} from '@heroicons/react/24/outline';

const ClinicProfileEdit = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [profile, setProfile] = useState(null);
  const [logoFile, setLogoFile] = useState(null);
  const [logoPreview, setLogoPreview] = useState(null);
  const [licenseFile, setLicenseFile] = useState(null);

  // Clinic types based on your field structure
  const clinicTypes = [
    'General Clinic',
    'Specialist Clinic',
    'Dental Clinic',
    'Medical Center',
    'Hospital',
    'Other'
  ];

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
        setProfile(profileData);
        
        // Set logo preview if exists
        if (profileData.logo) {
          const logoUrl = profileData.logo.startsWith('http') 
            ? profileData.logo 
            : `http://127.0.0.1:8000${profileData.logo}`;
          setLogoPreview(logoUrl);
        }
      } else {
        setError('No clinic profile found.');
      }
    } catch (err) {
      console.error('Error fetching profile:', err);
      setError('Failed to load profile. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfile(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleLogoChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      setError('Logo file size should be less than 5MB');
      return;
    }

    if (!file.type.startsWith('image/')) {
      setError('Please upload an image file');
      return;
    }

    setLogoFile(file);
    const reader = new FileReader();
    reader.onloadend = () => {
      setLogoPreview(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const handleLicenseChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.size > 10 * 1024 * 1024) {
      setError('License file size should be less than 10MB');
      return;
    }

    const allowedTypes = ['application/pdf', 'image/jpeg', 'image/png', 'image/jpg'];
    if (!allowedTypes.includes(file.type)) {
      setError('Please upload a PDF or image file (JPEG, PNG)');
      return;
    }

    setLicenseFile(file);
  };

  const removeLogo = () => {
    setLogoFile(null);
    setLogoPreview(null);
    // Clear logo from profile
    setProfile(prev => ({ ...prev, logo: null }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    setSuccess('');

    try {
      const formData = new FormData();
      
      // Append all profile fields
      if (profile.clinic_name) formData.append('clinic_name', profile.clinic_name);
      if (profile.clinic_type) formData.append('clinic_type', profile.clinic_type);
      if (profile.address) formData.append('address', profile.address);
      if (profile.phone) formData.append('phone', profile.phone);
      if (profile.email) formData.append('email', profile.email);
      if (profile.website) formData.append('website', profile.website);
      if (profile.established_date) formData.append('established_date', profile.established_date);
      if (profile.license_number) formData.append('license_number', profile.license_number);
      if (profile.contact_person) formData.append('contact_person', profile.contact_person);
      if (profile.consultation_fee) formData.append('consultation_fee', profile.consultation_fee);
      if (profile.specialties) formData.append('specialties', profile.specialties);
      if (profile.operating_hours) formData.append('operating_hours', profile.operating_hours);
      if (profile.facilities) formData.append('facilities', profile.facilities);
      if (profile.description) formData.append('description', profile.description);

      // Append files if changed
      if (logoFile) {
        formData.append('logo', logoFile);
      }
      if (licenseFile) {
        formData.append('license_document', licenseFile);
      }

      const response = await profileAPI.updateProfile(formData);
      setSuccess('Profile updated successfully!');
      
      // Update profile with new data
      if (response.data) {
        setProfile(response.data);
      }

    } catch (err) {
      console.error('Error updating profile:', err);
      setError(err.response?.data?.message || 'Failed to update profile. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    navigate('/clinic/profile');
  };

  const formatDateForInput = (dateString) => {
    if (!dateString) return '';
    try {
      const date = new Date(dateString);
      return date.toISOString().split('T')[0];
    } catch {
      return dateString;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <Alert type="error" className="mb-4">
            {error || 'Profile not found'}
          </Alert>
          <button
            onClick={() => navigate('/clinic/profile')}
            className="inline-flex items-center text-gray-600 hover:text-gray-900"
          >
            <ArrowLeftIcon className="w-5 h-5 mr-2" />
            Back to Profile
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => navigate('/clinic/profile')}
            className="inline-flex items-center text-gray-600 hover:text-gray-900 mb-6"
          >
            <ArrowLeftIcon className="w-5 h-5 mr-2" />
            Back to Profile
          </button>
          
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Edit Clinic Profile</h1>
            <p className="mt-1 text-gray-600">
              Update your clinic information
            </p>
          </div>
        </div>

        {/* Success/Error Messages */}
        {success && (
          <Alert type="success" className="mb-6">
            <div className="flex items-center">
              <CheckCircleIcon className="w-5 h-5 mr-2" />
              {success}
            </div>
          </Alert>
        )}
        
        {error && (
          <Alert type="error" className="mb-6">
            <div className="flex items-center">
              <ExclamationCircleIcon className="w-5 h-5 mr-2" />
              {error}
            </div>
          </Alert>
        )}

        {/* Edit Form */}
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Logo Section */}
          <div className="bg-white rounded-xl shadow p-6">
            <div className="flex items-center mb-6">
              <PhotoIcon className="w-6 h-6 text-gray-700 mr-3" />
              <h2 className="text-xl font-semibold text-gray-900">Clinic Logo</h2>
            </div>
            
            <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
              {/* Logo Preview */}
              <div className="relative">
                <div className="w-32 h-32 border-2 border-dashed border-gray-300 rounded-xl overflow-hidden bg-gray-50 flex items-center justify-center">
                  {logoPreview ? (
                    <img 
                      src={logoPreview} 
                      alt="Logo preview" 
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="text-center p-4">
                      <PhotoIcon className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                      <p className="text-sm text-gray-500">No logo</p>
                    </div>
                  )}
                </div>
                {logoPreview && (
                  <button
                    type="button"
                    onClick={removeLogo}
                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                  >
                    <XMarkIcon className="w-4 h-4" />
                  </button>
                )}
              </div>

              {/* Logo Upload */}
              <div className="flex-1">
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Upload Logo
                  </label>
                  <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-xl hover:border-blue-400">
                    <div className="space-y-2 text-center">
                      <CloudArrowUpIcon className="mx-auto h-12 w-12 text-gray-400" />
                      <div className="flex text-sm text-gray-600">
                        <label className="relative cursor-pointer rounded-md font-medium text-blue-600 hover:text-blue-500">
                          <span>Upload a file</span>
                          <input
                            type="file"
                            className="sr-only"
                            accept="image/*"
                            onChange={handleLogoChange}
                          />
                        </label>
                        <p className="pl-1">or drag and drop</p>
                      </div>
                      <p className="text-xs text-gray-500">
                        PNG, JPG, GIF up to 5MB
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Basic Information */}
          <div className="bg-white rounded-xl shadow p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Basic Information</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Clinic Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Clinic Name
                </label>
                <div className="relative">
                  <input
                    type="text"
                    name="clinic_name"
                    value={profile.clinic_name || ''}
                    onChange={handleChange}
                    className="w-full px-4 py-3 pl-11 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  <BuildingOfficeIcon className="absolute left-3 top-3.5 w-5 h-5 text-gray-400" />
                </div>
              </div>

              {/* Clinic Type */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Clinic Type
                </label>
                <div className="relative">
                  <select
                    name="clinic_type"
                    value={profile.clinic_type || ''}
                    onChange={handleChange}
                    className="w-full px-4 py-3 pl-11 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">Select type</option>
                    {clinicTypes.map(type => (
                      <option key={type} value={type}>{type}</option>
                    ))}
                  </select>
                  <IdentificationIcon className="absolute left-3 top-3.5 w-5 h-5 text-gray-400" />
                </div>
              </div>

              {/* Contact Person */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Contact Person
                </label>
                <div className="relative">
                  <input
                    type="text"
                    name="contact_person"
                    value={profile.contact_person || ''}
                    onChange={handleChange}
                    className="w-full px-4 py-3 pl-11 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  <UserIcon className="absolute left-3 top-3.5 w-5 h-5 text-gray-400" />
                </div>
              </div>

              {/* Established Date */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Established Date
                </label>
                <div className="relative">
                  <input
                    type="date"
                    name="established_date"
                    value={formatDateForInput(profile.established_date)}
                    onChange={handleChange}
                    className="w-full px-4 py-3 pl-11 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  <CalendarIcon className="absolute left-3 top-3.5 w-5 h-5 text-gray-400" />
                </div>
              </div>
            </div>
          </div>

          {/* Contact Information */}
          <div className="bg-white rounded-xl shadow p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Contact Information</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Address */}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Address
                </label>
                <div className="relative">
                  <textarea
                    name="address"
                    value={profile.address || ''}
                    onChange={handleChange}
                    rows="3"
                    className="w-full px-4 py-3 pl-11 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  <MapPinIcon className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                </div>
              </div>

              {/* Phone */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Phone
                </label>
                <div className="relative">
                  <input
                    type="tel"
                    name="phone"
                    value={profile.phone || ''}
                    onChange={handleChange}
                    className="w-full px-4 py-3 pl-11 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  <PhoneIcon className="absolute left-3 top-3.5 w-5 h-5 text-gray-400" />
                </div>
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email
                </label>
                <div className="relative">
                  <input
                    type="email"
                    name="email"
                    value={profile.email || ''}
                    onChange={handleChange}
                    className="w-full px-4 py-3 pl-11 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  <EnvelopeIcon className="absolute left-3 top-3.5 w-5 h-5 text-gray-400" />
                </div>
              </div>

              {/* Website */}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Website
                </label>
                <div className="relative">
                  <input
                    type="url"
                    name="website"
                    value={profile.website || ''}
                    onChange={handleChange}
                    className="w-full px-4 py-3 pl-11 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="https://example.com"
                  />
                  <GlobeAltIcon className="absolute left-3 top-3.5 w-5 h-5 text-gray-400" />
                </div>
              </div>
            </div>
          </div>

          {/* Professional Information */}
          <div className="bg-white rounded-xl shadow p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Professional Information</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* License Number */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  License Number
                </label>
                <div className="relative">
                  <input
                    type="text"
                    name="license_number"
                    value={profile.license_number || ''}
                    onChange={handleChange}
                    className="w-full px-4 py-3 pl-11 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  <DocumentIcon className="absolute left-3 top-3.5 w-5 h-5 text-gray-400" />
                </div>
              </div>

              {/* Consultation Fee */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Consultation Fee
                </label>
                <div className="relative">
                  <input
                    type="number"
                    name="consultation_fee"
                    value={profile.consultation_fee || ''}
                    onChange={handleChange}
                    min="0"
                    step="0.01"
                    className="w-full px-4 py-3 pl-11 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  <CurrencyDollarIcon className="absolute left-3 top-3.5 w-5 h-5 text-gray-400" />
                </div>
              </div>

              {/* Specialties */}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Specialties
                </label>
                <div className="relative">
                  <input
                    type="text"
                    name="specialties"
                    value={profile.specialties || ''}
                    onChange={handleChange}
                    className="w-full px-4 py-3 pl-11 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Cardiology, Pediatrics, Orthopedics"
                  />
                  <StarIcon className="absolute left-3 top-3.5 w-5 h-5 text-gray-400" />
                </div>
              </div>

              {/* Operating Hours */}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Operating Hours
                </label>
                <div className="relative">
                  <textarea
                    name="operating_hours"
                    value={profile.operating_hours || ''}
                    onChange={handleChange}
                    rows="3"
                    className="w-full px-4 py-3 pl-11 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Mon-Fri: 9:00 AM - 6:00 PM\nSat: 9:00 AM - 1:00 PM\nSun: Closed"
                  />
                  <ClockIcon className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                </div>
              </div>
            </div>
          </div>

          {/* Additional Information */}
          <div className="bg-white rounded-xl shadow p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Additional Information</h2>
            
            {/* Facilities */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Facilities
              </label>
              <textarea
                name="facilities"
                value={profile.facilities || ''}
                onChange={handleChange}
                rows="3"
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="X-ray, Laboratory, Pharmacy, Ambulance service"
              />
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description
              </label>
              <textarea
                name="description"
                value={profile.description || ''}
                onChange={handleChange}
                rows="4"
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Tell patients about your clinic, services, and mission..."
              />
            </div>
          </div>

          {/* License Document */}
          <div className="bg-white rounded-xl shadow p-6">
            <div className="flex items-center mb-6">
              <DocumentIcon className="w-6 h-6 text-gray-700 mr-3" />
              <h2 className="text-xl font-semibold text-gray-900">License Document</h2>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {profile.license_document ? 'Update License Document' : 'Upload License Document'}
              </label>
              <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-xl hover:border-blue-400">
                <div className="space-y-2 text-center">
                  <CloudArrowUpIcon className="mx-auto h-12 w-12 text-gray-400" />
                  <div className="flex text-sm text-gray-600">
                    <label className="relative cursor-pointer rounded-md font-medium text-blue-600 hover:text-blue-500">
                      <span>Upload a file</span>
                      <input
                        type="file"
                        className="sr-only"
                        accept=".pdf,.jpg,.jpeg,.png"
                        onChange={handleLicenseChange}
                      />
                    </label>
                    <p className="pl-1">or drag and drop</p>
                  </div>
                  <p className="text-xs text-gray-500">
                    PDF, PNG, JPG up to 10MB
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Form Actions */}
          <div className="flex flex-col sm:flex-row justify-end gap-4 pt-6 border-t border-gray-200">
            <button
              type="button"
              onClick={handleCancel}
              className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
              disabled={saving}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
            >
              {saving ? (
                <>
                  <LoadingSpinner size="sm" className="mr-2" />
                  Saving...
                </>
              ) : (
                'Save Changes'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ClinicProfileEdit;