import { useState, useRef, useEffect } from 'react';
import { Search, ArrowRight } from 'lucide-react';
import { useSearch } from '@/context/SearchContext';

interface SearchPillProps {
  onSearch: (query: string) => void;
}

export function SearchPill({ onSearch }: SearchPillProps) {
  const { query, setQuery, isSearching } = useSearch();
  const [isFocused, setIsFocused] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    // Auto-focus on mount
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim() && !isSearching) {
      onSearch(query.trim());
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && query.trim() && !isSearching) {
      onSearch(query.trim());
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-2xl mx-auto">
      <div
        className={`relative group transition-all duration-500 ${
          isFocused ? 'scale-[1.02]' : ''
        }`}
      >
        {/* Orbiting Rings */}
        <div className="absolute inset-0 -m-8 pointer-events-none">
          <div
            className={`absolute inset-0 border border-worm-accent/10 rounded-full transition-opacity duration-500 ${
              isFocused ? 'opacity-100' : 'opacity-50'
            }`}
            style={{ animation: 'orbit 20s linear infinite' }}
          />
          <div
            className={`absolute inset-4 -m-4 border border-worm-accent/5 rounded-full transition-opacity duration-500 ${
              isFocused ? 'opacity-80' : 'opacity-30'
            }`}
            style={{ animation: 'orbit 15s linear infinite reverse' }}
          />
        </div>

        {/* Search Pill */}
        <div
          className={`relative flex items-center gap-4 px-6 py-4 bg-worm-bg-secondary/90 backdrop-blur-xl rounded-pill border transition-all duration-300 ${
            isFocused
              ? 'border-worm-accent/60 shadow-glow-intense'
              : 'border-worm-accent/30 shadow-glow'
          }`}
        >
          {/* Search Icon */}
          <Search
            className={`w-5 h-5 transition-colors duration-300 ${
              isFocused ? 'text-worm-accent' : 'text-worm-text-secondary'
            }`}
          />

          {/* Input */}
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            onKeyDown={handleKeyDown}
            placeholder="Enter a name, alias, or identifier..."
            disabled={isSearching}
            className="flex-1 bg-transparent text-worm-text-primary placeholder:text-worm-text-secondary/50 text-lg outline-none disabled:opacity-50"
          />

          {/* Blinking Cursor (when empty and focused) */}
          {isFocused && !query && (
            <span className="absolute left-16 w-0.5 h-6 bg-worm-accent animate-blink" />
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={!query.trim() || isSearching}
            className={`flex items-center justify-center w-10 h-10 rounded-full transition-all duration-300 ${
              query.trim() && !isSearching
                ? 'bg-worm-accent/20 text-worm-accent hover:bg-worm-accent/30 btn-glow'
                : 'bg-worm-bg-primary text-worm-text-secondary/50 cursor-not-allowed'
            }`}
          >
            {isSearching ? (
              <div className="w-4 h-4 border-2 border-worm-accent/30 border-t-worm-accent rounded-full animate-spin" />
            ) : (
              <ArrowRight className="w-5 h-5" />
            )}
          </button>
        </div>

        {/* Micro Hint */}
        <p className="absolute -bottom-8 left-1/2 -translate-x-1/2 text-xs font-mono text-worm-text-secondary/50 whitespace-nowrap">
          Press Enter to initiate
        </p>
      </div>
    </form>
  );
}
