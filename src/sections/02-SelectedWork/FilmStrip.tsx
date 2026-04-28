import type { CSSProperties } from 'react';
import styles from './FilmStrip.module.css';
import type { Project } from '../../types';

interface FilmStripProps {
  projects: Project[];
  activeIndex: number;
}

function SprocketRow() {
  return (
    <div className={styles.sprocketRow} aria-hidden="true">
      {Array.from({ length: 12 }).map((_, i) => (
        <div key={i} className={styles.sprocket} />
      ))}
    </div>
  );
}

function DesignIsFunnyArt() {
  return (
    <div className={styles.artDesignFunny}>
      <div className={styles.designFunnyMap} />
      <div className={`${styles.designFunnyRing} ${styles.designFunnyRingPink}`} />
      <div className={`${styles.designFunnyRing} ${styles.designFunnyRingPearl}`} />
      <div className={styles.designFunnyLabel}>
        <span>Design</span>
        <span>is Funny</span>
      </div>
    </div>
  );
}

function ShowroomArt() {
  return (
    <div className={styles.artShowroom}>
      <div className={styles.showroomShadow} />
      <div className={styles.showroomWall} />
      <div className={styles.showroomFloor} />
      <div className={styles.showroomTable} />
      <div className={styles.showroomShelfLeft} />
      <div className={styles.showroomShelfCenter} />
      <div className={styles.showroomFigure} />
      <div className={styles.showroomRug} />
    </div>
  );
}

function MedicalArenaArt() {
  return (
    <div className={styles.artMedicalArena}>
      <div className={styles.medicalWallLeft} />
      <div className={styles.medicalWallRight} />
      <div className={styles.medicalFloor} />
      {Array.from({ length: 3 }).map((_, row) => (
        <div key={row} className={styles.medicalShelfRow}>
          {Array.from({ length: 7 }).map((__, cell) => (
            <span
              key={`${row}-${cell}`}
              className={styles.medicalProduct}
              style={
                {
                  '--product-delay': `${row * 0.05 + cell * 0.03}s`,
                } as CSSProperties
              }
            />
          ))}
        </div>
      ))}
      <div className={styles.medicalPoster} />
    </div>
  );
}

function GenericProjectArt({ project, index }: { project: Project; index: number }) {
  return (
    <div
      className={styles.artGeneric}
      style={
        {
          '--tone-a': `hsl(${(index * 41) % 360} 56% 26%)`,
          '--tone-b': `hsl(${(index * 41 + 58) % 360} 72% 18%)`,
        } as CSSProperties
      }
    >
      <div className={styles.genericGrid} />
      <div className={styles.genericOrb} />
      <div className={styles.genericLabel}>
        <span className={styles.genericNumber}>{String(index + 1).padStart(2, '0')}</span>
        <span>{project.name}</span>
      </div>
    </div>
  );
}

function ProjectArtwork({ project, index }: { project: Project; index: number }) {
  if (index === 0) {
    return <DesignIsFunnyArt />;
  }

  if (index === 1) {
    return <ShowroomArt />;
  }

  if (index === 2) {
    return <MedicalArenaArt />;
  }

  return <GenericProjectArt project={project} index={index} />;
}

function FilmStrip({ projects, activeIndex }: FilmStripProps) {
  return (
    <div className={styles.viewport}>
      <div className={styles.strip}>
        {projects.map((project, index) => {
          const offset = index - activeIndex;
          const depth = Math.abs(offset);
          const scale = Math.max(0.48, 1 - depth * 0.13);
          const opacity = depth > 4 ? 0 : Math.max(0.18, 1 - depth * 0.18);
          const translateX = `calc(-50% + ${offset * 21}vw)`;
          const translateY = `calc(-50% + ${22 + depth * 24}px)`;
          const translateZ = `${-depth * 210}px`;
          const rotateY = `${offset * -22}deg`;
          const rotateZ = `${offset * -5.2}deg`;

          return (
            <article
              key={project.id}
              className={styles.frame}
              aria-hidden={depth > 2}
              data-active={depth === 0}
              style={
                {
                  opacity,
                  zIndex: 50 - depth,
                  transform: `translate3d(${translateX}, ${translateY}, ${translateZ}) rotateY(${rotateY}) rotateZ(${rotateZ}) scale(${scale})`,
                } as CSSProperties
              }
            >
              <div className={styles.frameCard}>
                <SprocketRow />

                <div className={styles.exposure}>
                  {project.imageAvailable && project.images?.main ? (
                    <img
                      src={project.images.main}
                      alt={project.name}
                      className={styles.image}
                      loading="lazy"
                      decoding="async"
                    />
                  ) : (
                    <ProjectArtwork project={project} index={index} />
                  )}

                  <div className={styles.grain} aria-hidden="true" />
                  <span className={styles.frameNumber} aria-hidden="true">
                    {String(index + 1).padStart(2, '0')}A
                  </span>
                </div>

                <SprocketRow />
              </div>
            </article>
          );
        })}
      </div>
    </div>
  );
}

export default FilmStrip;
