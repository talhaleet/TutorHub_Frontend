// src/components/search/FilterPanel.jsx
import { useEffect } from "react";

const TEACHING_MODES = ["All", "Online", "InPerson", "Both"];

const CITIES = [
  "All Cities",
  "Lahore",
  "Karachi",
  "Islamabad",
  "Rawalpindi",
  "Faisalabad",
  "Multan",
  "Peshawar",
];

const RATINGS = [
  { label: "4.5+ Stars", value: "4.5" },
  { label: "4.0+ Stars", value: "4.0" },
  { label: "3.5+ Stars", value: "3.5" },
];

const FilterPanel = ({
  filters,
  onFilterChange,
  onReset,
  isMobileOpen,
  onMobileClose,
}) => {
  const set = (key, value) => onFilterChange(key, value);

  // 🔒 Lock background scroll when drawer is open (mobile UX fix)
  useEffect(() => {
    if (isMobileOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }

    return () => {
      document.body.style.overflow = "";
    };
  }, [isMobileOpen]);

  return (
    <>
      {/* ── MOBILE OVERLAY ── */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 bg-black/60 z-40 md:hidden"
          onClick={onMobileClose}
        />
      )}

      {/* ── PANEL ── */}
      <aside
        className={`
          fixed md:sticky top-0 md:top-20 left-0
          z-50 md:z-auto

          /* Mobile: full drawer */
          w-[85%] max-w-sm h-[100dvh]

          /* Desktop */
          md:w-64 md:h-auto md:max-w-none

          bg-white
          shadow-2xl md:shadow-none
          md:rounded-2xl md:border md:border-neutral-200

          transform transition-transform duration-300 ease-in-out
          ${isMobileOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}

          flex flex-col
        `}
      >
        {/* ── HEADER ── */}
        <div className="flex items-center justify-between p-5 border-b border-neutral-100">
          <h2 className="text-lg font-bold text-neutral-900">Filters</h2>

          <div className="flex gap-2 items-center">
            <button
              onClick={onReset}
              className="text-xs font-medium text-primary hover:text-primary/70 transition"
            >
              Reset
            </button>

            <button
              onClick={onMobileClose}
              className="md:hidden text-neutral-500 hover:text-neutral-800 text-lg"
            >
              ✕
            </button>
          </div>
        </div>

        {/* ── CONTENT (scroll only inside panel, not page) ── */}
        <div className="flex-1 overflow-y-auto p-5 space-y-6">

          {/* SEARCH */}
          <div>
            <label className="block text-sm font-semibold mb-2">
              Search
            </label>

            <input
              type="text"
              value={filters.keyword || ""}
              onChange={(e) => set("keyword", e.target.value)}
              placeholder="Subject or tutor name..."
              className="w-full px-3 py-2.5 text-sm border rounded-xl
                         focus:ring-2 focus:ring-primary/30 focus:border-primary outline-none"
            />
          </div>

          {/* CITY */}
          <div>
            <label className="block text-sm font-semibold mb-2">
              City
            </label>

            <select
              value={filters.city || ""}
              onChange={(e) =>
                set(
                  "city",
                  e.target.value === "All Cities" ? "" : e.target.value
                )
              }
              className="w-full px-3 py-2.5 text-sm border rounded-xl
                         focus:ring-2 focus:ring-primary/30 focus:border-primary"
            >
              {CITIES.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>

          {/* TEACHING MODE */}
          <div>
            <label className="block text-sm font-semibold mb-2">
              Teaching Mode
            </label>

            <div className="flex flex-wrap gap-2">
              {TEACHING_MODES.map((mode) => (
                <button
                  key={mode}
                  onClick={() => set("teachingMode", mode)}
                  className={`
                    px-3 py-1.5 text-xs rounded-full border font-semibold transition
                    ${
                      (filters.teachingMode || "All") === mode
                        ? "bg-primary text-white border-primary"
                        : "bg-white text-neutral-600 border-neutral-200 hover:border-primary"
                    }
                  `}
                >
                  {mode === "InPerson" ? "In-Person" : mode}
                </button>
              ))}
            </div>
          </div>

          {/* MAX PRICE */}
          <div>
            <label className="block text-sm font-semibold mb-2">
              Max Rate
              {filters.maxPrice && (
                <span className="ml-2 text-primary font-bold">
                  PKR {Number(filters.maxPrice).toLocaleString()}
                </span>
              )}
            </label>

            <input
              type="range"
              min="500"
              max="5000"
              step="100"
              value={filters.maxPrice || 5000}
              onChange={(e) => set("maxPrice", e.target.value)}
              className="w-full accent-primary"
            />
          </div>

          {/* RATING */}
          <div>
            <label className="block text-sm font-semibold mb-2">
              Minimum Rating
            </label>

            <div className="space-y-2">
              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  checked={!filters.minRating}
                  onChange={() => set("minRating", "")}
                  className="accent-primary"
                />
                Any Rating
              </label>

              {RATINGS.map((r) => (
                <label key={r.value} className="flex items-center gap-2">
                  <input
                    type="radio"
                    checked={filters.minRating === r.value}
                    onChange={() => set("minRating", r.value)}
                    className="accent-primary"
                  />
                  <span>
                    ★ {r.label}
                  </span>
                </label>
              ))}
            </div>
          </div>

          {/* SORT */}
          <div>
            <label className="block text-sm font-semibold mb-2">
              Sort By
            </label>

            <select
              value={filters.sortBy || "rating"}
              onChange={(e) => set("sortBy", e.target.value)}
              className="w-full px-3 py-2.5 text-sm border rounded-xl
                         focus:ring-2 focus:ring-primary/30 focus:border-primary"
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