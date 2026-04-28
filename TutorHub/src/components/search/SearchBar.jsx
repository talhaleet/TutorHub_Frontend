// SearchBar.jsx — src/components/search
// Controlled search input with 300ms debounced autocomplete dropdown.
import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAutocomplete } from '../../services/searchService';


const SearchBar = ({
  initialValue = '',
  onSearch,
  placeholder = 'Search by subject, tutor name, or city...',
  className = '',
}) => {
  const navigate = useNavigate();
  const [query, setQuery] = useState(initialValue);
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [activeSuggestion, setActiveSuggestion] = useState(-1);

  const wrapperRef = useRef(null);
  const debounceRef = useRef(null);
  const abortControllerRef = useRef(null);

  // ── Debounced autocomplete fetch ──────────────────────────
  useEffect(() => {
    // Clear any pending debounce timer from previous keystroke
    if (debounceRef.current) clearTimeout(debounceRef.current);
    
    // Cancel any in-flight request
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    const trimmedQuery = query.trim();
    
    // Don't fetch for short queries
    if (trimmedQuery.length < 2) {
      // Use a microtask to avoid synchronous state updates in effect
      Promise.resolve().then(() => {
        setSuggestions([]);
        setShowSuggestions(false);
      });
      return;
    }

    // Schedule the API call 300ms after the user stops typing
    debounceRef.current = setTimeout(() => {
      const abortController = new AbortController();
      abortControllerRef.current = abortController;
      
      setIsLoading(true);
      
      getAutocomplete(query, { signal: abortController.signal })
        .then(results => {
          // Only update if we still have a valid query
          if (query.trim().length >= 2) {
            setSuggestions(results);
            setShowSuggestions(results.length > 0);
          }
        })
        .catch(err => {
          // Ignore abort errors
          if (err.name !== 'AbortError') {
            console.error('Autocomplete error:', err);
            setSuggestions([]);
            setShowSuggestions(false);
          }
        })
        .finally(() => {
          setIsLoading(false);
        });
    }, 300);
    
    // Cleanup function
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, [query]);

  // ── Submit handler ────────────────────────────────────────
  const handleSubmit = (searchQuery = query) => {
    setShowSuggestions(false);
    setActiveSuggestion(-1);
    if (onSearch) {
      onSearch(searchQuery);
    } else {
      navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
    }
  };

  // ── Keyboard navigation ───────────────────────────────────
  const handleKeyDown = (e) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setActiveSuggestion(prev => Math.min(prev + 1, suggestions.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActiveSuggestion(prev => Math.max(prev - 1, -1));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (activeSuggestion >= 0 && suggestions[activeSuggestion]) {
        handleSubmit(suggestions[activeSuggestion]);
      } else {
        handleSubmit();
      }
    } else if (e.key === 'Escape') {
      e.preventDefault();
      setShowSuggestions(false);
      setActiveSuggestion(-1);
    }
  };

  // Click outside handler
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        setShowSuggestions(false);
        setActiveSuggestion(-1);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div ref={wrapperRef} className={`relative ${className}`}>
      <input
        type="text"
        value={query}
        onChange={e => { 
          setQuery(e.target.value); 
          setActiveSuggestion(-1);
        }}
        onKeyDown={handleKeyDown}
        onFocus={() => {
          if (query.trim().length >= 2 && suggestions.length > 0) {
            setShowSuggestions(true);
          }
        }}
        placeholder={placeholder}
        className="w-full px-5 py-3 rounded-2xl border border-neutral-300 outline-none
          focus:ring-2 focus:ring-primary focus:border-primary transition-all text-sm"
      />
      {isLoading && (
        <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
          <svg className="animate-spin h-5 w-5 text-neutral-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
        </div>
      )}
      {showSuggestions && suggestions.length > 0 && (
        <ul className="absolute top-full left-0 right-0 bg-white border border-neutral-200
          rounded-2xl shadow-lg mt-1 z-50 max-h-64 overflow-y-auto">
          {suggestions.map((s, i) => (
            <li
              key={`${s}-${i}`}
              onMouseDown={(e) => {
                e.preventDefault();
                handleSubmit(s);
              }}
              onMouseEnter={() => setActiveSuggestion(i)}
              className={`px-4 py-2 cursor-pointer text-sm transition-colors
                ${i === activeSuggestion
                  ? 'bg-primary/10 text-primary'
                  : 'hover:bg-neutral-50 text-neutral-700'}`}             
            >
              {s}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default SearchBar;