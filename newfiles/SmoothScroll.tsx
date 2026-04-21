// ============================================================
// SHADER REBUILD — Smooth Scroll Wrapper
// src/components/shared/SmoothScroll.tsx
// ============================================================

import { useEffect } from 'react';
import { initLenis, pauseLenis, resumeLenis } from '../../hooks/useLenis';

interface Props {
  children: React.ReactNode;
  /** Pass `true` while the preloader is active to lock scroll. */
  paused?: boolean;
}

/**
 * Wraps the entire app. Initialises Lenis once on mount and exposes
 * the `paused` prop to lock / unlock scrolling (used by the preloader).
 */
export function SmoothScroll({ children, paused = false }: Props) {
  // Initialise Lenis on first mount
  useEffect(() => {
    const lenis = initLenis();
    // Start locked if preloader is active on first render
    if (paused) pauseLenis();
    return () => lenis.destroy();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // React to `paused` changes (preloader exit unlocks scroll)
  useEffect(() => {
    if (paused) {
      pauseLenis();
    } else {
      resumeLenis();
    }
  }, [paused]);

  return <>{children}</>;
}
