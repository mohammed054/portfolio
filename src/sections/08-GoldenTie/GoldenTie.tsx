import TieScene from './TieScene';
import styles from './GoldenTie.module.css';

function GoldenTie() {
  return (
    <section className={styles.section}>
      <div className={styles.spotlight} />
      
      <h2 className={styles.headline}>Check Out This Golden Tie</h2>
      <p className={styles.subtext}>You made it this far. You deserve a tie-break.</p>

      <div className={styles.scene}>
        <TieScene />
      </div>

      <div className={styles.audience}>
        {['left', 'leftCenter', 'center', 'rightCenter', 'right'].map((position, i) => (
          <div key={position} className={`${styles.person} ${styles[position]}`}>
            <span className={styles.personPlaceholder}>👏</span>
          </div>
        ))}
      </div>
    </section>
  );
}

export default GoldenTie;