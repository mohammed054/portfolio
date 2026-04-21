import styles from './AboutHero.module.css';

function AboutHero() {
  return (
    <section id="about-us" className={styles.section}>
      <div className={styles.gradient} />
      <h1 className={styles.title}>About Us</h1>
    </section>
  );
}

export default AboutHero;