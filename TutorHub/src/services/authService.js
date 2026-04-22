// authService.js — All authentication API calls for TutorHub
// All functions return the response data directly.
// Axios errors propagate to the caller for toast handling.
import axiosInstance from "./axiosInstance";
// ^ Every auth call uses our configured axios instance (has JWT interceptors).
// ── register ────────────────────────────────────────────────────────
// Sends a new user registration to the backend.
// data: { firstName, lastName, email, password, role }
// Returns: { message: "Verification email sent" }
export const register = async (data) => {
 const response = await axiosInstance.post("/api/auth/register", data);
 return response.data;
};
// ── login ───────────────────────────────────────────────────────────
// Authenticates a user with email and password.
// data: { email, password }
// Returns: { accessToken, refreshToken, user: { id, email, role, firstName, lastName } 

export const login = async (data) => {
 const response = await axiosInstance.post("/api/auth/login", data);
 return response.data;
 // On success: caller stores accessToken + refreshToken in Zustand authStore.
 // On failure: axios throws an error with response.data.message from backend.
};
// ── refreshToken ────────────────────────────────────────────────────
// Exchanges an expired access token for a new one using the refresh token.
// data: { refreshToken }
// Returns: { accessToken, refreshToken }
export const refreshToken = async (data) => {
 const response = await axiosInstance.post("/api/auth/refresh-token", data);
 return response.data;
 // Called automatically by axiosInstance response interceptor on 401.
};
// ── logout ──────────────────────────────────────────────────────────
// Revokes the refresh token on the server side.
// data: { refreshToken }
export const logout = async (data) => {
    await axiosInstance.post("/api/auth/logout", data);
 // Note: axiosInstance interceptors will try to refresh if 401.
 // That is fine — the backend revokes the token then returns 200.
};
// ── forgotPassword ──────────────────────────────────────────────────
// Sends a password reset link to the user's email.
// data: { email }
// Returns: { message: "If that email exists, a reset link was sent." }
export const forgotPassword = async (data) => {
 const response = await axiosInstance.post("/api/auth/forgot-password", data);
 return response.data;
 // Backend always returns 200 regardless of whether email exists.
 // This prevents email enumeration attacks.
};
// ── resetPassword ───────────────────────────────────────────────────
// Sets a new password using the token from the reset email link.
// data: { token, email, newPassword }
export const resetPassword = async (data) => {
 const response = await axiosInstance.post("/api/auth/reset-password", data);
 return response.data;
};
// ── verifyEmail ─────────────────────────────────────────────────────
// Confirms the user's email address using the token from the verification link.
// token: string (from URL query param)
export const verifyEmail = async (token) => {
 const response = await axiosInstance.post("/api/auth/verify-email", { token });
 return response.data;
};
// ── changePassword ───────────────────────────────────────────────────
// Changes password for an already-logged-in user.
// data: { currentPassword, newPassword }
export const changePassword = async (data) => {
 const response = await axiosInstance.put("/api/auth/change-password", data);
 return response.data;
};