import { useRef } from 'react';
import { useGSAP } from '@gsap/react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import ShredderCanvas from './ShredderCanvas';
import styles from './Shredder.module.css';

gsap.registerPlugin(ScrollTrigger);

function Shredder() {
  const sectionRef = useRef<HTMLElement>(null);

  return (
    <section ref={sectionRef} className={styles.section}>
      <div className={styles.content}>
        <h2 className={styles.headline}>Had Enough Reading? Let's Shred This Thing.</h2>
        <p className={styles.subtext}>We've got one last trick up our sleeve.</p>
      </div>
      
      <ShredderCanvas />

      <div className={styles.shredder}>
        <div className={styles.machine}>
          <span className={styles.label}>SHREDDER</span>
        </div>
      </div>
    </section>
  );
}

export default Shredder;