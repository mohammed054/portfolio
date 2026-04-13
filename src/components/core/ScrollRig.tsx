'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { MOTION } from '@/lib/motionConfig';
import { useSystemStore } from '@/store/systemStore';

gsap.registerPlugin(ScrollTrigger);

interface ScrollRigProps {
  children: React.ReactNode;
}

export const ScrollRig = ({ children }: ScrollRigProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const setProgress = useSystemStore((state) => state.setProgress);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) {
      return;
    }

    const context = gsap.context(() => {
      ScrollTrigger.create({
        trigger: container,
        start: 'top top',
        end: 'bottom bottom',
        scrub: MOTION.scrollScrub,
        invalidateOnRefresh: true,
        onUpdate: ({ progress }) => {
          setProgress(progress);
        },
      });
    }, container);

    return () => context.revert();
  }, [setProgress]);

  return (
    <div ref={containerRef} style={{ height: `${MOTION.scrollHeight}vh`, position: 'relative' }}>
      <div
        style={{
          position: 'fixed',
          inset: 0,
          zIndex: 'var(--z-canvas)' as string,
        }}
      >
        {children}
      </div>
    </div>
  );
};
