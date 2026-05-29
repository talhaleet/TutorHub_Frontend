import { Navigate, useLocation } from 'react-router-dom';
import useAuthStore from '../../store/authStore';

const ProtectedRoute = ({ children, allowedRoles }) => {
  const { isAuthenticated, user } = useAuthStore();
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location.pathname }} replace />;
  }

  if (allowedRoles?.length) {
    if (!user?.role) {
      return <Navigate to="/login" state={{ from: location.pathname }} replace />;
    }
    if (!allowedRoles.includes(user.role)) {
      const fallback =
        user.role === 'Admin'
          ? '/admin'
          : user.role === 'Tutor'
            ? '/dashboard/tutor'
            : user.role === 'Parent'
              ? '/dashboard/parent'
              : '/dashboard/student';
      return <Navigate to={fallback} replace />;
    }
  }

  return children;
};

export default ProtectedRoute;
