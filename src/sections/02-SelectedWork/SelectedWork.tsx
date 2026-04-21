import { useRef } from 'react';
import { useGSAP } from '@gsap/react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import FilmStrip from './FilmStrip';
import styles from './SelectedWork.module.css';

gsap.registerPlugin(ScrollTrigger);

const projects = [
  { id: 1, name: 'Design is Funny', category: 'Brand Identity', url: '#' },
  { id: 2, name: 'eHealth Arena', category: '3D Showroom', url: '#' },
  { id: 3, name: 'Project Three', category: 'Web Experience', url: '#' },
  { id: 4, name: 'Project Four', category: 'Interactive', url: '#' },
  { id: 5, name: 'Project Five', category: '3D Visualization', url: '#' },
  { id: 6, name: 'Project Six', category: 'Web App', url: '#' },
  { id: 7, name: 'Project Seven', category: 'Creative', url: '#' },
  { id: 8, name: 'Project Eight', category: 'Branding', url: '#' },
  { id: 9, name: 'Project Nine', category: 'Development', url: '#' },
  { id: 10, name: 'Project Ten', category: 'Design', url: '#' },
  { id: 11, name: 'Project Eleven', category: 'Strategy', url: '#' },
];

function SelectedWork() {
  const sectionRef = useRef<HTMLElement>(null);

  return (
    <section ref={sectionRef} id="work" className={styles.section}>
      <div className={styles.header}>
        <h2 className={styles.title}>Selected Work</h2>
        <p className={styles.subtitle}>Browse our project carousel to explore our selected work.</p>
      </div>

      <FilmStrip projects={projects} />

      <div className={styles.navigation}>
        <button className={styles.navBtn} aria-label="Previous">←</button>
        <div className={styles.dots}>
          {projects.map((_, i) => (
            <span key={i} className={`${styles.dot} ${i === 0 ? styles.active : ''}`} />
          ))}
        </div>
        <button className={styles.navBtn} aria-label="Next">→</button>
      </div>
    </section>
  );
}

export default SelectedWork;