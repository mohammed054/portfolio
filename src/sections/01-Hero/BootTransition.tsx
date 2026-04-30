import type { CSSProperties } from 'react';
import styles from './BootTransition.module.css';

const SEGMENTS = 24;

function BootLogo() {
  return (
    <svg className={styles.logoIcon} viewBox="0 0 92 78" aria-hidden="true">
      <clipPath id="boot-transition-logo-clip">
        <circle cx="39" cy="39" r="34" />
      </clipPath>
      <g clipPath="url(#boot-transition-logo-clip)">
        {Array.from({ length: 7 }).map((_, index) => (
          <path
            key={index}
            d={`M-6 ${11 + index * 8.4} H${62 + index * 4.9} L${92 - index * 2.2} ${16 + index * 8.4} H-6 Z`}
          />
        ))}
      </g>
    </svg>
  );
}

function BootTransition() {
  return (
    <section id="section-boot" className={styles.section} aria-label="Shader boot sequence">
      <div className={styles.screen}>
        <div className={styles.content}>
          <div className={styles.logoLockup}>
            <BootLogo />
            <span className={styles.wordmark}>SHADER</span>
          </div>

          <div className={styles.subtitle}>
            <p>Shader Development Studio, Website</p>
            <p>Version 1.02</p>
          </div>

          <div className={styles.progressBar} aria-hidden="true">
            <div className={styles.progressInner}>
              {Array.from({ length: SEGMENTS }).map((_, index) => (
                <span
                  key={index}
                  className={styles.segment}
                  style={{ '--segment-index': index } as CSSProperties}
                />
              ))}
            </div>
          </div>
        </div>

        <p className={styles.copyright}>
          Copyright (c) Shader Development Studio AB, 2026. All Rights Reserved.
        </p>
      </div>
    </section>
  );
}

export default BootTransition;
