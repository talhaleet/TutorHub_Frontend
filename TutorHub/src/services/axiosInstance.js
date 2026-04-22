// axiosInstance.js — UPDATED for Day 4
// Now reads token via getToken() from tokenUtils (same as before),
// but the 401 interceptor now updates the Zustand store after refresh.
import axios from "axios";
import { getToken, getRefreshToken, saveToken, clearToken }
 from "../utils/tokenUtils";
const axiosInstance = axios.create({
 baseURL: import.meta.env.VITE_API_URL,
 headers: { "Content-Type": "application/json" },
 timeout: 15000, // 15 second timeout — prevent hanging requests
});
// ── Request Interceptor: attach JWT ─────────────────────────────────
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
// ── Response Interceptor: handle 401 with token refresh ─────────────
axiosInstance.interceptors.response.use(
 (response) => response,
 async (error) => {
 const originalRequest = error.config;
 if (error.response?.status === 401 && !originalRequest._retry) {
 originalRequest._retry = true;
 // _retry flag prevents infinite loop if refresh also returns 401.
 try {
 const refreshTokenValue = getRefreshToken();
 if (!refreshTokenValue) throw new Error("No refresh token");
 const res = await axios.post(
 `${import.meta.env.VITE_API_URL}/api/auth/refresh-token`,
 { refreshToken: refreshTokenValue }
 );
 // Use plain axios (not axiosInstance) to avoid interceptor loop.
 const { accessToken, refreshToken: newRefreshToken } = res.data;
 saveToken(accessToken, newRefreshToken);
 // Update localStorage with new tokens.
 // Retry the original request with the new token.
 originalRequest.headers.Authorization = `Bearer ${accessToken}`;
 return axiosInstance(originalRequest);
 } catch (refreshError) {
 // Refresh failed — token is invalid, log the user out.
 clearToken();
 // Clear tokens from localStorage.
 // Import authStore dynamically to avoid circular dependency.
 // (authStore imports tokenUtils which is used in the interceptor)
 const { default: useAuthStore } = await import("../store/authStore");
 useAuthStore.getState().logout();
 // Zustand getState() allows calling store actions outside React.
 window.location.href = "/login";
 return Promise.reject(refreshError);
 }
 }
 return Promise.reject(error);
 }
);
export default axiosInstance;