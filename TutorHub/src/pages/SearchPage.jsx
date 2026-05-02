import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";

import FilterPanel from "../components/search/FilterPanel";
import TutorCard from "../components/tutor/TutorCard";
import { searchTutors } from "../services/searchService";

const SearchPage = () => {
  const [searchParams] = useSearchParams();

  // ✅ Get keyword from URL (initial only)
  const keywordFromURL = searchParams.get("q") || "";

  const [filters, setFilters] = useState({
    keyword: keywordFromURL,
    city: "",
    teachingMode: "All",
    maxPrice: "5000",
    minRating: "",
    sortBy: "rating",
    page: 1,
  });

  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);

  // ✅ Sync URL → filters ONLY when URL changes (no override while typing)
  useEffect(() => {
    if (keywordFromURL && keywordFromURL !== filters.keyword) {
      setFilters((f) => ({
        ...f,
        keyword: keywordFromURL,
        page: 1,
      }));
    }
  }, [keywordFromURL]);

  // ✅ Debounce keyword (prevents API spam)
  const [debouncedKeyword, setDebouncedKeyword] = useState(filters.keyword);

  useEffect(() => {
    const t = setTimeout(() => {
      setDebouncedKeyword(filters.keyword);
    }, 400);

    return () => clearTimeout(t);
  }, [filters.keyword]);

  // ✅ React Query
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["tutors", { ...filters, keyword: debouncedKeyword }],
    queryFn: () =>
      searchTutors({ ...filters, keyword: debouncedKeyword }),
    keepPreviousData: true,
  });

  const tutors = data?.data ?? [];
  const total = data?.total ?? 0;
  const pageSize = data?.pageSize ?? 6;
  const totalPages = Math.ceil(total / pageSize);

  // Handlers
  const handleFilterChange = (key, value) => {
    setFilters((f) => ({
      ...f,
      [key]: value,
      page: 1,
    }));
  };

  const handleResetFilters = () => {
    setFilters({
      keyword: "",
      city: "",
      teachingMode: "All",
      maxPrice: "5000",
      minRating: "",
      sortBy: "rating",
      page: 1,
    });
  };

  const handlePageChange = (newPage) => {
    setFilters((f) => ({ ...f, page: newPage }));
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="min-h-screen bg-neutral-50">
      {/* HEADER */}
      <div className="bg-primary py-10 px-4">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-3xl font-bold text-white mb-2">
            Find Your Perfect Tutor
          </h1>
          <p className="text-blue-200">
            {total > 0
              ? `${total} tutor${total !== 1 ? "s" : ""} found`
              : isLoading
              ? "Searching..."
              : "No tutors found matching your criteria"}
          </p>
        </div>
      </div>

      {/* MOBILE FILTER BUTTON */}
      <div className="md:hidden sticky top-16 z-30 bg-white border-b border-neutral-200 px-4 py-3">
        <button
          onClick={() => setIsMobileFilterOpen(true)}
          className="flex items-center gap-2 px-4 py-2 bg-primary text-white text-sm font-semibold rounded-xl"
        >
          Filters & Sort
        </button>
      </div>

      {/* MAIN */}
      <div className="max-w-6xl mx-auto px-4 py-8 flex gap-8">
        {/* FILTER PANEL */}
        <FilterPanel
          filters={filters}
          onFilterChange={handleFilterChange}
          onReset={handleResetFilters}
          isMobileOpen={isMobileFilterOpen}
          onMobileClose={() => setIsMobileFilterOpen(false)}
        />

        {/* RESULTS */}
        <main className="flex-1 min-w-0">
          {/* LOADING */}
          {isLoading && (
            <div className="grid sm:grid-cols-2 gap-6">
              {Array.from({ length: 6 }).map((_, i) => (
                <div
                  key={i}
                  className="bg-white rounded-2xl border border-neutral-200 animate-pulse h-80"
                />
              ))}
            </div>
          )}

          {/* ERROR */}
          {isError && !isLoading && (
            <div className="bg-red-50 border border-red-200 rounded-2xl p-8 text-center">
              <p className="text-red-700 font-semibold">
                Failed to load tutors.
              </p>
              <p className="text-red-500 text-sm mt-1">
                {error?.message || "Please try again."}
              </p>
            </div>
          )}

          {/* EMPTY */}
          {!isLoading && !isError && tutors.length === 0 && (
            <div className="text-center py-20">
              <div className="text-6xl mb-4">🔍</div>
              <h3 className="text-xl font-bold text-neutral-700 mb-2">
                No tutors found
              </h3>
              <p className="text-neutral-500 mb-6">
                Try adjusting your filters.
              </p>
              <button
                onClick={handleResetFilters}
                className="px-6 py-3 bg-primary text-white font-semibold rounded-xl"
              >
                Clear all filters
              </button>
            </div>
          )}

          {/* RESULTS GRID */}
          {!isLoading && tutors.length > 0 && (
            <div className="grid sm:grid-cols-2 gap-6">
              {tutors.map((tutor) => (
                <TutorCard key={tutor.id} tutor={tutor} />
              ))}
            </div>
          )}

          {/* PAGINATION */}
          {totalPages > 1 && (
            <div className="flex justify-center items-center gap-2 mt-10">
              <button
                onClick={() => handlePageChange(filters.page - 1)}
                disabled={filters.page <= 1}
                className="px-4 py-2 rounded-xl border border-neutral-200 text-sm font-semibold disabled:opacity-40"
              >
                ← Previous
              </button>

              {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                (p) => (
                  <button
                    key={p}
                    onClick={() => handlePageChange(p)}
                    className={`w-10 h-10 rounded-xl text-sm font-semibold ${
                      p === filters.page
                        ? "bg-primary text-white"
                        : "border border-neutral-200"
                    }`}
                  >
                    {p}
                  </button>
                )
              )}

              <button
                onClick={() => handlePageChange(filters.page + 1)}
                disabled={filters.page >= totalPages}
                className="px-4 py-2 rounded-xl border border-neutral-200 text-sm font-semibold disabled:opacity-40"
              >
                Next →
              </button>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default SearchPage;