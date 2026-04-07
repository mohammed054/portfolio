'use client';

import { useEffect, useRef, useState } from 'react';
import { useSystemStore } from '@/store/systemStore';

export const Cursor = () => {
  const context = useSystemStore((state) => state.cursorContext);
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const target = useRef({ x: -100, y: -100 });
  const current = useRef({ x: -100, y: -100 });
  const frameRef = useRef<number | null>(null);
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    const finePointer = !window.matchMedia('(pointer: coarse)').matches;
    setEnabled(finePointer);

    if (!finePointer) {
      return;
    }

    const onPointerMove = (event: PointerEvent) => {
      target.current.x = event.clientX;
      target.current.y = event.clientY;

      if (dotRef.current) {
        dotRef.current.style.transform = `translate(${event.clientX - 4}px, ${event.clientY - 4}px)`;
      }
    };

    const tick = () => {
      current.current.x += (target.current.x - current.current.x) * 0.14;
      current.current.y += (target.current.y - current.current.y) * 0.14;

      if (ringRef.current) {
        const size = context === 'view' ? 30 : context === 'hover' ? 24 : 18;
        ringRef.current.style.width = `${size}px`;
        ringRef.current.style.height = `${size}px`;
        ringRef.current.style.transform = `translate(${current.current.x - size / 2}px, ${current.current.y - size / 2}px)`;
      }

      frameRef.current = window.requestAnimationFrame(tick);
    };

    window.addEventListener('pointermove', onPointerMove, { passive: true });
    frameRef.current = window.requestAnimationFrame(tick);

    return () => {
      window.removeEventListener('pointermove', onPointerMove);
      if (frameRef.current) {
        window.cancelAnimationFrame(frameRef.current);
      }
    };
  }, [context]);

  if (!enabled) {
    return null;
  }

  const ringRadius = context === 'drag' ? '4px' : '999px';
  const ringBorder =
    context === 'view' || context === 'hover'
      ? '1px solid rgba(255,255,255,0.6)'
      : '1px solid rgba(255,255,255,0.28)';
  const ringBackground =
    context === 'hover'
      ? 'rgba(255,255,255,0.08)'
      : context === 'drag'
        ? 'rgba(255,255,255,0.14)'
        : 'transparent';

  return (
    <>
      <div
        ref={dotRef}
        aria-hidden="true"
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '8px',
          height: '8px',
          borderRadius: '999px',
          background: 'var(--white)',
          zIndex: 'var(--z-cursor)' as string,
          pointerEvents: 'none',
          transform: 'translate(-100px, -100px)',
          willChange: 'transform',
        }}
      />
      <div
        ref={ringRef}
        aria-hidden="true"
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '18px',
          height: '18px',
          display: 'grid',
          placeItems: 'center',
          borderRadius: ringRadius,
          border: ringBorder,
          background: ringBackground,
          zIndex: 'calc(var(--z-cursor) - 1)' as string,
          pointerEvents: 'none',
          transform: 'translate(-100px, -100px)',
          transition:
            'width var(--duration-fast) var(--ease-out), height var(--duration-fast) var(--ease-out), border-radius var(--duration-fast) var(--ease-out), background var(--duration-fast) var(--ease-out), border-color var(--duration-fast) var(--ease-out)',
          willChange: 'transform, width, height',
        }}
      >
        {context === 'view' ? (
          <span
            className="text-mono"
            style={{ fontSize: '7px', letterSpacing: '0.08em', color: 'var(--white)' }}
          >
            VIEW
          </span>
        ) : null}
      </div>
    </>
  );
};
