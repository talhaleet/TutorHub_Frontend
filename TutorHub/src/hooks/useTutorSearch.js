// src/hooks/useTutorSearch.js
import { useState, useCallback } from "react";

const DEFAULT_FILTERS = {
  keyword: '', subjectId: '', gradeLevelId: '',
  minPrice: '', maxPrice: '', minRating: '',
  teachingMode: '', city: '', sortBy: 'rating',
  page: 1, pageSize: 10,
};

export function useTutorSearch(initialKeyword = '') {
  const [filters, setFilters] = useState({
    ...DEFAULT_FILTERS,
    keyword: initialKeyword,
  });

  const setFilter = useCallback((key, value) => {
    setFilters(prev => ({ ...prev, [key]: value, page: 1 }));
  }, []);

  const resetFilters = useCallback(() => {
    setFilters(DEFAULT_FILTERS);
  }, []);

  const goToPage = useCallback((page) => {
    setFilters(prev => ({ ...prev, page }));
  }, []);

  return { filters, setFilter, resetFilters, goToPage };
}