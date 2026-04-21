// ============================================================
// SHADER REBUILD — Selected Work (Film Strip Carousel)
// src/sections/02-SelectedWork/SelectedWork.tsx
//
// Spec: 03-selected-work.md + 13-scroll-animation-system.md
//
// Architecture:
//  - GSAP ScrollTrigger PINS this section
//  - While pinned, vertical scroll is converted to horizontal
//    translation of the film strip (scroll-to-horizontal)
//  - Active project index is derived from scroll progress
//  - Arrow buttons allow instant jump to adjacent project
// ============================================================

import React from 'react';
import { useRef, useState, useCallback } from 'react';
import { useGSAP } from '@gsap/react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import FilmStrip from './FilmStrip';
import { SectionAnchor } from '../../components/shared/SectionAnchor';
import { PROJECTS } from '../../utils/constants';
import styles from './SelectedWork.module.css';

gsap.registerPlugin(ScrollTrigger);

function SelectedWork() {
  const sectionRef  = useRef<HTMLElement>(null);
  const stripRef    = useRef<HTMLDivElement>(null);
  const stRef       = useRef<ScrollTrigger | null>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  useGSAP(() => {
    const section = sectionRef.current;
    const strip   = stripRef.current;
    if (!section || !strip) return;

    // Delay to let layout settle (font load, etc.)
    const init = () => {
      const totalX = strip.scrollWidth - window.innerWidth;
      if (totalX <= 0) return;

      const tween = gsap.to(strip, {
        x: -totalX,
        ease: 'none',
        scrollTrigger: {
          trigger: section,
          start: 'top top',
          end: `+=${totalX * 1.2}`,
          pin: true,
          scrub: 1.5,
          anticipatePin: 1,
          invalidateOnRefresh: true,
          onUpdate(self) {
            const idx = Math.round(self.progress * (PROJECTS.length - 1));
            setActiveIndex(idx);
          },
        },
      });

      stRef.current = tween.scrollTrigger ?? null;
    };

    // Wait one frame for layout
    const raf = requestAnimationFrame(init);
    return () => {
      cancelAnimationFrame(raf);
      stRef.current?.kill();
    };
  });

  // Arrow navigation — jump to adjacent project
  const goTo = useCallback(
    (delta: number) => {
      const st = stRef.current;
      if (!st) return;
      const target = Math.max(0, Math.min(PROJECTS.length - 1, activeIndex + delta));
      const progress = target / (PROJECTS.length - 1);
      // Scroll to the matching scroll position
      const scrollY = st.start + progress * (st.end - st.start);
      gsap.to(window, {
        scrollTo: scrollY,
        duration: 0.6,
        ease: 'power3.inOut',
      });
    },
    [activeIndex],
  );

  const activeProject = PROJECTS[activeIndex] ?? PROJECTS[0];

  return (
    <section ref={sectionRef} id="work" className={styles.section}>
      <SectionAnchor id="work" threshold={0.2} />

      {/* Project metadata — floats above the strip */}
      <div className={styles.meta} aria-live="polite">
        <h2 className={styles.projectName}>{activeProject.name}</h2>
        <p className={styles.projectCategory}>
          {activeProject.category}
          <a
            href={activeProject.url}
            className={styles.viewLink}
            target="_blank"
            rel="noopener noreferrer"
          >
            View project →
          </a>
        </p>
      </div>

      {/* Film strip */}
      <FilmStrip
        projects={PROJECTS}
        activeIndex={activeIndex}
        stripRef={stripRef}
      />

      {/* Navigation */}
      <div className={styles.nav}>
        <button
          className={styles.navBtn}
          onClick={() => goTo(-1)}
          disabled={activeIndex === 0}
          aria-label="Previous project"
        >
          ←
        </button>

        <div className={styles.dots} role="tablist" aria-label="Project pagination">
          {PROJECTS.map((p, i) => (
            <button
              key={p.id}
              className={`${styles.dot} ${i === activeIndex ? styles.dotActive : ''}`}
              role="tab"
              aria-selected={i === activeIndex}
              aria-label={`Go to ${p.name}`}
              onClick={() => goTo(i - activeIndex)}
            />
          ))}
        </div>

        <button
          className={styles.navBtn}
          onClick={() => goTo(1)}
          disabled={activeIndex === PROJECTS.length - 1}
          aria-label="Next project"
        >
          →
        </button>
      </div>
    </section>
  );
}

export default SelectedWork;