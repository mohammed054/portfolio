import styles from './FilmStrip.module.css';

interface Project {
  id: number;
  name: string;
  category: string;
  url: string;
}

interface FilmStripProps {
  projects: Project[];
}

function FilmStrip({ projects }: FilmStripProps) {
  return (
    <div className={styles.filmStrip}>
      <div className={styles.sprocketTop}>
        {Array.from({ length: 40 }).map((_, i) => (
          <div key={i} className={styles.sprocket} />
        ))}
      </div>

      <div className={styles.frames}>
        {projects.map((project) => (
          <div key={project.id} className={styles.frame}>
            <div className={styles.frameImage}>
              <span className={styles.placeholder}>Project {project.id}</span>
            </div>
            <div className={styles.frameInfo}>
              <h3>{project.name}</h3>
              <p>{project.category}</p>
            </div>
          </div>
        ))}
      </div>

      <div className={styles.sprocketBottom}>
        {Array.from({ length: 40 }).map((_, i) => (
          <div key={i} className={styles.sprocket} />
        ))}
      </div>
    </div>
  );
}

export default FilmStrip;