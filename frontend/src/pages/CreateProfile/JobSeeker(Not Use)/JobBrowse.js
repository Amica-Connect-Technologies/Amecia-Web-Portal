import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { jobsAPI } from '../../services/api';
import LoadingSpinner from '../../components/Common/LoadingSpinner';
import Alert from '../../components/Common/Alert';
import { 
  MapPinIcon, 
  CurrencyDollarIcon, 
  BriefcaseIcon,
  BuildingOfficeIcon,
  ClockIcon,
  MagnifyingGlassIcon,
  FunnelIcon
} from '@heroicons/react/24/outline';

const JobBrowse = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
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
      const data = await jobsAPI.getAllJobs();
      setJobs(data);
    } catch (error) {
      console.error('Error fetching jobs:', error);
      setError('Failed to load jobs');
    } finally {
      setLoading(false);
    }
  };

  const filteredJobs = jobs.filter(job => {
    const matchesSearch = searchTerm === '' || 
      job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.description.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesJobType = !filters.job_type || job.job_type === filters.job_type;
    const matchesLocation = !filters.location || 
      job.location.toLowerCase().includes(filters.location.toLowerCase());
    const matchesMinSalary = !filters.min_salary || 
      parseFloat(job.salary) >= parseFloat(filters.min_salary);

    return matchesSearch && matchesJobType && matchesLocation && matchesMinSalary;
  });

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

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Browse Healthcare Jobs</h1>
          <p className="mt-2 text-gray-600">
            Find your perfect opportunity in the healthcare industry
          </p>
        </div>

        {/* Search and Filters */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
            {/* Search */}
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

            {/* Filters */}
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

            {/* Clear Filters */}
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

        {error && (
          <Alert type="error" message={error} className="mb-6" />
        )}

        {/* Jobs Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredJobs.length === 0 ? (
            <div className="col-span-full text-center py-12">
              <div className="text-gray-400 mb-4">
                <BriefcaseIcon className="w-16 h-16 mx-auto" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No jobs found</h3>
              <p className="text-gray-600">Try adjusting your search criteria</p>
            </div>
          ) : (
            filteredJobs.map(job => (
              <div key={job.id} className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition">
                <div className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-lg font-bold text-gray-900 mb-1">{job.title}</h3>
                      <div className="flex items-center text-gray-600 mb-2">
                        <BuildingOfficeIcon className="w-4 h-4 mr-1" />
                        <span>{job.company}</span>
                      </div>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                      job.job_type === 'full_time' ? 'bg-green-100 text-green-800' :
                      job.job_type === 'part_time' ? 'bg-blue-100 text-blue-800' :
                      job.job_type === 'contract' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-purple-100 text-purple-800'
                    }`}>
                      {job.job_type?.replace('_', ' ').toUpperCase() || 'N/A'}
                    </span>
                  </div>

                  <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                    {job.description}
                  </p>

                  <div className="space-y-3 mb-6">
                    <div className="flex items-center text-gray-700">
                      <MapPinIcon className="w-4 h-4 mr-2 text-gray-400" />
                      <span className="text-sm">{job.location}</span>
                    </div>
                    <div className="flex items-center text-gray-700">
                      <CurrencyDollarIcon className="w-4 h-4 mr-2 text-gray-400" />
                      <span className="text-sm font-medium">{formatSalary(job.salary)}/year</span>
                    </div>
                    <div className="flex items-center text-gray-700">
                      <BriefcaseIcon className="w-4 h-4 mr-2 text-gray-400" />
                      <span className="text-sm">{job.requirements}</span>
                    </div>
                  </div>

                  <div className="flex justify-between items-center">
                    <div className="flex items-center text-sm text-gray-500">
                      <ClockIcon className="w-4 h-4 mr-1" />
                      <span>{job.total_applications || 0} applications</span>
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
        <div className="mt-8 text-center text-gray-600">
          <p>Showing {filteredJobs.length} of {jobs.length} jobs</p>
        </div>
      </div>
    </div>
  );
};

export default JobBrowse;