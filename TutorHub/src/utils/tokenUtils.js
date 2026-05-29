const TOKEN_KEY = 'tutorhub_access_token';
const REFRESH_KEY = 'tutorhub_refresh_token';
const USER_KEY = 'tutorhub_user';

export const saveToken = (accessToken, refreshToken) => {
  localStorage.setItem(TOKEN_KEY, accessToken);
  localStorage.setItem(REFRESH_KEY, refreshToken);
};

export const saveUser = (user) => {
  if (user) localStorage.setItem(USER_KEY, JSON.stringify(user));
};

export const getStoredUser = () => {
  try {
    const raw = localStorage.getItem(USER_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
};

export const clearUser = () => {
  localStorage.removeItem(USER_KEY);
};

export const getToken = () => localStorage.getItem(TOKEN_KEY);

export const getRefreshToken = () => localStorage.getItem(REFRESH_KEY);

export const clearToken = () => {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(REFRESH_KEY);
  clearUser();
};

export const isTokenExpired = (token) => {
  if (!token) return true;
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    return payload.exp * 1000 < Date.now();
  } catch {
    return true;
  }
};

/** Decode role and user id from JWT (supports mapped and short claim names). */
export const parseUserFromToken = (token) => {
  if (!token) return null;
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    const role =
      payload.role
      || payload['http://schemas.microsoft.com/ws/2008/06/identity/claims/role']
      || 'Student';
    return {
      id: payload.sub || payload.nameid || '',
      email: payload.email || payload['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress'] || '',
      firstName: payload.firstName || '',
      lastName: payload.lastName || '',
      role,
    };
  } catch {
    return null;
  }
};
