import { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';

import { searchTutors } from '../services/searchService';

import SearchBar from '../components/search/SearchBar';
import FilterPanel from '../components/search/FilterPanel';
import SortDropdown from '../components/search/SortDropdown';
import TutorCard from '../components/tutor/TutorCard';
import Pagination from '../components/common/Pagination';

// ── Default filter state ──────────────────────────────────────
const DEFAULT_FILTERS = {
  keyword: '',
  subjectIds: [],
  gradeLevelId: null,
  minPrice: 0,
  maxPrice: 5000,
  minRating: null,
  teachingMode: '',
  city: '',
  page: 1,
  pageSize: 9,
  sortBy: 'rating',
};

const SearchPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [isPanelOpen, setIsPanelOpen] = useState(false);

  // Read keyword directly from URL when needed, not from state
  const [filters, setFilters] = useState(() => ({
    ...DEFAULT_FILTERS,
    keyword: searchParams.get('q') || '',
  }));

  const handleSearch = (keyword) => {
    setFilters((prev) => ({ ...prev, keyword, page: 1 }));
    // Update URL without causing re-renders that trigger effects
    if (keyword) {
      setSearchParams({ q: keyword });
    } else {
      setSearchParams({});
    }
  };

  // ── React Query ─────────────────────────────────────
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ['tutors', filters],
    queryFn: () =>
      searchTutors({
        ...filters,
        subjectIds: filters.subjectIds.join(','),
      }),
    placeholderData: (prev) => prev,
    staleTime: 1000 * 30,
  });

  const tutors = data?.tutors || [];
  const total = data?.total || 0;
  const totalPages = data?.totalPages || 1;

  const handleFilterChange = (newFilters) => {
    setFilters({ ...newFilters, page: 1 });
  };

  const handleReset = () => {
    setFilters({ ...DEFAULT_FILTERS, keyword: filters.keyword });
    setSearchParams({});
  };

  // ── Skeleton ─────────────────────────────────────
  const SkeletonCard = () => (
    <div className="bg-white rounded-2xl border border-neutral-200 shadow-card animate-pulse p-5 space-y-4">
      <div className="flex gap-4">
        <div className="w-14 h-14 bg-neutral-200 rounded-2xl flex-shrink-0" />
        <div className="flex-1 space-y-2">
          <div className="h-4 bg-neutral-200 rounded w-2/3" />
          <div className="h-3 bg-neutral-200 rounded w-1/2" />
          <div className="h-3 bg-neutral-200 rounded w-1/3" />
        </div>
      </div>
      <div className="flex gap-2">
        <div className="h-6 w-20 bg-neutral-200 rounded-full" />
        <div className="h-6 w-16 bg-neutral-200 rounded-full" />
      </div>
      <div className="h-9 bg-neutral-200 rounded-xl" />
    </div>
  );

  return (
    <div className="min-h-screen bg-neutral-50">
      {/* ── Header ───────────────── */}
      <div className="bg-white border-b border-neutral-200 shadow-navbar sticky top-16 z-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3">
          <div className="flex items-center gap-3">
            {/* Mobile Filter Button */}
            <button
              onClick={() => setIsPanelOpen(true)}
              className="md:hidden flex items-center gap-2 px-3 py-2 rounded-xl border border-neutral-300 text-sm font-medium text-neutral-700 hover:bg-neutral-50 transition-colors flex-shrink-0"
            >
              <svg
                className="w-4 h-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 4h13M3 8h9m-9 4h6m4 0l4-4m0 0l4 4m-4-4v12"
                />
              </svg>
              Filters
            </button>

            <div className="flex-1">
              <SearchBar
                size="sm"
                initialValue={filters.keyword}
                onSearch={handleSearch}
              />
            </div>

            <div className="hidden sm:block">
              <SortDropdown
                value={filters.sortBy}
                onChange={(v) =>
                  setFilters((prev) => ({ ...prev, sortBy: v, page: 1 }))
                }
              />
            </div>
          </div>
        </div>
      </div>

      {/* ── Main Layout ───────────────── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        <div className="flex gap-8">
          {/* Filters */}
          <FilterPanel
            filters={filters}
            onChange={handleFilterChange}
            onReset={handleReset}
            isOpen={isPanelOpen}
            onClose={() => setIsPanelOpen(false)}
          />

          {/* Results */}
          <main className="flex-1 min-w-0">
            <div className="flex items-center justify-between mb-6">
              <p className="text-sm text-neutral-600">
                {isLoading
                  ? 'Searching...'
                  : `${total} tutor${total !== 1 ? 's' : ''} found`}
              </p>

              <div className="sm:hidden">
                <SortDropdown
                  value={filters.sortBy}
                  onChange={(v) =>
                    setFilters((prev) => ({
                      ...prev,
                      sortBy: v,
                      page: 1,
                    }))
                  }
                />
              </div>
            </div>

            {/* Error */}
            {isError && (
              <div className="bg-error-light border border-error/20 rounded-2xl p-8 text-center">
                <p className="text-error font-semibold mb-2">
                  Search failed
                </p>
                <p className="text-sm text-neutral-500">
                  {error?.message ||
                    'Please check your connection and try again.'}
                </p>
              </div>
            )}

            {/* Loading */}
            {isLoading && (
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {Array.from({ length: 6 }).map((_, i) => (
                  <SkeletonCard key={i} />
                ))}
              </div>
            )}

            {/* Empty */}
            {!isLoading && !isError && tutors.length === 0 && (
              <div className="bg-white rounded-2xl border border-neutral-200 shadow-card p-16 text-center">
                <div className="text-5xl mb-4">😕</div>
                <h3 className="text-lg font-bold text-neutral-900 mb-2">
                  No tutors found
                </h3>
                <p className="text-sm text-neutral-500 mb-6 max-w-sm mx-auto">
                  Try adjusting your filters or searching for a different subject or location.
                </p>
                <button
                  onClick={handleReset}
                  className="px-6 py-2.5 bg-primary text-white text-sm font-semibold rounded-xl hover:bg-primary-dark transition-colors"
                >
                  Clear all filters
                </button>
              </div>
            )}

            {/* Results */}
            {!isLoading && tutors.length > 0 && (
              <>
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
                  {tutors.map((tutor) => (
                    <TutorCard key={tutor.userId} tutor={tutor} />
                  ))}
                </div>

                <Pagination
                  currentPage={filters.page}
                  totalPages={totalPages}
                  onPageChange={(p) =>
                    setFilters((prev) => ({ ...prev, page: p }))
                  }
                />
              </>
            )}
          </main>
        </div>
      </div>
    </div>
  );
};

export default SearchPage;