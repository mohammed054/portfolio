'use client';

import { useRef, useEffect, useState } from 'react';
import AboutText from './AboutText';

export default function AboutSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const [visible, setVisible] = useState(false);
  const [titleVisible, setTitleVisible] = useState(false);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && entry.intersectionRatio > 0.15) {
          setVisible(true);
          setTimeout(() => setTitleVisible(true), 100);
        }
      },
      { threshold: [0.15] }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <section id="about" ref={sectionRef} className="about-section">
      {/* Particle fog — echoes the hero's starfield fading to calm */}
      <div className="about-fog" />

      <div className="about-inner">
        {/* LEFT: Identity anchor */}
        <div className={`about-identity ${titleVisible ? 'in' : ''}`}>
          <div className="about-label">Software Engineer</div>
          <h2 className="about-name">
            Mohammed<br />Hassoun
          </h2>
          <div className="about-divider" />
          <div className="about-meta">
            <span className="meta-tag">Available for work</span>
          </div>
        </div>

        {/* RIGHT: Narrative + principles */}
        <AboutText visible={visible} />
      </div>
    </section>
  );
}
