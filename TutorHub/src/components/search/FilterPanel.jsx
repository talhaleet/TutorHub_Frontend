// FilterPanel.jsx — src/components/search/
// Filter sidebar for SearchPage. Purely presentational — all state
// is owned by SearchPage and passed in as filters + onChange handlers.

import { useEffect, useState } from 'react';
import Select from 'react-select';
import { getSubjects, getGradeLevels } from '../../services/searchService';

// react-select styles matching TutorHub design tokens
const selectStyles = {
  control: (base, state) => ({
    ...base,
    borderRadius: '12px',
    borderColor: state.isFocused ? '#2E74B5' : '#D1D5DB',
    boxShadow: state.isFocused
      ? '0 0 0 3px rgba(46,116,181,0.15)'
      : 'none',
    fontSize: '14px',
    minHeight: '40px',
    '&:hover': { borderColor: '#2E74B5' },
  }),
  option: (base, state) => ({
    ...base,
    fontSize: '13px',
    backgroundColor: state.isSelected
      ? '#1F3864'
      : state.isFocused
      ? '#D6E4F0'
      : 'white',
    color: state.isSelected ? 'white' : '#1F2937',
  }),
  multiValue: (base) => ({
    ...base,
    backgroundColor: '#D6E4F0',
    borderRadius: '8px',
  }),
  multiValueLabel: (base) => ({
    ...base,
    color: '#1F3864',
    fontSize: '12px',
  }),
};

const TEACHING_MODES = [
  { value: '', label: 'Any' },
  { value: 'Online', label: 'Online Only' },
  { value: 'InPerson', label: 'In-Person Only' },
  { value: 'Both', label: 'Online & In-Person' },
];

const RATING_OPTIONS = [
  { value: 4.5, label: '4.5+ Stars' },
  { value: 4.0, label: '4.0+ Stars' },
  { value: 3.5, label: '3.5+ Stars' },
];

const FilterPanel = ({ filters, onChange, onReset, isOpen, onClose }) => {
  const [subjects, setSubjects] = useState([]);
  const [gradeLevels, setGradeLevels] = useState([]);

  // Load subjects and grade levels once
  useEffect(() => {
    getSubjects()
      .then((data) =>
        setSubjects(data.map((s) => ({ value: s.id, label: s.name })))
      )
      .catch(() => {});

    getGradeLevels()
      .then((data) =>
        setGradeLevels(data.map((g) => ({ value: g.id, label: g.name })))
      )
      .catch(() => {});
  }, []);

  const set = (key, val) => onChange({ ...filters, [key]: val });

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-30 md:hidden"
          onClick={onClose}
        />
      )}

      {/* Panel */}
      <aside
        className={`
        fixed md:static inset-y-0 left-0 z-40 md:z-auto
        w-72 md:w-64 bg-white md:bg-transparent
        transform transition-transform duration-300
        ${isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
        flex flex-col overflow-y-auto md:overflow-visible
      `}
      >
        {/* Mobile header */}
        <div className="flex items-center justify-between p-4 md:hidden border-b">
          <span className="font-bold text-neutral-900">Filters</span>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-neutral-100"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        <div className="p-4 md:p-0 flex-1 space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-neutral-900">Filters</h3>
            <button
              onClick={onReset}
              className="text-xs text-accent hover:text-primary font-medium transition-colors"
            >
              Reset all
            </button>
          </div>

          {/* Price */}
          <div>
            <label className="block text-sm font-semibold text-neutral-700 mb-3">
              Hourly Rate
            </label>

            <div className="flex items-center gap-2 mb-2">
              <span className="text-xs text-neutral-500 w-20">
                PKR {(filters.minPrice || 0).toLocaleString()}
              </span>
              <span className="text-xs text-neutral-400 flex-1 text-center">
                —
              </span>
              <span className="text-xs text-neutral-500 w-24 text-right">
                PKR {(filters.maxPrice || 5000).toLocaleString()}
              </span>
            </div>

            <input
              type="range"
              min={0}
              max={5000}
              step={100}
              value={filters.maxPrice || 5000}
              onChange={(e) => set('maxPrice', Number(e.target.value))}
              className="w-full h-2 rounded-full accent-primary cursor-pointer"
            />
          </div>

          {/* Subject */}
          <div>
            <label className="block text-sm font-semibold text-neutral-700 mb-2">
              Subject
            </label>
            <Select
              options={subjects}
              isMulti
              isClearable
              placeholder="Select subjects..."
              styles={selectStyles}
              value={subjects.filter((s) =>
                (filters.subjectIds || []).includes(s.value)
              )}
              onChange={(selected) =>
                set(
                  'subjectIds',
                  selected ? selected.map((s) => s.value) : []
                )
              }
            />
          </div>

          {/* Grade Level */}
          <div>
            <label className="block text-sm font-semibold text-neutral-700 mb-2">
              Grade Level
            </label>
            <Select
              options={gradeLevels}
              isClearable
              placeholder="Any grade level..."
              styles={selectStyles}
              value={
                gradeLevels.find((g) => g.value === filters.gradeLevelId) ||
                null
              }
              onChange={(sel) =>
                set('gradeLevelId', sel ? sel.value : null)
              }
            />
          </div>

          {/* Teaching Mode */}
          <div>
            <label className="block text-sm font-semibold text-neutral-700 mb-3">
              Teaching Mode
            </label>
            <div className="space-y-2">
              {TEACHING_MODES.map((mode) => (
                <label
                  key={mode.value}
                  className="flex items-center gap-2.5 cursor-pointer group"
                >
                  <input
                    type="radio"
                    name="teachingMode"
                    value={mode.value}
                    checked={filters.teachingMode === mode.value}
                    onChange={() => set('teachingMode', mode.value)}
                    className="accent-primary w-4 h-4"
                  />
                  <span className="text-sm text-neutral-700 group-hover:text-primary transition-colors">
                    {mode.label}
                  </span>
                </label>
              ))}
            </div>
          </div>

          {/* Rating */}
          <div>
            <label className="block text-sm font-semibold text-neutral-700 mb-3">
              Minimum Rating
            </label>
            <div className="space-y-2">
              {RATING_OPTIONS.map((r) => (
                <label
                  key={r.value}
                  className="flex items-center gap-2.5 cursor-pointer group"
                >
                  <input
                    type="radio"
                    name="minRating"
                    value={r.value}
                    checked={filters.minRating === r.value}
                    onChange={() => set('minRating', r.value)}
                    className="accent-primary w-4 h-4"
                  />
                  <span className="text-sm text-neutral-700 flex items-center gap-1.5">
                    <span className="text-yellow-400">★</span>
                    {r.label}
                  </span>
                </label>
              ))}
            </div>
          </div>

          {/* City */}
          <div>
            <label className="block text-sm font-semibold text-neutral-700 mb-2">
              City
            </label>
            <input
              type="text"
              placeholder="e.g. Lahore, Karachi..."
              value={filters.city || ''}
              onChange={(e) => set('city', e.target.value)}
              className="w-full px-3 py-2.5 rounded-xl border border-neutral-300 text-sm focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent transition-colors"
            />
          </div>
        </div>
      </aside>
    </>
  );
};

export default FilterPanel;