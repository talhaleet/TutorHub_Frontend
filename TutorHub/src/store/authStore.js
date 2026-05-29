import { create } from 'zustand';
import {
  saveToken,
  clearToken,
  getToken,
  saveUser,
  getStoredUser,
  parseUserFromToken,
  isTokenExpired,
} from '../utils/tokenUtils';

const hydrateFromStorage = () => {
  const token = getToken();
  if (!token || isTokenExpired(token)) {
    return { user: null, token: null, isAuthenticated: false };
  }
  const stored = getStoredUser();
  const user = stored || parseUserFromToken(token);
  return { user, token, isAuthenticated: true };
};

const initial = hydrateFromStorage();

const useAuthStore = create((set) => ({
  user: initial.user,
  token: initial.token,
  isAuthenticated: initial.isAuthenticated,
  isLoading: false,

  login: (userData, accessToken, refreshToken) => {
    saveToken(accessToken, refreshToken);
    saveUser(userData);
    set({ user: userData, token: accessToken, isAuthenticated: true });
  },

  logout: () => {
    clearToken();
    set({ user: null, token: null, isAuthenticated: false });
  },

  updateUser: (data) =>
    set((state) => {
      const user = { ...state.user, ...data };
      saveUser(user);
      return { user };
    }),

  rehydrate: () => {
    const next = hydrateFromStorage();
    set(next);
    return next;
  },

  setLoading: (isLoading) => set({ isLoading }),
}));

export default useAuthStore;
