'use client';

import { useState, useEffect } from 'react';
import { Search, X, Command } from 'lucide-react';

interface SearchBarProps {
  onSearch: (query: string) => void;
  placeholder?: string;
}

export function SearchBar({ onSearch, placeholder = 'Search articles by title, source, or topic...' }: SearchBarProps) {
  const [query, setQuery] = useState('');
  const [focused, setFocused] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      onSearch(query);
    }, 300);

    return () => clearTimeout(timer);
  }, [query, onSearch]);

  const handleClear = () => {
    setQuery('');
  };

  return (
    <div className={`relative w-full max-w-2xl transition-all duration-300 ${focused ? 'scale-[1.02]' : ''}`}>
      <div className={`absolute inset-0 rounded-2xl bg-gradient-to-r from-indigo-500/20 via-purple-500/20 to-pink-500/20 blur-xl transition-opacity duration-300 ${focused ? 'opacity-100' : 'opacity-0'}`} />
      <div className="relative">
        <Search className={`absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 pointer-events-none transition-colors duration-200 ${focused ? 'text-primary' : 'text-muted-foreground'}`} />
        <input
          type="text"
          placeholder={placeholder}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          className="w-full pl-12 pr-24 py-4 bg-card border border-border/60 rounded-2xl text-foreground placeholder:text-muted-foreground/70 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/40 transition-all duration-200 shadow-sm hover:shadow-md text-base"
        />
        <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-2">
          {query ? (
            <button
              onClick={handleClear}
              className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted/60 transition-all"
              aria-label="Clear search"
            >
              <X className="w-4 h-4" />
            </button>
          ) : (
            <kbd className="hidden sm:flex items-center gap-1 px-2 py-1 rounded-lg bg-muted/60 text-muted-foreground text-xs font-medium border border-border/40">
              <Command className="w-3 h-3" />
              K
            </kbd>
          )}
        </div>
      </div>
    </div>
  );
}
