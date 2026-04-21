// ============================================================
// SHADER REBUILD — Film Strip Component
// src/sections/02-SelectedWork/FilmStrip.tsx
//
// Spec: 03-selected-work.md
// Renders the physical 35mm film strip structure:
//  - Sprocket holes (CSS mask — actual cutouts)
//  - Perspective 3D tilt (CSS perspective + rotateY)
//  - Project frames with gradient placeholder backgrounds
//  - Active frame is full-size; adjacent frames are scaled down
// ============================================================

import { RefObject } from 'react';
import React from 'react';
import styles from './FilmStrip.module.css';

interface Project {
  id: number;
  name: string;
  category: string;
  url: string;
  images?: { main?: string; detail1?: string };
}

interface FilmStripProps {
  projects: Project[];
  activeIndex: number;
  stripRef: RefObject<HTMLDivElement>;
}

// Sprocket row — alternating across the full strip
function SprocketRow() {
  return (
    <div className={styles.sprocketRow} aria-hidden="true">
      {Array.from({ length: 50 }).map((_, i) => (
        <div key={i} className={styles.sprocket} />
      ))}
    </div>
  );
}

function FilmStrip({ projects, activeIndex, stripRef }: FilmStripProps) {
  return (
    <div className={styles.perspective}>
      <div ref={stripRef} className={styles.filmStrip}>
        {/* Top sprocket row */}
        <SprocketRow />

        {/* Frame row */}
        <div className={styles.frames}>
          {/* Leading spacer so the first frame is centered on load */}
          <div className={styles.spacer} aria-hidden="true" />

          {projects.map((project, i) => {
            const distance = Math.abs(i - activeIndex);
            const isActive = i === activeIndex;

            return (
              <div
                key={project.id}
                className={`${styles.frame} ${isActive ? styles.frameActive : ''}`}
                style={{
                  '--distance': distance,
                } as React.CSSProperties}
                aria-hidden={!isActive}
              >
                <div className={styles.frameImage}>
                  {project.images?.main ? (
                    <img
                      src={project.images.main}
                      alt={project.name}
                      className={styles.image}
                      loading="lazy"
                    />
                  ) : (
                    <div
                      className={styles.placeholder}
                      style={{
                        background: `linear-gradient(135deg,
                          hsl(${(i * 37) % 360}, 40%, 12%) 0%,
                          hsl(${(i * 37 + 60) % 360}, 50%, 18%) 100%)`,
                      }}
                    >
                      <span className={styles.placeholderLabel}>{project.name}</span>
                    </div>
                  )}

                  {/* Film grain texture overlay */}
                  <div className={styles.grain} aria-hidden="true" />

                  {/* Frame number — like a real film strip */}
                  <span className={styles.frameNumber} aria-hidden="true">
                    {String(i + 1).padStart(2, '0')}A
                  </span>
                </div>
              </div>
            );
          })}

          {/* Trailing spacer */}
          <div className={styles.spacer} aria-hidden="true" />
        </div>

        {/* Bottom sprocket row */}
        <SprocketRow />
      </div>
    </div>
  );
}

export default FilmStrip;