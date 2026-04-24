import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import './Preloader.css';

interface PreloaderProps {
  onComplete: () => void;
}

const RAINBOW = ['#ff2020','#ff8c00','#ffe000','#00c800','#0088ff','#8800ff'];
const SEGMENTS = 20;

export function Preloader({ onComplete }: PreloaderProps) {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const [progress, setProgress] = useState(0);
  const [done, setDone] = useState(false);
  const exitStarted = useRef(false);

  // Simulate asset loading
  useEffect(() => {
    let val = 0;
    const tick = () => {
      val += Math.random() * 6 + 3;
      if (val >= 100) {
        setProgress(100);
        setTimeout(() => setDone(true), 500);
      } else {
        setProgress(val);
        setTimeout(tick, 80 + Math.random() * 60);
      }
    };
    const t = setTimeout(tick, 300);
    return () => clearTimeout(t);
  }, []);

  // CRT power-off exit
  useEffect(() => {
    if (!done || exitStarted.current) return;
    exitStarted.current = true;
    const el = wrapperRef.current;
    if (!el) { onComplete(); return; }

    gsap.timeline({ onComplete })
      .to(el, { delay: 0.3, scaleY: 0.015, duration: 0.22, ease: 'power3.in', transformOrigin: 'center center' })
      .to(el, { scaleX: 0, duration: 0.14, ease: 'power2.in' })
      .set(el, { backgroundColor: '#ffffff' })
      .to(el, { opacity: 0, duration: 0.18 });
  }, [done, onComplete]);

  const filled = Math.round((progress / 100) * SEGMENTS);

  return (
    <div className="preloader" ref={wrapperRef}>
      <div className="preloader__scanlines" />
      <div className="preloader__vignette" />

      <div className="preloader__content">
        <div className="preloader__logo">
          <svg className="preloader__icon" viewBox="0 0 60 60" aria-hidden="true">
            {RAINBOW.map((c, i) => (
              <rect key={i} x={i * 10} y={0} width={10} height={60} fill={c} />
            ))}
          </svg>
          <span className="preloader__wordmark">SHADER</span>
        </div>

        <div className="preloader__subtitle">
          <p>Shader Development Studio, Website</p>
          <p>Version 1.02</p>
        </div>

        <div className="preloader__bar-outer" role="progressbar" aria-valuenow={Math.round(progress)} aria-valuemin={0} aria-valuemax={100}>
          <div className="preloader__bar-inner">
            {Array.from({ length: SEGMENTS }).map((_, i) => (
              <div key={i} className={`preloader__seg ${i < filled ? 'preloader__seg--on' : ''}`} />
            ))}
          </div>
        </div>
      </div>

      <p className="preloader__copyright">
        Copyright (c) Shader Development Studio AB, 2026. All Rights Reserved.
      </p>
    </div>
  );
}
