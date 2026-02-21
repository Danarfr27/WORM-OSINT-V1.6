import React, { createContext, useContext, useState } from 'react';
import type { SearchResult, SearchQuery } from '@/types';

interface SearchContextType {
  query: string;
  setQuery: (query: string) => void;
  isSearching: boolean;
  setIsSearching: (searching: boolean) => void;
  searchStage: 'idle' | 'parsing' | 'scanning' | 'analyzing' | 'complete' | 'error';
  setSearchStage: (stage: 'idle' | 'parsing' | 'scanning' | 'analyzing' | 'complete' | 'error') => void;
  result: SearchResult | null;
  setResult: (result: SearchResult | null) => void;
  searchHistory: SearchQuery[];
  addToHistory: (query: SearchQuery) => void;
  clearHistory: () => void;
  scanProgress: number;
  setScanProgress: (progress: number) => void;
}

const SearchContext = createContext<SearchContextType | undefined>(undefined);

export function SearchProvider({ children }: { children: React.ReactNode }) {
  const [query, setQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [searchStage, setSearchStage] = useState<'idle' | 'parsing' | 'scanning' | 'analyzing' | 'complete' | 'error'>('idle');
  const [result, setResult] = useState<SearchResult | null>(null);
  const [searchHistory, setSearchHistory] = useState<SearchQuery[]>([]);
  const [scanProgress, setScanProgress] = useState(0);

  const addToHistory = (searchQuery: SearchQuery) => {
    setSearchHistory(prev => [searchQuery, ...prev].slice(0, 10));
  };

  const clearHistory = () => {
    setSearchHistory([]);
  };

  return (
    <SearchContext.Provider value={{
      query,
      setQuery,
      isSearching,
      setIsSearching,
      searchStage,
      setSearchStage,
      result,
      setResult,
      searchHistory,
      addToHistory,
      clearHistory,
      scanProgress,
      setScanProgress,
    }}>
      {children}
    </SearchContext.Provider>
  );
}

export function useSearch() {
  const context = useContext(SearchContext);
  if (context === undefined) {
    throw new Error('useSearch must be used within a SearchProvider');
  }
  return context;
}
