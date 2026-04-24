import { useEffect, useRef, ReactNode } from 'react';
import Lenis from '@studio-freight/lenis';

interface SmoothScrollProps {
  children: ReactNode;
  paused?: boolean;
}

export function SmoothScroll({ children, paused }: SmoothScrollProps) {
  const lenisRef = useRef<Lenis | null>(null);

  useEffect(() => {
    if (paused) return;

    const lenis = new Lenis({
      duration: 1.2,
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      smoothWheel: true,
    });

    lenisRef.current = lenis;

    // Sync Lenis with GSAP ScrollTrigger
    lenis.on('scroll', () => {
      // ScrollTrigger.update() is called internally by GSAP
    });

    const raf = (time: number) => {
      lenis.raf(time);
      requestAnimationFrame(raf);
    };
    const id = requestAnimationFrame(raf);

    return () => {
      cancelAnimationFrame(id);
      lenis.destroy();
    };
  }, [paused]);

  return <>{children}</>;
}
