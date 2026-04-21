// ============================================================
// SHADER REBUILD — GSAP Hook Helpers
// src/hooks/useGSAP.ts
// ============================================================

// Re-export useGSAP from the official @gsap/react package.
// All GSAP animations that create ScrollTriggers must use this hook
// so they are automatically cleaned up on component unmount.
export { useGSAP } from '@gsap/react';

// Re-export gsap + ScrollTrigger so every component has a single
// consistent import path rather than reaching into gsap/ScrollTrigger directly.
export { gsap } from 'gsap';
export { ScrollTrigger } from 'gsap/ScrollTrigger';
