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


export const jobAPI = {
  getAllJobs: (params) => api.get('/jobs/jobs/', { params }),
  getJob: (id) => api.get(`/jobs/jobs/${id}/`),
  applyForJob: (formData) => api.post('/jobs/applications/', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  }),
  getMyApplications: () => api.get('/jobs/applications/my_applications/'),
  getApplication: (id) => api.get(`/jobs/applications/${id}/`),
  updateApplicationStatus: (id, status) => 
    api.patch(`/jobs/applications/${id}/update_status/`, { status }),
};

// Profile API calls
export const profileAPI = {
  // For file uploads, we need to use FormData and multipart/form-data
  createProfile: (data) => {
    // If data is FormData (contains files), use multipart/form-data
    if (data instanceof FormData) {
      return api.post("/profile/create/", data, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
    }
    // Otherwise use JSON
    return api.post("/profile/create/", data);
  },
  getProfile: () => api.get("/profile/me/"),
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
};

export default api;
