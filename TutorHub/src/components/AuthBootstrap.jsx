import { useEffect } from 'react';
import useAuthStore from '../store/authStore';

/** Re-sync auth store from localStorage on app load (fixes admin 403 after refresh). */
const AuthBootstrap = ({ children }) => {
  const rehydrate = useAuthStore((s) => s.rehydrate);

  useEffect(() => {
    rehydrate();
  }, [rehydrate]);

  return children;
};

export default AuthBootstrap;
