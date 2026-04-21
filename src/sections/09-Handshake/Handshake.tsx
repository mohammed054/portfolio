import styles from './Handshake.module.css';

function Handshake() {
  return (
    <section className={styles.section}>
      <div className={styles.fadeTop} />
      <div className={styles.image}>
        <div className={styles.placeholder}>Cinematic Handshake Close-up</div>
      </div>
      <div className={styles.fadeBottom} />
    </section>
  );
}

export default Handshake;