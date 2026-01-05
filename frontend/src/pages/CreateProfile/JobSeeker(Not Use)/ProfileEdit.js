import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import FormInput from '../../components/Common/FormInput';
import Alert from '../../components/Common/Alert';
import LoadingSpinner from '../../components/Common/LoadingSpinner';
import { profileAPI } from '../../services/api';
import { 
  UserIcon, 
  ArrowUpTrayIcon,
  AcademicCapIcon, 
  BriefcaseIcon,
  XMarkIcon 
} from '@heroicons/react/24/outline';

const ProfileEdit = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [errors, setErrors] = useState({});
  const [profilePicPreview, setProfilePicPreview] = useState(null);
  const [profilePicFile, setProfilePicFile] = useState(null);
  const [resumeFile, setResumeFile] = useState(null);
  const [certificationsFile, setCertificationsFile] = useState(null);
  
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    phone: '',
    address: '',
    date_of_birth: '',
    profession: '',
    experience_years: '',
    education: '',
    skills: '',
  });

  const professions = [
    'Doctor',
    'Nurse',
    'Dentist',
    'Pharmacist',
    'Physiotherapist',
    'Medical Technician',
    'Healthcare Administrator',
    'Medical Researcher',
    'Dental Assistant',
    'Medical Assistant',
    'Surgeon',
    'Pediatrician',
    'Cardiologist',
    'Neurologist',
    'Radiologist',
    'Psychiatrist',
    'Anesthesiologist',
    'Other'
  ];

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      setFetching(true);
      const response = await profileAPI.getProfile();
      setFormData({
        first_name: response.first_name || '',
        last_name: response.last_name || '',
        phone: response.phone || '',
        address: response.address || '',
        date_of_birth: response.date_of_birth || '',
        profession: response.profession || '',
        experience_years: response.experience_years || '',
        education: response.education || '',
        skills: response.skills || '',
      });
      if (response.profile_picture) {
        setProfilePicPreview(response.profile_picture);
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
      setErrors({ form: 'Failed to load profile' });
    } finally {
      setFetching(false);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, files } = e.target;
    
    if (type === 'file') {
      const file = files[0];
      if (name === 'profile_picture') {
        setProfilePicFile(file);
        if (file) {
          const reader = new FileReader();
          reader.onloadend = () => {
            setProfilePicPreview(reader.result);
          };
          reader.readAsDataURL(file);
        }
      } else if (name === 'resume') {
        setResumeFile(file);
      } else if (name === 'certifications') {
        setCertificationsFile(file);
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

  const handleRemoveProfilePic = () => {
    setProfilePicPreview(null);
    setProfilePicFile(null);
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
      if (profilePicFile) {
        formDataObj.append('profile_picture', profilePicFile);
      }
      if (resumeFile) {
        formDataObj.append('resume', resumeFile);
      }
      if (certificationsFile) {
        formDataObj.append('certifications', certificationsFile);
      }
      
      const response = await profileAPI.updateProfile(formDataObj);
      
      if (response.status === 200) {
        navigate('/profile', { 
          state: { message: 'Profile updated successfully!' }
        });
      }
    } catch (error) {
      console.error('Profile update error:', error);
      if (error.response?.data) {
        setErrors(error.response.data);
      } else {
        setErrors({ form: 'Failed to update profile. Please try again.' });
      }
    } finally {
      setLoading(false);
    }
  };

  if (fetching) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <div className="mx-auto w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mb-4">
            <UserIcon className="w-8 h-8 text-purple-600" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900">Edit Your Profile</h1>
          <p className="mt-2 text-gray-600">
            Update your information to keep your profile current
          </p>
        </div>

        {errors.form && (
          <Alert type="error" message={errors.form} className="mb-6" />
        )}

        <form onSubmit={handleSubmit} encType="multipart/form-data">
          {/* Personal Information */}
          <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6 pb-3 border-b">
              Personal Information
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormInput
                label="First Name"
                name="first_name"
                placeholder="John"
                value={formData.first_name}
                onChange={handleChange}
                error={errors.first_name}
                required
              />

              <FormInput
                label="Last Name"
                name="last_name"
                placeholder="Doe"
                value={formData.last_name}
                onChange={handleChange}
                error={errors.last_name}
                required
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

              <FormInput
                label="Date of Birth"
                name="date_of_birth"
                type="date"
                value={formData.date_of_birth}
                onChange={handleChange}
                error={errors.date_of_birth}
              />

              <div className="md:col-span-2">
                <FormInput
                  label="Address"
                  name="address"
                  placeholder="Street, City, State, ZIP Code"
                  value={formData.address}
                  onChange={handleChange}
                  error={errors.address}
                />
              </div>
            </div>
          </div>

          {/* Professional Information */}
          <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6 pb-3 border-b">
              Professional Information
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Profession <span className="text-red-500">*</span>
                </label>
                <select
                  name="profession"
                  value={formData.profession}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">Select your profession</option>
                  {professions.map(profession => (
                    <option key={profession} value={profession}>{profession}</option>
                  ))}
                </select>
                {errors.profession && (
                  <p className="mt-1 text-sm text-red-600">{errors.profession}</p>
                )}
              </div>

              <FormInput
                label="Years of Experience"
                name="experience_years"
                type="number"
                min="0"
                placeholder="0"
                value={formData.experience_years}
                onChange={handleChange}
                error={errors.experience_years}
                required
              />
            </div>

            <div className="mt-6">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Education
              </label>
              <textarea
                name="education"
                rows={4}
                value={formData.education}
                onChange={handleChange}
                placeholder="List your educational qualifications, degrees, certifications..."
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
              <p className="mt-1 text-sm text-gray-500">
                Include degrees, institutions, and graduation years
              </p>
              {errors.education && (
                <p className="mt-1 text-sm text-red-600">{errors.education}</p>
              )}
            </div>

            <div className="mt-6">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Skills
              </label>
              <textarea
                name="skills"
                rows={3}
                value={formData.skills}
                onChange={handleChange}
                placeholder="List your skills separated by commas (e.g., Patient Care, Medical Records, Emergency Response)"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
              <p className="mt-1 text-sm text-gray-500">
                Separate skills with commas
              </p>
              {errors.skills && (
                <p className="mt-1 text-sm text-red-600">{errors.skills}</p>
              )}
            </div>
          </div>

          {/* Documents & Media */}
          <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6 pb-3 border-b">
              Documents & Media
            </h2>
            
            <div className="space-y-6">
              {/* Profile Picture */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Profile Picture
                </label>
                <div className="flex items-center space-x-6">
                  <div className="flex-1">
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-400 transition">
                      <input
                        type="file"
                        name="profile_picture"
                        id="profile_picture"
                        accept="image/*"
                        onChange={handleChange}
                        className="hidden"
                      />
                      <label htmlFor="profile_picture" className="cursor-pointer">
                        <ArrowUpTrayIcon className="mx-auto h-12 w-12 text-gray-400" />
                        <p className="mt-2 text-sm text-gray-600">
                          {profilePicPreview ? 'Change profile picture' : 'Upload profile picture'}
                        </p>
                        <p className="text-xs text-gray-500">
                          PNG, JPG up to 5MB
                        </p>
                      </label>
                    </div>
                    {errors.profile_picture && (
                      <p className="mt-1 text-sm text-red-600">{errors.profile_picture}</p>
                    )}
                  </div>
                  
                  {profilePicPreview && (
                    <div className="flex-shrink-0 relative">
                      <p className="text-sm font-medium text-gray-700 mb-2">Preview</p>
                      <div className="relative group">
                        <div className="w-32 h-32 border rounded-lg overflow-hidden">
                          <img
                            src={profilePicPreview}
                            alt="Profile preview"
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <button
                          type="button"
                          onClick={handleRemoveProfilePic}
                          className="absolute -top-2 -right-2 bg-red-100 text-red-600 rounded-full p-1 opacity-0 group-hover:opacity-100 transition"
                        >
                          <XMarkIcon className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Resume */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Resume (PDF, DOC)
                </label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-400 transition">
                  <input
                    type="file"
                    name="resume"
                    id="resume"
                    accept=".pdf,.doc,.docx"
                    onChange={handleChange}
                    className="hidden"
                  />
                  <label htmlFor="resume" className="cursor-pointer">
                    <BriefcaseIcon className="mx-auto h-12 w-12 text-gray-400" />
                    <p className="mt-2 text-sm text-gray-600">
                      {resumeFile ? 'Change resume' : 'Upload your resume'}
                    </p>
                    <p className="text-xs text-gray-500">
                      PDF, DOC, DOCX up to 10MB
                    </p>
                  </label>
                </div>
                {errors.resume && (
                  <p className="mt-1 text-sm text-red-600">{errors.resume}</p>
                )}
              </div>

              {/* Certifications */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Certifications (Optional)
                </label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-400 transition">
                  <input
                    type="file"
                    name="certifications"
                    id="certifications"
                    accept=".pdf,.doc,.docx,.jpg,.png"
                    onChange={handleChange}
                    className="hidden"
                  />
                  <label htmlFor="certifications" className="cursor-pointer">
                    <AcademicCapIcon className="mx-auto h-12 w-12 text-gray-400" />
                    <p className="mt-2 text-sm text-gray-600">
                      {certificationsFile ? 'Change certifications' : 'Upload certifications'}
                    </p>
                    <p className="text-xs text-gray-500">
                      PDF, DOC, JPG, PNG up to 10MB
                    </p>
                  </label>
                </div>
                {errors.certifications && (
                  <p className="mt-1 text-sm text-red-600">{errors.certifications}</p>
                )}
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-end space-x-4 pt-6">
            <button
              type="button"
              onClick={() => navigate('/profile')}
              className="px-6 py-3 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition flex items-center"
            >
              {loading ? (
                <>
                  <LoadingSpinner size="sm" className="mr-2" />
                  Updating Profile...
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

export default ProfileEdit;