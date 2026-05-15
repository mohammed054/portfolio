import PhonesScene from './PhonesScene';
import { SectionAnchor } from '../../components/shared/SectionAnchor';
import styles from './GoodBuy.module.css';

function GoodBuy() {
  return (
    <section id="section-good-buy" className={styles.section}>
      <SectionAnchor id="good-buy" threshold={0.42} />
      <div className={styles.scene}>
        <PhonesScene />
      </div>
      <h2 className={styles.headline}>Good build.</h2>
    </section>
  );
}

export default GoodBuy;
