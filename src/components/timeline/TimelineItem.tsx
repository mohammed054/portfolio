'use client';

import { useEffect, useRef, useState } from 'react';
import type { TimelineMilestone } from '@/types';

interface Props {
  item: TimelineMilestone;
  index: number;
  isActive: boolean;
  isPast: boolean;
}

export default function TimelineItem({ item, index, isActive, isPast }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setMounted(true);
      },
      { threshold: 0.3 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const side = index % 2 === 0 ? 'left' : 'right';

  return (
    <div
      ref={ref}
      className={`tl-item tl-${side} ${mounted ? 'tl-mounted' : ''} ${isActive ? 'tl-active' : ''} ${isPast ? 'tl-past' : ''}`}
    >
      {/* Year label — always on the axis side */}
      <div className="tl-year">{item.year}</div>

      {/* Dot on axis */}
      <div className="tl-dot">
        <div className="tl-dot-inner" />
        {isActive && <div className="tl-dot-pulse" />}
      </div>

      {/* Content card — alternates sides */}
      <div className="tl-content">
        <div className="tl-title">{item.title}</div>
        <div className="tl-subtitle">{item.subtitle}</div>
        <div className="tl-desc">{item.description}</div>
      </div>
    </div>
  );
}
