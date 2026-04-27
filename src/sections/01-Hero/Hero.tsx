import { useRef } from 'react';
import { useGSAP } from '@gsap/react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import HeroScene from './HeroScene';
import { SectionAnchor } from '../../components/shared/SectionAnchor';
import { COPY } from '../../utils/constants';
import { prefersReducedMotion } from '../../utils/motion';
import styles from './Hero.module.css';

gsap.registerPlugin(ScrollTrigger);

function Hero() {
  const containerRef = useRef<HTMLElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const ctaRef = useRef<HTMLParagraphElement>(null);
  const linesRef = useRef<HTMLSpanElement[]>([]);

  useGSAP(
    () => {
      const lines = linesRef.current.filter(Boolean);
      if (!textRef.current || !ctaRef.current || lines.length === 0) {
        return;
      }

      if (prefersReducedMotion) {
        gsap.set(lines, { y: 0, opacity: 1 });
        gsap.set(ctaRef.current, { opacity: 1 });
        return;
      }

      gsap.set(lines, { y: 40, opacity: 0 });
      gsap.set(ctaRef.current, { opacity: 0 });

      gsap
        .timeline({ delay: 0.3 })
        .to(lines, {
          y: 0,
          opacity: 1,
          duration: 0.8,
          stagger: 0.1,
          ease: 'power3.out',
        })
        .to(
          ctaRef.current,
          {
            opacity: 1,
            duration: 0.6,
            ease: 'power2.out',
          },
          '-=0.2',
        );

      gsap.to(textRef.current, {
        yPercent: -25,
        opacity: 0.4,
        ease: 'none',
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'top top',
          end: 'bottom top',
          scrub: true,
        },
      });
    },
    { scope: containerRef },
  );

  return (
    <section id="section-hero" ref={containerRef} className={styles.hero}>
      <SectionAnchor id="home" threshold={0.3} />
      <div className={styles.vignette} aria-hidden="true" />

      <div className={styles.textColumn} ref={textRef}>
        <h1 className={styles.headline}>
          {COPY.hero.headline.map((line, index) => (
            <span
              key={line}
              className={styles.headlineLine}
              ref={(element) => {
                if (element) {
                  linesRef.current[index] = element;
                }
              }}
            >
              {line}
            </span>
          ))}
        </h1>

        <p ref={ctaRef} className={styles.cta}>
          {COPY.hero.subCta}
          <span className={styles.scrollIcons} aria-hidden="true">
            <span className={styles.icon}>↓</span>
            <span className={styles.icon}>↓</span>
            <span className={styles.icon}>↓</span>
          </span>
        </p>
      </div>

      <div className={styles.scene3d} aria-hidden="true">
        <HeroScene />
      </div>
    </section>
  );
}

export default Hero;
