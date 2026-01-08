import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { jobAPI } from '../../../services/api';
import LoadingSpinner from '../../../components/Common/LoadingSpinner';
import Alert from '../../../components/Common/Alert';
import { 
  MapPinIcon, 
  CurrencyDollarIcon, 
  BriefcaseIcon,
  BuildingOfficeIcon,
  ClockIcon,
  MagnifyingGlassIcon,
  FunnelIcon,
  ExclamationTriangleIcon
} from '@heroicons/react/24/outline';

const JobBrowse = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [rawResponse, setRawResponse] = useState(null); // For debugging
  const [filters, setFilters] = useState({
    job_type: '',
    location: '',
    min_salary: ''
  });

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    try {
      setLoading(true);
      setError('');
      
      // Make a direct axios call to see the raw response
      const response = await jobAPI.getAllJobs();
      console.log('RAW API RESPONSE:', response);
      console.log('Response type:', typeof response);
      console.log('Response keys:', response ? Object.keys(response) : 'No response');
      setRawResponse(response); // Store for debugging
      
      // Try to extract jobs from various possible response structures
      let extractedJobs = [];
      
      if (Array.isArray(response)) {
        // Direct array response
        extractedJobs = response;
      } else if (response && typeof response === 'object') {
        // Check common response structures
        
        // Case 1: Django REST Framework paginated response
        if (Array.isArray(response.results)) {
          extractedJobs = response.results;
        }
        // Case 2: Axios response object (with data property)
        else if (response.data) {
          const data = response.data;
          console.log('Response data:', data);
          
          if (Array.isArray(data)) {
            extractedJobs = data;
          } else if (Array.isArray(data.results)) {
            extractedJobs = data.results;
          } else if (Array.isArray(data.jobs)) {
            extractedJobs = data.jobs;
          } else if (Array.isArray(data.data)) {
            extractedJobs = data.data;
          } else if (typeof data === 'object') {
            // Try to convert object values to array
            const values = Object.values(data);
            if (values.every(item => typeof item === 'object')) {
              extractedJobs = values;
            }
          }
        }
        // Case 3: Direct object with nested array
        else if (response.jobs && Array.isArray(response.jobs)) {
          extractedJobs = response.jobs;
        }
        // Case 4: Convert entire object to array if all values are objects
        else {
          const values = Object.values(response);
          if (values.length > 0 && values.every(item => item && typeof item === 'object')) {
            extractedJobs = values;
          }
        }
      }
      
      console.log('Extracted jobs:', extractedJobs);
      console.log('Extracted jobs length:', extractedJobs.length);
      
      if (Array.isArray(extractedJobs) && extractedJobs.length > 0) {
        setJobs(extractedJobs);
      } else {
        console.warn('No jobs extracted from response');
        setJobs([]);
        setError('No jobs available or invalid data format');
      }
      
    } catch (error) {
      console.error('Error fetching jobs:', error);
      console.error('Error response:', error.response);
      setError(`Failed to load jobs: ${error.message}`);
      setJobs([]);
    } finally {
      setLoading(false);
    }
  };

  // Debug component to show raw response
  const DebugPanel = () => (
    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
      <div className="flex items-center mb-2">
        <ExclamationTriangleIcon className="w-5 h-5 text-yellow-600 mr-2" />
        <h3 className="text-lg font-semibold text-yellow-800">Debug Info</h3>
      </div>
      <div className="text-sm text-yellow-700">
        <p><strong>Raw response type:</strong> {typeof rawResponse}</p>
        <p><strong>Is array:</strong> {Array.isArray(rawResponse) ? 'Yes' : 'No'}</p>
        <p><strong>Raw response keys:</strong> {rawResponse ? Object.keys(rawResponse).join(', ') : 'None'}</p>
        <details className="mt-2">
          <summary className="cursor-pointer font-medium">View raw response</summary>
          <pre className="mt-2 p-2 bg-yellow-100 rounded text-xs overflow-auto max-h-60">
            {JSON.stringify(rawResponse, null, 2)}
          </pre>
        </details>
      </div>
    </div>
  );

  // Safe filtering function
  const filteredJobs = Array.isArray(jobs) ? jobs.filter(job => {
    if (!job || typeof job !== 'object') return false;
    
    const title = String(job.title || '');
    const company = String(job.company || '');
    const description = String(job.description || '');
    const jobType = String(job.job_type || '');
    const location = String(job.location || '');
    const salary = parseFloat(job.salary) || 0;
    
    const matchesSearch = searchTerm === '' || 
      title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      company.toLowerCase().includes(searchTerm.toLowerCase()) ||
      description.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesJobType = !filters.job_type || jobType === filters.job_type;
    const matchesLocation = !filters.location || 
      location.toLowerCase().includes(filters.location.toLowerCase());
    const matchesMinSalary = !filters.min_salary || 
      salary >= parseFloat(filters.min_salary || 0);

    return matchesSearch && matchesJobType && matchesLocation && matchesMinSalary;
  }) : [];

  const jobTypeOptions = [
    { value: 'full_time', label: 'Full Time' },
    { value: 'part_time', label: 'Part Time' },
    { value: 'contract', label: 'Contract' },
    { value: 'temporary', label: 'Temporary' },
    { value: 'internship', label: 'Internship' }
  ];

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  const clearFilters = () => {
    setFilters({
      job_type: '',
      location: '',
      min_salary: ''
    });
    setSearchTerm('');
  };

  const formatSalary = (salary) => {
    if (!salary) return 'Not specified';
    const numSalary = parseFloat(salary);
    if (isNaN(numSalary)) return 'Not specified';
    
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0
    }).format(numSalary);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Browse Healthcare Jobs</h1>
          <p className="mt-2 text-gray-600">
            Find your perfect opportunity in the healthcare industry
          </p>
          <button
            onClick={fetchJobs}
            className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
          >
            Refresh Jobs
          </button>
        </div>

        {/* Debug Panel */}
        <DebugPanel />

        {error && (
          <Alert type="error" message={error} className="mb-6" />
        )}

        {/* Search and Filters */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
            <div className="md:col-span-4">
              <div className="relative">
                <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search jobs, companies, keywords..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>

            <div className="md:col-span-6 grid grid-cols-1 sm:grid-cols-3 gap-4">
              <select
                name="job_type"
                value={filters.job_type}
                onChange={handleFilterChange}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">All Job Types</option>
                {jobTypeOptions.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>

              <input
                type="text"
                name="location"
                placeholder="Location"
                value={filters.location}
                onChange={handleFilterChange}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />

              <input
                type="number"
                name="min_salary"
                placeholder="Min Salary"
                value={filters.min_salary}
                onChange={handleFilterChange}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div className="md:col-span-2">
              <button
                onClick={clearFilters}
                className="w-full px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition flex items-center justify-center"
              >
                <FunnelIcon className="w-4 h-4 mr-2" />
                Clear Filters
              </button>
            </div>
          </div>
        </div>

        {/* Jobs Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredJobs.length === 0 ? (
            <div className="col-span-full text-center py-12">
              <div className="text-gray-400 mb-4">
                <BriefcaseIcon className="w-16 h-16 mx-auto" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                {jobs.length === 0 ? 'No jobs available' : 'No matching jobs found'}
              </h3>
              <p className="text-gray-600 mb-4">
                {jobs.length === 0 
                  ? 'There are no jobs posted yet or failed to load jobs.'
                  : 'Try adjusting your search criteria.'
                }
              </p>
              <div className="space-x-4">
                <button
                  onClick={fetchJobs}
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
                >
                  Refresh Jobs
                </button>
                <button
                  onClick={clearFilters}
                  className="bg-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-300 transition"
                >
                  Clear Filters
                </button>
              </div>
            </div>
          ) : (
            filteredJobs.map(job => (
              <div key={job.id || Math.random()} className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition">
                <div className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-lg font-bold text-gray-900 mb-1">{job.title || 'Untitled Position'}</h3>
                      <div className="flex items-center text-gray-600 mb-2">
                        <BuildingOfficeIcon className="w-4 h-4 mr-1" />
                        <span>{job.company || 'Unknown Company'}</span>
                      </div>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                      (job.job_type || '').includes('full') ? 'bg-green-100 text-green-800' :
                      (job.job_type || '').includes('part') ? 'bg-blue-100 text-blue-800' :
                      (job.job_type || '').includes('contract') ? 'bg-yellow-100 text-yellow-800' :
                      'bg-purple-100 text-purple-800'
                    }`}>
                      {(job.job_type || 'N/A').toString().replace('_', ' ').toUpperCase()}
                    </span>
                  </div>

                  <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                    {job.description || 'No description provided'}
                  </p>

                  <div className="space-y-3 mb-6">
                    <div className="flex items-center text-gray-700">
                      <MapPinIcon className="w-4 h-4 mr-2 text-gray-400" />
                      <span className="text-sm">{job.location || 'Location not specified'}</span>
                    </div>
                    <div className="flex items-center text-gray-700">
                      <CurrencyDollarIcon className="w-4 h-4 mr-2 text-gray-400" />
                      <span className="text-sm font-medium">{formatSalary(job.salary)}/year</span>
                    </div>
                    {job.requirements && (
                      <div className="flex items-center text-gray-700">
                        <BriefcaseIcon className="w-4 h-4 mr-2 text-gray-400" />
                        <span className="text-sm">{job.requirements}</span>
                      </div>
                    )}
                  </div>

                  <div className="flex justify-between items-center">
                    <div className="flex items-center text-sm text-gray-500">
                      <ClockIcon className="w-4 h-4 mr-1" />
                      <span>{(job.total_applications || 0)} applications</span>
                    </div>
                    <Link
                      to={`/jobs/${job.id}`}
                      className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition"
                    >
                      View Details
                    </Link>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Stats */}
        {filteredJobs.length > 0 && (
          <div className="mt-8 text-center text-gray-600">
            <p>Showing {filteredJobs.length} of {jobs.length} jobs</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default JobBrowse;