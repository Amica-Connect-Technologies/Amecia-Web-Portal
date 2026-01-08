import axios from "axios";

// Create axios instance
const api = axios.create({
  baseURL: "http://127.0.0.1:8000/api",
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("access_token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor for token refresh
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshToken = localStorage.getItem("refresh_token");
        if (refreshToken) {
          const response = await axios.post(
            "http://127.0.0.1:8000/api/auth/token/refresh/",
            { refresh: refreshToken }
          );

          const { access } = response.data;
          localStorage.setItem("access_token", access);
          originalRequest.headers.Authorization = `Bearer ${access}`;

          return api(originalRequest);
        }
      } catch (refreshError) {
        localStorage.clear();
        window.location.href = "/login";
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

// Auth API calls
export const authAPI = {
  register: (data) => api.post("/auth/register/", data),
  login: (data) => api.post("/auth/login/", data),
  getProfile: () => api.get("/auth/me/"),
};

// Job API calls
export const jobAPI = {
  getAllJobs: (params) => api.get('/jobs/jobs/', { params }),
  getJob: (id) => api.get(`/jobs/jobs/${id}/`),
  getMyPostedJobs: () => api.get('/jobs/jobs/my_posted_jobs/'),
  getJobApplications: (jobId) => api.get(`/jobs/jobs/${jobId}/applications/`),
  
  // Applications
  applyForJob: (formData) => api.post('/jobs/applications/', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  }),
  getMyApplications: () => api.get('/jobs/applications/my_applications/'),
  getApplication: (id) => api.get(`/jobs/applications/${id}/`),
  updateApplicationStatus: (id, status) => 
    api.patch(`/jobs/applications/${id}/update_status/`, { status }),
  getAllApplications: () => api.get('/jobs/applications/'),
  
  // NEW: Dashboard specific job APIs
  getRecentApplications: (limit = 5) => api.get(`/jobs/applications/my_applications/?limit=${limit}`),
  getJobStats: () => api.get('/jobs/stats/'),
  getEmployerApplications: () => api.get('/jobs/applications/employer_applications/'),
  getSavedJobs: () => api.get('/jobs/saved_jobs/'),
};

// Profile API calls - UPDATED ENDPOINTS
export const profileAPI = {
  // Get or create profile (existing)
  getProfile: async () => {
    try {
      const response = await api.get("/profile/me/");
      return response.data;
    } catch (error) {
      if (error.response?.status === 404) {
        return null;
      }
      throw error;
    }
  },

  // Create or update profile (existing)
  saveProfile: async (data) => {
    try {
      const existingProfile = await api.get("/profile/me/").catch(() => null);
      
      if (existingProfile?.data) {
        if (data instanceof FormData) {
          return api.put("/profile/me/", data, {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          });
        }
        return api.put("/profile/me/", data);
      } else {
        if (data instanceof FormData) {
          return api.post("/profile/create/", data, {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          });
        }
        return api.post("/profile/create/", data);
      }
    } catch (error) {
      if (data instanceof FormData) {
        return api.post("/profile/create/", data, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
      }
      return api.post("/profile/create/", data);
    }
  },

  // Create new profile (existing)
  createProfile: (data) => {
    if (data instanceof FormData) {
      return api.post("/profile/create/", data, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
    }
    return api.post("/profile/create/", data);
  },

  // Update existing profile (existing)
  updateProfile: (data) => {
    if (data instanceof FormData) {
      return api.put("/profile/me/", data, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
    }
    return api.put("/profile/me/", data);
  },

  // Upload file (existing)
  uploadFile: (fileType, file) => {
    const formData = new FormData();
    formData.append(fileType, file);
    return api.post(`/profile/upload_${fileType}/`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  },

  // NEW: Dashboard specific profile APIs
  getDashboardStats: () => api.get('/profile/dashboard-stats/'),
  getProfileCompletion: () => api.get('/profile/completion/'),
  getNotifications: () => api.get('/profile/notifications/'),
  markNotificationRead: (id) => api.patch(`/profile/notifications/${id}/read/`),
  getRecentActivity: () => api.get('/profile/recent-activity/'),
  
  // NEW: User type specific profile checks
  getJobSeekerProfile: () => api.get('/profile/job-seeker/'),
  getEmployerProfile: () => api.get('/profile/employer/'),
  getClinicProfile: () => api.get('/profile/clinic/'),
};

// NEW: Clinic API calls for dashboard
export const clinicAPI = {
  getAppointments: () => api.get('/clinic/appointments/'),
  getRecentAppointments: (limit = 5) => api.get(`/clinic/appointments/recent/?limit=${limit}`),
  getAppointmentsToday: () => api.get('/clinic/appointments/today/'),
  getClinicStats: () => api.get('/clinic/stats/'),
  getDoctorAvailability: () => api.get('/clinic/doctors/availability/'),
  createAppointment: (data) => api.post('/clinic/appointments/', data),
};

// NEW: Dashboard API calls (aggregated data)
export const dashboardAPI = {
  // Get all dashboard data at once
  getDashboardData: () => api.get('/dashboard/'),
  
  // Get quick stats
  getQuickStats: () => api.get('/dashboard/quick-stats/'),
  
  // Get user type specific dashboard
  getUserDashboard: (userType) => api.get(`/dashboard/${userType}/`),
  
  // Get recent activities
  getRecentActivities: () => api.get('/dashboard/recent-activities/'),
  
  // Get upcoming events
  getUpcomingEvents: () => api.get('/dashboard/upcoming-events/'),
  
  // Get profile completion
  getProfileCompletion: () => api.get('/dashboard/profile-completion/'),
};

// NEW: Helper functions for dashboard
export const getDashboardData = async (user) => {
  try {
    // Get user type
    const userType = user?.user_type;
    
    // Fetch all dashboard data in parallel
    const [profileResponse, statsResponse, activityResponse, notificationsResponse] = await Promise.allSettled([
      // Get profile based on user type
      userType === 'job_seeker' ? profileAPI.getJobSeekerProfile() :
      userType === 'employer' ? profileAPI.getEmployerProfile() :
      userType === 'clinic' ? profileAPI.getClinicProfile() :
      profileAPI.getProfile(),
      
      // Get dashboard stats
      dashboardAPI.getQuickStats(),
      
      // Get recent activity
      profileAPI.getRecentActivity(),
      
      // Get notifications
      profileAPI.getNotifications(),
    ]);
    
    return {
      profile: profileResponse.status === 'fulfilled' ? profileResponse.value?.data || null : null,
      stats: statsResponse.status === 'fulfilled' ? statsResponse.value?.data || {} : {},
      recentActivity: activityResponse.status === 'fulfilled' ? activityResponse.value?.data || [] : [],
      notifications: notificationsResponse.status === 'fulfilled' ? notificationsResponse.value?.data || [] : [],
      userType: userType,
    };
    
  } catch (error) {
    console.error('Error fetching dashboard data:', error);
    throw error;
  }
};

// NEW: Helper function to calculate profile completion
export const calculateProfileCompletion = (profile, userType) => {
  if (!profile) return 0;
  
  let requiredFields = [];
  let totalWeight = 0;
  let completedWeight = 0;
  
  // Define required fields based on user type
  switch(userType) {
    case "job_seeker":
      requiredFields = [
        { field: 'first_name', weight: 15 },
        { field: 'last_name', weight: 15 },
        { field: 'phone_number', weight: 10 },
        { field: 'address', weight: 10 },
        { field: 'profession', weight: 15 },
        { field: 'experience_years', weight: 15 },
        { field: 'skills', weight: 10 },
        { field: 'resume', weight: 10 },
      ];
      break;
    case "employer":
      requiredFields = [
        { field: 'company_name', weight: 25 },
        { field: 'contact_person', weight: 20 },
        { field: 'phone_number', weight: 15 },
        { field: 'company_address', weight: 20 },
        { field: 'company_description', weight: 20 },
      ];
      break;
    case "clinic":
      requiredFields = [
        { field: 'clinic_name', weight: 25 },
        { field: 'address', weight: 20 },
        { field: 'phone_number', weight: 15 },
        { field: 'services', weight: 20 },
        { field: 'number_of_doctors', weight: 10 },
        { field: 'specializations', weight: 10 },
      ];
      break;
    default:
      // Generic profile completion
      requiredFields = Object.keys(profile).map(field => ({
        field,
        weight: Math.round(100 / Object.keys(profile).length)
      }));
  }
  
  // Calculate completion
  requiredFields.forEach(({ field, weight }) => {
    totalWeight += weight;
    if (profile[field] !== null && profile[field] !== "" && profile[field] !== undefined) {
      completedWeight += weight;
    }
  });
  
  return totalWeight > 0 ? Math.round((completedWeight / totalWeight) * 100) : 0;
};

// NEW: Helper to get user-specific stats
export const getUserStats = async (userType) => {
  try {
    let stats = {};
    
    switch(userType) {
      case "job_seeker":
        const [applications, savedJobs] = await Promise.all([
          jobAPI.getMyApplications().catch(() => ({ data: { count: 0, results: [] } })),
          jobAPI.getSavedJobs().catch(() => ({ data: { count: 0 } })),
        ]);
        
        // Count interviews scheduled
        const interviewCount = applications.data.results?.filter(app => 
          app.status === 'interview_scheduled'
        ).length || 0;
        
        stats = {
          applicationsCount: applications.data.count || 0,
          savedJobsCount: savedJobs.data.count || 0,
          interviewsScheduled: interviewCount,
          profileViews: 0, // You'll need to add this field to your profile
        };
        break;
        
      case "employer":
        const [postedJobs, allApplications] = await Promise.all([
          jobAPI.getMyPostedJobs().catch(() => ({ data: { count: 0, results: [] } })),
          jobAPI.getAllApplications().catch(() => ({ data: { count: 0, results: [] } })),
        ]);
        
        // Count active jobs
        const activeJobs = postedJobs.data.results?.filter(job => 
          job.status === 'active'
        ).length || 0;
        
        // Count new applications
        const newApplications = allApplications.data.results?.filter(app => 
          app.status === 'applied'
        ).length || 0;
        
        stats = {
          postedJobsCount: postedJobs.data.count || 0,
          totalApplications: allApplications.data.count || 0,
          activeJobs: activeJobs,
          newApplications: newApplications,
        };
        break;
        
      case "clinic":
        const [clinicStats, todayAppointments] = await Promise.all([
          clinicAPI.getClinicStats().catch(() => ({ data: {} })),
          clinicAPI.getAppointmentsToday().catch(() => ({ data: { results: [] } })),
        ]);
        
        stats = {
          totalDoctors: clinicStats.data.number_of_doctors || 0,
          availableSlots: clinicStats.data.available_slots || 0,
          appointmentsToday: todayAppointments.data.results?.length || 0,
          patientVisits: clinicStats.data.patient_visits || 0,
        };
        break;
        
      default:
        stats = {};
    }
    
    return stats;
    
  } catch (error) {
    console.error('Error getting user stats:', error);
    return {};
  }
};

// NEW: Helper to get recent activity
export const getRecentActivity = async (userType) => {
  try {
    let activities = [];
    
    switch(userType) {
      case "job_seeker":
        const applications = await jobAPI.getRecentApplications(3).catch(() => ({ data: { results: [] } }));
        activities = applications.data.results?.map(app => ({
          id: app.id,
          type: 'application',
          title: `Applied for ${app.job?.title || 'a job'}`,
          description: `Status: ${app.status}`,
          time: new Date(app.applied_at || app.created_at).toLocaleDateString(),
          icon: 'DocumentCheckIcon',
          color: 'text-blue-500',
        })) || [];
        break;
        
      case "employer":
        const allApps = await jobAPI.getAllApplications().catch(() => ({ data: { results: [] } }));
        const recentApps = allApps.data.results?.slice(0, 3) || [];
        activities = recentApps.map(app => ({
          id: app.id,
          type: 'application_received',
          title: `New application received`,
          description: `For: ${app.job?.title || 'your job'}`,
          time: new Date(app.applied_at || app.created_at).toLocaleDateString(),
          icon: 'UsersIcon',
          color: 'text-green-500',
        }));
        break;
        
      case "clinic":
        const appointments = await clinicAPI.getRecentAppointments(3).catch(() => ({ data: { results: [] } }));
        activities = appointments.data.results?.map(apt => ({
          id: apt.id,
          type: 'appointment',
          title: `Appointment scheduled`,
          description: `Patient: ${apt.patient_name || 'New patient'}`,
          time: new Date(apt.date || apt.created_at).toLocaleDateString(),
          icon: 'CalendarIcon',
          color: 'text-purple-500',
        })) || [];
        break;
    }
    
    return activities;
    
  } catch (error) {
    console.error('Error getting recent activity:', error);
    return [];
  }
};

export default api;