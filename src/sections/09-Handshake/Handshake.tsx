import { SectionAnchor } from '../../components/shared/SectionAnchor';
import styles from './Handshake.module.css';

function Handshake() {
  return (
    <section id="section-handshake" className={styles.section} aria-label="Cinematic handshake transition">
      <SectionAnchor id="handshake" threshold={0.35} />
      <div className={styles.image} aria-hidden="true">
        <span className={`${styles.hand} ${styles.handLeft}`} />
        <span className={`${styles.hand} ${styles.handRight}`} />
        <span className={styles.flash} />
        <span className={styles.particles} />
      </div>
      <div className={styles.fadeTop} />
      <div className={styles.fadeBottom} />
    </section>
  );
}

export default Handshake;
