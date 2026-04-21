// ============================================================
// SHADER REBUILD — About Vintage (Retro Computer Spread)
// src/sections/05-AboutVintage/AboutVintage.tsx
//
// Spec: 06-about-vintage.md
// - Full-bleed 1982-era computer product photography
// - Deep parallax: image moves at 0.4x scroll speed
// - Rainbow stripe separator (top & bottom)
//   - Top stripes animate in from left-to-right on enter
// - No text overlay — image speaks for itself
// ============================================================

import { useRef } from 'react';
import { useGSAP } from '@gsap/react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SectionAnchor } from '../../components/shared/SectionAnchor';
import styles from './AboutVintage.module.css';

gsap.registerPlugin(ScrollTrigger);

const RAINBOW = ['#e63946', '#f4a261', '#e9c46a', '#2a9d8f', '#457b9d', '#6a0572'];
const RAINBOW_REV = [...RAINBOW].reverse();

function AboutVintage() {
  const sectionRef  = useRef<HTMLElement>(null);
  const imageRef    = useRef<HTMLDivElement>(null);
  const stripTopRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    if (!sectionRef.current || !imageRef.current) return;

    // Deep parallax — image moves at 0.4x scroll speed
    gsap.to(imageRef.current, {
      yPercent: 15,
      ease: 'none',
      scrollTrigger: {
        trigger: sectionRef.current,
        start: 'top bottom',
        end: 'bottom top',
        scrub: true,
      },
    });

    // Rainbow stripes animate in from left (each stripe 50ms stagger)
    if (stripTopRef.current) {
      const stripes = stripTopRef.current.querySelectorAll(`.${styles.stripe}`);
      gsap.from(stripes, {
        scaleX: 0,
        transformOrigin: 'left center',
        duration: 0.4,
        stagger: 0.05,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 80%',
          toggleActions: 'play none none reverse',
        },
      });
    }
  });

  return (
    <section ref={sectionRef} className={styles.section}>
      <SectionAnchor id="about-vintage" threshold={0.4} />

      {/* Top rainbow stripe separator */}
      <div ref={stripTopRef} className={styles.rainbowStripe} aria-hidden="true">
        {RAINBOW.map((color, i) => (
          <div key={i} className={styles.stripe} style={{ backgroundColor: color }} />
        ))}
      </div>

      {/* Parallax background */}
      <div ref={imageRef} className={styles.bgImage} role="img" aria-label="Vintage retro computer product spread from the 1980s" />

      {/* Light vignette */}
      <div className={styles.vignette} aria-hidden="true" />

      {/* Bottom rainbow stripe */}
      <div className={styles.rainbowStripeBottom} aria-hidden="true">
        {RAINBOW_REV.map((color, i) => (
          <div key={i} className={styles.stripe} style={{ backgroundColor: color }} />
        ))}
      </div>
    </section>
  );
}

export default AboutVintage;