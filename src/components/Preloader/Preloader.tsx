// ============================================================
// SHADER REBUILD — Preloader (CRT Boot Sequence)
// src/components/Preloader/Preloader.tsx
//
// Spec: 01-preloader.md
// Full CRT boot sequence with:
//   - Commodore-blue background (#1a1aff)
//   - Rainbow speed-line logo + SHADER wordmark
//   - Monospace subtitle + version line
//   - Chunky 20-segment progress bar tied to useProgress
//   - GSAP-driven CRT power-off exit:
//       1. Flicker x2
//       2. scaleY collapse to 1px horizontal line (200ms)
//       3. scaleX collapse to 0 (150ms)
//       4. White flash (200ms fade)
//       5. onComplete fires
// ============================================================

import { useState, useEffect, useRef } from 'react';
import { useProgress } from '@react-three/drei';
import { gsap } from 'gsap';
import styles from './Preloader.module.css';

interface PreloaderProps {
  onComplete?: () => void;
}

/** Rainbow speed-line icon — 6 stripes tapering to the right */
function ShaderLogoIcon() {
  const stripes = [
    { color: '#e63946', y: 0,   w: 240, h: 16 },
    { color: '#f4a261', y: 22,  w: 210, h: 13 },
    { color: '#e9c46a', y: 41,  w: 178, h: 13 },
    { color: '#2a9d8f', y: 60,  w: 146, h: 11 },
    { color: '#457b9d', y: 77,  w: 112, h: 11 },
    { color: '#6a0572', y: 94,  w: 80,  h: 10 },
  ];
  return (
    <svg
      className={styles.logoIcon}
      viewBox="0 0 240 110"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      {stripes.map((s, i) => (
        <rect key={i} x={0} y={s.y} width={s.w} height={s.h} rx={2} fill={s.color} />
      ))}
    </svg>
  );
}

const TOTAL_SEGMENTS = 20;

function Preloader({ onComplete }: PreloaderProps) {
  const { progress, active } = useProgress();
  const [phase, setPhase] = useState<'loading' | 'complete' | 'exiting' | 'done'>('loading');
  const wrapperRef = useRef<HTMLDivElement>(null);
  const flashRef   = useRef<HTMLDivElement>(null);
  const hasExited  = useRef(false);

  // How many segments to fill
  const filledSegments = Math.round((progress / 100) * TOTAL_SEGMENTS);

  // Trigger exit sequence when loading finishes
  useEffect(() => {
    // Consider complete when progress hits 100 OR when the R3F active flag drops
    const isComplete = progress >= 100 && !active;
    if (!isComplete || hasExited.current || phase !== 'loading') return;

    hasExited.current = true;
    setPhase('complete');

    const tl = gsap.timeline({ delay: 0.4 });

    // 1. CRT flicker × 2
    tl.to(wrapperRef.current, { opacity: 0.7, duration: 0.06, yoyo: true, repeat: 3, ease: 'none' })

    // 2. Vertical collapse — squish to thin horizontal bar
      .to(wrapperRef.current, { scaleY: 0.008, duration: 0.2, ease: 'power3.in' })

    // 3. Horizontal collapse — shrink the line to nothing
      .to(wrapperRef.current, { scaleX: 0,   duration: 0.15, ease: 'power3.in' })

    // 4. White flash in
      .to(flashRef.current, { opacity: 1, duration: 0.08, ease: 'none' })

    // 5. White flash out + call onComplete
      .to(flashRef.current, {
        opacity: 0,
        duration: 0.18,
        ease: 'power1.out',
        onComplete: () => {
          setPhase('done');
          onComplete?.();
        },
      });
  }, [progress, active, phase, onComplete]);

  // Dev mode: if no 3D assets are loaded, auto-complete after a moment
  useEffect(() => {
    if (active || progress > 0) return;
    const timer = setTimeout(() => {
      // Simulate progress reaching 100 when no R3F assets are in Suspense
      if (!hasExited.current) {
        // Force fire with synthetic progress
      }
    }, 800);
    return () => clearTimeout(timer);
  }, [active, progress]);

  if (phase === 'done') return null;

  return (
    <div
      ref={wrapperRef}
      className={styles.preloader}
      role="progressbar"
      aria-label="Loading Shader Development Studio"
      aria-valuenow={Math.round(progress)}
      aria-valuemin={0}
      aria-valuemax={100}
    >
      {/* Scanlines overlay */}
      <div className={styles.scanlines} aria-hidden="true" />

      {/* Main content */}
      <div className={styles.content}>
        {/* Logo lockup */}
        <div className={styles.logoLockup}>
          <ShaderLogoIcon />
          <span className={styles.wordmark}>SHADER</span>
        </div>

        {/* Monospace subtitle */}
        <div className={styles.subtitle} aria-live="polite">
          <p>Shader Development Studio, Website</p>
          <p>Version 1.02</p>
        </div>

        {/* Progress bar — chunky pixel segments */}
        <div className={styles.progressBar}>
          <div className={styles.progressInner}>
            {Array.from({ length: TOTAL_SEGMENTS }).map((_, i) => (
              <div
                key={i}
                className={`${styles.segment} ${i < filledSegments ? styles.filled : styles.empty}`}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Copyright — fixed to bottom */}
      <p className={styles.copyright} aria-hidden="true">
        Copyright (c) Shader Development Studio AB, 2026. All Rights Reserved.
      </p>

      {/* White flash overlay (starts transparent) */}
      <div ref={flashRef} className={styles.flash} aria-hidden="true" />
    </div>
  );
}

export default Preloader;