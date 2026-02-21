import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useSearch } from '@/context/SearchContext';

gsap.registerPlugin(ScrollTrigger);

export function QuerySection() {
  const sectionRef = useRef<HTMLElement>(null);
  const queryRef = useRef<HTMLDivElement>(null);
  const bracketsRef = useRef<HTMLDivElement>(null);
  const statusRef = useRef<HTMLDivElement>(null);
  const scanLineRef = useRef<HTMLDivElement>(null);
  const { query, searchStage } = useSearch();

  useEffect(() => {
    const ctx = gsap.context(() => {
      const scrollTl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top top',
          end: '+=125%',
          pin: true,
          scrub: 0.6,
        },
      });

      // ENTRANCE (0%-30%)
      scrollTl.fromTo(
        queryRef.current,
        { opacity: 0, y: '10vh', scale: 0.96 },
        { opacity: 1, y: 0, scale: 1, ease: 'none' },
        0
      );

      scrollTl.fromTo(
        bracketsRef.current,
        { scale: 1.18, opacity: 0 },
        { scale: 1, opacity: 1, ease: 'none' },
        0
      );

      scrollTl.fromTo(
        statusRef.current,
        { opacity: 0, y: '2vh' },
        { opacity: 1, y: 0, ease: 'none' },
        0.1
      );

      // SETTLE (30%-70%) - Brackets breathe
      scrollTl.to(
        bracketsRef.current,
        { scale: 1.02, duration: 0.2, yoyo: true, repeat: 3, ease: 'sine.inOut' },
        0.3
      );

      // Scan line sweep
      scrollTl.fromTo(
        scanLineRef.current,
        { y: '-100%', opacity: 0 },
        { y: '100vh', opacity: 1, duration: 0.15, ease: 'none' },
        0.85
      );

      // EXIT (70%-100%)
      scrollTl.fromTo(
        queryRef.current,
        { y: 0, opacity: 1 },
        { y: '-18vh', opacity: 0, ease: 'power2.in' },
        0.7
      );

      scrollTl.fromTo(
        bracketsRef.current,
        { scale: 1, opacity: 1 },
        { scale: 1.6, opacity: 0, ease: 'power2.in' },
        0.7
      );

      scrollTl.fromTo(
        statusRef.current,
        { opacity: 1 },
        { opacity: 0, ease: 'power2.in' },
        0.85
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const getStatusText = () => {
    switch (searchStage) {
      case 'parsing':
        return 'PARSING INPUT / NORMALIZING...';
      case 'scanning':
        return 'SCANNING DATABASES...';
      case 'analyzing':
        return 'ANALYZING PATTERNS...';
      default:
        return 'PARSING INPUT / NORMALIZING...';
    }
  };

  return (
    <section
      ref={sectionRef}
      className="relative w-full h-screen flex items-center justify-center overflow-hidden z-20"
    >
      {/* Background */}
      <div className="absolute inset-0 bg-worm-bg-primary hex-grid" />

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center">
        {/* Target Brackets */}
        <div ref={bracketsRef} className="relative">
          {/* Corner Brackets */}
          <div className="absolute -inset-8 md:-inset-12">
            {/* Top Left */}
            <div className="absolute top-0 left-0 w-8 h-8 md:w-12 md:h-12 border-l-2 border-t-2 border-worm-accent/90" />
            {/* Top Right */}
            <div className="absolute top-0 right-0 w-8 h-8 md:w-12 md:h-12 border-r-2 border-t-2 border-worm-accent/90" />
            {/* Bottom Left */}
            <div className="absolute bottom-0 left-0 w-8 h-8 md:w-12 md:h-12 border-l-2 border-b-2 border-worm-accent/90" />
            {/* Bottom Right */}
            <div className="absolute bottom-0 right-0 w-8 h-8 md:w-12 md:h-12 border-r-2 border-b-2 border-worm-accent/90" />
          </div>

          {/* Query Text */}
          <div
            ref={queryRef}
            className="px-8 py-6 md:px-12 md:py-8"
          >
            <p className="font-mono text-worm-text-primary text-center" style={{ fontSize: 'clamp(20px, 3.6vw, 48px)' }}>
              <span className="text-worm-text-secondary">Query:</span>{' '}
              <span className="text-worm-accent">{query || 'nama orang'}</span>
            </p>
          </div>
        </div>

        {/* Status Label */}
        <div
          ref={statusRef}
          className="mt-8 px-4 py-2 bg-worm-accent/10 border border-worm-accent/30 rounded-lg"
        >
          <p className="font-mono text-sm text-worm-accent tracking-wider animate-pulse">
            {getStatusText()}
          </p>
        </div>
      </div>

      {/* Scan Line */}
      <div
        ref={scanLineRef}
        className="absolute left-0 right-0 h-0.5 bg-worm-accent shadow-glow-intense pointer-events-none"
        style={{ top: 0 }}
      />

      {/* Bottom Gradient */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-worm-bg-primary to-transparent pointer-events-none" />
    </section>
  );
}
