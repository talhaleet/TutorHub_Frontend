import { USER_ROLES } from './constants';

export const isStudent = (user) => user?.role === USER_ROLES.STUDENT;
export const isParent = (user) => user?.role === USER_ROLES.PARENT;
export const isTutor = (user) => user?.role === USER_ROLES.TUTOR;
export const isAdmin = (user) => user?.role === USER_ROLES.ADMIN;

export const getDashboardRoute = (role) => {
  switch (role) {
    case USER_ROLES.STUDENT:
      return '/dashboard/student';
    case USER_ROLES.PARENT:
      return '/dashboard/parent';
    case USER_ROLES.TUTOR:
      return '/dashboard/tutor';
    case USER_ROLES.ADMIN:
      return '/admin';
    default:
      return '/';
  }
};
