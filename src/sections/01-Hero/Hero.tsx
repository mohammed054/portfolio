// ============================================================
// SHADER REBUILD — Hero Section
// src/sections/01-Hero/Hero.tsx
//
// Spec: 02-hero.md + 13-scroll-animation-system.md
// - On-enter: staggered headline lines slide up from translateY
// - Scroll: text parallaxes upward at 0.6x scroll speed
// - Sub-CTA fades in after headline
// ============================================================

import { useRef } from 'react';
import { useGSAP } from '@gsap/react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import HeroScene from './HeroScene';
import { SectionAnchor } from '../../components/shared/SectionAnchor';
import styles from './Hero.module.css';

gsap.registerPlugin(ScrollTrigger);

function Hero() {
  const containerRef = useRef<HTMLElement>(null);
  const textRef      = useRef<HTMLDivElement>(null);
  const ctaRef       = useRef<HTMLParagraphElement>(null);
  const linesRef     = useRef<HTMLSpanElement[]>([]);

  useGSAP(() => {
    if (!textRef.current || !ctaRef.current) return;

    // ── Enter animation ──────────────────────────────────────
    const lines = linesRef.current.filter(Boolean);

    gsap.set(lines, { y: 40, opacity: 0 });
    gsap.set(ctaRef.current, { opacity: 0 });

    const tl = gsap.timeline({ delay: 0.3 });

    tl.to(lines, {
      y: 0,
      opacity: 1,
      duration: 0.8,
      stagger: 0.1,
      ease: 'power3.out',
    }).to(
      ctaRef.current,
      { opacity: 1, duration: 0.6, ease: 'power2.out' },
      '-=0.2',
    );

    // ── Scroll parallax — text drifts up ─────────────────────
    gsap.to(textRef.current, {
      yPercent: -25,
      opacity: 0.4,
      ease: 'none',
      scrollTrigger: {
        trigger: containerRef.current,
        start: 'top top',
        end: 'bottom top',
        scrub: true,
      },
    });
  });

  return (
    <section ref={containerRef} className={styles.hero}>
      <SectionAnchor id="home" threshold={0.3} />

      {/* Vignette overlay */}
      <div className={styles.vignette} aria-hidden="true" />

      {/* Left column — typography */}
      <div className={styles.textColumn} ref={textRef}>
        <h1 className={styles.headline}>
          {['A Creative', 'Development', 'Studio, Plugged', 'into the Future'].map(
            (line, i) => (
              <span
                key={i}
                className={styles.headlineLine}
                ref={(el) => { if (el) linesRef.current[i] = el; }}
              >
                {line}
              </span>
            ),
          )}
        </h1>

        <p ref={ctaRef} className={styles.cta}>
          Scroll to Inspect Our Closed Deals
          <span className={styles.scrollIcons} aria-hidden="true">
            <span className={styles.icon}>↓</span>
            <span className={styles.icon}>↓</span>
            <span className={styles.icon}>↓</span>
          </span>
        </p>
      </div>

      {/* Right column — 3D scene */}
      <div className={styles.scene3d} aria-hidden="true">
        <HeroScene />
      </div>
    </section>
  );
}

export default Hero;