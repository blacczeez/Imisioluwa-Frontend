import axios from 'axios';
import { getClientApiBaseUrl } from '@/lib/api';

const api = axios.create({
  baseURL: getClientApiBaseUrl(),
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor for adding language header and auth token
api.interceptors.request.use((config) => {
  if (typeof window !== 'undefined') {
    const language = localStorage.getItem('language') || 'en';
    config.headers['Accept-Language'] = language;

    // Add admin token if available
    const adminToken = localStorage.getItem('adminToken');
    if (adminToken) {
      config.headers.Authorization = `Bearer ${adminToken}`;
    }
  }

  return config;
});

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (typeof window !== 'undefined') {
      if (error.response?.status === 401 && window.location.pathname.startsWith('/admin') && window.location.pathname !== '/admin/login') {
        localStorage.removeItem('adminToken');
        localStorage.removeItem('adminUser');
        window.location.href = '/admin/login';
      }
    }
    console.error('API Error:', error);
    return Promise.reject(error);
  }
);

export default api;
