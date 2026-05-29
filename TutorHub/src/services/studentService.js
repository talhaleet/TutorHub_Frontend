import axiosInstance from './axiosInstance';

export const getChildrenProfiles = async () => {
  const res = await axiosInstance.get('/api/student/children');
  return res.data;
};

export const addChildProfile = async (data) => {
  const res = await axiosInstance.post('/api/student/children', data);
  return res.data;
};

export const updateChildProfile = async (id, data) => {
  const res = await axiosInstance.put(`/api/student/children/${id}`, data);
  return res.data;
};

export const deleteChildProfile = async (id) => {
  await axiosInstance.delete(`/api/student/children/${id}`);
  return { success: true };
};

export const getStudentStats = async () => {
  const res = await axiosInstance.get('/api/student/stats');
  return res.data;
};

export const getParentStats = async () => {
  const res = await axiosInstance.get('/api/parent/stats');
  return res.data;
};
