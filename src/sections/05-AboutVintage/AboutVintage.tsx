import styles from './AboutVintage.module.css';

function AboutVintage() {
  return (
    <section className={styles.section}>
      <div className={styles.rainbowStripe}>
        {['#e63946', '#f4a261', '#e9c46a', '#2a9d8f', '#457b9d', '#6a0572'].map((color, i) => (
          <div key={i} className={styles.stripe} style={{ backgroundColor: color }} />
        ))}
      </div>
      <div className={styles.imageWrapper}>
        <div className={styles.placeholder}>Retro Computer Product Spread</div>
      </div>
      <div className={styles.rainbowStripeBottom}>
        {['#6a0572', '#457b9d', '#2a9d8f', '#e9c46a', '#f4a261', '#e63946'].map((color, i) => (
          <div key={i} className={styles.stripe} style={{ backgroundColor: color }} />
        ))}
      </div>
    </section>
  );
}

export default AboutVintage;