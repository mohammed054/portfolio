'use client';
import { useRef, useEffect, useState } from 'react';
import { timeline } from '@/lib/data';

export default function TimelineSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const axisRef    = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(-1);
  const [axisH, setAxisH]     = useState(0);  // 0–100 percent
  const [hdrVis, setHdrVis]   = useState(false);
  const [exitVis, setExitVis] = useState(false);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    // Header observer
    const hdrObs = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) setHdrVis(true);
    }, { threshold: 0.1 });
    hdrObs.observe(section);

    const onScroll = () => {
      const rect    = section.getBoundingClientRect();
      const viewH   = window.innerHeight;

      // How far into the section we are
      const entered = viewH - rect.top;
      const total   = rect.height + viewH;
      const pct     = Math.max(0, Math.min(1, entered / total));
      setAxisH(pct * 100);

      // Active item
      const items = section.querySelectorAll('.tl-item');
      let active = -1;
      items.forEach((el, i) => {
        if (el.getBoundingClientRect().top < viewH * 0.58) active = i;
      });
      setActiveIndex(active);

      // Exit hook
      const bottom = rect.bottom;
      if (bottom < viewH * 1.2) setExitVis(true);
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();

    return () => {
      hdrObs.disconnect();
      window.removeEventListener('scroll', onScroll);
    };
  }, []);

  return (
    <section id="timeline" ref={sectionRef} className="tl-section">

      {/* Header */}
      <div className={`tl-header ${hdrVis ? 'tl-in' : ''}`}>
        <span className="tl-label">— Timeline</span>
        <h2 className="tl-title">The progression.</h2>
      </div>

      {/* Timeline body */}
      <div className="tl-body">
        {/* Center axis */}
        <div className="tl-axis">
          <div
            className="tl-axis-fill"
            style={{ height: `${axisH}%` }}
          />
        </div>

        {/* Items */}
        <div className="tl-items">
          {timeline.map((item, i) => {
            const isActive = i === activeIndex;
            const isPast   = i < activeIndex;
            const side     = i % 2 === 0 ? 'left' : 'right';
            return (
              <div
                key={i}
                className={`tl-item tl-${side}${isPast ? ' tl-past' : ''}${isActive ? ' tl-active' : ''}${activeIndex >= i ? ' tl-vis' : ''}`}
              >
                {/* Year */}
                <div className="tl-year">{item.year}</div>

                {/* Dot on axis */}
                <div className="tl-node">
                  <div className="tl-dot" />
                  {isActive && <div className="tl-pulse" />}
                </div>

                {/* Content — no card, just text */}
                <div className="tl-content">
                  <div className="tl-item-title">{item.title}</div>
                  <div className="tl-item-sub">{item.subtitle}</div>
                  <div className="tl-item-desc">{item.description}</div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Exit hook */}
      <div className={`tl-exit ${exitVis ? 'tl-in' : ''}`}>
        <div className="tl-exit-line" />
        <span className="tl-exit-text">Now, see the output.</span>
        <div className="tl-exit-line" />
      </div>

    </section>
  );
}
