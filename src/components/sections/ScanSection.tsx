import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useSearch } from '@/context/SearchContext';

gsap.registerPlugin(ScrollTrigger);

export function ScanSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const mapRef = useRef<HTMLDivElement>(null);
  const barsRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);
  const { scanProgress } = useSearch();

  useEffect(() => {
    const ctx = gsap.context(() => {
      const scrollTl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top top',
          end: '+=140%',
          pin: true,
          scrub: 0.6,
        },
      });

      // ENTRANCE (0%-30%)
      scrollTl.fromTo(
        mapRef.current,
        { opacity: 0, scale: 1.08 },
        { opacity: 0.85, scale: 1, ease: 'none' },
        0
      );

      // Data bars stagger
      const bars = barsRef.current?.querySelectorAll('.data-bar');
      if (bars) {
        scrollTl.fromTo(
          bars,
          { opacity: 0, y: '-8vh', scaleY: 0.2 },
          { opacity: 1, y: 0, scaleY: 1, stagger: 0.02, ease: 'none' },
          0.05
        );
      }

      scrollTl.fromTo(
        headerRef.current,
        { opacity: 0, y: '-4vh' },
        { opacity: 1, y: 0, ease: 'none' },
        0.1
      );

      scrollTl.fromTo(
        progressRef.current,
        { opacity: 0, y: '2vh' },
        { opacity: 1, y: 0, ease: 'none' },
        0.15
      );

      // SETTLE (30%-70%) - Ambient motion
      if (bars) {
        scrollTl.to(
          bars,
          { y: -6, duration: 0.1, yoyo: true, repeat: 5, ease: 'sine.inOut' },
          0.3
        );
      }

      scrollTl.to(
        mapRef.current,
        { x: -4, duration: 0.15, yoyo: true, repeat: 3, ease: 'sine.inOut' },
        0.3
      );

      // EXIT (70%-100%)
      scrollTl.fromTo(
        mapRef.current,
        { scale: 1, opacity: 0.85 },
        { scale: 1.12, opacity: 0, ease: 'power2.in' },
        0.7
      );

      if (bars) {
        scrollTl.fromTo(
          bars,
          { opacity: 1, y: 0 },
          { opacity: 0, y: '-10vh', stagger: 0.01, ease: 'power2.in' },
          0.7
        );
      }

      scrollTl.fromTo(
        [headerRef.current, progressRef.current],
        { opacity: 1 },
        { opacity: 0, ease: 'power2.in' },
        0.85
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  // Generate data bars
  const dataBars = Array.from({ length: 14 }, (_, i) => ({
    id: i,
    height: `${18 + Math.random() * 16}vh`,
    delay: i * 0.1,
  }));

  return (
    <section
      ref={sectionRef}
      id="scan"
      className="relative w-full h-screen flex items-center justify-center overflow-hidden z-30"
    >
      {/* Background */}
      <div className="absolute inset-0 bg-worm-bg-primary" />

      {/* World Map */}
      <div
        ref={mapRef}
        className="absolute inset-0 flex items-center justify-center opacity-85"
      >
        <svg
          viewBox="0 0 1000 500"
          className="w-[86vw] h-auto"
          style={{ filter: 'drop-shadow(0 0 30px rgba(0, 240, 255, 0.2))' }}
        >
          {/* Simplified World Map Path */}
          <defs>
            <linearGradient id="mapGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#00F0FF" stopOpacity="0.6" />
              <stop offset="100%" stopColor="#00D4E0" stopOpacity="0.3" />
            </linearGradient>
          </defs>
          
          {/* North America */}
          <path
            d="M150,120 Q200,80 280,100 L320,140 Q300,180 250,200 L200,180 Q160,160 150,120Z"
            fill="none"
            stroke="url(#mapGradient)"
            strokeWidth="1"
            opacity="0.7"
          />
          
          {/* South America */}
          <path
            d="M260,250 Q300,240 320,280 L300,380 Q260,400 240,360 L250,280Z"
            fill="none"
            stroke="url(#mapGradient)"
            strokeWidth="1"
            opacity="0.7"
          />
          
          {/* Europe */}
          <path
            d="M450,100 Q500,80 550,100 L560,140 Q520,160 480,150 L450,120Z"
            fill="none"
            stroke="url(#mapGradient)"
            strokeWidth="1"
            opacity="0.7"
          />
          
          {/* Africa */}
          <path
            d="M480,180 Q540,170 560,220 L540,350 Q500,380 470,340 L460,220Z"
            fill="none"
            stroke="url(#mapGradient)"
            strokeWidth="1"
            opacity="0.7"
          />
          
          {/* Asia */}
          <path
            d="M580,80 Q700,60 800,100 L820,180 Q780,220 700,200 L620,160 L580,120Z"
            fill="none"
            stroke="url(#mapGradient)"
            strokeWidth="1"
            opacity="0.7"
          />
          
          {/* Australia */}
          <path
            d="M750,320 Q820,310 850,350 L830,400 Q780,410 760,380 L750,340Z"
            fill="none"
            stroke="url(#mapGradient)"
            strokeWidth="1"
            opacity="0.7"
          />

          {/* Connection Lines */}
          <g opacity="0.3">
            <line x1="250" y1="150" x2="500" y2="120" stroke="#00F0FF" strokeWidth="0.5" strokeDasharray="4,4">
              <animate attributeName="stroke-dashoffset" from="0" to="8" dur="2s" repeatCount="indefinite" />
            </line>
            <line x1="520" y1="130" x2="700" y2="140" stroke="#00F0FF" strokeWidth="0.5" strokeDasharray="4,4">
              <animate attributeName="stroke-dashoffset" from="0" to="8" dur="1.5s" repeatCount="indefinite" />
            </line>
            <line x1="280" y1="300" x2="510" y2="280" stroke="#00F0FF" strokeWidth="0.5" strokeDasharray="4,4">
              <animate attributeName="stroke-dashoffset" from="0" to="8" dur="2.5s" repeatCount="indefinite" />
            </line>
            <line x1="720" y1="180" x2="790" y2="350" stroke="#00F0FF" strokeWidth="0.5" strokeDasharray="4,4">
              <animate attributeName="stroke-dashoffset" from="0" to="8" dur="1.8s" repeatCount="indefinite" />
            </line>
          </g>

          {/* Data Points */}
          <g>
            <circle cx="250" cy="150" r="3" fill="#00F0FF" opacity="0.8">
              <animate attributeName="r" values="3;5;3" dur="2s" repeatCount="indefinite" />
              <animate attributeName="opacity" values="0.8;0.4;0.8" dur="2s" repeatCount="indefinite" />
            </circle>
            <circle cx="520" cy="130" r="3" fill="#00F0FF" opacity="0.8">
              <animate attributeName="r" values="3;5;3" dur="1.5s" repeatCount="indefinite" />
              <animate attributeName="opacity" values="0.8;0.4;0.8" dur="1.5s" repeatCount="indefinite" />
            </circle>
            <circle cx="700" cy="140" r="3" fill="#00F0FF" opacity="0.8">
              <animate attributeName="r" values="3;5;3" dur="2.2s" repeatCount="indefinite" />
              <animate attributeName="opacity" values="0.8;0.4;0.8" dur="2.2s" repeatCount="indefinite" />
            </circle>
            <circle cx="280" cy="300" r="3" fill="#00F0FF" opacity="0.8">
              <animate attributeName="r" values="3;5;3" dur="1.8s" repeatCount="indefinite" />
              <animate attributeName="opacity" values="0.8;0.4;0.8" dur="1.8s" repeatCount="indefinite" />
            </circle>
            <circle cx="510" cy="280" r="3" fill="#00F0FF" opacity="0.8">
              <animate attributeName="r" values="3;5;3" dur="2.5s" repeatCount="indefinite" />
              <animate attributeName="opacity" values="0.8;0.4;0.8" dur="2.5s" repeatCount="indefinite" />
            </circle>
            <circle cx="790" cy="360" r="3" fill="#00F0FF" opacity="0.8">
              <animate attributeName="r" values="3;5;3" dur="1.6s" repeatCount="indefinite" />
              <animate attributeName="opacity" values="0.8;0.4;0.8" dur="1.6s" repeatCount="indefinite" />
            </circle>
          </g>
        </svg>
      </div>

      {/* Data Stream Bars */}
      <div
        ref={barsRef}
        className="absolute inset-0 flex items-end justify-center gap-2 md:gap-3 pb-[15vh] pointer-events-none"
      >
        {dataBars.map((bar) => (
          <div
            key={bar.id}
            className="data-bar w-2 md:w-4 data-bar animate-data-stream"
            style={{
              height: bar.height,
              animationDelay: `${bar.delay}s`,
            }}
          />
        ))}
      </div>

      {/* Header */}
      <div
        ref={headerRef}
        className="absolute top-[15vh] left-1/2 -translate-x-1/2 text-center"
      >
        <h2 className="font-mono text-worm-accent tracking-[0.18em] text-sm md:text-base uppercase">
          SCANNING GLOBAL DATA...
        </h2>
      </div>

      {/* Progress */}
      <div
        ref={progressRef}
        className="absolute bottom-[15vh] left-1/2 -translate-x-1/2 text-center"
      >
        <p className="font-mono text-2xl md:text-4xl font-bold text-worm-text-primary">
          {scanProgress}%
        </p>
        <p className="font-mono text-xs text-worm-text-secondary mt-2 max-w-md">
          Cross-referencing open sources, breached datasets, and public records.
        </p>
      </div>

      {/* Bottom Gradient */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-worm-bg-primary to-transparent pointer-events-none" />
    </section>
  );
}
