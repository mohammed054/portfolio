import { useEffect, useRef, useState } from 'react';
import { useProgress } from '@react-three/drei/core/Progress.js';
import { gsap } from 'gsap';
import { COPY, FEATURES } from '../../utils/constants';
import styles from './Preloader.module.css';

interface PreloaderProps {
  onComplete: () => void;
}

const BOOT_LOGO_STRIPE = '#f3ecd7';
const SEGMENTS = 20;

export function Preloader({ onComplete }: PreloaderProps) {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const flashRef = useRef<HTMLDivElement>(null);
  const hasCompletedRef = useRef(false);
  const previousFilledRef = useRef(0);
  const { progress, active } = useProgress();
  const [fallbackReady, setFallbackReady] = useState(false);
  const [newlyFilled, setNewlyFilled] = useState<number | null>(null);
  const skipPreloader =
    typeof window !== 'undefined' &&
    new URLSearchParams(window.location.search).has('skip-preloader');

  useEffect(() => {
    if (FEATURES.enablePreloader && !skipPreloader) {
      return;
    }

    onComplete();
  }, [onComplete, skipPreloader]);

  useEffect(() => {
    if (!FEATURES.enablePreloader || skipPreloader) {
      return;
    }

    const timer = window.setTimeout(() => {
      if (progress < 100) {
        setFallbackReady(true);
      }
    }, progress > 0 ? 3200 : 1800);

    return () => window.clearTimeout(timer);
  }, [progress, skipPreloader]);

  useEffect(() => {
    if (!FEATURES.enablePreloader || skipPreloader) {
      return;
    }

    const timer = window.setTimeout(() => {
      setFallbackReady(true);
    }, 6000);

    return () => window.clearTimeout(timer);
  }, [skipPreloader]);

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
    if (!FEATURES.enablePreloader || skipPreloader || hasCompletedRef.current) {
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
        delay: 0.18,
        opacity: 0,
        duration: 0.18,
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
  }, [active, fallbackReady, onComplete, progress, skipPreloader]);

  if (!FEATURES.enablePreloader || skipPreloader) {
    return null;
  }

  return (
    <div ref={wrapperRef} className={styles.preloader}>
      <div className={styles.crtScreen}>
        <div className={styles.content}>
          <div className={styles.logoLockup}>
            <svg className={styles.logoIcon} viewBox="0 0 80 80" aria-hidden="true">
              <clipPath id="boot-logo-clip">
                <circle cx="40" cy="40" r="34" />
              </clipPath>
              <g clipPath="url(#boot-logo-clip)">
                {Array.from({ length: 7 }).map((_, index) => (
                  <path
                    key={index}
                    d={`M-4 ${13 + index * 8.2} H${64 + index * 4.5} L${88 - index * 2.1} ${18 + index * 8.2} H-4 Z`}
                    fill={BOOT_LOGO_STRIPE}
                  />
                ))}
              </g>
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
