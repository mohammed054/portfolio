'use client';

import { useEffect, useRef } from 'react';

interface HeroTextProps {
  visible: boolean;
}

export default function HeroText({ visible }: HeroTextProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;
    const els = containerRef.current.querySelectorAll(
      '.hero-name, .hero-role, .hero-tagline, .hero-cta'
    );
    if (visible) {
      els.forEach((el) => el.classList.add('visible'));
    } else {
      els.forEach((el) => el.classList.remove('visible'));
    }
  }, [visible]);

  return (
    <div ref={containerRef} className="hero-text-overlay">
      <h1 className="hero-name">Mohammed<br />Hassoun</h1>
      <p className="hero-role">Software Engineer</p>
      <p className="hero-tagline">
        "I only design what's necessary,<br />not what's flashy."
      </p>
      <div className="hero-cta">
        <button className="cta-btn cta-btn-primary">Explore Work</button>
        <button className="cta-btn cta-btn-secondary">Contact</button>
      </div>
    </div>
  );
}
