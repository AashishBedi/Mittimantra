import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    // Add auth token if available
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Handle unauthorized access
      localStorage.removeItem('token');
      window.location.href = '/';
    }
    return Promise.reject(error);
  }
);

// API Services
export const apiService = {
  // Health check
  healthCheck: async () => {
    const response = await api.get('/health');
    return response.data;
  },

  // Crop Recommendation
  predictCrop: async (data) => {
    const response = await api.post('/predict-crop', data);
    return response.data;
  },

  // Disease Detection
  predictDisease: async (file) => {
    const formData = new FormData();
    formData.append('file', file);

    const response = await api.post('/predict-disease', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  // Irrigation Scheduler
  getIrrigationSchedule: async (data) => {
    const response = await api.post('/irrigation-schedule', data);
    return response.data;
  },

  // Pest Control
  getPestControl: async (file) => {
    const formData = new FormData();
    formData.append('file', file);

    const response = await api.post('/pest-control', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  // Authentication
  login: async (username, password) => {
    const response = await api.post('/api/auth/login', { username, password });
    return response.data;
  },

  register: async (email, username, password, full_name = null) => {
    const response = await api.post('/api/auth/register', {
      email,
      username,
      password,
      full_name,
    });
    return response.data;
  },

  logout: async () => {
    const response = await api.post('/api/auth/logout');
    return response.data;
  },

  getProfile: async () => {
    const response = await api.get('/api/auth/me');
    return response.data;
  },

  // Crop Patterns
  getCropPatterns: async () => {
    const response = await api.get('/crop-patterns');
    return response.data;
  },

  // Farmer Insights
  getFarmerInsights: async () => {
    const response = await api.get('/farmer-insights');
    return response.data;
  },
};

export default api;