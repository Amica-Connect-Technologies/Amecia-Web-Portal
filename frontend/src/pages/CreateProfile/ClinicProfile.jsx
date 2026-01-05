import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import FormInput from '../../components/Common/FormInput';
import Alert from '../../components/Common/Alert';
import LoadingSpinner from '../../components/Common/LoadingSpinner';
import { profileAPI } from '../../services/api';
import { BuildingOfficeIcon } from '@heroicons/react/24/outline';
import { ArrowUpTrayIcon } from '@heroicons/react/24/outline';


const ClinicProfile = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [logoPreview, setLogoPreview] = useState(null);
  const [logoFile, setLogoFile] = useState(null);
  const [licenseFile, setLicenseFile] = useState(null);
  
  const [formData, setFormData] = useState({
    clinic_name: '',
    clinic_type: '',
    address: '',
    phone: '',
    description: '',
    license_number: '',
    established_date: '',
    number_of_doctors: '',
    services: '',
    website: '',
  });

  const clinicTypes = [
    'Dental Clinic',
    'Medical Clinic',
    'Veterinary Clinic',
    'Eye Clinic',
    'Physical Therapy',
    'Mental Health',
    'Specialty Clinic',
    'General Practice',
    'Other',
  ];

  const handleChange = (e) => {
    const { name, value, type, files } = e.target;
    
    if (type === 'file') {
      const file = files[0];
      if (name === 'logo') {
        setLogoFile(file);
        // Create preview
        if (file) {
          const reader = new FileReader();
          reader.onloadend = () => {
            setLogoPreview(reader.result);
          };
          reader.readAsDataURL(file);
        } else {
          setLogoPreview(null);
        }
      } else if (name === 'license_document') {
        setLicenseFile(file);
      }
    } else {
      setFormData({
        ...formData,
        [name]: value,
      });
    }
    
    // Clear error for this field
    if (errors[name]) {
      setErrors({ ...errors, [name]: '' });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrors({});
    
    try {
      // Create FormData object for multipart/form-data
      const formDataObj = new FormData();
      
      // Append all form fields
      Object.keys(formData).forEach(key => {
        if (formData[key] !== null && formData[key] !== '') {
          formDataObj.append(key, formData[key]);
        }
      });
      
      // Append files if they exist
      if (logoFile) {
        formDataObj.append('logo', logoFile);
      }
      
      if (licenseFile) {
        formDataObj.append('license_document', licenseFile);
      }
      
      // For debugging - log FormData contents
      for (let pair of formDataObj.entries()) {
        console.log(pair[0] + ': ' + pair[1]);
      }
      
      const response = await profileAPI.createProfile(formDataObj);
      
      if (response.status === 201) {
        navigate('/dashboard', { 
          state: { message: 'Profile created successfully!' }
        });
      }
    } catch (error) {
      console.error('Profile creation error:', error);
      if (error.response?.data) {
        setErrors(error.response.data);
      } else {
        setErrors({ form: 'Failed to create profile. Please try again.' });
      }
    } finally {
      setLoading(false);
    }
  };

  // Rest of your component JSX remains the same...
  // Make sure the form has proper enctype
  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <div className="mx-auto w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
            <BuildingOfficeIcon className="w-8 h-8 text-blue-600" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900">Complete Your Clinic Profile</h1>
          <p className="mt-2 text-gray-600">
            Provide your clinic details to get started on Arnica Connect
          </p>
        </div>

        {errors.form && (
          <Alert type="error" message={errors.form} className="mb-6" />
        )}

        {/* Make sure form has proper enctype */}
        <form onSubmit={handleSubmit} encType="multipart/form-data">
          <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6 pb-3 border-b">
              Basic Information
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormInput
                label="Clinic Name"
                name="clinic_name"
                placeholder="e.g., City Dental Center"
                value={formData.clinic_name}
                onChange={handleChange}
                error={errors.clinic_name}
                required
              />

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Clinic Type <span className="text-red-500">*</span>
                </label>
                <select
                  name="clinic_type"
                  value={formData.clinic_type}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">Select clinic type</option>
                  {clinicTypes.map(type => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
                {errors.clinic_type && (
                  <p className="mt-1 text-sm text-red-600">{errors.clinic_type}</p>
                )}
              </div>

              <div className="md:col-span-2">
                <FormInput
                  label="Address"
                  name="address"
                  placeholder="Street, City, State, ZIP Code"
                  value={formData.address}
                  onChange={handleChange}
                  error={errors.address}
                  required
                />
              </div>

              <FormInput
                label="Phone Number"
                name="phone"
                type="tel"
                placeholder="+1 (555) 123-4567"
                value={formData.phone}
                onChange={handleChange}
                error={errors.phone}
                required
              />

              <FormInput
                label="Website"
                name="website"
                type="url"
                placeholder="https://yourclinic.com"
                value={formData.website}
                onChange={handleChange}
                error={errors.website}
              />
            </div>

            <div className="mt-6">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Description
              </label>
              <textarea
                name="description"
                rows={4}
                value={formData.description}
                onChange={handleChange}
                placeholder="Tell us about your clinic, services, specialties..."
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
              {errors.description && (
                <p className="mt-1 text-sm text-red-600">{errors.description}</p>
              )}
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6 pb-3 border-b">
              Business Details
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormInput
                label="License Number"
                name="license_number"
                placeholder="e.g., MED123456"
                value={formData.license_number}
                onChange={handleChange}
                error={errors.license_number}
              />

              <FormInput
                label="Established Date"
                name="established_date"
                type="date"
                value={formData.established_date}
                onChange={handleChange}
                error={errors.established_date}
              />

              <FormInput
                label="Number of Doctors"
                name="number_of_doctors"
                type="number"
                min="0"
                placeholder="0"
                value={formData.number_of_doctors}
                onChange={handleChange}
                error={errors.number_of_doctors}
              />
            </div>

            <div className="mt-6">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Services Offered
              </label>
              <textarea
                name="services"
                rows={3}
                value={formData.services}
                onChange={handleChange}
                placeholder="List your services separated by commas (e.g., General Dentistry, Orthodontics, Cleaning)"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
              <p className="mt-1 text-sm text-gray-500">
                Separate services with commas
              </p>
              {errors.services && (
                <p className="mt-1 text-sm text-red-600">{errors.services}</p>
              )}
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6 pb-3 border-b">
              Documents & Media
            </h2>
            
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Clinic Logo
                </label>
                <div className="flex items-center space-x-6">
                  <div className="flex-1">
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-400 transition">
                      <input
                        type="file"
                        name="logo"
                        id="logo"
                        accept="image/*"
                        onChange={handleChange}
                        className="hidden"
                      />
                      <label htmlFor="logo" className="cursor-pointer">
                        <ArrowUpTrayIcon className="mx-auto h-12 w-12 text-gray-400" />
                        <p className="mt-2 text-sm text-gray-600">
                          Click to upload logo
                        </p>
                        <p className="text-xs text-gray-500">
                          PNG, JPG, GIF up to 5MB
                        </p>
                      </label>
                    </div>
                    {errors.logo && (
                      <p className="mt-1 text-sm text-red-600">{errors.logo}</p>
                    )}
                  </div>
                  
                  {logoPreview && (
                    <div className="flex-shrink-0">
                      <div className="w-32 h-32 border rounded-lg overflow-hidden">
                        <img
                          src={logoPreview}
                          alt="Logo preview"
                          className="w-full h-full object-cover"
                        />
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  License Document (Optional)
                </label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-400 transition">
                  <input
                    type="file"
                    name="license_document"
                    id="license_document"
                    accept=".pdf,.doc,.docx,.jpg,.png"
                    onChange={handleChange}
                    className="hidden"
                  />
                  <label htmlFor="license_document" className="cursor-pointer">
                    <ArrowUpTrayIcon className="mx-auto h-12 w-12 text-gray-400" />
                    <p className="mt-2 text-sm text-gray-600">
                      Upload license document
                    </p>
                    <p className="text-xs text-gray-500">
                      PDF, DOC, JPG, PNG up to 10MB
                    </p>
                  </label>
                </div>
                {errors.license_document && (
                  <p className="mt-1 text-sm text-red-600">{errors.license_document}</p>
                )}
              </div>
            </div>
          </div>

          <div className="flex justify-end space-x-4 pt-6">
            <button
              type="button"
              onClick={() => navigate('/dashboard')}
              className="px-6 py-3 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition"
            >
              Skip for now
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition flex items-center"
            >
              {loading ? (
                <>
                  <LoadingSpinner size="sm" className="mr-2" />
                  Creating Profile...
                </>
              ) : (
                'Complete Profile'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ClinicProfile;