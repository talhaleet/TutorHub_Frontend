export const APP_NAME = 'TutorHub';

export const USER_ROLES = {
  STUDENT: 'Student',
  PARENT: 'Parent',
  TUTOR: 'Tutor',
  ADMIN: 'Admin',
};

export const SESSION_STATUS = {
  PENDING: 'Pending',
  APPROVED: 'Approved',
  REJECTED: 'Rejected',
  COMPLETED: 'Completed',
  CANCELLED: 'Cancelled',
};

export const TEACHING_MODES = {
  ONLINE: 'Online',
  IN_PERSON: 'InPerson',
  BOTH: 'Both',
};

export const API_ENDPOINTS = {
  LOGIN: '/api/auth/login',
  REGISTER: '/api/auth/register',
  LOGOUT: '/api/auth/logout',
  REFRESH_TOKEN: '/api/auth/refresh-token',
  FORGOT_PASSWORD: '/api/auth/forgot-password',
  RESET_PASSWORD: '/api/auth/reset-password',
  VERIFY_EMAIL: '/api/auth/verify-email',
  TUTOR_PROFILE: '/api/tutor/profile',
  SEARCH_TUTORS: '/api/search/tutors',
  BOOKINGS: '/api/bookings',
  PAYMENTS: '/api/payments',
};
