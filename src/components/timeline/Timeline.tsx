'use client';

import { useRef, useEffect, useState } from 'react';
import { timeline } from '@/lib/data';
import TimelineItem from './TimelineItem';

export default function Timeline() {
  const sectionRef = useRef<HTMLElement>(null);
  const axisRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(-1);
  const [axisHeight, setAxisHeight] = useState(0);
  const [headerVisible, setHeaderVisible] = useState(false);

  // Scroll-linked axis fill + active node tracking
  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setHeaderVisible(true);
      },
      { threshold: 0.1 }
    );
    observer.observe(section);

    const onScroll = () => {
      const rect = section.getBoundingClientRect();
      const viewH = window.innerHeight;

      // How far through the section we are (0 → 1)
      const progress = Math.max(
        0,
        Math.min(1, (viewH - rect.top) / (rect.height + viewH))
      );

      setAxisHeight(progress * 100);

      // Determine active item based on scroll position
      const items = section.querySelectorAll('.tl-item');
      let newActive = -1;
      items.forEach((el, i) => {
        const r = el.getBoundingClientRect();
        if (r.top < viewH * 0.6) newActive = i;
      });
      setActiveIndex(newActive);
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();

    return () => {
      window.removeEventListener('scroll', onScroll);
      observer.disconnect();
    };
  }, []);

  return (
    <section id="timeline" ref={sectionRef} className="tl-section">
      {/* Section header */}
      <div className={`tl-header ${headerVisible ? 'in' : ''}`}>
        <span className="tl-header-label">— Timeline</span>
        <h2 className="tl-header-title">The progression.</h2>
      </div>

      {/* Vertical axis container */}
      <div className="tl-axis-wrap">
        {/* Static track */}
        <div className="tl-axis-track">
          {/* Scroll-driven fill */}
          <div
            ref={axisRef}
            className="tl-axis-fill"
            style={{ height: `${axisHeight}%` }}
          />
        </div>

        {/* Items */}
        <div className="tl-items">
          {timeline.map((item, i) => (
            <TimelineItem
              key={item.year}
              item={item}
              index={i}
              isActive={activeIndex === i}
              isPast={i < activeIndex}
            />
          ))}
        </div>
      </div>

      {/* Exit hook */}
      <div className={`tl-exit ${axisHeight > 80 ? 'in' : ''}`}>
        <div className="tl-exit-line" />
        <span className="tl-exit-text">Now, see the output.</span>
        <div className="tl-exit-line" />
      </div>
    </section>
  );
}
