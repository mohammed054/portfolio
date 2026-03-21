'use client';
import { useEffect, useRef, useState } from 'react';

interface Props {
  visible: boolean;
  onDiveReady: () => void;   // called when user can scroll to dive out
}

type Phase = 'hidden' | 'appear' | 'expand' | 'sub' | 'done';

export default function NameReveal({ visible, onDiveReady }: Props) {
  const [phase, setPhase] = useState<Phase>('hidden');
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);
  const diveReadyCalled = useRef(false);

  const clear = () => { timers.current.forEach(clearTimeout); timers.current = []; };

  useEffect(() => {
    if (visible) {
      clear();
      diveReadyCalled.current = false;
      // Sequence — staggered from when the 3D zoom-blast peaks (~350ms)
      setPhase('appear');
      timers.current.push(setTimeout(() => setPhase('expand'), 480));
      timers.current.push(setTimeout(() => setPhase('sub'),    1300));
      timers.current.push(setTimeout(() => {
        setPhase('done');
        if (!diveReadyCalled.current) {
          diveReadyCalled.current = true;
          onDiveReady();
        }
      }, 2200));
    } else {
      clear();
      setPhase('hidden');
    }
    return clear;
  }, [visible, onDiveReady]);

  if (phase === 'hidden') return null;

  const expanding = phase === 'expand' || phase === 'sub' || phase === 'done';
  const subVisible = phase === 'sub' || phase === 'done';
  const ctaVisible = phase === 'done';

  return (
    <div className={`nr-overlay nr-${phase}`}>
      <div className="nr-inner">

        {/* ── Line 1: M → Mohammed ── */}
        <div className="nr-line">
          <span className="nr-anchor nr-m">M</span>
          <span className="nr-rest">
            <span className={`nr-rest-inner ${expanding ? 'in' : ''}`}>
              ohammed
            </span>
          </span>
        </div>

        {/* ── Line 2: H → Hassoun ── */}
        <div className="nr-line">
          <span className="nr-anchor nr-h">H</span>
          <span className="nr-rest">
            <span className={`nr-rest-inner ${expanding ? 'in' : ''}`} style={{ transitionDelay: '60ms' }}>
              assoun
            </span>
          </span>
        </div>

        {/* ── Sub info ── */}
        <div className={`nr-sub ${subVisible ? 'in' : ''}`}>
          <span className="nr-role">Full-Stack Engineer</span>
          <span className="nr-dash">—</span>
          <span className="nr-tag">Engineer. Builder. Occasional physicist.</span>
        </div>

        {/* ── CTAs ── */}
        <div className={`nr-cta ${ctaVisible ? 'in' : ''}`}>
          <button className="nr-btn nr-btn-primary">Explore Work</button>
          <button className="nr-btn nr-btn-ghost">Get in Touch</button>
        </div>

        {/* ── Scroll nudge ── */}
        {ctaVisible && (
          <div className="nr-scroll-hint">
            <div className="nr-sh-line" />
            <span className="nr-sh-text">scroll to continue</span>
          </div>
        )}
      </div>
    </div>
  );
}