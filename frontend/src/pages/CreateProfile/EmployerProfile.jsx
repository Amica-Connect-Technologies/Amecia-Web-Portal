import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import FormInput from '../../components/Common/FormInput';
import Alert from '../../components/Common/Alert';
import LoadingSpinner from '../../components/Common/LoadingSpinner';
import { profileAPI } from '../../services/api';
import { BuildingOfficeIcon,  UserIcon } from '@heroicons/react/24/outline';

import { ArrowUpTrayIcon } from '@heroicons/react/24/outline';


const EmployerProfile = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [logoPreview, setLogoPreview] = useState(null);
  const [logoFile, setLogoFile] = useState(null);
  
  const [formData, setFormData] = useState({
    company_name: '',
    contact_person: '',
    phone: '',
    address: '',
    industry: '',
    company_size: '',
    website: '',
    description: '',
  });

  const companySizes = [
    '1-10 employees',
    '11-50 employees',
    '51-200 employees',
    '201-500 employees',
    '501-1000 employees',
    '1000+ employees'
  ];

  const industries = [
    'Healthcare',
    'Medical Equipment',
    'Pharmaceutical',
    'Biotechnology',
    'Healthcare IT',
    'Hospital',
    'Clinic',
    'Dental',
    'Nursing Home',
    'Medical Research',
    'Healthcare Consulting',
    'Insurance',
    'Other'
  ];

  const handleChange = (e) => {
    const { name, value, type, files } = e.target;
    
    if (type === 'file') {
      const file = files[0];
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
      
      // Append logo file if exists
      if (logoFile) {
        formDataObj.append('company_logo', logoFile);
      }
      
      const response = await profileAPI.createProfile(formDataObj);
      
      if (response.status === 201) {
        navigate('/dashboard', { 
          state: { message: 'Employer profile created successfully!' }
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

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <div className="mx-auto w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
            <BuildingOfficeIcon className="w-8 h-8 text-blue-600" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900">Complete Your Employer Profile</h1>
          <p className="mt-2 text-gray-600">
            Tell us about your company to start hiring healthcare professionals
          </p>
        </div>

        {errors.form && (
          <Alert type="error" message={errors.form} className="mb-6" />
        )}

        <form onSubmit={handleSubmit} encType="multipart/form-data">
          {/* Company Information */}
          <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6 pb-3 border-b">
              Company Information
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormInput
                label="Company Name"
                name="company_name"
                placeholder="e.g., Medical Solutions Inc."
                value={formData.company_name}
                onChange={handleChange}
                error={errors.company_name}
                required
              />

              <FormInput
                label="Contact Person"
                name="contact_person"
                placeholder="e.g., John Smith"
                value={formData.contact_person}
                onChange={handleChange}
                error={errors.contact_person}
                required
              />

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Industry <span className="text-red-500">*</span>
                </label>
                <select
                  name="industry"
                  value={formData.industry}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">Select industry</option>
                  {industries.map(industry => (
                    <option key={industry} value={industry}>{industry}</option>
                  ))}
                </select>
                {errors.industry && (
                  <p className="mt-1 text-sm text-red-600">{errors.industry}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Company Size <span className="text-red-500">*</span>
                </label>
                <select
                  name="company_size"
                  value={formData.company_size}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">Select company size</option>
                  {companySizes.map(size => (
                    <option key={size} value={size}>{size}</option>
                  ))}
                </select>
                {errors.company_size && (
                  <p className="mt-1 text-sm text-red-600">{errors.company_size}</p>
                )}
              </div>

              <FormInput
                label="Website"
                name="website"
                type="url"
                placeholder="https://yourcompany.com"
                value={formData.website}
                onChange={handleChange}
                error={errors.website}
              />

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
            </div>

            <div className="mt-6">
              <FormInput
                label="Company Address"
                name="address"
                placeholder="Street, City, State, ZIP Code"
                value={formData.address}
                onChange={handleChange}
                error={errors.address}
              />
            </div>

            <div className="mt-6">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Company Description
              </label>
              <textarea
                name="description"
                rows={4}
                value={formData.description}
                onChange={handleChange}
                placeholder="Tell us about your company, mission, values, and what makes you unique..."
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
              <p className="mt-1 text-sm text-gray-500">
                This will be visible to job seekers
              </p>
              {errors.description && (
                <p className="mt-1 text-sm text-red-600">{errors.description}</p>
              )}
            </div>
          </div>

          {/* Company Logo */}
          <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6 pb-3 border-b">
              Company Logo
            </h2>
            
            <div className="flex items-center space-x-6">
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Upload Company Logo
                </label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-400 transition">
                  <input
                    type="file"
                    name="company_logo"
                    id="company_logo"
                    accept="image/*"
                    onChange={handleChange}
                    className="hidden"
                  />
                  <label htmlFor="company_logo" className="cursor-pointer">
                    <ArrowUpTrayIcon className="mx-auto h-12 w-12 text-gray-400" />
                    <p className="mt-2 text-sm text-gray-600">
                      Click to upload logo
                    </p>
                    <p className="text-xs text-gray-500">
                      PNG, JPG, GIF up to 5MB
                    </p>
                  </label>
                </div>
                {errors.company_logo && (
                  <p className="mt-1 text-sm text-red-600">{errors.company_logo}</p>
                )}
              </div>
              
              {logoPreview && (
                <div className="flex-shrink-0">
                  <p className="text-sm font-medium text-gray-700 mb-2">Preview</p>
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

          {/* Actions */}
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

export default EmployerProfile;