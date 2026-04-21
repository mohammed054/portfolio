// ============================================================
// SHADER REBUILD — Scroll Progress Hook
// src/hooks/useScrollProgress.ts
// ============================================================

import { useEffect, useState } from 'react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

/**
 * Returns a 0–1 progress value representing how far the user has scrolled
 * through the element matching `sectionSelector`.
 *
 * Used by R3F scenes (HeroScene, TieScene, PhonesScene) to drive camera
 * animation from scroll position without coupling to GSAP DOM animations.
 *
 * @param sectionSelector - CSS selector or element ID with '#' prefix
 * @param start - ScrollTrigger start value (default: 'top top')
 * @param end   - ScrollTrigger end value   (default: 'bottom top')
 *
 * @example
 * const progress = useScrollProgress('#section-hero');
 */
export function useScrollProgress(
  sectionSelector: string,
  start = 'top top',
  end = 'bottom top',
): number {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const trigger = ScrollTrigger.create({
      trigger: sectionSelector,
      start,
      end,
      onUpdate: (self) => setProgress(self.progress),
    });

    return () => trigger.kill();
  }, [sectionSelector, start, end]);

  return progress;
}
