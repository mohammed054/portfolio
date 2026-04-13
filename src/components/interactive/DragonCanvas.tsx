'use client';

import { useCallback, useEffect, useRef } from 'react';
import { DragonRenderer } from './DragonRenderer';
import { DragonSpine } from './DragonSpine';
import { TextParticles } from './TextParticles';
import { MOTION } from '@/lib/motionConfig';
import { useSystemStore } from '@/store/systemStore';

export const DragonCanvas = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const spineRef = useRef<DragonSpine | null>(null);
  const rendererRef = useRef<DragonRenderer | null>(null);
  const particlesRef = useRef<TextParticles | null>(null);
  const animationFrame = useRef<number | null>(null);
  const activeRef = useRef(false);

  const progress = useSystemStore((state) => state.progress);
  const reducedMotion = useSystemStore((state) => state.reducedMotion);
  const isActive =
    progress >= MOTION.dragonProgressStart && progress <= MOTION.dragonProgressEnd;

  useEffect(() => {
    activeRef.current = isActive;
  }, [isActive]);

  const initialize = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) {
      return;
    }

    const context = canvas.getContext('2d');
    if (!context) {
      return;
    }

    let disposed = false;

    const setSize = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);

      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      context.setTransform(dpr, 0, 0, dpr, 0, 0);

      spineRef.current = new DragonSpine(width / 2, height / 2);
      rendererRef.current = new DragonRenderer();
      particlesRef.current = new TextParticles();
      particlesRef.current.init('HASSOUN', Math.min(width * 0.13, 148), width, height);
    };

    setSize();

    if ('fonts' in document) {
      void document.fonts
        .load('700 120px "System Display"')
        .then(() => {
          if (!disposed) {
            setSize();
          }
        })
        .catch(() => undefined);
    }

    const isCoarse = window.matchMedia('(pointer: coarse)').matches;
    let autonomousTime = 0;

    const handlePointerMove = (event: PointerEvent) => {
      spineRef.current?.setTarget(event.clientX, event.clientY);
    };

    const handleResize = () => {
      setSize();
    };

    if (!isCoarse) {
      window.addEventListener('pointermove', handlePointerMove, { passive: true });
    }

    window.addEventListener('resize', handleResize);

    const loop = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;

      context.clearRect(0, 0, width, height);

      if (activeRef.current && spineRef.current && rendererRef.current && particlesRef.current) {
        if (isCoarse) {
          autonomousTime += 0.012;
          spineRef.current.setTarget(
            width / 2 + Math.sin(autonomousTime) * width * 0.28,
            height / 2 + Math.sin(autonomousTime * 2) * height * 0.18
          );
        }

        context.fillStyle = 'rgba(4, 4, 10, 0.18)';
        context.fillRect(0, 0, width, height);

        spineRef.current.update();
        const head = spineRef.current.getSegments()[0];
        particlesRef.current.update(head.x, head.y);
        particlesRef.current.draw(context);
        rendererRef.current.drawDragon(context, spineRef.current);
      }

      animationFrame.current = window.requestAnimationFrame(loop);
    };

    animationFrame.current = window.requestAnimationFrame(loop);

    return () => {
      disposed = true;
      if (!isCoarse) {
        window.removeEventListener('pointermove', handlePointerMove);
      }
      window.removeEventListener('resize', handleResize);
      if (animationFrame.current) {
        window.cancelAnimationFrame(animationFrame.current);
      }
    };
  }, []);

  useEffect(() => {
    const cleanup = initialize();
    return cleanup;
  }, [initialize]);

  if (reducedMotion) {
    return null;
  }

  return (
    <canvas
      ref={canvasRef}
      aria-label="Interactive decoration"
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 'var(--z-html-world)' as string,
        opacity: isActive ? 1 : 0,
        pointerEvents: 'none',
        transition: `opacity ${MOTION.dragonFadeSeconds}s var(--ease-out)`,
        background: 'transparent',
        willChange: 'opacity',
      }}
    />
  );
};
