import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useSearch } from '@/context/SearchContext';
import { 
  User, 
  AtSign, 
  MapPin, 
  Mail, 
  Globe, 
  Database,
  Linkedin,
  Twitter,
  Facebook,
  ExternalLink
} from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

export function ResultsSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const detailsRef = useRef<HTMLDivElement>(null);
  const { result } = useSearch();

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Title animation
      gsap.fromTo(
        titleRef.current,
        { opacity: 0, y: 24 },
        {
          opacity: 1,
          y: 0,
          duration: 0.6,
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 80%',
            end: 'top 55%',
            scrub: 0.4,
          },
        }
      );

      // Main card animation
      gsap.fromTo(
        cardRef.current,
        { opacity: 0, x: '-8vw', rotateY: 8 },
        {
          opacity: 1,
          x: 0,
          rotateY: 0,
          duration: 0.8,
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 70%',
            end: 'top 40%',
            scrub: 0.4,
          },
        }
      );

      // Detail blocks animation
      const detailBlocks = detailsRef.current?.querySelectorAll('.detail-block');
      if (detailBlocks) {
        gsap.fromTo(
          detailBlocks,
          { opacity: 0, x: '6vw', y: 18 },
          {
            opacity: 1,
            x: 0,
            y: 0,
            stagger: 0.1,
            duration: 0.6,
            scrollTrigger: {
              trigger: detailsRef.current,
              start: 'top 80%',
              end: 'top 50%',
              scrub: 0.4,
            },
          }
        );
      }
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  // Default mock data if no result
  const displayData = result || {
    name: 'Nama Orang Yang Dicari',
    aliases: ['Alias1', 'Alias2', 'Alias3'],
    possible_locations: ['Kota, Negara', 'Lainnya'],
    associated_emails: ['email1@domain.com', 'email2@domain.com'],
    social_media_profiles: {
      linkedin: 'https://linkedin.com/in/example',
      twitter: 'https://twitter.com/example',
      facebook: 'https://facebook.com/example',
    },
    additional_data_sources: [
      { source: 'Public Records Database', info: 'Verified identity match' },
      { source: 'Social Graph Analysis', info: '3 connected profiles found' },
    ],
    risk_level: 'low' as const,
  };

  const getRiskColor = (level: string) => {
    switch (level) {
      case 'low':
        return 'text-green-400 border-green-400/30 bg-green-400/10';
      case 'medium':
        return 'text-yellow-400 border-yellow-400/30 bg-yellow-400/10';
      case 'high':
        return 'text-orange-400 border-orange-400/30 bg-orange-400/10';
      case 'critical':
        return 'text-red-400 border-red-400/30 bg-red-400/10';
      default:
        return 'text-worm-accent border-worm-accent/30 bg-worm-accent/10';
    }
  };

  return (
    <section
      ref={sectionRef}
      id="results"
      className="relative w-full min-h-screen py-24 overflow-hidden z-40"
    >
      {/* Background */}
      <div className="absolute inset-0 bg-worm-bg-secondary" />

      <div className="relative z-10 w-full px-4 sm:px-6 lg:px-12 xl:px-20">
        {/* Section Title */}
        <h2
          ref={titleRef}
          className="font-heading font-bold text-3xl md:text-4xl text-worm-text-primary mb-12"
        >
          <span className="text-worm-accent">INTELLIGENCE</span> DECK
        </h2>

        {/* Content Grid */}
        <div className="grid lg:grid-cols-12 gap-8">
          {/* Left Column - Main Profile Card */}
          <div className="lg:col-span-5">
            <div
              ref={cardRef}
              className="lg:sticky lg:top-24 p-6 md:p-8 rounded-card bg-worm-bg-primary/65 border border-worm-accent/25 shadow-panel glow-cyan card-hover"
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="p-3 bg-worm-accent/10 rounded-lg">
                  <User className="w-6 h-6 text-worm-accent" />
                </div>
                <div>
                  <h3 className="font-heading font-semibold text-lg text-worm-text-primary">
                    Subject Profile
                  </h3>
                  <p className="text-xs text-worm-text-secondary font-mono">
                    ID: {Math.random().toString(36).substring(2, 10).toUpperCase()}
                  </p>
                </div>
              </div>

              {/* Name */}
              <div className="mb-6">
                <label className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-worm-text-secondary mb-2">
                  <User className="w-3 h-3" />
                  Name
                </label>
                <p className="text-xl font-medium text-worm-text-primary">
                  {displayData.name}
                </p>
              </div>

              {/* Risk Level */}
              <div className="mb-6">
                <label className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-worm-text-secondary mb-2">
                  <Database className="w-3 h-3" />
                  Risk Level
                </label>
                <span className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg border font-mono uppercase text-sm ${getRiskColor(displayData.risk_level)}`}>
                  {displayData.risk_level}
                </span>
              </div>

              {/* Status */}
              <div className="pt-6 border-t border-worm-accent/10">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-worm-text-secondary">Last Updated</span>
                  <span className="font-mono text-worm-accent">{new Date().toLocaleString()}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Details */}
          <div ref={detailsRef} className="lg:col-span-7 space-y-6">
            {/* Aliases */}
            <div className="detail-block p-6 rounded-card bg-worm-bg-primary/40 border border-worm-accent/10">
              <label className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-worm-text-secondary mb-4">
                <AtSign className="w-4 h-4" />
                Aliases
              </label>
              <div className="flex flex-wrap gap-2">
                {displayData.aliases.map((alias, i) => (
                  <span
                    key={i}
                    className="px-3 py-1.5 text-sm font-mono text-worm-accent bg-worm-accent/10 border border-worm-accent/30 rounded-chip"
                  >
                    {alias}
                  </span>
                ))}
              </div>
            </div>

            {/* Locations */}
            <div className="detail-block p-6 rounded-card bg-worm-bg-primary/40 border border-worm-accent/10">
              <label className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-worm-text-secondary mb-4">
                <MapPin className="w-4 h-4" />
                Possible Locations
              </label>
              <div className="flex flex-wrap gap-2">
                {displayData.possible_locations.map((location, i) => (
                  <span
                    key={i}
                    className="px-3 py-1.5 text-sm text-worm-text-primary bg-worm-bg-secondary border border-worm-accent/20 rounded-chip"
                  >
                    {location}
                  </span>
                ))}
              </div>
            </div>

            {/* Emails */}
            <div className="detail-block p-6 rounded-card bg-worm-bg-primary/40 border border-worm-accent/10">
              <label className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-worm-text-secondary mb-4">
                <Mail className="w-4 h-4" />
                Associated Emails
              </label>
              <div className="space-y-2">
                {displayData.associated_emails.map((email, i) => (
                  <div
                    key={i}
                    className="flex items-center gap-3 px-4 py-2 bg-worm-bg-secondary rounded-lg"
                  >
                    <span className="font-mono text-sm text-worm-text-primary">{email}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Social Profiles */}
            <div className="detail-block p-6 rounded-card bg-worm-bg-primary/40 border border-worm-accent/10">
              <label className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-worm-text-secondary mb-4">
                <Globe className="w-4 h-4" />
                Social Media Profiles
              </label>
              <div className="grid sm:grid-cols-2 gap-3">
                {displayData.social_media_profiles.linkedin && (
                  <a
                    href={displayData.social_media_profiles.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 px-4 py-3 bg-worm-bg-secondary rounded-lg hover:bg-worm-accent/10 transition-colors group"
                  >
                    <Linkedin className="w-5 h-5 text-worm-text-secondary group-hover:text-worm-accent" />
                    <span className="text-sm text-worm-text-primary flex-1">LinkedIn</span>
                    <ExternalLink className="w-4 h-4 text-worm-text-secondary opacity-0 group-hover:opacity-100 transition-opacity" />
                  </a>
                )}
                {displayData.social_media_profiles.twitter && (
                  <a
                    href={displayData.social_media_profiles.twitter}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 px-4 py-3 bg-worm-bg-secondary rounded-lg hover:bg-worm-accent/10 transition-colors group"
                  >
                    <Twitter className="w-5 h-5 text-worm-text-secondary group-hover:text-worm-accent" />
                    <span className="text-sm text-worm-text-primary flex-1">Twitter</span>
                    <ExternalLink className="w-4 h-4 text-worm-text-secondary opacity-0 group-hover:opacity-100 transition-opacity" />
                  </a>
                )}
                {displayData.social_media_profiles.facebook && (
                  <a
                    href={displayData.social_media_profiles.facebook}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 px-4 py-3 bg-worm-bg-secondary rounded-lg hover:bg-worm-accent/10 transition-colors group"
                  >
                    <Facebook className="w-5 h-5 text-worm-text-secondary group-hover:text-worm-accent" />
                    <span className="text-sm text-worm-text-primary flex-1">Facebook</span>
                    <ExternalLink className="w-4 h-4 text-worm-text-secondary opacity-0 group-hover:opacity-100 transition-opacity" />
                  </a>
                )}
              </div>
            </div>

            {/* Additional Sources */}
            <div className="detail-block p-6 rounded-card bg-worm-bg-primary/40 border border-worm-accent/10">
              <label className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-worm-text-secondary mb-4">
                <Database className="w-4 h-4" />
                Additional Data Sources
              </label>
              <div className="space-y-3">
                {displayData.additional_data_sources.map((source, i) => (
                  <div
                    key={i}
                    className="flex items-start gap-4 p-4 bg-worm-bg-secondary rounded-lg"
                  >
                    <div className="w-2 h-2 mt-2 rounded-full bg-worm-accent" />
                    <div>
                      <p className="font-mono text-sm text-worm-accent">{source.source}</p>
                      <p className="text-sm text-worm-text-secondary mt-1">{source.info}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
