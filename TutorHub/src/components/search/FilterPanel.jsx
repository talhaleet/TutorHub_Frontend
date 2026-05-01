// FilterPanel.jsx — src/components/search/


const TEACHING_MODES = ["All", "Online", "InPerson", "Both"];
const CITIES = ["All Cities", "Lahore", "Karachi", "Islamabad",
                "Rawalpindi", "Faisalabad", "Multan", "Peshawar"];
const RATINGS = [
  { label: "4.5+ Stars", value: "4.5" },
  { label: "4.0+ Stars", value: "4.0" },
  { label: "3.5+ Stars", value: "3.5" },
];

const FilterPanel = ({ filters, onFilterChange, onReset, isMobileOpen, onMobileClose }) => {
  // isMobileOpen — controlled by SearchPage for slide-in drawer on mobile

  const set = (key, value) => onFilterChange(key, value);
  // ^ Calls parent — triggers React Query refetch with new filter value

  return (
    <>
      {/* ── MOBILE OVERLAY ── */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={onMobileClose}
        />
      )}

      {/* ── PANEL ── */}
      <aside className={`
        fixed md:sticky top-0 md:top-20 left-0 h-full md:h-auto
        w-72 md:w-64 bg-white z-50 md:z-auto
        transform transition-transform duration-300
        ${isMobileOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}
        shadow-xl md:shadow-none
        overflow-y-auto md:overflow-visible
        md:rounded-2xl md:border md:border-neutral-200
        flex-shrink-0
      `}>{/* Panel header */}
        <div className="flex items-center justify-between p-5 border-b border-neutral-100">
          <h2 className="text-lg font-bold text-neutral-900">Filters</h2>
          <div className="flex gap-2">
            <button
              onClick={onReset}
              className="text-xs text-accent hover:text-primary font-medium
                         transition-colors"
            >
              Reset all
            </button>
            {/* Mobile close button */}
            <button
              onClick={onMobileClose}
              className="md:hidden text-neutral-400 hover:text-neutral-700"
            >
              ✕
            </button>
          </div>
        </div>

        <div className="p-5 space-y-6">

          {/* ── Keyword Search ── */}
          <div>
            <label className="block text-sm font-semibold text-neutral-700 mb-2">
              Search
            </label>
            <div className="relative">
              <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4
                             text-neutral-400"
                   fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0" />
              </svg>
              <input
                type="text"
                value={filters.keyword || ""}
                onChange={e => set("keyword", e.target.value)}
                placeholder="Subject or tutor name..."
                className="w-full pl-9 pr-3 py-2.5 text-sm border border-neutral-200
                           rounded-xl focus:outline-none focus:ring-2
                           focus:ring-primary/30 focus:border-primary transition"
              />
            </div>
          </div>

          {/* ── City ── */}
          <div>
            <label className="block text-sm font-semibold text-neutral-700 mb-2">
              City
            </label>
            <select
              value={filters.city || ""}
              onChange={e => set("city", e.target.value === "All Cities" ? "" : e.target.value)}
              className="w-full px-3 py-2.5 text-sm border border-neutral-200 rounded-xl
              focus:outline-none focus:ring-2 focus:ring-primary/30
                         focus:border-primary bg-white transition"
            >
              {CITIES.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>

          {/* ── Teaching Mode ── */}
          <div>
            <label className="block text-sm font-semibold text-neutral-700 mb-2">
              Teaching Mode
            </label>
            <div className="flex flex-wrap gap-2">
              {TEACHING_MODES.map(mode => (
                <button
                  key={mode}
                  onClick={() => set("teachingMode", mode)}
                  className={`px-3 py-1.5 text-xs font-semibold rounded-full
                    border transition-all ${
                      (filters.teachingMode || "All") === mode ? "bg-primary text-white border-primary": "bg-white text-neutral-600 border-neutral-200 hover:border-primary hover:text-primary"
                    }`}
                >
                  {mode === "InPerson" ? "In-Person" : mode}
                </button>
              ))}
            </div>
          </div>

          {/* ── Max Price ── */}
          <div>
            <label className="block text-sm font-semibold text-neutral-700 mb-2">
              Max Rate
              {filters.maxPrice && (
                <span className="ml-2 font-bold text-primary">
                  PKR {Number(filters.maxPrice).toLocaleString()}/hr
                </span>
              )}
            </label>
            <input
              type="range"
              min="500"
              max="5000"
              step="100"
              value={filters.maxPrice || 5000}
              onChange={e => set("maxPrice", e.target.value)}
              className="w-full accent-primary"
            />
            <div className="flex justify-between text-xs text-neutral-400 mt-1">
              <span>PKR 500</span>
              <span>PKR 5,000</span>
            </div>
          </div>

          {/* ── Minimum Rating ── */}
          <div>
            <label className="block text-sm font-semibold text-neutral-700 mb-2">
              Minimum Rating
            </label>
            <div className="space-y-2">
            <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="rating"
                  value=""
                  checked={!filters.minRating}
                  onChange={() => set("minRating", "")}
                  className="accent-primary"
                />
                <span className="text-sm text-neutral-700">Any Rating</span>
              </label>
              {RATINGS.map(r => (
                <label key={r.value} className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="rating"
                    value={r.value}
                    checked={filters.minRating === r.value}
                    onChange={() => set("minRating", r.value)}
                    className="accent-primary"
                  />
                  <span className="text-sm text-neutral-700">
                    <span className="text-yellow-400">★</span> {r.label}
                  </span>
                </label>
              ))}
            </div>
          </div>

          {/* ── Sort By ── */}
          <div>
            <label className="block text-sm font-semibold text-neutral-700 mb-2">
              Sort By
            </label>
            <select
              value={filters.sortBy || "rating"}
              onChange={e => set("sortBy", e.target.value)}
              className="w-full px-3 py-2.5 text-sm border border-neutral-200
                         rounded-xl focus:outline-none focus:ring-2
                         focus:ring-primary/30 focus:border-primary bg-white transition"
            >
              <option value="rating">Highest Rated</option>
              <option value="price_asc">Price: Low to High</option>
              <option value="price_desc">Price: High to Low</option>
              <option value="experience">Most Experienced</option>
            </select>
          </div>

        </div>
      </aside>
    </>
  );
};

export default FilterPanel;