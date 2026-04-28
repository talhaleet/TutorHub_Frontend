// searchService.js — src/services/
// All search API calls. Imported by React Query hooks.
import axiosInstance from './axiosInstance';

// ── Search tutors with filters ────────────────────────────────
// filters: { keyword, subjectId, gradeLevelId, minPrice,
// maxPrice, minRating, teachingMode, city,
// page, pageSize, sortBy }
export const searchTutors = async (filters = {}) => {
  const params = new URLSearchParams();
  Object.entries(filters).forEach(([key, val]) => {
    if (val !== null && val !== undefined && val !== '') {
      params.append(key, val);
    }
  });
  const response = await axiosInstance.get(
    `/api/search/tutors?${params.toString()}`
  );
  return response.data;
  // Returns: { tutors: TutorSearchResultDto[], total, page, pageSize, totalPages }
};

// ── Autocomplete suggestions ─────────────────────────────────
// Called as user types — returns matching tutor names and subjects.
// Keep query short — backend handles prefix matching.
export const getAutocomplete = async (query) => {
  if (!query || query.trim().length < 2) return [];
  const response = await axiosInstance.get(
    `/api/search/autocomplete?q=${encodeURIComponent(query)}`
  );
  return response.data; // string[]
};

// ── Subjects dropdown ────────────────────────────────────────
// Seeded from DataSeeder.cs — returns all active subjects.
export const getSubjects = async () => {
  const response = await axiosInstance.get('/api/search/subjects');
  return response.data; // { id, name, category }[]
};

// ── Grade levels dropdown ─────────────────────────────────────
export const getGradeLevels = async () => {
  const response = await axiosInstance.get('/api/search/grade-levels');
  return response.data; // { id, name, sortOrder }[]
};