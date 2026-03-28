'use client';

import { useEffect, useRef } from 'react';

export default function CustomCursor() {
  const dotRef   = useRef<HTMLDivElement>(null);
  const ringRef  = useRef<HTMLDivElement>(null);
  const pos      = useRef({ x: -200, y: -200 });
  const ringPos  = useRef({ x: -200, y: -200 });
  const rafRef   = useRef<number>(0);

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      pos.current = { x: e.clientX, y: e.clientY };
      if (dotRef.current) {
        dotRef.current.style.left = `${e.clientX}px`;
        dotRef.current.style.top  = `${e.clientY}px`;
      }
    };

    const tick = () => {
      ringPos.current.x += (pos.current.x - ringPos.current.x) * 0.10;
      ringPos.current.y += (pos.current.y - ringPos.current.y) * 0.10;
      if (ringRef.current) {
        ringRef.current.style.left = `${ringPos.current.x}px`;
        ringRef.current.style.top  = `${ringPos.current.y}px`;
      }
      rafRef.current = requestAnimationFrame(tick);
    };

    /* Hover detection */
    const onEnter = () => ringRef.current?.classList.add('hovering');
    const onLeave = () => ringRef.current?.classList.remove('hovering');
    const attachHover = () => {
      document.querySelectorAll('a, button, [data-hover]').forEach(el => {
        el.addEventListener('mouseenter', onEnter);
        el.addEventListener('mouseleave', onLeave);
      });
    };

    window.addEventListener('mousemove', onMove, { passive: true });
    rafRef.current = requestAnimationFrame(tick);
    attachHover();

    return () => {
      window.removeEventListener('mousemove', onMove);
      cancelAnimationFrame(rafRef.current);
    };
  }, []);

  return (
    <>
      <div ref={dotRef} className="c-dot" aria-hidden="true" />
      <div ref={ringRef} className="c-ring" aria-hidden="true" />
    </>
  );
}