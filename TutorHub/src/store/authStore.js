import { create } from "zustand";
import { saveToken, clearToken, getToken } from "../utils/tokenUtils";
const useAuthStore = create((set) => ({
user: null,
token: getToken() || null, // rehydrate from localStorage on pageload
isAuthenticated: !!getToken(), // true if token exists in storage
isLoading: false,
// login — called by LoginPage.jsx after successful API response
login: (userData, accessToken, refreshToken) => {
saveToken(accessToken, refreshToken); // persist to localStorage
set({ user: userData, token: accessToken, isAuthenticated: true });
},
// logout — called by axiosInstance on 401 refresh failure, or by user
logout: () => {
clearToken(); // remove from localStorage
set({ user: null, token: null, isAuthenticated: false });
},
// updateUser — called after profile edit to keep store in sync
updateUser: (data) => set((state) => ({
user: { ...state.user, ...data }
})),
setLoading: (isLoading) => set({ isLoading }),
}));
export default useAuthStore;