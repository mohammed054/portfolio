import { useState, useEffect } from 'react';
import { useProgress } from '@react-three/drei';
import styles from './Preloader.module.css';

interface PreloaderProps {
  onComplete?: () => void;
}

function Preloader({ onComplete }: PreloaderProps) {
  const { progress, active } = useProgress();
  const [phase, setPhase] = useState<'loading' | 'complete' | 'exit'>('loading');

  useEffect(() => {
    if (progress === 100 && !active) {
      setPhase('complete');
      setTimeout(() => {
        setPhase('exit');
        setTimeout(() => {
          onComplete?.();
        }, 200);
      }, 400);
    }
  }, [progress, active, onComplete]);

  const segments = 20;

  return (
    <div 
      className={`${styles.preloader} ${phase === 'exit' ? styles.exit : ''}`}
      role="progressbar"
      aria-valuenow={Math.round(progress)}
      aria-valuemin={0}
      aria-valuemax={100}
    >
      <div className={styles.crtEffect}>
        <div className={styles.scanlines} />
        
        <div className={styles.content}>
          <div className={styles.logo}>
            <svg className={styles.logoIcon} viewBox="0 0 120 120" fill="none">
              <rect x="0" y="0" width="120" height="16" fill="var(--color-rainbow-1)" />
              <rect x="0" y="20" width="120" height="16" fill="var(--color-rainbow-2)" />
              <rect x="0" y="40" width="120" height="16" fill="var(--color-rainbow-3)" />
              <rect x="0" y="60" width="120" height="16" fill="var(--color-rainbow-4)" />
              <rect x="0" y="80" width="120" height="16" fill="var(--color-rainbow-5)" />
              <rect x="0" y="100" width="120" height="16" fill="var(--color-rainbow-6)" />
            </svg>
            <span className={styles.logoText}>SHADER</span>
          </div>

          <div className={styles.subtitle}>
            <p>Shader Development Studio, Website</p>
            <p>Version 1.02</p>
          </div>

          <div className={styles.progressBar}>
            <div className={styles.progressInner}>
              {Array.from({ length: segments }).map((_, i) => (
                <div
                  key={i}
                  className={`${styles.segment} ${
                    (progress / 100) * segments > i ? styles.filled : styles.empty
                  }`}
                />
              ))}
            </div>
          </div>
        </div>

        <p className={styles.copyright}>
          Copyright (c) Shader Development Studio AB, 2026. All Rights Reserved.
        </p>
      </div>

      {phase === 'exit' && <div className={styles.flash} />}
    </div>
  );
}

export default Preloader;