import { useState, useEffect } from 'react';
import { Settings, Search, ScanLine, FileText, Menu, X, MessageSquare } from 'lucide-react';
import { useSettings } from '@/context/SettingsContext';
import { useChat } from '@/context/ChatContext';

export function Navigation() {
  const { setIsSettingsOpen } = useSettings();
  const { openChat } = useChat();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
    setIsMobileMenuOpen(false);
  };

  const navItems = [
    { id: 'hero', label: 'Search', icon: Search },
    { id: 'scan', label: 'Scan', icon: ScanLine },
    { id: 'results', label: 'Report', icon: FileText },
  ];

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        isScrolled
          ? 'bg-worm-bg-primary/90 backdrop-blur-xl border-b border-worm-accent/10'
          : 'bg-transparent'
      }`}
    >
      <div className="w-full px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="absolute inset-0 bg-worm-accent/20 blur-lg rounded-full" />
              <span className="relative font-heading font-bold text-xl text-worm-text-primary">
                WORM AI
              </span>
            </div>
            <span className="font-mono text-xs text-worm-accent/70 border border-worm-accent/30 px-2 py-0.5 rounded">
              V1.6
            </span>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-1">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => scrollToSection(item.id)}
                className="flex items-center gap-2 px-4 py-2 text-sm text-worm-text-secondary hover:text-worm-accent transition-colors rounded-lg hover:bg-worm-accent/5"
              >
                <item.icon className="w-4 h-4" />
                <span className="font-mono uppercase tracking-wider">{item.label}</span>
              </button>
            ))}
          </div>

          {/* Right Actions */}
          <div className="flex items-center gap-2">
            {/* Chat Button */}
            <button
              onClick={openChat}
              className="flex items-center gap-2 px-4 py-2 text-sm text-worm-text-secondary hover:text-worm-accent transition-all rounded-lg hover:bg-worm-accent/5 border border-transparent hover:border-worm-accent/30 group"
            >
              <div className="relative">
                <MessageSquare className="w-4 h-4" />
                <span className="absolute -top-1 -right-1 w-2 h-2 bg-worm-accent rounded-full animate-pulse" />
              </div>
              <span className="hidden sm:inline font-mono uppercase tracking-wider">Chat</span>
            </button>

            {/* Settings Button */}
            <button
              onClick={() => setIsSettingsOpen(true)}
              className="flex items-center gap-2 px-4 py-2 text-sm text-worm-text-secondary hover:text-worm-accent transition-all rounded-lg hover:bg-worm-accent/5 border border-transparent hover:border-worm-accent/30"
            >
              <Settings className="w-4 h-4" />
              <span className="hidden sm:inline font-mono uppercase tracking-wider">Settings</span>
            </button>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2 text-worm-text-secondary hover:text-worm-accent"
            >
              {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-worm-bg-primary/95 backdrop-blur-xl border-t border-worm-accent/10">
          <div className="px-4 py-4 space-y-2">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => scrollToSection(item.id)}
                className="flex items-center gap-3 w-full px-4 py-3 text-left text-worm-text-secondary hover:text-worm-accent hover:bg-worm-accent/5 rounded-lg transition-all"
              >
                <item.icon className="w-5 h-5" />
                <span className="font-mono uppercase tracking-wider">{item.label}</span>
              </button>
            ))}
            <button
              onClick={() => {
                openChat();
                setIsMobileMenuOpen(false);
              }}
              className="flex items-center gap-3 w-full px-4 py-3 text-left text-worm-text-secondary hover:text-worm-accent hover:bg-worm-accent/5 rounded-lg transition-all"
            >
              <MessageSquare className="w-5 h-5" />
              <span className="font-mono uppercase tracking-wider">Chat</span>
            </button>
          </div>
        </div>
      )}
    </nav>
  );
}
