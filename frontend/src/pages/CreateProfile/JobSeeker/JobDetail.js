import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { jobAPI, profileAPI } from '../../../services/api';
import LoadingSpinner from '../../../components/Common/LoadingSpinner';
import Alert from '../../../components/Common/Alert';
import { 
  MapPinIcon, 
  CurrencyDollarIcon, 
  BriefcaseIcon,
  BuildingOfficeIcon,
  UserIcon,
  CalendarIcon,
  DocumentTextIcon,
  CheckCircleIcon,
  ArrowLeftIcon
} from '@heroicons/react/24/outline';

const JobDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [applying, setApplying] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [profile, setProfile] = useState(null);
  const [profileComplete, setProfileComplete] = useState(false);
  const [applicationData, setApplicationData] = useState({
    job: id,
    cover_letter: '',
    notes: '',
    resume: null
  });

  useEffect(() => {
    fetchJobDetails();
    checkUserProfile();
  }, [id]);

  const fetchJobDetails = async () => {
    try {
      setLoading(true);
      const data = await jobAPI.getJob(id);
      setJob(data);
    } catch (error) {
      console.error('Error fetching job:', error);
      setError('Failed to load job details');
    } finally {
      setLoading(false);
    }
  };

  const checkUserProfile = async () => {
    try {
      const profileData = await profileAPI.getProfile();
      if (profileData) {
        setProfile(profileData);
        // Check if profile is complete enough to apply
        const isComplete = profileData.first_name && 
                          profileData.last_name && 
                          profileData.profession && 
                          profileData.resume;
        setProfileComplete(isComplete);
        
        // Set resume from profile if exists
        if (profileData.resume) {
          setApplicationData(prev => ({ ...prev, resume: profileData.resume }));
        }
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
    }
  };

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === 'resume') {
      setApplicationData(prev => ({ ...prev, resume: files[0] }));
    } else {
      setApplicationData(prev => ({ ...prev, [name]: value }));
    }
  };

  const validateApplication = () => {
    if (!profile) {
      setError('Please complete your profile before applying');
      navigate('/profile/create');
      return false;
    }

    if (!profileComplete) {
      setError('Your profile is incomplete. Please complete all required fields and upload a resume.');
      navigate('/profile/edit');
      return false;
    }

    if (!applicationData.cover_letter.trim()) {
      setError('Please write a cover letter');
      return false;
    }

    return true;
  };

  const handleApply = async () => {
    if (!validateApplication()) return;

    setApplying(true);
    setError('');
    setSuccess('');

    try {
      const formData = new FormData();
      
      // Append all application data
      Object.keys(applicationData).forEach(key => {
        if (applicationData[key]) {
          if (key === 'resume' && applicationData[key] instanceof File) {
            formData.append(key, applicationData[key]);
          } else if (key !== 'resume') {
            formData.append(key, applicationData[key]);
          }
        }
      });

      // If no new resume file, use profile resume
      if (!(applicationData.resume instanceof File) && profile?.resume) {
        // We need to handle this differently - either use existing resume or skip
        // Most APIs will use the profile's resume automatically
        console.log('Using existing resume from profile');
      }

      console.log('Submitting application:', Object.fromEntries(formData));
      
      const response = await jobAPI.applyForJob(formData);
      
      if (response.status === 201) {
        setSuccess('Application submitted successfully! Redirecting to dashboard...');
        setTimeout(() => {
          navigate('/dashboard');
        }, 2000);
      }
    } catch (error) {
      console.error('Error applying:', error);
      if (error.response?.data) {
        // Format Django validation errors
        const errorData = error.response.data;
        let errorMessage = '';
        
        if (typeof errorData === 'object') {
          Object.keys(errorData).forEach(key => {
            if (Array.isArray(errorData[key])) {
              errorMessage += `${key}: ${errorData[key].join(', ')}\n`;
            } else {
              errorMessage += `${errorData[key]}\n`;
            }
          });
        } else if (typeof errorData === 'string') {
          errorMessage = errorData;
        } else if (errorData.detail) {
          errorMessage = errorData.detail;
        } else {
          errorMessage = 'Failed to submit application. Please try again.';
        }
        
        setError(errorMessage);
      } else {
        setError('Failed to submit application. Please try again.');
      }
    } finally {
      setApplying(false);
    }
  };

  const formatSalary = (salary) => {
    if (!salary) return 'Not specified';
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0
    }).format(salary);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (!job) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Alert type="error" message="Job not found" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => navigate('/jobs')}
            className="text-blue-600 hover:text-blue-800 mb-4 flex items-center"
          >
            <ArrowLeftIcon className="w-4 h-4 mr-1" />
            Back to Jobs
          </button>
          <h1 className="text-3xl font-bold text-gray-900">{job.title}</h1>
          <div className="flex items-center text-gray-600 mt-2">
            <BuildingOfficeIcon className="w-5 h-5 mr-2" />
            <span>{job.company}</span>
            <span className="mx-2">•</span>
            <MapPinIcon className="w-5 h-5 mr-2" />
            <span>{job.location}</span>
          </div>
        </div>

        {error && (
          <Alert 
            type="error" 
            message={error} 
            className="mb-6" 
            onClose={() => setError('')}
          />
        )}
        
        {success && (
          <Alert 
            type="success" 
            message={success} 
            className="mb-6"
            onClose={() => setSuccess('')}
          />
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Job Details */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Job Description</h2>
              <div className="prose max-w-none">
                <p className="text-gray-700 whitespace-pre-line">{job.description}</p>
              </div>

              <h3 className="text-lg font-semibold text-gray-900 mt-6 mb-3">Requirements</h3>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-gray-700">{job.requirements}</p>
              </div>
            </div>

            {/* Application Form */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Apply for this Position</h2>
              
              {!profileComplete && (
                <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <p className="text-yellow-800">
                    <span className="font-semibold">Profile Incomplete:</span> Please complete your profile before applying.
                  </p>
                  <button
                    onClick={() => navigate('/profile/edit')}
                    className="mt-2 text-yellow-700 hover:text-yellow-800 font-medium"
                  >
                    Complete Profile →
                  </button>
                </div>
              )}

              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Cover Letter *
                  </label>
                  <textarea
                    name="cover_letter"
                    rows={6}
                    value={applicationData.cover_letter}
                    onChange={handleChange}
                    placeholder="Tell us why you're the perfect candidate for this position..."
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    disabled={!profileComplete}
                    required
                  />
                  <p className="mt-1 text-sm text-gray-500">
                    Explain your qualifications and why you're interested in this position
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Additional Notes
                  </label>
                  <textarea
                    name="notes"
                    rows={3}
                    value={applicationData.notes}
                    onChange={handleChange}
                    placeholder="Any additional information you'd like to share..."
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    disabled={!profileComplete}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Resume
                  </label>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-4">
                    {profile?.resume && !(applicationData.resume instanceof File) ? (
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center">
                            <DocumentTextIcon className="w-5 h-5 text-gray-400 mr-2" />
                            <span>Using your profile resume</span>
                          </div>
                          <a
                            href={profile.resume}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:text-blue-800 text-sm"
                          >
                            View
                          </a>
                        </div>
                        <p className="text-sm text-gray-500">
                          Upload a different resume below if needed
                        </p>
                      </div>
                    ) : null}
                    
                    <div className="mt-3">
                      <input
                        type="file"
                        name="resume"
                        id="resume"
                        accept=".pdf,.doc,.docx"
                        onChange={handleChange}
                        className="hidden"
                        disabled={!profileComplete}
                      />
                      <label htmlFor="resume" className="cursor-pointer flex items-center">
                        <DocumentTextIcon className="w-5 h-5 text-gray-400 mr-2" />
                        <span className={`${!profileComplete ? 'text-gray-400' : 'text-blue-600 hover:text-blue-800'}`}>
                          {applicationData.resume instanceof File 
                            ? applicationData.resume.name 
                            : 'Upload a different resume (optional)'}
                        </span>
                      </label>
                    </div>
                  </div>
                  <p className="mt-1 text-sm text-gray-500">
                    PDF, DOC, DOCX up to 10MB
                  </p>
                </div>

                <button
                  onClick={handleApply}
                  disabled={applying || !profileComplete}
                  className={`w-full py-3 rounded-lg text-lg font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 transition flex items-center justify-center ${
                    profileComplete 
                      ? 'bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500' 
                      : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  }`}
                >
                  {applying ? (
                    <>
                      <LoadingSpinner size="sm" className="mr-2" />
                      Submitting Application...
                    </>
                  ) : (
                    <>
                      <CheckCircleIcon className="w-5 h-5 mr-2" />
                      {profileComplete ? 'Submit Application' : 'Complete Profile to Apply'}
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* Right Column - Job Info */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-lg p-6 sticky top-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Job Overview</h3>
              
              <div className="space-y-4">
                <div className="flex items-center text-gray-700">
                  <CurrencyDollarIcon className="w-5 h-5 text-gray-400 mr-3 flex-shrink-0" />
                  <div>
                    <p className="text-sm text-gray-500">Salary</p>
                    <p className="font-medium">{formatSalary(job.salary)}/year</p>
                  </div>
                </div>

                <div className="flex items-center text-gray-700">
                  <BriefcaseIcon className="w-5 h-5 text-gray-400 mr-3 flex-shrink-0" />
                  <div>
                    <p className="text-sm text-gray-500">Job Type</p>
                    <p className="font-medium">{job.job_type?.replace('_', ' ').toUpperCase() || 'Not specified'}</p>
                  </div>
                </div>

                <div className="flex items-center text-gray-700">
                  <MapPinIcon className="w-5 h-5 text-gray-400 mr-3 flex-shrink-0" />
                  <div>
                    <p className="text-sm text-gray-500">Location</p>
                    <p className="font-medium">{job.location}</p>
                  </div>
                </div>

                <div className="flex items-center text-gray-700">
                  <BuildingOfficeIcon className="w-5 h-5 text-gray-400 mr-3 flex-shrink-0" />
                  <div>
                    <p className="text-sm text-gray-500">Company</p>
                    <p className="font-medium">{job.company}</p>
                  </div>
                </div>

                <div className="flex items-center text-gray-700">
                  <UserIcon className="w-5 h-5 text-gray-400 mr-3 flex-shrink-0" />
                  <div>
                    <p className="text-sm text-gray-500">Posted By</p>
                    <p className="font-medium">{job.created_by}</p>
                  </div>
                </div>

                <div className="flex items-center text-gray-700">
                  <CalendarIcon className="w-5 h-5 text-gray-400 mr-3 flex-shrink-0" />
                  <div>
                    <p className="text-sm text-gray-500">Applications</p>
                    <p className="font-medium">{job.total_applications || 0} applicants</p>
                  </div>
                </div>
              </div>

              {/* Profile Status */}
              <div className="mt-8 pt-6 border-t border-gray-200">
                <h4 className="text-sm font-medium text-gray-700 mb-3">Your Profile Status</h4>
                <ul className="space-y-2 text-sm">
                  <li className={`flex items-start ${profile?.first_name ? 'text-green-600' : 'text-red-600'}`}>
                    <CheckCircleIcon className={`w-4 h-4 mr-2 mt-0.5 ${profile?.first_name ? 'text-green-500' : 'text-red-500'}`} />
                    <span>Basic Information</span>
                  </li>
                  <li className={`flex items-start ${profile?.profession ? 'text-green-600' : 'text-red-600'}`}>
                    <CheckCircleIcon className={`w-4 h-4 mr-2 mt-0.5 ${profile?.profession ? 'text-green-500' : 'text-red-500'}`} />
                    <span>Profession</span>
                  </li>
                  <li className={`flex items-start ${profile?.resume ? 'text-green-600' : 'text-red-600'}`}>
                    <CheckCircleIcon className={`w-4 h-4 mr-2 mt-0.5 ${profile?.resume ? 'text-green-500' : 'text-red-500'}`} />
                    <span>Resume</span>
                  </li>
                </ul>
                
                {!profileComplete && (
                  <button
                    onClick={() => navigate('/profile/edit')}
                    className="w-full mt-4 bg-yellow-500 text-white py-2 rounded-lg text-sm font-medium hover:bg-yellow-600 transition"
                  >
                    Complete Profile
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default JobDetail;