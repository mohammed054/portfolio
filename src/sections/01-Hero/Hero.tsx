import { useRef } from 'react';
import { useGSAP } from '@gsap/react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import HeroScene from './HeroScene';
import styles from './Hero.module.css';

gsap.registerPlugin(ScrollTrigger);

function Hero() {
  const containerRef = useRef<HTMLElement>(null);
  const textRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    const ctx = gsap.context(() => {
      if (textRef.current) {
        gsap.from(textRef.current.children, {
          y: 30,
          opacity: 0,
          duration: 0.8,
          stagger: 0.1,
          ease: 'power3.out',
          delay: 0.5,
        });
      }
    }, containerRef);

    return ctx;
  });

  return (
    <section ref={containerRef} id="home" className={styles.hero}>
      <div className={styles.vignette} />
      
      <div className={styles.textColumn} ref={textRef}>
        <h1 className={styles.headline}>
          <span>A Creative</span>
          <span>Development</span>
          <span>Studio, Plugged</span>
          <span>into the Future</span>
        </h1>
        <p className={styles.cta}>
          Scroll to Inspect Our Closed Deals
          <span className={styles.scrollIcons}>
            <span className={styles.icon}>↓</span>
            <span className={styles.icon}>↓</span>
            <span className={styles.icon}>↓</span>
          </span>
        </p>
      </div>

      <div className={styles.scene3d}>
        <HeroScene />
      </div>
    </section>
  );
}

export default Hero;