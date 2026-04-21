// ============================================================
// SHADER REBUILD — Motion Utilities
// src/utils/motion.ts
// ============================================================

/**
 * Whether the user has requested reduced motion.
 * Read once at startup — stable across the session.
 */
export const prefersReducedMotion: boolean =
  typeof window !== 'undefined'
    ? window.matchMedia('(prefers-reduced-motion: reduce)').matches
    : false;

/**
 * Conditionally run a callback only when animations are allowed.
 * Pass `reducedFallback` to run an alternative when motion is reduced.
 *
 * @example
 * ifMotion(
 *   () => gsap.to('.el', { y: 0, opacity: 1, duration: 0.6 }),
 *   () => gsap.set('.el', { y: 0, opacity: 1 })
 * );
 */
export function ifMotion(
  fullMotion: () => void,
  reducedFallback?: () => void,
): void {
  if (!prefersReducedMotion) {
    fullMotion();
  } else {
    reducedFallback?.();
  }
}

/**
 * Returns a GSAP-compatible duration value.
 * Returns 0 when the user prefers reduced motion (instant transition).
 */
export function motionDuration(ms: number): number {
  return prefersReducedMotion ? 0 : ms;
}

/**
 * Returns GSAP scrub value.
 * Returns false (instant) when the user prefers reduced motion.
 */
export function motionScrub(value: number | boolean): number | boolean {
  return prefersReducedMotion ? false : value;
}
