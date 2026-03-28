'use client';

import { useEffect, useRef, useState } from 'react';

export default function Loader() {
  const [progress, setProgress]   = useState(0);
  const [exiting, setExiting]     = useState(false);
  const [hidden,   setHidden]     = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    let p = 0;

    intervalRef.current = setInterval(() => {
      p += Math.random() * 16 + 6;
      if (p >= 100) {
        p = 100;
        if (intervalRef.current) clearInterval(intervalRef.current);
        setTimeout(() => {
          setExiting(true);
          setTimeout(() => setHidden(true), 850);
        }, 380);
      }
      setProgress(Math.min(p, 100));
    }, 100);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  if (hidden) return null;

  return (
    <div className={`loader-root${exiting ? ' loader-exit' : ''}`} aria-live="polite" role="status">
      {/* MH logotype */}
      <div className="loader-logo" aria-label="MH">MH</div>

      {/* Progress track */}
      <div className="loader-bar-wrap" aria-hidden="true">
        <div
          className="loader-bar-fill"
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* Numeric counter */}
      <span className="loader-count" aria-label={`Loading ${Math.round(progress)}%`}>
        {String(Math.round(progress)).padStart(3, '0')}
      </span>
    </div>
  );
}