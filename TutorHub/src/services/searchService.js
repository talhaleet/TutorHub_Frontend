import axiosInstance from './axiosInstance';

const mapTutorResult = (t) => {
  const name = t.name || t.Name || 'Tutor';
  const parts = name.split(' ').filter(Boolean);
  const initials = (parts[0]?.[0] || '') + (parts[1]?.[0] || parts[0]?.[1] || '');
  return {
    id: t.id || t.Id,
    name,
    headline: t.headline || t.Headline || '',
    subjects: t.subjects || t.Subjects || [],
    gradeLevel: t.gradeLevel || t.GradeLevel || '',
    city: t.city || t.City || '',
    teachingMode: t.teachingMode || t.TeachingMode || '',
    hourlyRateMin: Number(t.hourlyRateMin ?? t.HourlyRateMin ?? 0),
    hourlyRateMax: Number(t.hourlyRateMax ?? t.HourlyRateMax ?? 0),
    experienceYears: t.experienceYears ?? t.ExperienceYears ?? 0,
    averageRating: Number(t.averageRating ?? t.AverageRating ?? 0),
    totalReviews: t.totalReviews ?? t.TotalReviews ?? 0,
    isVerified: t.isVerified ?? t.IsVerified ?? false,
    initials: initials.toUpperCase() || 'T',
    color: 'bg-blue-500',
  };
};

export const searchTutors = async (filters = {}) => {
  const params = new URLSearchParams();
  if (filters.keyword) params.set('keyword', filters.keyword);
  if (filters.city) params.set('city', filters.city);
  if (filters.teachingMode && filters.teachingMode !== 'All') params.set('teachingMode', filters.teachingMode);
  if (filters.maxPrice) params.set('maxPrice', filters.maxPrice);
  if (filters.minRating) params.set('minRating', filters.minRating);
  if (filters.sortBy) params.set('sortBy', filters.sortBy);
  if (filters.page) params.set('page', String(filters.page));
  if (filters.subjectId) params.set('subjectId', String(filters.subjectId));
  if (filters.gradeLevelId) params.set('gradeLevelId', String(filters.gradeLevelId));
  params.set('pageSize', String(filters.pageSize || 9));

  const res = await axiosInstance.get(`/api/search/tutors?${params.toString()}`);
  const body = res.data ?? {};
  const list = body.data ?? body.Data ?? [];
  return {
    data: Array.isArray(list) ? list.map(mapTutorResult) : [],
    total: body.total ?? body.Total ?? 0,
    page: body.page ?? body.Page ?? 1,
    pageSize: body.pageSize ?? body.PageSize ?? 9,
    totalPages: body.totalPages ?? body.TotalPages ?? 0,
  };
};

export const getSubjects = async () => {
  const res = await axiosInstance.get('/api/search/subjects');
  return res.data?.data ?? res.data ?? [];
};

export const getGradeLevels = async () => {
  const res = await axiosInstance.get('/api/search/grade-levels');
  return res.data?.data ?? res.data ?? [];
};

export const getAutocomplete = async (query) => {
  if (!query || query.length < 2) return [];
  const res = await axiosInstance.get(`/api/search/autocomplete?q=${encodeURIComponent(query)}`);
  return res.data?.data ?? res.data ?? [];
};
