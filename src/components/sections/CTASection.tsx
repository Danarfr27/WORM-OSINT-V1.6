import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ArrowRight, BookOpen, Shield } from 'lucide-react';
import { Button } from '@/components/ui/button';

gsap.registerPlugin(ScrollTrigger);

interface CTASectionProps {
  onNewSearch: () => void;
}

export function CTASection({ onNewSearch }: CTASectionProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const subtextRef = useRef<HTMLParagraphElement>(null);
  const buttonsRef = useRef<HTMLDivElement>(null);
  const footerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        headingRef.current,
        { opacity: 0, y: 18 },
        {
          opacity: 1,
          y: 0,
          duration: 0.6,
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 80%',
            end: 'top 60%',
            scrub: 0.4,
          },
        }
      );

      gsap.fromTo(
        subtextRef.current,
        { opacity: 0, y: 14 },
        {
          opacity: 1,
          y: 0,
          duration: 0.5,
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 75%',
            end: 'top 55%',
            scrub: 0.4,
          },
        }
      );

      gsap.fromTo(
        buttonsRef.current,
        { opacity: 0, y: 14, scale: 0.98 },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.5,
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 70%',
            end: 'top 50%',
            scrub: 0.4,
          },
        }
      );

      gsap.fromTo(
        footerRef.current,
        { opacity: 0 },
        {
          opacity: 1,
          duration: 0.5,
          scrollTrigger: {
            trigger: footerRef.current,
            start: 'top 90%',
            toggleActions: 'play none none none',
          },
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative w-full min-h-screen flex flex-col items-center justify-center py-24 overflow-hidden z-[70]"
    >
      {/* Background */}
      <div className="absolute inset-0 bg-worm-bg-primary">
        {/* Horizon Line */}
        <div
          className="absolute bottom-0 left-0 right-0 h-1/2 opacity-30"
          style={{
            background: 'linear-gradient(to top, rgba(0, 240, 255, 0.05) 0%, transparent 100%)',
          }}
        />
      </div>

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center text-center px-4 max-w-3xl mx-auto">
        {/* Heading */}
        <h2
          ref={headingRef}
          className="font-heading font-bold text-3xl md:text-5xl text-worm-text-primary mb-6"
        >
          Ready to run your{' '}
          <span className="gradient-text">first search?</span>
        </h2>

        {/* Subtext */}
        <p
          ref={subtextRef}
          className="text-worm-text-secondary text-lg mb-10 max-w-xl"
        >
          No signup required. Pay per query. Enterprise APIs available.
        </p>

        {/* Buttons */}
        <div ref={buttonsRef} className="flex flex-col sm:flex-row gap-4">
          <Button
            onClick={onNewSearch}
            size="lg"
            className="bg-worm-accent/20 text-worm-accent border border-worm-accent/50 hover:bg-worm-accent/30 btn-glow px-8 py-6 text-base"
          >
            <ArrowRight className="w-5 h-5 mr-2" />
            Start Searching
          </Button>
          <Button
            variant="outline"
            size="lg"
            className="border-worm-accent/30 text-worm-text-secondary hover:bg-worm-accent/10 hover:text-worm-accent px-8 py-6 text-base"
          >
            <BookOpen className="w-5 h-5 mr-2" />
            Read Docs
          </Button>
        </div>
      </div>

      {/* Footer */}
      <div
        ref={footerRef}
        className="absolute bottom-0 left-0 right-0 py-8 px-4"
      >
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 max-w-6xl mx-auto">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <Shield className="w-5 h-5 text-worm-accent" />
            <span className="font-heading font-semibold text-worm-text-primary">
              WORM AI
            </span>
            <span className="font-mono text-xs text-worm-accent/70 border border-worm-accent/30 px-1.5 py-0.5 rounded">
              V1.6
            </span>
          </div>

          {/* Links */}
          <div className="flex items-center gap-6 text-sm text-worm-text-secondary">
            <a href="#" className="hover:text-worm-accent transition-colors">Privacy</a>
            <a href="#" className="hover:text-worm-accent transition-colors">Terms</a>
            <a href="#" className="hover:text-worm-accent transition-colors">Security</a>
          </div>

          {/* Copyright */}
          <p className="text-xs text-worm-text-secondary/50 font-mono">
            © 2024 WORM AI. All rights reserved.
          </p>
        </div>
      </div>
    </section>
  );
}
