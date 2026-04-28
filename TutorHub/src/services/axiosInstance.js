// src/services/axiosInstance.js
import axios from 'axios';
import useAuthStore from '../store/authStore';
 
const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '',
  // If VITE_API_URL is empty (Docker), axios uses the same origin.
  // Nginx then routes /api/* requests to the backend container.
  // If VITE_API_URL is http://localhost:5000 (local dev), it calls directly.
 
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});
 
// Request interceptor: attach JWT token to every request
axiosInstance.interceptors.request.use(
  (config) => {
    const token = useAuthStore.getState().token;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);
 
// Response interceptor: handle 401 unauthorized (refresh token flow)
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    // Your existing 401 refresh token logic here...
    return Promise.reject(error);
  }
);
 
export default axiosInstance;