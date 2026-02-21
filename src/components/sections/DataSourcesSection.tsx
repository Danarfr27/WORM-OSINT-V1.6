import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Database, CheckCircle } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

interface DataSourceItem {
  name: string;
  confidence: number;
}

const dataSources: DataSourceItem[] = [
  { name: 'Public Records', confidence: 92 },
  { name: 'Social Graph', confidence: 87 },
  { name: 'Breach Correlation', confidence: 74 },
  { name: 'Open Web', confidence: 81 },
  { name: 'Dark Web Monitoring', confidence: 63 },
  { name: 'Corporate Registry', confidence: 89 },
];

export function DataSourcesSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const titleRef = useRef<HTMLDivElement>(null);
  const rowsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Title animation
      gsap.fromTo(
        titleRef.current,
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

      // Rows animation
      const rows = rowsRef.current?.querySelectorAll('.source-row');
      if (rows) {
        gsap.fromTo(
          rows,
          { opacity: 0, x: '-4vw' },
          {
            opacity: 1,
            x: 0,
            stagger: 0.08,
            duration: 0.5,
            scrollTrigger: {
              trigger: rowsRef.current,
              start: 'top 80%',
              end: 'top 50%',
              scrub: 0.4,
            },
          }
        );
      }

      // Progress lines
      const progressLines = rowsRef.current?.querySelectorAll('.progress-line');
      if (progressLines) {
        progressLines.forEach((line, i) => {
          const confidence = dataSources[i]?.confidence || 0;
          gsap.fromTo(
            line,
            { scaleX: 0 },
            {
              scaleX: confidence / 100,
              duration: 0.8,
              ease: 'power2.out',
              scrollTrigger: {
                trigger: line,
                start: 'top 85%',
                toggleActions: 'play none none none',
              },
            }
          );
        });
      }
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative w-full py-24 overflow-hidden z-50"
    >
      {/* Background */}
      <div className="absolute inset-0 bg-worm-bg-primary" />

      <div className="relative z-10 w-full px-4 sm:px-6 lg:px-12 xl:px-20">
        {/* Title */}
        <div ref={titleRef} className="text-center mb-12">
          <h2 className="font-heading font-bold text-3xl md:text-4xl text-worm-text-primary mb-3">
            <span className="text-worm-accent">DATA</span> SOURCES
          </h2>
          <p className="text-worm-text-secondary max-w-md mx-auto">
            Verified against multiple datasets for maximum accuracy.
          </p>
        </div>

        {/* Source List */}
        <div ref={rowsRef} className="max-w-3xl mx-auto space-y-4">
          {dataSources.map((source, index) => (
            <div
              key={index}
              className="source-row p-5 rounded-card bg-worm-bg-secondary/50 border border-worm-accent/10 hover:border-worm-accent/30 transition-colors"
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-worm-accent/10 rounded-lg">
                    <Database className="w-4 h-4 text-worm-accent" />
                  </div>
                  <span className="font-mono text-sm text-worm-text-primary uppercase tracking-wider">
                    {source.name}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-400" />
                  <span className="font-mono text-lg font-bold text-worm-accent">
                    {source.confidence}%
                  </span>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="h-1 bg-worm-bg-primary rounded-full overflow-hidden">
                <div
                  className="progress-line h-full bg-gradient-to-r from-worm-accent to-cyan-300 rounded-full"
                  style={{ transformOrigin: 'left', transform: 'scaleX(0)' }}
                />
              </div>
            </div>
          ))}
        </div>

        {/* Summary */}
        <div className="mt-12 text-center">
          <p className="text-sm text-worm-text-secondary">
            <span className="text-worm-accent font-mono">{dataSources.length}</span> sources queried •{' '}
            <span className="text-worm-accent font-mono">
              {Math.round(dataSources.reduce((acc, s) => acc + s.confidence, 0) / dataSources.length)}%
            </span>{' '}
            average confidence
          </p>
        </div>
      </div>
    </section>
  );
}
