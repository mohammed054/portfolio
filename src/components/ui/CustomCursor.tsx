'use client';

import { useEffect, useRef } from 'react';
import { useSceneStore } from '@/store/scene';

export default function CustomCursor() {
  const cursorRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const setCursor = useSceneStore((s) => s.setCursor);
  const isHovering = useSceneStore((s) => s.isHovering);

  const posRef = useRef({ x: 0, y: 0 });
  const ringPosRef = useRef({ x: 0, y: 0 });
  const rafRef = useRef<number>(0);

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      posRef.current = { x: e.clientX, y: e.clientY };

      // Normalized -1 to 1
      setCursor(
        (e.clientX / window.innerWidth) * 2 - 1,
        -((e.clientY / window.innerHeight) * 2 - 1)
      );

      if (cursorRef.current) {
        cursorRef.current.style.left = `${e.clientX}px`;
        cursorRef.current.style.top = `${e.clientY}px`;
      }
    };

    // Ring lags behind cursor
    const animateRing = () => {
      ringPosRef.current.x += (posRef.current.x - ringPosRef.current.x) * 0.12;
      ringPosRef.current.y += (posRef.current.y - ringPosRef.current.y) * 0.12;

      if (ringRef.current) {
        ringRef.current.style.left = `${ringPosRef.current.x}px`;
        ringRef.current.style.top = `${ringPosRef.current.y}px`;
      }

      rafRef.current = requestAnimationFrame(animateRing);
    };

    window.addEventListener('mousemove', onMove);
    rafRef.current = requestAnimationFrame(animateRing);

    return () => {
      window.removeEventListener('mousemove', onMove);
      cancelAnimationFrame(rafRef.current);
    };
  }, [setCursor]);

  // Track hoverable elements
  useEffect(() => {
    const setHovering = useSceneStore.getState().setHovering;
    const targets = document.querySelectorAll('a, button, [data-cursor="hover"]');

    const enter = () => setHovering(true);
    const leave = () => setHovering(false);

    targets.forEach((el) => {
      el.addEventListener('mouseenter', enter);
      el.addEventListener('mouseleave', leave);
    });

    return () => {
      targets.forEach((el) => {
        el.removeEventListener('mouseenter', enter);
        el.removeEventListener('mouseleave', leave);
      });
    };
  }, []);

  return (
    <>
      <div
        ref={cursorRef}
        className={`cursor ${isHovering ? 'hover' : ''}`}
        aria-hidden="true"
      />
      <div ref={ringRef} className="cursor-ring" aria-hidden="true" />
    </>
  );
}
