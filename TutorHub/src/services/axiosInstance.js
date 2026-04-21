import axios from 'axios';
import { getToken, getRefreshToken, saveToken, clearToken } from '../utils/tokenUtils';

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: { 'Content-Type': 'application/json' },
});

// ── Request interceptor: attach JWT to every request ────────
axiosInstance.interceptors.request.use(
  (config) => {
    const token = getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// ── Response interceptor: handle 401 with token refresh ─────
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        const refreshToken = getRefreshToken();
        const res = await axios.post(
          `${import.meta.env.VITE_API_URL}/api/auth/refresh-token`,
          { refreshToken }
        );
        const newToken = res.data.accessToken;
        saveToken(newToken, res.data.refreshToken);
        originalRequest.headers.Authorization = `Bearer ${newToken}`;
        return axiosInstance(originalRequest);
      } catch {
        clearToken();
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);
export default axiosInstance;