import { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import TutorCard from "../components/tutor/TutorCard";
import { searchTutors } from "../services/searchService";
import PublicLayout from "../components/layout/PublicLayout";

const SearchPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

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

  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  useEffect(() => {
    if (keywordFromURL && keywordFromURL !== filters.keyword) {
      setFilters((f) => ({
        ...f,
        keyword: keywordFromURL,
        page: 1,
      }));
    }
  }, [keywordFromURL]);

  const [debouncedKeyword, setDebouncedKeyword] = useState(filters.keyword);

  useEffect(() => {
    const t = setTimeout(() => {
      setDebouncedKeyword(filters.keyword);
    }, 400);
    return () => clearTimeout(t);
  }, [filters.keyword]);

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["tutors", { ...filters, keyword: debouncedKeyword }],
    queryFn: () => searchTutors({ ...filters, keyword: debouncedKeyword }),
    keepPreviousData: true,
  });

  const tutors = data?.data ?? [];
  const total = data?.total ?? 0;
  const pageSize = data?.pageSize ?? 6;
  const totalPages = Math.ceil(total / pageSize);

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
    <PublicLayout>
      {/* Hero Search Section */}
      <div className="bg-gradient-to-r from-primary to-accent py-16 px-4 sm:px-6 lg:px-8 text-center shadow-md">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight mb-4">
            Find Your Perfect Tutor
          </h1>
          <p className="text-slate-200 text-sm sm:text-base mb-8">
            Search from verified private tutors across Pakistan for both online & in-person learning
          </p>
          
          <div className="bg-white rounded-2xl p-3 shadow-xl max-w-3xl mx-auto flex flex-col md:flex-row gap-3">
            <div className="flex-1 flex items-center gap-3 px-3 py-2 border-b md:border-b-0 md:border-r border-slate-100">
              <svg className="w-5 h-5 text-slate-400 flex-shrink-0" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"/>
              </svg>
              <input 
                type="text" 
                placeholder="Subject (Math, Science, Physics...)"
                value={filters.keyword} 
                onChange={(e) => handleFilterChange("keyword", e.target.value)} 
                className="w-full text-slate-800 placeholder-slate-400 focus:outline-none text-sm bg-transparent"
              />
            </div>
            
            <div className="flex-1 flex items-center gap-3 px-3 py-2">
              <svg className="w-5 h-5 text-slate-400 flex-shrink-0" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/>
              </svg>
              <input 
                type="text" 
                placeholder="City or location"
                value={filters.city} 
                onChange={(e) => handleFilterChange("city", e.target.value)}
                className="w-full text-slate-800 placeholder-slate-400 focus:outline-none text-sm bg-transparent"
              />
            </div>

            <button 
              onClick={() => setDebouncedKeyword(filters.keyword)}
              className="bg-primary hover:bg-primary-dark text-white font-semibold py-3 px-8 rounded-xl shadow-md transition-colors text-sm"
            >
              Search
            </button>
          </div>
        </div>
      </div>

      {/* Main content area */}
      <div className="bg-slate-50 min-h-screen py-10 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          
          {/* Filters Bar */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-5 mb-8">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5">
              
              <div className="flex flex-wrap items-center gap-3">
                
                {/* Sort dropdown */}
                <div className="flex flex-col">
                  <span className="text-[11px] font-bold text-slate-400 uppercase mb-1 tracking-wider">Sort By</span>
                  <select 
                    value={filters.sortBy} 
                    onChange={(e) => handleFilterChange("sortBy", e.target.value)}
                    className="h-10 px-3 rounded-xl border border-slate-200 text-sm text-slate-700 bg-white hover:border-slate-300 focus:outline-none focus:ring-2 focus:ring-primary/20"
                  >
                    <option value="rating">Highest Rated</option>
                    <option value="price_asc">Price: Low to High</option>
                    <option value="price_desc">Price: High to Low</option>
                    <option value="experience">Most Experienced</option>
                  </select>
                </div>

                {/* Price dropdown */}
                <div className="flex flex-col">
                  <span className="text-[11px] font-bold text-slate-400 uppercase mb-1 tracking-wider">Max Hourly Rate</span>
                  <select 
                    value={filters.maxPrice} 
                    onChange={(e) => handleFilterChange("maxPrice", e.target.value)}
                    className="h-10 px-3 rounded-xl border border-slate-200 text-sm text-slate-700 bg-white hover:border-slate-300 focus:outline-none focus:ring-2 focus:ring-primary/20"
                  >
                    <option value="5000">Price: Any</option>
                    <option value="1500">Under PKR 1,500/hr</option>
                    <option value="2500">Under PKR 2,500/hr</option>
                    <option value="3500">Under PKR 3,500/hr</option>
                  </select>
                </div>

                {/* Rating dropdown */}
                <div className="flex flex-col">
                  <span className="text-[11px] font-bold text-slate-400 uppercase mb-1 tracking-wider">Rating</span>
                  <select 
                    value={filters.minRating} 
                    onChange={(e) => handleFilterChange("minRating", e.target.value)}
                    className="h-10 px-3 rounded-xl border border-slate-200 text-sm text-slate-700 bg-white hover:border-slate-300 focus:outline-none focus:ring-2 focus:ring-primary/20"
                  >
                    <option value="">Rating: Any</option>
                    <option value="4.0">4.0★ & above</option>
                    <option value="4.5">4.5★ & above</option>
                  </select>
                </div>

                {/* Teaching Mode Toggle */}
                <div className="flex flex-col">
                  <span className="text-[11px] font-bold text-slate-400 uppercase mb-1 tracking-wider">Teaching Mode</span>
                  <div className="flex bg-slate-100 p-1 rounded-xl h-10 items-center">
                    {[
                      { label: "All", value: "All" },
                      { label: "Online", value: "Online" },
                      { label: "In-Person", value: "InPerson" }
                    ].map((mode) => (
                      <button
                        key={mode.value}
                        onClick={() => handleFilterChange("teachingMode", mode.value)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                          filters.teachingMode === mode.value
                            ? "bg-white text-primary shadow-sm"
                            : "text-slate-500 hover:text-slate-800"
                        }`}
                      >
                        {mode.label}
                      </button>
                    ))}
                  </div>
                </div>

              </div>

              {/* Counter / Clear */}
              <div className="flex items-center gap-4 justify-between border-t lg:border-t-0 pt-4 lg:pt-0 border-slate-100">
                <span className="text-sm text-slate-500">
                  Showing <strong className="text-slate-800">{total}</strong> tutors
                </span>
                {(filters.city || filters.keyword || filters.teachingMode !== "All" || filters.minRating || filters.maxPrice !== "5000") && (
                  <button 
                    onClick={handleResetFilters}
                    className="text-xs font-bold text-red-500 hover:text-red-700 transition-colors"
                  >
                    Clear Filters
                  </button>
                )}
              </div>

            </div>
          </div>

          {/* LOADING STATE */}
          {isLoading && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="skeleton h-[350px] w-full rounded-2xl" />
              ))}
            </div>
          )}

          {/* ERROR STATE */}
          {isError && !isLoading && (
            <div className="bg-red-50 border border-red-100 rounded-2xl p-6 text-center text-red-700 max-w-lg mx-auto">
              <span className="text-2xl">⚠️</span>
              <h3 className="text-base font-bold mt-2">Failed to load tutors</h3>
              <p className="text-sm text-red-600 mt-1">
                {error?.response?.data?.message || error?.message || "Please refresh or try again."}
              </p>
              <p className="text-xs text-red-500/80 mt-2">If this persists, restart the backend API so database migrations can run.</p>
            </div>
          )}

          {/* EMPTY STATE */}
          {!isLoading && !isError && tutors.length === 0 && (
            <div className="text-center py-20 bg-white rounded-2xl border border-slate-100 shadow-sm">
              <span className="text-5xl block mb-4">🔍</span>
              <h3 className="text-lg font-bold text-slate-800 mb-2">No tutors found</h3>
              <p className="text-slate-500 text-sm mb-6 max-w-md mx-auto">
                No verified tutors match your filters yet. Tutors appear here only after admin approval.
                Try clearing filters, or check back once more tutors are verified.
              </p>
              <button 
                onClick={handleResetFilters} 
                className="bg-primary hover:bg-primary-dark text-white font-semibold py-2 px-6 rounded-xl text-sm transition-colors"
              >
                Clear all filters
              </button>
            </div>
          )}

          {/* TUTORS GRID */}
          {!isLoading && tutors.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {tutors.map((tutor) => (
                <TutorCard key={tutor.id} tutor={tutor} />
              ))}
            </div>
          )}

          {/* PAGINATION */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 mt-12">
              <button 
                onClick={() => handlePageChange(filters.page - 1)} 
                disabled={filters.page <= 1}
                className="px-4 py-2 text-sm font-semibold rounded-xl border border-slate-200 text-slate-600 bg-white hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                ← Prev
              </button>
              
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                <button
                  key={p}
                  onClick={() => handlePageChange(p)}
                  className={`w-10 h-10 rounded-xl text-sm font-bold transition-all ${
                    p === filters.page 
                      ? "bg-primary text-white shadow-md shadow-primary/10"
                      : "bg-white border border-slate-200 text-slate-600 hover:bg-slate-50"
                  }`}
                >
                  {p}
                </button>
              ))}

              <button 
                onClick={() => handlePageChange(filters.page + 1)} 
                disabled={filters.page >= totalPages}
                className="px-4 py-2 text-sm font-semibold rounded-xl border border-slate-200 text-slate-600 bg-white hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Next →
              </button>
            </div>
          )}

        </div>
      </div>
    </PublicLayout>
  );
};

export default SearchPage;