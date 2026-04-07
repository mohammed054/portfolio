'use client';

import { useEffect, useRef } from 'react';
import { MOTION } from '@/lib/motionConfig';
import { useSystemStore } from '@/store/systemStore';

const clamp = (value: number) => Math.max(-1, Math.min(1, value));

export const useCursorPosition = (): { x: number; y: number } => {
  const cursor = useSystemStore((state) => state.cursor);
  const setCursor = useSystemStore((state) => state.setCursor);

  const raw = useRef({ x: 0, y: 0 });
  const smooth = useRef({ x: 0, y: 0 });
  const raf = useRef<number | null>(null);

  useEffect(() => {
    if (window.matchMedia('(pointer: coarse)').matches) {
      return;
    }

    const onPointerMove = (event: PointerEvent) => {
      raw.current.x = clamp((event.clientX / window.innerWidth) * 2 - 1);
      raw.current.y = clamp(-((event.clientY / window.innerHeight) * 2 - 1));
    };

    const tick = () => {
      smooth.current.x += (raw.current.x - smooth.current.x) * MOTION.mouseLerp;
      smooth.current.y += (raw.current.y - smooth.current.y) * MOTION.mouseLerp;
      setCursor(smooth.current.x, smooth.current.y);
      raf.current = window.requestAnimationFrame(tick);
    };

    window.addEventListener('pointermove', onPointerMove, { passive: true });
    raf.current = window.requestAnimationFrame(tick);

    return () => {
      window.removeEventListener('pointermove', onPointerMove);
      if (raf.current) {
        window.cancelAnimationFrame(raf.current);
      }
    };
  }, [setCursor]);

  return cursor;
};
