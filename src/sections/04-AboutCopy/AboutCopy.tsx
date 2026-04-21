// ============================================================
// SHADER REBUILD — About Copy
// src/sections/04-AboutCopy/AboutCopy.tsx
//
// Spec: 05-about-copy.md
// - Warm cream background (#f0e8d8)
// - Large Playfair Display headline, centered
// - 3-column EB Garamond body copy
// - Businessman cutout slides in from the right
// - Stagger entrance animations per column
// ============================================================

import { useRef } from 'react';
import { useGSAP } from '@gsap/react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { COPY } from '../../utils/constants';
import { SectionAnchor } from '../../components/shared/SectionAnchor';
import styles from './AboutCopy.module.css';

gsap.registerPlugin(ScrollTrigger);

function AboutCopy() {
  const sectionRef    = useRef<HTMLElement>(null);
  const headlineRef   = useRef<HTMLHeadingElement>(null);
  const col1Ref       = useRef<HTMLDivElement>(null);
  const col2Ref       = useRef<HTMLDivElement>(null);
  const col3Ref       = useRef<HTMLDivElement>(null);
  const businessmanRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    const st = { trigger: sectionRef.current, start: 'top 65%' };

    // Headline fades up
    gsap.from(headlineRef.current, {
      y: 30, opacity: 0, duration: 0.7, ease: 'power3.out',
      scrollTrigger: { ...st, toggleActions: 'play none none reverse' },
    });

    // Columns stagger in left→right, 150ms apart
    [col1Ref, col2Ref, col3Ref].forEach((ref, i) => {
      gsap.from(ref.current, {
        y: 20, opacity: 0, duration: 0.6, ease: 'power2.out',
        delay: i * 0.15,
        scrollTrigger: { ...st, toggleActions: 'play none none reverse' },
      });
    });

    // Businessman slides in from right
    gsap.from(businessmanRef.current, {
      x: 80, opacity: 0, duration: 0.8, ease: 'power3.out',
      delay: 0.4,
      scrollTrigger: { ...st, toggleActions: 'play none none reverse' },
    });

    // Subtle parallax on the businessman — lags slightly behind
    gsap.to(businessmanRef.current, {
      y: -30,
      ease: 'none',
      scrollTrigger: {
        trigger: sectionRef.current,
        start: 'top bottom',
        end: 'bottom top',
        scrub: true,
      },
    });
  });

  return (
    <section ref={sectionRef} className={styles.section}>
      <SectionAnchor id="about-copy" threshold={0.4} />

      {/* Paper texture overlay */}
      <div className={styles.paperTexture} aria-hidden="true" />

      <div className={styles.container}>
        {/* Headline */}
        <h2 ref={headlineRef} className={styles.headline}>
          Making Digital Storytelling More Playful,
          <br />
          Powerful, and Alive
        </h2>

        {/* Three-column body copy */}
        <div className={styles.columns}>
          <div ref={col1Ref} className={styles.column}>
            <p>{COPY.aboutCopy.col1}</p>
          </div>
          <div ref={col2Ref} className={styles.column}>
            <p>{COPY.aboutCopy.col2}</p>
          </div>
          <div ref={col3Ref} className={styles.column}>
            <p>{COPY.aboutCopy.col3}</p>
          </div>
        </div>
      </div>

      {/* Businessman cutout — positioned absolute, right side */}
      <div ref={businessmanRef} className={styles.businessman} aria-hidden="true">
        <img
          src="/images/businessman-about.png"
          alt=""
          className={styles.businessmanImg}
          loading="lazy"
        />
        {/* Fallback if image missing */}
        <div className={styles.businessmanFallback} aria-hidden="true" />
      </div>
    </section>
  );
}

export default AboutCopy;