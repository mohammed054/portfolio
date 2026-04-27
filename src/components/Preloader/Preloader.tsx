import { useEffect, useRef, useState } from 'react';
import { useProgress } from '@react-three/drei/core/Progress.js';
import { gsap } from 'gsap';
import { COPY, FEATURES } from '../../utils/constants';
import styles from './Preloader.module.css';

interface PreloaderProps {
  onComplete: () => void;
}

const RAINBOW = [
  '#e63946',
  '#f4a261',
  '#e9c46a',
  '#2a9d8f',
  '#457b9d',
  '#6a0572',
];
const SEGMENTS = 20;

export function Preloader({ onComplete }: PreloaderProps) {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const flashRef = useRef<HTMLDivElement>(null);
  const hasCompletedRef = useRef(false);
  const previousFilledRef = useRef(0);
  const { progress, active } = useProgress();
  const [fallbackReady, setFallbackReady] = useState(false);
  const [newlyFilled, setNewlyFilled] = useState<number | null>(null);

  useEffect(() => {
    if (FEATURES.enablePreloader) {
      return;
    }

    onComplete();
  }, [onComplete]);

  useEffect(() => {
    if (!FEATURES.enablePreloader) {
      return;
    }

    if (progress > 0) {
      return;
    }

    const timer = window.setTimeout(() => {
      if (progress === 0) {
        setFallbackReady(true);
      }
    }, 1500);

    return () => window.clearTimeout(timer);
  }, [progress]);

  const filledSegments = Math.floor((Math.min(progress, 100) / 100) * SEGMENTS);

  useEffect(() => {
    if (filledSegments <= previousFilledRef.current) {
      return;
    }

    setNewlyFilled(filledSegments - 1);
    previousFilledRef.current = filledSegments;

    const timer = window.setTimeout(() => {
      setNewlyFilled((current) =>
        current === filledSegments - 1 ? null : current,
      );
    }, 180);

    return () => window.clearTimeout(timer);
  }, [filledSegments]);

  useEffect(() => {
    if (!FEATURES.enablePreloader || hasCompletedRef.current) {
      return;
    }

    const ready = (!active && progress >= 100) || fallbackReady;
    if (!ready) {
      return;
    }

    hasCompletedRef.current = true;

    const timeline = gsap.timeline({
      onComplete,
    });

    timeline
      .to(wrapperRef.current, {
        delay: 0.4,
        scaleY: 0.02,
        duration: 0.2,
        ease: 'power3.in',
        transformOrigin: 'center center',
      })
      .to(wrapperRef.current, {
        scaleX: 0,
        duration: 0.15,
        ease: 'power2.in',
      })
      .to(
        flashRef.current,
        {
          opacity: 1,
          duration: 0.08,
          ease: 'none',
        },
        '-=0.02',
      )
      .to(flashRef.current, {
        opacity: 0,
        duration: 0.12,
        ease: 'none',
      });
  }, [active, fallbackReady, onComplete, progress]);

  if (!FEATURES.enablePreloader) {
    return null;
  }

  return (
    <div ref={wrapperRef} className={styles.preloader}>
      <div className={styles.crtScreen}>
        <div className={styles.content}>
          <div className={styles.logoLockup}>
            <svg className={styles.logoIcon} viewBox="0 0 320 80" aria-hidden="true">
              {RAINBOW.map((color, index) => (
                <path
                  key={color}
                  d={`M10 ${10 + index * 10} H${170 + index * 18} L${300 - index * 4} ${18 + index * 10} H10 Z`}
                  fill={color}
                />
              ))}
            </svg>
            <div className={styles.wordmark}>SHADER</div>
          </div>

          <div className={styles.subtitle}>
            <p>{COPY.preloader.line1}</p>
            <p>{COPY.preloader.line2}</p>
          </div>

          <div
            className={styles.progressBar}
            role="progressbar"
            aria-valuemin={0}
            aria-valuemax={100}
            aria-valuenow={Math.round(fallbackReady ? 100 : progress)}
          >
            <div className={styles.progressInner}>
              {Array.from({ length: SEGMENTS }).map((_, index) => {
                const isFilled = index < filledSegments || fallbackReady;
                const isNew = isFilled && index === newlyFilled;

                return (
                  <div
                    key={index}
                    className={[
                      styles.segment,
                      isFilled ? styles.filled : styles.empty,
                      isNew ? styles.filledNew : '',
                    ]
                      .filter(Boolean)
                      .join(' ')}
                  />
                );
              })}
            </div>
          </div>
        </div>
      </div>

      <div className={styles.scanlines} aria-hidden="true" />
      <p className={styles.copyright}>{COPY.preloader.footer}</p>
      <div ref={flashRef} className={styles.flash} aria-hidden="true" />
    </div>
  );
}
