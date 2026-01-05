import axios from "axios";

// Create axios instance
const api = axios.create({
  baseURL: "http://localhost:8000/api",
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
            "http://localhost:8000/api/auth/token/refresh/",
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
};

// Profile API calls - UPDATED ENDPOINTS
export const profileAPI = {
  // Get or create profile
  getProfile: async () => {
    try {
      const response = await api.get("/profile/me/");
      return response.data;
    } catch (error) {
      // If profile doesn't exist, return null
      if (error.response?.status === 404) {
        return null;
      }
      throw error;
    }
  },

  // Create or update profile
  saveProfile: async (data) => {
    try {
      // First try to get existing profile
      const existingProfile = await api.get("/profile/me/").catch(() => null);
      
      if (existingProfile?.data) {
        // Update existing profile
        if (data instanceof FormData) {
          return api.put("/profile/me/", data, {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          });
        }
        return api.put("/profile/me/", data);
      } else {
        // Create new profile
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
      // If update fails, try to create
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

  // Create new profile (explicit)
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

  // Update existing profile
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

  // Upload file
  uploadFile: (fileType, file) => {
    const formData = new FormData();
    formData.append(fileType, file);
    return api.post(`/profile/upload_${fileType}/`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  },
};

export default api;