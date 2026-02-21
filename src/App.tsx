import { useEffect, useCallback, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Navigation } from '@/components/Navigation';
import { SettingsPanel } from '@/components/SettingsPanel';
import { ChatBot } from '@/components/ChatBot';
import { HeroSection } from '@/components/sections/HeroSection';
import { QuerySection } from '@/components/sections/QuerySection';
import { ScanSection } from '@/components/sections/ScanSection';
import { ResultsSection } from '@/components/sections/ResultsSection';
import { DataSourcesSection } from '@/components/sections/DataSourcesSection';
import { RiskSection } from '@/components/sections/RiskSection';
import { CTASection } from '@/components/sections/CTASection';
import { SearchProvider, useSearch } from '@/context/SearchContext';
import { SettingsProvider } from '@/context/SettingsContext';
import { ChatProvider } from '@/context/ChatContext';
import type { SearchResult } from '@/types';
import './App.css';

gsap.registerPlugin(ScrollTrigger);

// Fungsi untuk memanggil API chat
const callChatApi = async (query: string): Promise<SearchResult> => {
  const response = await fetch('/api/chat', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ contents: query }),
  });

  if (!response.ok) {
    throw new Error('Failed to fetch data from API');
  }

  const data = await response.json();
  return data;
};

function AppContent() {
  const { 
    setQuery, 
    setIsSearching, 
    setSearchStage, 
    setResult, 
    addToHistory,
    setScanProgress 
  } = useSearch();
  const mainRef = useRef<HTMLElement>(null);

  // Handle search
  const handleSearch = useCallback(async (searchQuery: string) => {
    setIsSearching(true);
    setSearchStage('parsing');
    setScanProgress(0);

    // Scroll to query section
    const querySection = document.querySelector('#query-section');
    if (querySection) {
      querySection.scrollIntoView({ behavior: 'smooth' });
    }

    // Simulate parsing
    await new Promise(resolve => setTimeout(resolve, 800));
    setSearchStage('scanning');

    // Simulate scan progress
    let currentProgress = 0;
    const progressInterval = setInterval(() => {
      currentProgress += Math.floor(Math.random() * 15) + 5;
      if (currentProgress >= 90) {
        clearInterval(progressInterval);
        currentProgress = 90;
      }
      setScanProgress(currentProgress);
    }, 300);

    // Perform search
    try {
      const result = await callChatApi(searchQuery);

      clearInterval(progressInterval);
      setScanProgress(100);

      await new Promise(resolve => setTimeout(resolve, 500));
      setSearchStage('analyzing');

      await new Promise(resolve => setTimeout(resolve, 600));
      setResult(result);
      setSearchStage('complete');

      addToHistory({
        query: searchQuery,
        timestamp: new Date().toISOString(),
        result,
        status: 'success',
      });

      setSearchStage('error' as 'idle' | 'parsing' | 'scanning' | 'analyzing' | 'complete' | 'error');

      // Scroll to results
      setTimeout(() => {
        const resultsSection = document.getElementById('results');
        if (resultsSection) {
          resultsSection.scrollIntoView({ behavior: 'smooth' });
        }
      }, 500);
    } catch (error) {
      console.error('Error during search:', error);
      setSearchStage('error');
    } finally {
      setIsSearching(false);
    }
  }, [setIsSearching, setSearchStage, setScanProgress, setResult, addToHistory]);

  // Handle new search from CTA
  const handleNewSearch = useCallback(() => {
    setQuery('');
    setResult(null);
    setSearchStage('idle');
    setScanProgress(0);
    
    const heroSection = document.getElementById('hero');
    if (heroSection) {
      heroSection.scrollIntoView({ behavior: 'smooth' });
    }
  }, [setQuery, setResult, setSearchStage, setScanProgress]);

  // Setup global scroll snap for pinned sections
  useEffect(() => {
    // Wait for all ScrollTriggers to be created
    const timeout = setTimeout(() => {
      const pinned = ScrollTrigger.getAll()
        .filter(st => st.vars.pin)
        .sort((a, b) => a.start - b.start);
      
      const maxScroll = ScrollTrigger.maxScroll(window);
      
      if (!maxScroll || pinned.length === 0) return;

      const pinnedRanges = pinned.map(st => ({
        start: st.start / maxScroll,
        end: (st.end ?? st.start) / maxScroll,
        center: (st.start + ((st.end ?? st.start) - st.start) * 0.5) / maxScroll,
      }));

      ScrollTrigger.create({
        snap: {
          snapTo: (value: number) => {
            // Check if within any pinned range (with buffer)
            const inPinned = pinnedRanges.some(
              r => value >= r.start - 0.02 && value <= r.end + 0.02
            );
            
            if (!inPinned) return value; // Flowing section: free scroll

            // Find nearest pinned center
            const target = pinnedRanges.reduce(
              (closest, r) =>
                Math.abs(r.center - value) < Math.abs(closest - value)
                  ? r.center
                  : closest,
              pinnedRanges[0]?.center ?? 0
            );

            return target;
          },
          duration: { min: 0.15, max: 0.35 },
          delay: 0,
          ease: 'power2.out',
        },
      });
    }, 100);

    return () => {
      clearTimeout(timeout);
    };
  }, []);

  return (
    <div className="relative min-h-screen bg-worm-bg-primary">
      {/* Noise Overlay */}
      <div className="noise-overlay" />

      {/* Navigation */}
      <Navigation />

      {/* Settings Panel */}
      <SettingsPanel />

      {/* Chat Bot */}
      <ChatBot />

      {/* Main Content */}
      <main ref={mainRef} className="relative">
        {/* Section 1: Hero Search */}
        <div className="relative z-10">
          <HeroSection onSearch={handleSearch} />
        </div>

        {/* Section 2: Query Visualization */}
        <div id="query-section" className="relative z-20">
          <QuerySection />
        </div>

        {/* Section 3: Global Scan */}
        <div className="relative z-30">
          <ScanSection />
        </div>

        {/* Section 4: Intelligence Deck */}
        <div className="relative z-40">
          <ResultsSection />
        </div>

        {/* Section 5: Data Sources */}
        <div className="relative z-50">
          <DataSourcesSection />
        </div>

        {/* Section 6: Risk Assessment */}
        <div className="relative z-[60]">
          <RiskSection />
        </div>

        {/* Section 7: CTA / Closing */}
        <div className="relative z-[70]">
          <CTASection onNewSearch={handleNewSearch} />
        </div>
      </main>
    </div>
  );
}

function App() {
  return (
    <SettingsProvider>
      <SearchProvider>
        <ChatProvider>
          <AppContent />
        </ChatProvider>
      </SearchProvider>
    </SettingsProvider>
  );
}

export default App;
