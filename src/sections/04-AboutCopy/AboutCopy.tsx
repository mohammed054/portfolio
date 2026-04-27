import { useRef } from 'react';
import { useGSAP } from '@gsap/react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { COPY } from '../../utils/constants';
import { SectionAnchor } from '../../components/shared/SectionAnchor';
import styles from './AboutCopy.module.css';

gsap.registerPlugin(ScrollTrigger);

function AboutCopy() {
  const sectionRef = useRef<HTMLElement>(null);
  const headlineRef = useRef<HTMLHeadingElement>(null);
  const col1Ref = useRef<HTMLDivElement>(null);
  const col2Ref = useRef<HTMLDivElement>(null);
  const col3Ref = useRef<HTMLDivElement>(null);
  const businessmanRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const trigger = { trigger: sectionRef.current, start: 'top 65%' };

      gsap.from(headlineRef.current, {
        y: 30,
        opacity: 0,
        duration: 0.7,
        ease: 'power3.out',
        scrollTrigger: { ...trigger, toggleActions: 'play none none reverse' },
      });

      [col1Ref, col2Ref, col3Ref].forEach((columnRef, index) => {
        gsap.from(columnRef.current, {
          y: 20,
          opacity: 0,
          duration: 0.6,
          ease: 'power2.out',
          delay: index * 0.15,
          scrollTrigger: { ...trigger, toggleActions: 'play none none reverse' },
        });
      });

      gsap.from(businessmanRef.current, {
        x: 80,
        opacity: 0,
        duration: 0.8,
        ease: 'power3.out',
        delay: 0.4,
        scrollTrigger: { ...trigger, toggleActions: 'play none none reverse' },
      });

      gsap.to(businessmanRef.current, {
        y: -30,
        ease: 'none',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top bottom',
          end: 'bottom top',
          scrub: true,
        },
      });
    },
    { scope: sectionRef },
  );

  return (
    <section id="section-about-copy" ref={sectionRef} className={styles.section}>
      <SectionAnchor id="about-copy" threshold={0.4} />
      <div className={styles.paperTexture} aria-hidden="true" />

      <div className={styles.container}>
        <h2 ref={headlineRef} className={styles.headline}>
          Making Digital Storytelling More Playful,
          <br />
          Powerful, and Alive
        </h2>

        <div className={styles.columns}>
          <div ref={col1Ref} className={styles.column}>
            <p>{COPY.aboutCopy.col1}</p>
          </div>
          <div ref={col2Ref} className={styles.column}>
            <p>{COPY.aboutCopy.col2}</p>
          </div>
          <div ref={col3Ref} className={styles.column}>
            <p>{COPY.aboutCopy.col3}</p>
          </div>
        </div>
      </div>

      <div ref={businessmanRef} className={styles.businessman} aria-hidden="true">
        <div className={styles.businessmanFallback} />
      </div>
    </section>
  );
}

export default AboutCopy;
