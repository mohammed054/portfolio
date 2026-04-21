// ============================================================
// SHADER REBUILD — About Hero (Cubicle Flyover)
// src/sections/03-AboutHero/AboutHero.tsx
//
// Spec: 04-about-hero.md
// - Full-bleed bg image with deep parallax (0.5x scroll speed)
// - "About Us" in massive Playfair Display, semi-transparent
// - Subtle CRT chromatic aberration via CSS filter
// - Top-of-section transition: gradient from hero dark to transparent
// ============================================================

import { useRef } from 'react';
import { useGSAP } from '@gsap/react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SectionAnchor } from '../../components/shared/SectionAnchor';
import styles from './AboutHero.module.css';

gsap.registerPlugin(ScrollTrigger);

function AboutHero() {
  const sectionRef = useRef<HTMLElement>(null);
  const imageRef   = useRef<HTMLDivElement>(null);
  const titleRef   = useRef<HTMLHeadingElement>(null);

  useGSAP(() => {
    if (!sectionRef.current || !imageRef.current || !titleRef.current) return;

    // ── Parallax: image moves at 0.5x scroll ─────────────────
    gsap.to(imageRef.current, {
      yPercent: 20,
      ease: 'none',
      scrollTrigger: {
        trigger: sectionRef.current,
        start: 'top bottom',
        end: 'bottom top',
        scrub: true,
      },
    });

    // ── Title enter: fade up ──────────────────────────────────
    gsap.from(titleRef.current, {
      opacity: 0,
      y: 20,
      duration: 0.8,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: sectionRef.current,
        start: 'top 75%',
        toggleActions: 'play none none reverse',
      },
    });
  });

  return (
    <section ref={sectionRef} className={styles.section}>
      <SectionAnchor id="about-us" threshold={0.4} />

      {/* Transition gradient from dark hero above */}
      <div className={styles.fadeFromDark} aria-hidden="true" />

      {/* Parallax background image */}
      <div ref={imageRef} className={styles.bgImage} aria-hidden="true" />

      {/* Vignette */}
      <div className={styles.vignette} aria-hidden="true" />

      {/* Title */}
      <h1 ref={titleRef} className={styles.title}>
        About Us
      </h1>
    </section>
  );
}

export default AboutHero;