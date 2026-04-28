// SortDropdown.jsx — src/components/search/

const SORT_OPTIONS = [
  { value: 'rating', label: 'Top Rated' },
  { value: 'priceAsc', label: 'Price: Low to High' },
  { value: 'priceDesc', label: 'Price: High to Low' },
  { value: 'experience', label: 'Most Experienced' },
  { value: 'reviews', label: 'Most Reviewed' },
];

const SortDropdown = ({ value, onChange }) => (
  <div className="flex items-center gap-2">
    <span className="text-sm text-neutral-500 whitespace-nowrap">
      Sort by:
    </span>

    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="text-sm border border-neutral-300 rounded-xl px-3 py-2
      focus:outline-none focus:ring-2 focus:ring-accent/30
      focus:border-accent bg-white cursor-pointer transition-colors"
    >
      {SORT_OPTIONS.map((opt) => (
        <option key={opt.value} value={opt.value}>
          {opt.label}
        </option>
      ))}
    </select>
  </div>
);

export default SortDropdown;