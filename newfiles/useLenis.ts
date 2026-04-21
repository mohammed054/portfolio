// ============================================================
// SHADER REBUILD — Lenis Smooth Scroll Hook
// src/hooks/useLenis.ts
// ============================================================

import Lenis from 'lenis';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

let lenis: Lenis | null = null;

/**
 * Initialise Lenis and wire it into GSAP's ticker + ScrollTrigger.
 * Call once at app startup (inside SmoothScroll.tsx).
 */
export function initLenis(): Lenis {
  lenis = new Lenis({
    duration: 1.4,
    easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // expo out
    orientation: 'vertical',
    gestureOrientation: 'vertical',
    smoothWheel: true,
    wheelMultiplier: 1.0,
    touchMultiplier: 2.0,
    infinite: false,
  });

  // Bridge: every Lenis scroll event updates ScrollTrigger positions
  lenis.on('scroll', ScrollTrigger.update);

  // Drive Lenis via GSAP's ticker so both share the same RAF loop
  gsap.ticker.add((time: number) => {
    lenis!.raf(time * 1000);
  });

  // Disable GSAP's lag-smoothing — Lenis handles this itself
  gsap.ticker.lagSmoothing(0);

  // One-time ScrollTrigger defaults
  ScrollTrigger.defaults({
    invalidateOnRefresh: true,
  });

  // When ScrollTrigger refreshes (e.g. after resize), scroll to top immediately
  ScrollTrigger.addEventListener('refresh', () =>
    lenis?.scrollTo(0, { immediate: true }),
  );

  window.addEventListener('resize', () => ScrollTrigger.refresh());

  return lenis;
}

/** Return the active Lenis instance (may be null before init). */
export function getLenis(): Lenis | null {
  return lenis;
}

/** Freeze scrolling — called while the preloader is visible. */
export function pauseLenis(): void {
  lenis?.stop();
}

/** Unfreeze scrolling — called when the preloader exits. */
export function resumeLenis(): void {
  lenis?.start();
}
