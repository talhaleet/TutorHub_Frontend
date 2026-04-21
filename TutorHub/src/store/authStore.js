import { create } from 'zustand';
import { saveToken, clearToken, getToken } from '../utils/tokenUtils';

const useAuthStore = create((set) => ({
  user:            null,
  token:           getToken(),
  isAuthenticated: !!getToken(),
  isLoading:       false,

  login: (userData, accessToken, refreshToken) => {
    saveToken(accessToken, refreshToken);
    set({ user: userData, token: accessToken, isAuthenticated: true });
  },

  logout: () => {
    clearToken();
    set({ user: null, token: null, isAuthenticated: false });
  },

  updateUser: (userData) => {
    set({ user: userData });
  },

  setLoading: (bool) => {
    set({ isLoading: bool });
  },
}));

export default useAuthStore;