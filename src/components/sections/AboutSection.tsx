'use client';
import { useRef, useEffect, useState } from 'react';

const LINES = [
  { text: 'I build systems that don\'t need explanation.',        delay: 0   },
  { text: 'My focus is clarity under complexity —',               delay: 90  },
  { text: 'where performance, design, and logic converge.',       delay: 180 },
  { text: '',                                                     delay: 0   },
  { text: 'No unnecessary layers.',                               delay: 280 },
  { text: 'No decorative engineering.',                           delay: 370 },
  { text: '',                                                     delay: 0   },
  { text: 'Only what holds.',                                     delay: 470 },
];

const PRINCIPLES = [
  { delay: 620,  text: 'Systems over features' },
  { delay: 710,  text: 'Performance over abstraction' },
  { delay: 800,  text: 'Precision over volume' },
];

export default function AboutSection() {
  const ref       = useRef<HTMLElement>(null);
  const triggered = useRef(false);
  const [lineVis, setLineVis]   = useState<boolean[]>(new Array(LINES.length).fill(false));
  const [princVis, setPrincVis] = useState<boolean[]>(new Array(PRINCIPLES.length).fill(false));
  const [idVis, setIdVis]       = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting || triggered.current) return;
      triggered.current = true;

      // Identity block
      setTimeout(() => setIdVis(true), 80);

      // Lines
      LINES.forEach((l, i) => {
        if (l.text === '') return;
        setTimeout(() => {
          setLineVis(prev => { const n = [...prev]; n[i] = true; return n; });
        }, l.delay + 200);
      });

      // Principles
      PRINCIPLES.forEach((p, i) => {
        setTimeout(() => {
          setPrincVis(prev => { const n = [...prev]; n[i] = true; return n; });
        }, p.delay + 200);
      });
    }, { threshold: 0.18 });

    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return (
    <section id="about" ref={ref} className="about-section">
      <div className="about-inner">

        {/* LEFT — identity */}
        <div className={`about-id ${idVis ? 'about-in' : ''}`}>
          <span className="about-label">— Software Engineer</span>
          <h2 className="about-name">
            Mohammed<br />Hassoun
          </h2>
          <div className="about-divider" />
          <div className="about-avail">
            <span className="avail-dot" />
            <span className="avail-text">Available for work</span>
          </div>
          <div className="about-stats">
            <div className="stat">
              <span className="stat-n">5+</span>
              <span className="stat-l">Years</span>
            </div>
            <div className="stat">
              <span className="stat-n">40+</span>
              <span className="stat-l">Projects</span>
            </div>
            <div className="stat">
              <span className="stat-n">12+</span>
              <span className="stat-l">Clients</span>
            </div>
          </div>
        </div>

        {/* RIGHT — narrative */}
        <div className="about-text">
          <div className="about-body">
            {LINES.map((line, i) =>
              line.text === '' ? (
                <div key={i} className="about-spacer" />
              ) : (
                <p key={i} className={`about-line ${lineVis[i] ? 'about-in' : ''}`}>
                  {line.text}
                </p>
              )
            )}
          </div>

          <div className="about-principles">
            {PRINCIPLES.map((p, i) => (
              <div key={i} className={`principle ${princVis[i] ? 'about-in' : ''}`}>
                <span className="pr-dash">—</span>
                <span className="pr-text">{p.text}</span>
              </div>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
}
