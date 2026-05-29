import axiosInstance from './axiosInstance';

export const getNotifications = async () => {
  const res = await axiosInstance.get('/api/notifications');
  return res.data;
};

export const markNotificationRead = async (id) => {
  const res = await axiosInstance.put(`/api/notifications/${id}/read`);
  return res.data;
};

export const markAllNotificationsRead = async () => {
  await axiosInstance.put('/api/notifications/read-all');
  return { success: true };
};

export const getNotificationPreferences = async () => {
  const res = await axiosInstance.get('/api/notifications/preferences');
  return res.data.data;
};

export const saveNotificationPreferences = async (prefs) => {
  const res = await axiosInstance.post('/api/notifications/preferences', prefs);
  return res.data;
};
