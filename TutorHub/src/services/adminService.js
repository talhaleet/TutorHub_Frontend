import axiosInstance from './axiosInstance';

export const getAdminUsers = async () => {
  const res = await axiosInstance.get('/api/admin/users');
  return res.data;
};

export const toggleUserStatus = async (userId, status) => {
  const res = await axiosInstance.put(`/api/admin/users/${userId}/status`, { status });
  return res.data;
};

export const changeUserRole = async (userId, role) => {
  const res = await axiosInstance.put(`/api/admin/users/${userId}/role`, { role });
  return res.data;
};

export const getPendingTutors = async () => {
  const res = await axiosInstance.get('/api/admin/tutors/pending');
  return res.data;
};

export const approveTutor = async (tutorId, notes = '') => {
  const res = await axiosInstance.post(`/api/admin/tutors/${tutorId}/approve`, { notes });
  return res.data;
};

export const rejectTutor = async (tutorId, reason) => {
  const res = await axiosInstance.post(`/api/admin/tutors/${tutorId}/reject`, { reason });
  return res.data;
};

export const getAdminBookings = async () => {
  const res = await axiosInstance.get('/api/admin/bookings');
  return res.data;
};

export const cancelAdminBooking = async (bookingId, reason) => {
  const res = await axiosInstance.put(`/api/admin/bookings/${bookingId}/cancel`, { reason });
  return res.data;
};

export const getSubjectsList = async () => {
  const res = await axiosInstance.get('/api/admin/subjects');
  const data = res.data?.data ?? res.data ?? [];
  return data.map((s) => (typeof s === 'string' ? s : s.name));
};

export const addSubject = async (name) => {
  const res = await axiosInstance.post('/api/admin/subjects', { name });
  return res.data;
};

export const deleteSubject = async (name) => {
  await axiosInstance.delete(`/api/admin/subjects/${encodeURIComponent(name)}`);
  return { success: true };
};

export const getGradeLevelsList = async () => {
  const res = await axiosInstance.get('/api/admin/grade-levels');
  const data = res.data?.data ?? res.data ?? [];
  return data.map((g) => (typeof g === 'string' ? g : g.name));
};

export const addGradeLevel = async (name) => {
  const res = await axiosInstance.post('/api/admin/grade-levels', { name });
  return res.data;
};

export const deleteGradeLevel = async (name) => {
  await axiosInstance.delete(`/api/admin/grade-levels/${encodeURIComponent(name)}`);
  return { success: true };
};

export const getAdminAnalytics = async () => {
  const res = await axiosInstance.get('/api/admin/analytics');
  return res.data;
};
