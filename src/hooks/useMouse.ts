'use client';
import { useRef, useEffect } from 'react';

export interface MouseState {
  x: number; // -1 to 1
  y: number; // -1 to 1
  rawX: number;
  rawY: number;
}

export function useMouse() {
  const mouse = useRef<MouseState>({ x: 0, y: 0, rawX: 0, rawY: 0 });

  useEffect(() => {
    const handleMove = (e: MouseEvent) => {
      mouse.current = {
        x: (e.clientX / window.innerWidth) * 2 - 1,
        y: -(e.clientY / window.innerHeight) * 2 + 1,
        rawX: e.clientX,
        rawY: e.clientY,
      };
    };

    const handleTouch = (e: TouchEvent) => {
      const t = e.touches[0];
      mouse.current = {
        x: (t.clientX / window.innerWidth) * 2 - 1,
        y: -(t.clientY / window.innerHeight) * 2 + 1,
        rawX: t.clientX,
        rawY: t.clientY,
      };
    };

    window.addEventListener('mousemove', handleMove, { passive: true });
    window.addEventListener('touchmove', handleTouch, { passive: true });

    return () => {
      window.removeEventListener('mousemove', handleMove);
      window.removeEventListener('touchmove', handleTouch);
    };
  }, []);

  return mouse;
}
