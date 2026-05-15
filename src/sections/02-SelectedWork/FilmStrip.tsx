import type { MutableRefObject } from 'react';
import styles from './FilmStrip.module.css';
import type { Project } from '../../types';

interface FilmStripProps {
  projects: Project[];
  activeIndex: number;
  viewportRef: MutableRefObject<HTMLDivElement | null>;
  trackRef: MutableRefObject<HTMLDivElement | null>;
  setFrameRef: (index: number, element: HTMLElement | null) => void;
}

function SprocketRow({ count }: { count: number }) {
  return (
    <div className={styles.sprocketRow} aria-hidden="true">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className={styles.sprocket} />
      ))}
    </div>
  );
}

function ProjectFallback({ project }: { project: Project }) {
  return (
    <div className={styles.fallbackArt}>
      <div className={styles.fallbackGrid} />
      <div className={styles.fallbackLabel}>
        <span className={styles.fallbackKicker}>GitHub project</span>
        <span>{project.name}</span>
      </div>
    </div>
  );
}

function FilmStrip({
  projects,
  activeIndex,
  viewportRef,
  trackRef,
  setFrameRef,
}: FilmStripProps) {
  const sprocketCount = Math.max(34, projects.length * 10);
  const leadingProject = projects[projects.length - 1];

  return (
    <div className={styles.viewport}>
      <div className={styles.reel}>
        <SprocketRow count={sprocketCount} />

        <div className={styles.window} ref={viewportRef}>
          <div className={styles.strip} ref={trackRef}>
            {leadingProject ? (
              <article
                className={`${styles.frame} ${styles.framePreview}`}
                data-active="false"
                aria-hidden="true"
              >
                <div className={styles.exposure}>
                  {leadingProject.imageAvailable && leadingProject.images?.main ? (
                    <img
                      src={leadingProject.images.main}
                      alt=""
                      className={styles.image}
                      loading="eager"
                      decoding="async"
                      fetchPriority="high"
                    />
                  ) : (
                    <ProjectFallback project={leadingProject} />
                  )}

                  <div className={styles.imageOverlay} aria-hidden="true" />
                  <span className={styles.frameNumber} aria-hidden="true">
                    {String(projects.length).padStart(2, '0')}A
                  </span>
                </div>
              </article>
            ) : null}

            {projects.map((project, index) => (
              <article
                key={project.id}
                ref={(element) => setFrameRef(index, element)}
                className={styles.frame}
                data-active={index === activeIndex}
              >
                <div className={styles.exposure}>
                  {project.imageAvailable && project.images?.main ? (
                    <img
                      src={project.images.main}
                      alt={project.name}
                      className={styles.image}
                      loading={index < 3 ? 'eager' : 'lazy'}
                      decoding="async"
                      fetchPriority={index < 3 ? 'high' : 'auto'}
                    />
                  ) : (
                    <ProjectFallback project={project} />
                  )}

                  <div className={styles.imageOverlay} aria-hidden="true" />
                  <span className={styles.frameNumber} aria-hidden="true">
                    {String(index + 1).padStart(2, '0')}A
                  </span>
                </div>
              </article>
            ))}
          </div>
        </div>

        <SprocketRow count={sprocketCount} />
      </div>
    </div>
  );
}

export default FilmStrip;
