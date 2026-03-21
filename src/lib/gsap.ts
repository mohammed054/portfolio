import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ScrollToPlugin } from 'gsap/ScrollToPlugin';

// Only register on client side
if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);
  
  // Global GSAP defaults
  gsap.defaults({
    ease: 'power2.out',
    duration: 0.6,
  });
  
  // ScrollTrigger defaults
  ScrollTrigger.defaults({
    scroller: window,
  });
}

export { gsap, ScrollTrigger };

// Helper: smooth lerp
export const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

// Helper: clamp
export const clamp = (v: number, min: number, max: number) =>
  Math.max(min, Math.min(max, v));

// Helper: map range
export const mapRange = (
  value: number,
  inMin: number,
  inMax: number,
  outMin: number,
  outMax: number
) => {
  const t = clamp((value - inMin) / (inMax - inMin), 0, 1);
  return outMin + t * (outMax - outMin);
};
