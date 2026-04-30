import { useRef, useState, type CSSProperties } from 'react';
import { useGSAP } from '@gsap/react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SectionAnchor } from '../../components/shared/SectionAnchor';
import { COPY } from '../../utils/constants';
import TieScene from './TieScene';
import styles from './GoldenTie.module.css';

gsap.registerPlugin(ScrollTrigger);

const AUDIENCE = [
  { key: 'pinkSuit', side: 'left', scale: 0.96, pose: 'raised' },
  { key: 'tanSuit', side: 'left', scale: 0.9, pose: 'clapping' },
  { key: 'patternDress', side: 'left', scale: 1.02, pose: 'raised' },
  { key: 'brownSuit', side: 'left', scale: 0.86, pose: 'raised' },
  { key: 'graySuit', side: 'right', scale: 1, pose: 'clapping' },
  { key: 'blueSuit', side: 'right', scale: 0.9, pose: 'raised' },
  { key: 'blackDress', side: 'right', scale: 0.94, pose: 'turned' },
] as const;

function GoldenTie() {
  const sectionRef = useRef<HTMLElement>(null);
  const spotlightRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<HTMLDivElement>(null);
  const headlineRef = useRef<HTMLHeadingElement>(null);
  const subtextRef = useRef<HTMLParagraphElement>(null);
  const [activated, setActivated] = useState(false);

  useGSAP(
    () => {
      const section = sectionRef.current;
      if (!section || !spotlightRef.current || !sceneRef.current || !headlineRef.current || !subtextRef.current) {
        return;
      }

      const leftPeople = section.querySelectorAll('[data-side="left"]');
      const rightPeople = section.querySelectorAll('[data-side="right"]');

      const activationTrigger = ScrollTrigger.create({
        trigger: section,
        start: 'top 70%',
        end: 'bottom top',
        onEnter: () => setActivated(true),
        onEnterBack: () => setActivated(true),
        onLeaveBack: () => setActivated(false),
      });

      gsap.fromTo(
        spotlightRef.current,
        { opacity: 0 },
        {
          opacity: 1,
          duration: 0.6,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: section,
            start: 'top 75%',
            toggleActions: 'play none none reverse',
          },
        },
      );

      gsap.fromTo(
        sceneRef.current,
        { opacity: 0, y: -160 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          ease: 'back.out(1.4)',
          scrollTrigger: {
            trigger: section,
            start: 'top 68%',
            toggleActions: 'play none none reverse',
          },
        },
      );

      gsap.fromTo(
        headlineRef.current,
        { opacity: 0, y: 22 },
        {
          opacity: 1,
          y: 0,
          duration: 0.65,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: section,
            start: 'top 66%',
            toggleActions: 'play none none reverse',
          },
        },
      );

      gsap.fromTo(
        subtextRef.current,
        { opacity: 0, y: 18 },
        {
          opacity: 1,
          y: 0,
          duration: 0.65,
          ease: 'power3.out',
          delay: 0.1,
          scrollTrigger: {
            trigger: section,
            start: 'top 64%',
            toggleActions: 'play none none reverse',
          },
        },
      );

      gsap.fromTo(
        leftPeople,
        { opacity: 0, xPercent: -120 },
        {
          opacity: 1,
          xPercent: 0,
          duration: 0.8,
          ease: 'power2.out',
          stagger: 0.1,
          scrollTrigger: {
            trigger: section,
            start: 'top 60%',
            toggleActions: 'play none none reverse',
          },
        },
      );

      gsap.fromTo(
        rightPeople,
        { opacity: 0, xPercent: 120 },
        {
          opacity: 1,
          xPercent: 0,
          duration: 0.8,
          ease: 'power2.out',
          stagger: 0.1,
          scrollTrigger: {
            trigger: section,
            start: 'top 60%',
            toggleActions: 'play none none reverse',
          },
        },
      );

      return () => {
        activationTrigger.kill();
      };
    },
    { scope: sectionRef },
  );

  return (
    <section id="section-golden-tie" ref={sectionRef} className={styles.section}>
      <SectionAnchor id="golden-tie" threshold={0.35} />
      <div ref={spotlightRef} className={styles.spotlight} />

      <div className={styles.header}>
        <h2 ref={headlineRef} className={styles.headline}>
          {COPY.goldenTie.headline}
        </h2>
        <p ref={subtextRef} className={styles.subtext}>
          {COPY.goldenTie.subtext}
        </p>
      </div>

      <div ref={sceneRef} className={styles.scene}>
        <div className={styles.tieFallback} aria-hidden="true">
          <span className={styles.tieKnot} />
          <span className={styles.tieBlade} />
        </div>
        <div className={styles.sceneCanvas}>
          <TieScene activated={activated} />
        </div>
      </div>

      <div className={styles.audience}>
        {AUDIENCE.map((person) => (
          <div
            key={person.key}
            className={`${styles.person} ${styles[person.key]} ${styles[person.pose]}`}
            data-side={person.side}
            style={{ '--person-scale': person.scale } as CSSProperties}
            aria-hidden="true"
          >
            <span className={styles.figure}>
              <span className={styles.head} />
              <span className={styles.torso} />
              <span className={`${styles.arm} ${styles.armLeft}`} />
              <span className={`${styles.arm} ${styles.armRight}`} />
            </span>
          </div>
        ))}
      </div>
    </section>
  );
}

export default GoldenTie;
