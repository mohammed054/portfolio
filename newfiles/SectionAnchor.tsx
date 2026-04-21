// ============================================================
// SHADER REBUILD — Section Anchor
// src/components/shared/SectionAnchor.tsx
// ============================================================

import { useEffect, useRef } from 'react';
import { SECTION_THEMES } from '../../utils/constants';
import type { SectionId } from '../../types';

interface Props {
  /** The section's hash ID (e.g. 'home', 'work', 'about-us'). */
  id: SectionId | string;
  /**
   * IntersectionObserver threshold — how much of the section must be
   * visible before it is considered "active".
   *
   * - 0.4 for most sections
   * - 0.2 for very tall pinned sections (work carousel, shredder)
   */
  threshold?: number;
}

/**
 * Place at the very top of each `<section>` element.
 * When the observed element enters the viewport:
 *   1. Updates `location.hash` via `history.replaceState` (no scroll jump).
 *   2. Sets `data-active-section` on `<body>` (used by Navbar for link styling).
 *   3. Toggles `body.theme-dark` class for navbar colour switching.
 *
 * @example
 * <section className="section-hero">
 *   <SectionAnchor id="home" threshold={0.4} />
 *   ...
 * </section>
 */
export function SectionAnchor({ id, threshold = 0.4 }: Props) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;

        // 1. Update URL hash without triggering a scroll jump
        history.replaceState(null, '', `#${id}`);

        // 2. Mark the active section on body for CSS/JS consumers
        document.body.dataset.activeSection = id;

        // 3. Switch navbar theme class
        const theme = SECTION_THEMES[id] ?? 'light';
        if (theme === 'dark') {
          document.body.classList.add('theme-dark');
        } else {
          document.body.classList.remove('theme-dark');
        }
      },
      { threshold },
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [id, threshold]);

  // Zero-size div — purely an observation target
  return <div ref={ref} id={id} style={{ position: 'absolute', top: 0 }} />;
}
