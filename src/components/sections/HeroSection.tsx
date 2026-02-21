import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SearchPill } from '@/components/SearchPill';
// Hero section - Search interface

gsap.registerPlugin(ScrollTrigger);

interface HeroSectionProps {
  onSearch: (query: string) => void;
}

export function HeroSection({ onSearch }: HeroSectionProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const headlineRef = useRef<HTMLHeadingElement>(null);
  const subheadlineRef = useRef<HTMLParagraphElement>(null);
  const searchRef = useRef<HTMLDivElement>(null);
  const ringsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Entrance Animation (on load)
      const tl = gsap.timeline({ defaults: { ease: 'power2.out' } });

      // Headline character animation
      if (headlineRef.current) {
        const chars = headlineRef.current.querySelectorAll('.char');
        tl.fromTo(
          chars,
          { opacity: 0, y: 18, rotateX: 35 },
          { opacity: 1, y: 0, rotateX: 0, stagger: 0.02, duration: 0.6 },
          0.2
        );
      }

      // Subheadline
      tl.fromTo(
        subheadlineRef.current,
        { opacity: 0, y: 12 },
        { opacity: 1, y: 0, duration: 0.5 },
        0.6
      );

      // Search pill
      tl.fromTo(
        searchRef.current,
        { opacity: 0, scale: 0.92 },
        { opacity: 1, scale: 1, duration: 0.6 },
        0.7
      );

      // Rings
      tl.fromTo(
        ringsRef.current,
        { opacity: 0, rotate: -12 },
        { opacity: 1, rotate: 0, duration: 0.8 },
        0.5
      );

      // Scroll-driven animation (pinned)
      const scrollTl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top top',
          end: '+=130%',
          pin: true,
          scrub: 0.6,
          onLeaveBack: () => {
            // Reset to visible when scrolling back to top
            gsap.set([headlineRef.current, subheadlineRef.current, searchRef.current], {
              opacity: 1,
              y: 0,
              scale: 1,
            });
          },
        },
      });

      // Ambient ring rotation during settle
      scrollTl.fromTo(
        ringsRef.current,
        { rotate: 0 },
        { rotate: 8, ease: 'none' },
        0
      );

      // EXIT (70%-100%)
      scrollTl.fromTo(
        [headlineRef.current, subheadlineRef.current],
        { y: 0, opacity: 1 },
        { y: '-22vh', opacity: 0, ease: 'power2.in' },
        0.7
      );

      scrollTl.fromTo(
        searchRef.current,
        { scale: 1, opacity: 1 },
        { scale: 0.88, opacity: 0, ease: 'power2.in' },
        0.7
      );

      scrollTl.fromTo(
        ringsRef.current,
        { scale: 1, opacity: 1 },
        { scale: 1.25, opacity: 0, ease: 'power2.in' },
        0.7
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  // Split headline into characters
  const headline = 'WORM AI';
  const chars = headline.split('').map((char, i) => (
    <span key={i} className="char inline-block" style={{ display: char === ' ' ? 'inline' : 'inline-block' }}>
      {char === ' ' ? '\u00A0' : char}
    </span>
  ));

  return (
    <section
      ref={sectionRef}
      id="hero"
      className="relative w-full h-screen flex items-center justify-center overflow-hidden vignette"
    >
      {/* Background */}
      <div className="absolute inset-0 bg-worm-bg-primary" />

      {/* Vignette Overlay */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse at center, transparent 0%, transparent 50%, rgba(0, 0, 0, 0.4) 100%)',
        }}
      />

      {/* Content */}
      <div className="relative z-10 w-full px-4 flex flex-col items-center">
        {/* Logo Lockup */}
        <div className="text-center mb-8">
          <h1
            ref={headlineRef}
            className="font-heading font-bold text-glow gradient-text"
            style={{ fontSize: 'clamp(44px, 6vw, 84px)', lineHeight: 1.1 }}
          >
            {chars}
          </h1>
          <p
            ref={subheadlineRef}
            className="mt-4 text-worm-text-secondary text-lg md:text-xl max-w-xl mx-auto"
          >
            Deep-search identities, aliases, and digital footprints.
          </p>
        </div>

        {/* Search Pill */}
        <div ref={searchRef} className="w-full max-w-2xl px-4">
          <SearchPill onSearch={onSearch} />
        </div>

        {/* Orbiting Rings Decoration */}
        <div
          ref={ringsRef}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none"
        >
          <div className="relative w-[500px] h-[500px] md:w-[600px] md:h-[600px]">
            <div className="absolute inset-0 border border-worm-accent/10 rounded-full" />
            <div className="absolute inset-8 border border-worm-accent/5 rounded-full" />
            <div className="absolute inset-16 border border-worm-accent/[0.03] rounded-full" />
          </div>
        </div>
      </div>

      {/* Bottom Gradient */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-worm-bg-primary to-transparent pointer-events-none" />
    </section>
  );
}
