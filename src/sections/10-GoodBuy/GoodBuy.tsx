import PhonesScene from './PhonesScene';
import styles from './GoodBuy.module.css';

function GoodBuy() {
  return (
    <section className={styles.section}>
      <div className={styles.scene}>
        <PhonesScene />
      </div>
      <h2 className={styles.headline}>Good buy.</h2>
    </section>
  );
}

export default GoodBuy;