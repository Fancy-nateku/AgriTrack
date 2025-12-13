import axios, { AxiosInstance, AxiosError } from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

// Create axios instance
const apiClient: AxiosInstance = axios.create({
  baseURL: `${API_URL}/api`,
  timeout: 10000, // 10 second timeout
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
apiClient.interceptors.request.use(
  (config) => {
    const session = localStorage.getItem('agritrack_session');
    if (session) {
      try {
        const { token } = JSON.parse(session);
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
      } catch (error) {
        console.error('Error parsing session:', error);
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
apiClient.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    if (error.code === 'ECONNABORTED' || error.code === 'ERR_NETWORK') {
      console.error('Network error or timeout:', error.message);
      // Don't redirect on network errors, just propagate the error
      return Promise.reject({
        ...error,
        message: 'Network error. Please check your connection and try again.',
      });
    }
    
    if (error.response?.status === 401) {
      // Clear session on 401
      localStorage.removeItem('agritrack_session');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// API methods
export const api = {
  // Auth
  auth: {
    register: (username: string, password: string, full_name?: string) =>
      apiClient.post('/auth/register', { username, password, full_name }),
    
    login: (username: string, password: string) =>
      apiClient.post('/auth/login', { username, password }),
    
    getCurrentUser: () =>
      apiClient.get('/auth/me'),
  },

  // Farms
  farms: {
    getAll: () =>
      apiClient.get('/farms'),
    
    getDefault: () =>
      apiClient.get('/farms/default'),
    
    create: (data: { name: string; location?: string; size_acres?: number }) =>
      apiClient.post('/farms', data),
    
    update: (id: string, data: { name?: string; location?: string; size_acres?: number }) =>
      apiClient.put(`/farms/${id}`, data),
    
    delete: (id: string) =>
      apiClient.delete(`/farms/${id}`),
  },

  // Expenses
  expenses: {
    getAll: (farm_id: string) =>
      apiClient.get('/expenses', { params: { farm_id } }),
    
    create: (data: { farm_id: string; category: string; description: string; amount: number; date: string }) =>
      apiClient.post('/expenses', data),
    
    update: (id: string, data: { category?: string; description?: string; amount?: number; date?: string }) =>
      apiClient.put(`/expenses/${id}`, data),
    
    delete: (id: string) =>
      apiClient.delete(`/expenses/${id}`),
  },

  // Income
  income: {
    getAll: (farm_id: string) =>
      apiClient.get('/income', { params: { farm_id } }),
    
    create: (data: { farm_id: string; source: string; description?: string; amount: number; date: string }) =>
      apiClient.post('/income', data),
    
    update: (id: string, data: { source?: string; description?: string; amount?: number; date?: string }) =>
      apiClient.put(`/income/${id}`, data),
    
    delete: (id: string) =>
      apiClient.delete(`/income/${id}`),
  },

  // Activities
  activities: {
    getAll: (farm_id: string) =>
      apiClient.get('/activities', { params: { farm_id } }),
    
    create: (data: {
      farm_id: string;
      description: string;
      time_frame: string;
      custom_date?: string;
      priority: string;
      notes?: string;
    }) =>
      apiClient.post('/activities', data),
    
    update: (id: string, data: {
      description?: string;
      time_frame?: string;
      custom_date?: string;
      priority?: string;
      notes?: string;
    }) =>
      apiClient.put(`/activities/${id}`, data),
    
    toggleComplete: (id: string) =>
      apiClient.patch(`/activities/${id}/toggle`),
    
    delete: (id: string) =>
      apiClient.delete(`/activities/${id}`),
  },

  // Dashboard
  dashboard: {
    getMetrics: (farm_id: string) =>
      apiClient.get('/dashboard/metrics', { params: { farm_id } }),
  },
};

export default apiClient;
