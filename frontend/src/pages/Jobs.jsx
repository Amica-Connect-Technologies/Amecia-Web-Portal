import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  MagnifyingGlassIcon,
  MapPinIcon,
  CurrencyDollarIcon,
  ClockIcon,
  ChevronRightIcon,
  XMarkIcon,
  BookmarkIcon,
  EyeIcon,
  FunnelIcon,
  UserGroupIcon,
  BeakerIcon,
  HeartIcon,
  BriefcaseIcon,
  AcademicCapIcon,
  ShieldCheckIcon
} from '@heroicons/react/24/outline';
import { BookmarkIcon as BookmarkIconSolid } from '@heroicons/react/24/solid';
import { useAuth } from '../context/AuthContext';

// Helper function to get icon based on job title
const getJobIcon = (title) => {
  const lowerTitle = title.toLowerCase();
  
  if (lowerTitle.includes('nurse') || lowerTitle.includes('nursing')) {
    return { icon: '👩‍⚕️', color: 'text-red-500', bg: 'bg-red-50' };
  }
  if (lowerTitle.includes('doctor') || lowerTitle.includes('physician') || lowerTitle.includes('practitioner')) {
    return { icon: '👨‍⚕️', color: 'text-blue-500', bg: 'bg-blue-50' };
  }
  if (lowerTitle.includes('technician') || lowerTitle.includes('technologist') || lowerTitle.includes('lab')) {
    return { icon: '🔬', color: 'text-purple-500', bg: 'bg-purple-50' };
  }
  if (lowerTitle.includes('therapist') || lowerTitle.includes('therapy')) {
    return { icon: '💆‍♂️', color: 'text-green-500', bg: 'bg-green-50' };
  }
  if (lowerTitle.includes('pediatric') || lowerTitle.includes('children')) {
    return { icon: '👶', color: 'text-pink-500', bg: 'bg-pink-50' };
  }
  if (lowerTitle.includes('surgeon') || lowerTitle.includes('surgery')) {
    return { icon: '⚕️', color: 'text-indigo-500', bg: 'bg-indigo-50' };
  }
  if (lowerTitle.includes('dentist') || lowerTitle.includes('dental')) {
    return { icon: '🦷', color: 'text-cyan-500', bg: 'bg-cyan-50' };
  }
  if (lowerTitle.includes('pharmacist') || lowerTitle.includes('pharmacy')) {
    return { icon: '💊', color: 'text-yellow-500', bg: 'bg-yellow-50' };
  }
  if (lowerTitle.includes('manager') || lowerTitle.includes('director') || lowerTitle.includes('chief')) {
    return { icon: '👔', color: 'text-gray-600', bg: 'bg-gray-50' };
  }
  if (lowerTitle.includes('assistant') || lowerTitle.includes('aide')) {
    return { icon: '🤝', color: 'text-orange-500', bg: 'bg-orange-50' };
  }
  if (lowerTitle.includes('specialist')) {
    return { icon: '🎯', color: 'text-teal-500', bg: 'bg-teal-50' };
  }
  
  // Default medical icon
  return { icon: '🏥', color: 'text-gray-500', bg: 'bg-gray-50' };
};

const JobCard = ({ job, onPreview, onSave, isSaved }) => {
  const formatSalary = (salary) => {
    if (!salary) return '';
    const num = parseInt(salary);
    if (num < 1000) return `$${num}`;
    if (num < 1000000) return `$${Math.floor(num/1000)}k`;
    return `$${Math.floor(num/1000000)}M`;
  };

  const getTimeAgo = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now - date;
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.floor(diffDays/7)} week${Math.floor(diffDays/7) > 1 ? 's' : ''} ago`;
    if (diffDays < 365) return `${Math.floor(diffDays/30)} month${Math.floor(diffDays/30) > 1 ? 's' : ''} ago`;
    return `${Math.floor(diffDays/365)} year${Math.floor(diffDays/365) > 1 ? 's' : ''} ago`;
  };

  const salaryDisplay = formatSalary(job.salary);
  const timeAgo = getTimeAgo(job.created_at);
  const jobIcon = getJobIcon(job.title);

  return (
    <div className="bg-white border-b border-gray-200 py-6 px-4 hover:bg-gray-50 transition-colors group">
      <div className="flex justify-between items-start">
        {/* Left Content - Job Details */}
        <div className="flex-1">
          {/* Job Title with Icon */}
          <div className="flex items-center gap-3 mb-2">
            <div className={`w-10 h-10 ${jobIcon.bg} rounded-lg flex items-center justify-center`}>
              <span className="text-xl">{jobIcon.icon}</span>
            </div>
            <div>
              <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                {job.title}
                {job.is_featured && (
                  <span className="px-2 py-1 bg-gradient-to-r from-yellow-400 to-orange-400 text-white text-xs font-bold rounded-full">
                    FEATURED
                  </span>
                )}
              </h3>
              {/* Company Name with healthcare icon */}
              <div className="flex items-center gap-2 mt-1">
                <BuildingOfficeIcon className="w-4 h-4 text-gray-400" />
                <p className="text-lg font-semibold text-gray-800">{job.company}</p>
                {job.is_verified && (
                  <ShieldCheckIcon className="w-4 h-4 text-blue-500" title="Verified Employer" />
                )}
              </div>
            </div>
          </div>
          
          {/* Location, Salary, Time */}
          <div className="flex flex-wrap items-center gap-6 text-gray-600 ml-13">
            {/* Location */}
            <div className="flex items-center group/location">
              <MapPinIcon className="w-5 h-5 mr-2 text-gray-500 group-hover/location:text-blue-500 transition-colors" />
              <span className="group-hover/location:text-blue-700 transition-colors">{job.location}</span>
            </div>
            
            {/* Salary */}
            {salaryDisplay && (
              <div className="flex items-center group/salary">
                <CurrencyDollarIcon className="w-5 h-5 mr-2 text-gray-500 group-hover/salary:text-green-500 transition-colors" />
                <span className="group-hover/salary:text-green-700 transition-colors font-medium">{salaryDisplay}</span>
                <span className="text-xs text-gray-400 ml-1">/year</span>
              </div>
            )}
            
            {/* Time Posted */}
            <div className="flex items-center group/time">
              <ClockIcon className="w-5 h-5 mr-2 text-gray-500 group-hover/time:text-purple-500 transition-colors" />
              <span className="group-hover/time:text-purple-700 transition-colors">{timeAgo}</span>
            </div>
            
            {/* Job Type Badge */}
            {job.job_type && (
              <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                job.job_type === 'full_time' 
                  ? 'bg-blue-100 text-blue-700'
                  : job.job_type === 'part_time'
                  ? 'bg-green-100 text-green-700'
                  : job.job_type === 'contract'
                  ? 'bg-orange-100 text-orange-700'
                  : 'bg-purple-100 text-purple-700'
              }`}>
                {job.job_type.replace('_', ' ').toUpperCase()}
              </span>
            )}
          </div>
          
          {/* Quick Description Preview */}
          <p className="text-gray-600 text-sm mt-4 ml-13 line-clamp-2">
            {job.description?.substring(0, 120)}...
            <button 
              onClick={() => onPreview(job)}
              className="text-blue-600 hover:text-blue-800 font-medium ml-2"
            >
              Read more
            </button>
          </p>
        </div>
        
        {/* Right Content - Action Buttons */}
        <div className="flex flex-col items-end gap-4 ml-4">
          {/* Action Buttons */}
          <div className="flex items-center gap-2">
            {/* Save Button */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                onSave(job.id);
              }}
              className={`p-2 rounded-lg transition-all ${isSaved ? 'bg-blue-50 text-blue-600' : 'hover:bg-gray-100 text-gray-400 hover:text-gray-600'}`}
              title={isSaved ? "Saved" : "Save job"}
            >
              {isSaved ? (
                <BookmarkIconSolid className="w-6 h-6" />
              ) : (
                <BookmarkIcon className="w-6 h-6" />
              )}
            </button>
            
            {/* Quick View Button */}
            <button
              onClick={() => onPreview(job)}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors text-gray-400 hover:text-gray-600"
              title="Quick view"
            >
              <EyeIcon className="w-6 h-6" />
            </button>
            
            {/* Share Button */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                if (navigator.share) {
                  navigator.share({
                    title: job.title,
                    text: `Check out this ${job.title} position at ${job.company}`,
                    url: window.location.href,
                  });
                } else {
                  navigator.clipboard.writeText(window.location.href);
                  // Show copied notification
                }
              }}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors text-gray-400 hover:text-gray-600"
              title="Share job"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
              </svg>
            </button>
          </div>
          
          {/* Apply Now Button */}
          <div className="flex flex-col items-end gap-2">
            <button
              onClick={() => onPreview(job)}
              className="px-6 py-2.5 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors whitespace-nowrap shadow-sm hover:shadow"
            >
              Apply Now
            </button>
            <div className="text-xs text-gray-500">
              {job.total_applications || 0} applicant{job.total_applications !== 1 ? 's' : ''}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Building icon component
const BuildingOfficeIcon = ({ className = "w-6 h-6" }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
  </svg>
);

const JobsPage = () => {
  const [jobs, setJobs] = useState([]);
  const [filteredJobs, setFilteredJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [previewJob, setPreviewJob] = useState(null);
  const [savedJobs, setSavedJobs] = useState(new Set());
  const { user } = useAuth();
  const navigate = useNavigate();

  // Filter states
  const [filters, setFilters] = useState({
    search: '',
    location: '',
    jobType: '',
    salaryRange: ''
  });

  // Sample data matching the uploaded image EXACTLY
  const sampleJobs = [
    {
      id: 1,
      title: "Senior Registered Nurse",
      company: "Mercy Hospital",
      location: "Los Angeles, CA",
      salary: "95000",
      created_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
      description: "We are seeking an experienced Senior Registered Nurse to join our critical care team. The ideal candidate will provide comprehensive nursing care, supervise junior staff, and ensure the highest standards of patient care in our state-of-the-art facility.",
      requirements: "• Bachelor of Science in Nursing (BSN) required\n• Current California RN license\n• Minimum 5 years of clinical nursing experience\n• ACLS and BLS certifications\n• Strong leadership and communication skills\n• Experience in critical care or emergency department preferred",
      job_type: "full_time",
      application_deadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
      is_active: true,
      is_featured: true,
      is_verified: true,
      total_applications: 45,
      created_by: "HR Department"
    },
    {
      id: 2,
      title: "General Practitioner",
      company: "HealthLink Clinic",
      location: "San Francisco, CA",
      salary: "180000",
      created_at: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
      description: "Join our multidisciplinary clinic as a General Practitioner. Provide primary care services, manage patient health, and work collaboratively with specialists to deliver comprehensive healthcare solutions to our diverse patient population.",
      requirements: "• Medical Doctor (MD) or Doctor of Osteopathic Medicine (DO) degree\n• Board certified in Family Medicine or Internal Medicine\n• Valid California medical license\n• Minimum 3 years of clinical experience\n• Excellent diagnostic and patient management skills\n• Bilingual in Spanish preferred",
      job_type: "full_time",
      application_deadline: new Date(Date.now() + 21 * 24 * 60 * 60 * 1000).toISOString(),
      is_active: true,
      is_featured: false,
      is_verified: true,
      total_applications: 28,
      created_by: "Clinic Director"
    },
    {
      id: 3,
      title: "Medical Laboratory Technician",
      company: "BioTech Diagnostics",
      location: "Houston, TX",
      salary: "60000",
      created_at: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
      description: "Perform laboratory tests and procedures to aid in diagnosis, treatment, and prevention of diseases. Work with state-of-the-art equipment in a modern laboratory setting, ensuring accuracy and reliability of test results.",
      requirements: "• Associate's or Bachelor's degree in Medical Technology or related field\n• MLT or MT certification (ASCP preferred)\n• Minimum 2 years of laboratory experience\n• Knowledge of laboratory safety protocols\n• Experience with automated laboratory equipment\n• Strong attention to detail and analytical skills",
      job_type: "full_time",
      application_deadline: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(),
      is_active: true,
      is_featured: true,
      is_verified: false,
      total_applications: 32,
      created_by: "Lab Manager"
    },
    {
      id: 4,
      title: "Physical Therapist",
      company: "RehabPlus Center",
      location: "Chicago, IL",
      salary: "85000",
      created_at: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
      description: "Provide physical therapy services to patients with injuries, disabilities, or other health conditions. Develop treatment plans, guide patients through exercises, and help restore movement and reduce pain.",
      job_type: "full_time",
      application_deadline: new Date(Date.now() + 45 * 24 * 60 * 60 * 1000).toISOString(),
      is_active: true,
      is_featured: false,
      is_verified: true,
      total_applications: 18
    },
    {
      id: 5,
      title: "Pediatrician",
      company: "Children's Health Center",
      location: "Boston, MA",
      salary: "220000",
      created_at: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
      description: "Provide comprehensive medical care for infants, children, and adolescents. Conduct routine check-ups, diagnose and treat illnesses, and provide guidance on child health and development.",
      job_type: "full_time",
      application_deadline: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000).toISOString(),
      is_active: true,
      is_featured: true,
      is_verified: true,
      total_applications: 22
    },
    {
      id: 6,
      title: "Emergency Room Nurse",
      company: "City General Hospital",
      location: "New York, NY",
      salary: "88000",
      created_at: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
      description: "Provide emergency nursing care to patients in a fast-paced ER environment. Assess patient conditions, administer treatments, and coordinate with medical teams.",
      job_type: "full_time",
      application_deadline: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000).toISOString(),
      is_active: true,
      is_featured: false,
      is_verified: true,
      total_applications: 31
    }
  ];

  useEffect(() => {
    fetchJobs();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [filters, jobs]);

  const fetchJobs = async () => {
    try {
      setLoading(true);
      // Try to fetch from API first, fall back to sample data
      const response = await fetch('http://127.0.0.1:8000/api/jobs/jobs/');
      if (response.ok) {
        const data = await response.json();
        setJobs(data);
        setFilteredJobs(data);
      } else {
        // Use sample data if API fails
        setJobs(sampleJobs);
        setFilteredJobs(sampleJobs);
      }
    } catch (err) {
      // Use sample data if there's an error
      setJobs(sampleJobs);
      setFilteredJobs(sampleJobs);
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = [...jobs];

    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      filtered = filtered.filter(job =>
        job.title.toLowerCase().includes(searchLower) ||
        job.company.toLowerCase().includes(searchLower) ||
        job.description.toLowerCase().includes(searchLower)
      );
    }

    if (filters.location) {
      filtered = filtered.filter(job =>
        job.location.toLowerCase().includes(filters.location.toLowerCase())
      );
    }

    if (filters.jobType) {
      filtered = filtered.filter(job => job.job_type === filters.jobType);
    }

    if (filters.salaryRange) {
      const [min, max] = filters.salaryRange.split('-').map(Number);
      filtered = filtered.filter(job => {
        const salary = parseInt(job.salary) || 0;
        return salary >= min && salary <= max;
      });
    }

    setFilteredJobs(filtered);
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const clearFilters = () => {
    setFilters({
      search: '',
      location: '',
      jobType: '',
      salaryRange: ''
    });
  };

  const toggleSaveJob = (jobId) => {
    const newSaved = new Set(savedJobs);
    if (newSaved.has(jobId)) {
      newSaved.delete(jobId);
    } else {
      newSaved.add(jobId);
    }
    setSavedJobs(newSaved);
  };

  const openPreview = (job) => {
    setPreviewJob(job);
  };

  const closePreview = () => {
    setPreviewJob(null);
  };

  const handleApply = (job) => {
    if (user) {
      navigate(`/apply/${job.id}`);
    } else {
      navigate('/register', { state: { from: `/apply/${job.id}` } });
    }
  };

  // Function to get time ago for modal
  const getTimeAgo = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now - date;
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.floor(diffDays/7)} week${Math.floor(diffDays/7) > 1 ? 's' : ''} ago`;
    if (diffDays < 365) return `${Math.floor(diffDays/30)} month${Math.floor(diffDays/30) > 1 ? 's' : ''} ago`;
    return `${Math.floor(diffDays/365)} year${Math.floor(diffDays/365) > 1 ? 's' : ''} ago`;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-gray-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading healthcare jobs...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-4 py-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <span className="text-2xl">🏥</span>
            </div>
            <h1 className="text-3xl font-bold text-gray-900">Healthcare Jobs</h1>
          </div>
          <p className="text-gray-600 ml-13">Find your next opportunity in healthcare</p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Search and Filter Bar */}
        <div className="bg-white rounded-lg border border-gray-200 p-4 mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search Input */}
            <div className="flex-1">
              <div className="relative">
                <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  name="search"
                  value={filters.search}
                  onChange={handleFilterChange}
                  placeholder="Search jobs, companies, or specialties..."
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>

            {/* Location Filter */}
            <div className="relative md:w-48">
              <MapPinIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                name="location"
                value={filters.location}
                onChange={handleFilterChange}
                placeholder="Location"
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            {/* Job Type Filter */}
            <select
              name="jobType"
              value={filters.jobType}
              onChange={handleFilterChange}
              className="border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">All Types</option>
              <option value="full_time">Full Time</option>
              <option value="part_time">Part Time</option>
              <option value="contract">Contract</option>
              <option value="remote">Remote</option>
            </select>

            {/* Salary Filter */}
            <select
              name="salaryRange"
              value={filters.salaryRange}
              onChange={handleFilterChange}
              className="border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">All Salaries</option>
              <option value="40000-70000">$40k - $70k</option>
              <option value="70000-100000">$70k - $100k</option>
              <option value="100000-150000">$100k - $150k</option>
              <option value="150000-250000">$150k+</option>
            </select>

            {/* Filter Button */}
            <button
              onClick={() => document.getElementById('mobile-filters')?.classList.toggle('hidden')}
              className="md:hidden px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
            >
              <FunnelIcon className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Results Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">
              {filteredJobs.length} {filteredJobs.length === 1 ? 'Job' : 'Jobs'} Found
            </h2>
            <p className="text-sm text-gray-600 mt-1">
              Showing healthcare opportunities in various specialties
            </p>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-sm text-gray-600">
              <span className="font-medium">{savedJobs.size}</span> jobs saved
            </div>
            <select 
              onChange={(e) => {
                let sorted = [...filteredJobs];
                if (e.target.value === 'salary_high') {
                  sorted.sort((a, b) => (b.salary || 0) - (a.salary || 0));
                } else if (e.target.value === 'newest') {
                  sorted.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
                } else if (e.target.value === 'featured') {
                  sorted.sort((a, b) => (b.is_featured ? 1 : 0) - (a.is_featured ? 1 : 0));
                }
                setFilteredJobs(sorted);
              }}
              className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="newest">Most Recent</option>
              <option value="salary_high">Highest Salary</option>
              <option value="featured">Featured Jobs</option>
            </select>
          </div>
        </div>

        {/* Jobs List */}
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden shadow-sm">
          {filteredJobs.length === 0 ? (
            <div className="p-12 text-center">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <MagnifyingGlassIcon className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">No jobs found</h3>
              <p className="text-gray-600">Try adjusting your search filters</p>
              <button
                onClick={clearFilters}
                className="mt-4 px-4 py-2 text-blue-600 hover:text-blue-800 font-medium"
              >
                Clear all filters
              </button>
            </div>
          ) : (
            <>
              {filteredJobs.map((job, index) => (
                <React.Fragment key={job.id}>
                  <JobCard
                    job={job}
                    onPreview={openPreview}
                    onSave={toggleSaveJob}
                    isSaved={savedJobs.has(job.id)}
                  />
                  {index < filteredJobs.length - 1 && <div className="border-t border-gray-200"></div>}
                </React.Fragment>
              ))}
            </>
          )}
        </div>

        {/* Pagination */}
        {filteredJobs.length > 0 && (
          <div className="mt-8 flex justify-center">
            <nav className="flex items-center gap-2">
              <button className="px-4 py-2 border border-gray-300 rounded-lg text-gray-600 hover:bg-gray-50">
                Previous
              </button>
              <button className="px-4 py-2 bg-blue-600 text-white rounded-lg">1</button>
              <button className="px-4 py-2 border border-gray-300 rounded-lg text-gray-600 hover:bg-gray-50">
                2
              </button>
              <button className="px-4 py-2 border border-gray-300 rounded-lg text-gray-600 hover:bg-gray-50">
                3
              </button>
              <button className="px-4 py-2 border border-gray-300 rounded-lg text-gray-600 hover:bg-gray-50">
                Next
              </button>
            </nav>
          </div>
        )}

        {/* Stats */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white p-4 rounded-lg border border-gray-200">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center">
                <BriefcaseIcon className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-900">{jobs.length}</div>
                <div className="text-gray-600 text-sm">Total Jobs</div>
              </div>
            </div>
          </div>
          <div className="bg-white p-4 rounded-lg border border-gray-200">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-green-50 rounded-lg flex items-center justify-center">
                <CurrencyDollarIcon className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <div className="text-2xl font-bold text-green-600">
                  ${Math.round(jobs.reduce((acc, job) => acc + (parseInt(job.salary) || 0), 0) / jobs.length).toLocaleString()}
                </div>
                <div className="text-gray-600 text-sm">Avg Salary</div>
              </div>
            </div>
          </div>
          <div className="bg-white p-4 rounded-lg border border-gray-200">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-purple-50 rounded-lg flex items-center justify-center">
                <MapPinIcon className="w-6 h-6 text-purple-600" />
              </div>
              <div>
                <div className="text-2xl font-bold text-purple-600">
                  {[...new Set(jobs.map(job => job.location.split(',')[0]))].length}
                </div>
                <div className="text-gray-600 text-sm">Cities</div>
              </div>
            </div>
          </div>
          <div className="bg-white p-4 rounded-lg border border-gray-200">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-orange-50 rounded-lg flex items-center justify-center">
                <BuildingOfficeIcon className="w-6 h-6 text-orange-600" />
              </div>
              <div>
                <div className="text-2xl font-bold text-orange-600">
                  {[...new Set(jobs.map(job => job.company))].length}
                </div>
                <div className="text-gray-600 text-sm">Companies</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Job Preview Modal */}
      {previewJob && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-hidden">
            <div className="p-6">
              <div className="flex justify-between items-start mb-6">
                <div className="flex items-start gap-4">
                  <div className={`w-12 h-12 ${getJobIcon(previewJob.title).bg} rounded-lg flex items-center justify-center`}>
                    <span className="text-2xl">{getJobIcon(previewJob.title).icon}</span>
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-1">{previewJob.title}</h2>
                    <div className="flex items-center gap-2">
                      <p className="text-lg font-semibold text-gray-800">{previewJob.company}</p>
                      {previewJob.is_verified && (
                        <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs font-medium rounded-full">
                          Verified
                        </span>
                      )}
                    </div>
                    <p className="text-gray-600 mt-2">{previewJob.location}</p>
                    
                    <div className="flex items-center gap-4 mt-3">
                      {previewJob.salary && (
                        <span className="px-3 py-1 bg-green-50 text-green-700 rounded-full text-sm font-medium">
                          ${parseInt(previewJob.salary).toLocaleString()}/year
                        </span>
                      )}
                      <span className="text-gray-500 text-sm">
                        Posted {getTimeAgo(previewJob.created_at)}
                      </span>
                    </div>
                  </div>
                </div>
                <button
                  onClick={closePreview}
                  className="p-2 hover:bg-gray-100 rounded-lg"
                >
                  <XMarkIcon className="w-6 h-6 text-gray-500" />
                </button>
              </div>

              <div className="space-y-6">
                <div>
                  <h3 className="font-semibold text-gray-900 mb-3 text-lg">Description</h3>
                  <p className="text-gray-700 whitespace-pre-line">{previewJob.description}</p>
                </div>

                {previewJob.requirements && (
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-3 text-lg">Requirements</h3>
                    <div className="bg-gray-50 rounded-lg p-4">
                      <div className="text-gray-700 whitespace-pre-line">{previewJob.requirements}</div>
                    </div>
                  </div>
                )}
              </div>

              <div className="mt-8 pt-6 border-t border-gray-200 flex justify-between items-center">
                <div className="text-sm text-gray-600">
                  <span className="font-medium">{previewJob.total_applications || 0}</span> applicants • Apply before {new Date(previewJob.application_deadline).toLocaleDateString()}
                </div>
                <div className="flex gap-3">
                  <button
                    onClick={closePreview}
                    className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                  >
                    Close
                  </button>
                  <button
                    onClick={() => handleApply(previewJob)}
                    className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium"
                  >
                    Apply Now
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default JobsPage;