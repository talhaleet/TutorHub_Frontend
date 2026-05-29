import axiosInstance from './axiosInstance';
import { resolveFileUrl } from './chatService';
import { apiSlotsToSchedule, scheduleToApiSlots } from '../utils/availabilityUtils';

const apiBase = () => (import.meta.env.VITE_API_URL || '').replace(/\/$/, '');

export const getTutorProfile = async (userId) => {
  const res = await axiosInstance.get(`/api/tutor/${userId}`);
  const p = res.data;
  const fullName = `${p.firstName || ''} ${p.lastName || ''}`.trim();
  return {
    data: {
      userId: p.userId,
      fullName,
      headline: p.headline,
      bio: p.bio,
      education: p.education,
      experienceYears: p.experienceYears,
      city: p.city,
      hourlyRateMin: p.hourlyRateMin,
      hourlyRateMax: p.hourlyRateMax,
      teachingMode: p.teachingMode,
      profileImageUrl: resolveFileUrl(p.profileImageUrl),
      demoVideoUrl: resolveFileUrl(p.demoVideoUrl),
      isVerified: p.isVerified,
      averageRating: p.averageRating,
      totalReviews: p.totalReviews,
      subjects: (p.subjects || []).map((s) =>
        typeof s === 'string' ? { id: null, name: s } : { id: s.id ?? s.Id, name: s.name ?? s.Name }
      ),
      subjectNames: (p.subjects || []).map((s) => (typeof s === 'string' ? s : s.name ?? s.Name)),
      gradeLevels: (p.subjects || []).map((s) => (typeof s === 'string' ? null : s.gradeLevel ?? s.GradeLevel)).filter(Boolean),
    },
  };
};

export const updateTutorProfile = async (data) => {
  const res = await axiosInstance.put('/api/tutor/profile', data);
  return res.data;
};

export const uploadDocument = async (file, documentType) => {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('documentType', documentType);
  const res = await axiosInstance.post('/api/tutor/documents/upload', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return res.data;
};

const tutorApiError = (err) =>
  err?.response?.data?.message || err?.message || 'Request failed';

export const getTutorDocuments = async () => {
  const res = await axiosInstance.get('/api/tutor/documents');
  return (res.data || []).map((d) => ({
    ...d,
    fileUrl: resolveFileUrl(d.fileUrl),
  }));
};

export const uploadDemoVideo = async (file) => {
  const formData = new FormData();
  formData.append('file', file);
  try {
    const res = await axiosInstance.post('/api/tutor/demo-video', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return res.data;
  } catch (err) {
    throw new Error(tutorApiError(err));
  }
};

/** Load weekly schedule as { Monday: ['09:00 AM', ...], ... } */
export const getAvailability = async () => {
  const res = await axiosInstance.get('/api/tutor/availability');
  const raw = res.data?.data ?? res.data ?? [];
  const list = Array.isArray(raw) ? raw : [];
  return { data: apiSlotsToSchedule(list) };
};

/** Save weekly schedule from UI object */
export const setAvailability = async (schedule) => {
  const payload = scheduleToApiSlots(schedule || {});
  const res = await axiosInstance.post('/api/tutor/availability', payload);
  return res.data;
};

export const resolveMediaUrl = (url) => {
  if (!url) return null;
  if (url.startsWith('http')) return url;
  return `${apiBase()}${url.startsWith('/') ? url : `/${url}`}`;
};
