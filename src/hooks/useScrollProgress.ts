'use client';

import { useEffect } from 'react';
import { useSystemStore } from '@/store/systemStore';

// ─────────────────────────────────────────────────────────────────────────────
// useScrollProgress
// Maps raw document scroll position → normalized progress [0,1].
// The ScrollRig component uses GSAP ScrollTrigger for this, but this hook
// provides a fallback / read-only accessor for components that need it.
// ─────────────────────────────────────────────────────────────────────────────

export const useScrollProgress = (): number => {
  const setProgress = useSystemStore((s) => s.setProgress);
  const progress    = useSystemStore((s) => s.progress);

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop    = window.scrollY;
      const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (scrollHeight <= 0) return;
      const raw = scrollTop / scrollHeight;
      setProgress(Math.max(0, Math.min(1, raw)));
    };

    // Initial value
    handleScroll();

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [setProgress]);

  return progress;
};
