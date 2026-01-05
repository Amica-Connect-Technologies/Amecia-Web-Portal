import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { jobsAPI, profileAPI } from '../../services/api';
import LoadingSpinner from '../../components/Common/LoadingSpinner';
import Alert from '../../components/Common/Alert';
import { 
  MapPinIcon, 
  CurrencyDollarIcon, 
  BriefcaseIcon,
  BuildingOfficeIcon,
  UserIcon,
  CalendarIcon,
  DocumentTextIcon,
  CheckCircleIcon
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
  const [applicationData, setApplicationData] = useState({
    cover_letter: '',
    notes: '',
    resume: null
  });

  useEffect(() => {
    fetchJobDetails();
    fetchUserProfile();
  }, [id]);

  const fetchJobDetails = async () => {
    try {
      setLoading(true);
      const data = await jobsAPI.getJobById(id);
      setJob(data);
    } catch (error) {
      console.error('Error fetching job:', error);
      setError('Failed to load job details');
    } finally {
      setLoading(false);
    }
  };

  const fetchUserProfile = async () => {
    try {
      const data = await profileAPI.getProfile();
      setProfile(data);
      if (data.resume) {
        setApplicationData(prev => ({ ...prev, resume: data.resume }));
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

  const handleApply = async () => {
    if (!profile) {
      setError('Please complete your profile before applying');
      navigate('/profile/create');
      return;
    }

    setApplying(true);
    setError('');
    setSuccess('');

    try {
      const formData = new FormData();
      formData.append('job', id);
      formData.append('cover_letter', applicationData.cover_letter);
      formData.append('notes', applicationData.notes);
      
      if (applicationData.resume instanceof File) {
        formData.append('resume', applicationData.resume);
      }

      await jobsAPI.createApplication(formData);
      setSuccess('Application submitted successfully!');
      setTimeout(() => {
        navigate('/dashboard');
      }, 2000);
    } catch (error) {
      console.error('Error applying:', error);
      setError(error.response?.data?.detail || 'Failed to submit application');
    } finally {
      setApplying(false);
    }
  };

  const formatSalary = (salary) => {
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
            ← Back to Jobs
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

        {error && <Alert type="error" message={error} className="mb-6" />}
        {success && <Alert type="success" message={success} className="mb-6" />}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Job Details */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Job Description</h2>
              <div className="prose max-w-none">
                <p className="text-gray-700 whitespace-pre-line">{job.description}</p>
              </div>

              <h3 className="text-lg font-semibold text-gray-900 mt-6 mb-3">Requirements</h3>
              <p className="text-gray-700">{job.requirements}</p>
            </div>

            {/* Application Form */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Apply for this Position</h2>
              
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Cover Letter
                  </label>
                  <textarea
                    name="cover_letter"
                    rows={6}
                    value={applicationData.cover_letter}
                    onChange={handleChange}
                    placeholder="Tell us why you're the perfect candidate for this position..."
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
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
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Resume
                  </label>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-4">
                    {profile?.resume && !(applicationData.resume instanceof File) ? (
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <DocumentTextIcon className="w-5 h-5 text-gray-400 mr-2" />
                          <span>Using profile resume</span>
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
                    ) : (
                      <div>
                        <input
                          type="file"
                          name="resume"
                          id="resume"
                          accept=".pdf,.doc,.docx"
                          onChange={handleChange}
                          className="hidden"
                        />
                        <label htmlFor="resume" className="cursor-pointer flex items-center">
                          <DocumentTextIcon className="w-5 h-5 text-gray-400 mr-2" />
                          <span className="text-blue-600 hover:text-blue-800">
                            {applicationData.resume?.name || 'Upload resume (optional)'}
                          </span>
                        </label>
                      </div>
                    )}
                  </div>
                </div>

                <button
                  onClick={handleApply}
                  disabled={applying}
                  className="w-full bg-blue-600 text-white py-3 rounded-lg text-lg font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition flex items-center justify-center"
                >
                  {applying ? (
                    <>
                      <LoadingSpinner size="sm" className="mr-2" />
                      Submitting Application...
                    </>
                  ) : (
                    <>
                      <CheckCircleIcon className="w-5 h-5 mr-2" />
                      Submit Application
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
                  <CurrencyDollarIcon className="w-5 h-5 text-gray-400 mr-3" />
                  <div>
                    <p className="text-sm text-gray-500">Salary</p>
                    <p className="font-medium">{formatSalary(job.salary)}/year</p>
                  </div>
                </div>

                <div className="flex items-center text-gray-700">
                  <BriefcaseIcon className="w-5 h-5 text-gray-400 mr-3" />
                  <div>
                    <p className="text-sm text-gray-500">Job Type</p>
                    <p className="font-medium">{job.job_type?.replace('_', ' ').toUpperCase() || 'N/A'}</p>
                  </div>
                </div>

                <div className="flex items-center text-gray-700">
                  <MapPinIcon className="w-5 h-5 text-gray-400 mr-3" />
                  <div>
                    <p className="text-sm text-gray-500">Location</p>
                    <p className="font-medium">{job.location}</p>
                  </div>
                </div>

                <div className="flex items-center text-gray-700">
                  <BuildingOfficeIcon className="w-5 h-5 text-gray-400 mr-3" />
                  <div>
                    <p className="text-sm text-gray-500">Company</p>
                    <p className="font-medium">{job.company}</p>
                  </div>
                </div>

                <div className="flex items-center text-gray-700">
                  <UserIcon className="w-5 h-5 text-gray-400 mr-3" />
                  <div>
                    <p className="text-sm text-gray-500">Posted By</p>
                    <p className="font-medium">{job.created_by}</p>
                  </div>
                </div>

                <div className="flex items-center text-gray-700">
                  <CalendarIcon className="w-5 h-5 text-gray-400 mr-3" />
                  <div>
                    <p className="text-sm text-gray-500">Applications</p>
                    <p className="font-medium">{job.total_applications || 0} applicants</p>
                  </div>
                </div>
              </div>

              <div className="mt-8 pt-6 border-t border-gray-200">
                <h4 className="text-sm font-medium text-gray-700 mb-3">Before You Apply</h4>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li className="flex items-start">
                    <CheckCircleIcon className="w-4 h-4 text-green-500 mr-2 mt-0.5" />
                    <span>Ensure your profile is complete</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircleIcon className="w-4 h-4 text-green-500 mr-2 mt-0.5" />
                    <span>Customize your cover letter</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircleIcon className="w-4 h-4 text-green-500 mr-2 mt-0.5" />
                    <span>Check all requirements match your qualifications</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default JobDetail;