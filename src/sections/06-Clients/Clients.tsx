import { SectionAnchor } from '../../components/shared/SectionAnchor';
import styles from './Clients.module.css';

const STACK = [
  'React',
  'Next.js',
  'TypeScript',
  'Python',
  'Node/Express',
  'MongoDB',
  'Android Kotlin',
  'Chrome MV3',
  'Three.js',
  'GSAP',
  'OCR',
  'AI APIs',
];

function Businessman({ side }: { side: 'left' | 'right' }) {
  return (
    <div className={`${styles.businessman} ${styles[side]}`} aria-hidden="true">
      <span className={styles.head} />
      <span className={styles.body} />
      <span className={styles.tie} />
      <span className={`${styles.arm} ${styles.armOne}`} />
      <span className={`${styles.arm} ${styles.armTwo}`} />
    </div>
  );
}

function Clients() {
  return (
    <section id="section-clients" className={styles.section}>
      <SectionAnchor id="clients" threshold={0.35} />
      <div className={styles.texture} aria-hidden="true" />

      <Businessman side="left" />
      <Businessman side="right" />

      <div className={styles.container}>
        <h2>Stack and Strengths</h2>
        <p>
          The tools Mohamed uses to turn automation, data, web, mobile, and AI ideas into working software.
        </p>

        <div className={styles.logoGrid} aria-label="Technology stack">
          {STACK.map((tool) => (
            <div key={tool} className={styles.logoCell}>
              {tool}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default Clients;
