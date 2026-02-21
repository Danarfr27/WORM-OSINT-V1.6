import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useSearch } from '@/context/SearchContext';
import { AlertTriangle, Shield } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

export function RiskSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const meterRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<SVGCircleElement>(null);
  const labelRef = useRef<HTMLDivElement>(null);
  const valueRef = useRef<HTMLDivElement>(null);
  const { result } = useSearch();

  const riskLevel = result?.risk_level || 'low';
  
  const riskConfig = {
    low: { value: 'LOW', percentage: 25, color: '#4ade80', message: 'No high-risk indicators detected.' },
    medium: { value: 'MEDIUM', percentage: 50, color: '#facc15', message: 'Some risk factors identified.' },
    high: { value: 'HIGH', percentage: 75, color: '#fb923c', message: 'Multiple risk indicators present.' },
    critical: { value: 'CRITICAL', percentage: 95, color: '#f87171', message: 'Immediate attention required.' },
  };

  const config = riskConfig[riskLevel];

  useEffect(() => {
    const ctx = gsap.context(() => {
      const scrollTl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top top',
          end: '+=120%',
          pin: true,
          scrub: 0.6,
        },
      });

      // ENTRANCE (0%-30%)
      scrollTl.fromTo(
        meterRef.current,
        { opacity: 0, scale: 0.85, rotate: -8 },
        { opacity: 1, scale: 1, rotate: 0, ease: 'none' },
        0
      );

      // Ring fill animation
      if (ringRef.current) {
        const circumference = 2 * Math.PI * 120;
        const offset = circumference - (config.percentage / 100) * circumference * 0.75;
        
        scrollTl.fromTo(
          ringRef.current,
          { strokeDashoffset: circumference },
          { strokeDashoffset: offset, ease: 'none' },
          0.1
        );
      }

      scrollTl.fromTo(
        [labelRef.current, valueRef.current],
        { opacity: 0, y: '-2vh' },
        { opacity: 1, y: 0, stagger: 0.05, ease: 'none' },
        0.15
      );

      // SETTLE (30%-70%) - Pulse glow
      scrollTl.to(
        meterRef.current,
        {
          boxShadow: `0 0 35px ${config.color}40`,
          duration: 0.2,
          yoyo: true,
          repeat: 5,
          ease: 'sine.inOut',
        },
        0.3
      );

      // EXIT (70%-100%)
      scrollTl.fromTo(
        meterRef.current,
        { scale: 1, opacity: 1 },
        { scale: 1.12, opacity: 0, ease: 'power2.in' },
        0.7
      );

      scrollTl.fromTo(
        [labelRef.current, valueRef.current],
        { opacity: 1 },
        { opacity: 0, ease: 'power2.in' },
        0.85
      );
    }, sectionRef);

    return () => ctx.revert();
  }, [config.percentage, config.color]);

  return (
    <section
      ref={sectionRef}
      className="relative w-full h-screen flex items-center justify-center overflow-hidden z-[60]"
    >
      {/* Background */}
      <div className="absolute inset-0 bg-worm-bg-primary" />

      {/* Warning Triangles (decorative) */}
      <div className="absolute inset-0 pointer-events-none opacity-10">
        <AlertTriangle className="absolute top-[20%] left-[15%] w-8 h-8 text-worm-accent" />
        <AlertTriangle className="absolute top-[25%] right-[20%] w-6 h-6 text-worm-accent" />
        <AlertTriangle className="absolute bottom-[30%] left-[20%] w-5 h-5 text-worm-accent" />
      </div>

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center">
        {/* Label */}
        <div ref={labelRef} className="mb-8">
          <span className="font-mono text-sm uppercase tracking-[0.18em] text-worm-text-secondary">
            Risk Level
          </span>
        </div>

        {/* Risk Meter */}
        <div
          ref={meterRef}
          className="relative w-[280px] h-[280px] md:w-[380px] md:h-[380px]"
        >
          {/* Outer Glow */}
          <div
            className="absolute inset-0 rounded-full blur-3xl opacity-30"
            style={{ backgroundColor: config.color }}
          />

          {/* SVG Ring */}
          <svg
            viewBox="0 0 280 280"
            className="absolute inset-0 w-full h-full -rotate-90"
          >
            {/* Track */}
            <circle
              cx="140"
              cy="140"
              r="120"
              fill="none"
              stroke="rgba(138,150,168,0.25)"
              strokeWidth="12"
              strokeLinecap="round"
              strokeDasharray={`${2 * Math.PI * 120 * 0.75} ${2 * Math.PI * 120}`}
            />
            
            {/* Fill */}
            <circle
              ref={ringRef}
              cx="140"
              cy="140"
              r="120"
              fill="none"
              stroke={config.color}
              strokeWidth="12"
              strokeLinecap="round"
              strokeDasharray={`${2 * Math.PI * 120 * 0.75} ${2 * Math.PI * 120}`}
              strokeDashoffset={2 * Math.PI * 120}
              style={{
                filter: `drop-shadow(0 0 10px ${config.color})`,
              }}
            />
          </svg>

          {/* Center Content */}
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <Shield
              className="w-10 h-10 mb-2"
              style={{ color: config.color }}
            />
            <span
              ref={valueRef}
              className="font-heading font-bold text-4xl md:text-5xl"
              style={{ color: config.color }}
            >
              {config.value}
            </span>
            <span className="font-mono text-sm text-worm-text-secondary mt-2">
              {config.percentage}%
            </span>
          </div>
        </div>

        {/* Message */}
        <div className="mt-8 text-center max-w-md px-4">
          <p className="text-worm-text-secondary">{config.message}</p>
        </div>
      </div>

      {/* Bottom Gradient */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-worm-bg-primary to-transparent pointer-events-none" />
    </section>
  );
}
