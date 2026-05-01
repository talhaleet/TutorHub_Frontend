// tutorService.js -- src/services/
import axiosInstance from './axiosInstance';
// Public: Get tutor profile by userId (no auth required)
export const getTutorProfile = async (userId) => {
 const res = await axiosInstance.get(`/api/tutor/${userId}`);
 return res.data;
};
// Tutor: Update own profile
export const updateTutorProfile = async (data) => {
 const res = await axiosInstance.put('/api/tutor/profile', data);
 return res.data;
};
// Tutor: Upload document
export const uploadDocument = async (file, documentType) => {
 const formData = new FormData();
 formData.append('file', file);
 formData.append('documentType', documentType);
 const res = await axiosInstance.post('/api/tutor/documents', formData, {
 headers: { 'Content-Type': 'multipart/form-data' },
 });
 return res.data;
};
// Tutor: Get own availability / Set weekly availability
export const getAvailability = async () => {
 const res = await axiosInstance.get('/api/tutor/availability');
 return res.data;
};
export const setAvailability = async (slots) => {
 const res = await axiosInstance.post('/api/tutor/availability', slots);
 return res.data;
};