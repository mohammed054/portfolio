import { useMemo, useRef, useState, type CSSProperties } from 'react';
import { useGSAP } from '@gsap/react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SectionAnchor } from '../../components/shared/SectionAnchor';
import { COPY } from '../../utils/constants';
import ShredderCanvas from './ShredderCanvas';
import styles from './Shredder.module.css';

gsap.registerPlugin(ScrollTrigger);

function Shredder() {
  const sectionRef = useRef<HTMLElement>(null);
  const machineRef = useRef<HTMLDivElement>(null);
  const headlineRef = useRef<HTMLHeadingElement>(null);
  const subtextRef = useRef<HTMLParagraphElement>(null);
  const businessmanRef = useRef<HTMLDivElement>(null);
  const [powered, setPowered] = useState(false);
  const [imageMissing, setImageMissing] = useState(false);
  const stripMotion = useMemo(
    () =>
      Array.from({ length: 17 }, (_, index) => ({
        index,
        shiftX: `${((index % 2 === 0 ? -1 : 1) * (0.6 + (index % 5) * 0.22)).toFixed(2)}vw`,
        shiftY: `${(3.4 + (index % 4) * 1.6).toFixed(2)}vh`,
        tilt: `${((index % 3) - 1) * (0.7 + index * 0.05)}deg`,
      })),
    [],
  );

  useGSAP(
    () => {
      const section = sectionRef.current;
      if (!section || !machineRef.current || !headlineRef.current || !subtextRef.current) {
        return;
      }

      section.style.setProperty('--shred-progress', '0');

      gsap.to(machineRef.current, {
        y: 2,
        duration: 1.8,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut',
      });

      gsap.fromTo(
        [headlineRef.current, subtextRef.current],
        { opacity: 0, y: 28 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          ease: 'power3.out',
          stagger: 0.08,
          scrollTrigger: {
            trigger: section,
            start: 'top 78%',
            toggleActions: 'play none none reverse',
          },
        },
      );

      if (businessmanRef.current) {
        gsap.fromTo(
          businessmanRef.current,
          { opacity: 0, x: 80 },
          {
            opacity: 1,
            x: 0,
            duration: 0.85,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: section,
              start: 'top 72%',
              toggleActions: 'play none none reverse',
            },
          },
        );
      }

      const trigger = ScrollTrigger.create({
        trigger: section,
        start: 'top top',
        end: '+=200%',
        pin: true,
        anticipatePin: 1,
        onUpdate: (self) => {
          section.style.setProperty('--shred-progress', self.progress.toFixed(4));
          setPowered(self.progress > 0.2);
        },
        onLeaveBack: () => {
          section.style.setProperty('--shred-progress', '0');
          setPowered(false);
        },
      });

      return () => {
        trigger.kill();
      };
    },
    { scope: sectionRef },
  );

  return (
    <section id="section-shredder" ref={sectionRef} className={styles.section}>
      <SectionAnchor id="shredder" threshold={0.2} />

      <div className={styles.darkRise} aria-hidden="true" />

      <div className={styles.paperWorld} aria-hidden="true">
        <div className={styles.paperSheet}>
          <div className={styles.paperHeader}>
            <span>SHADER CORPORATE BROCHURE</span>
            <span>VERSION 1.02</span>
          </div>

          <div className={styles.paperColumns}>
            {['Studio', 'Capabilities', 'Delivery'].map((label) => (
              <div key={label} className={styles.paperColumn}>
                <span className={styles.paperLabel}>{label}</span>
                {Array.from({ length: 8 }).map((_, line) => (
                  <span
                    key={`${label}-${line}`}
                    className={styles.paperLine}
                    style={{ '--line-width': `${78 - line * 6}%` } as CSSProperties}
                  />
                ))}
              </div>
            ))}
          </div>
        </div>

        <div className={styles.outputField}>
          {stripMotion.map((strip) => (
            <span
              key={strip.index}
              className={styles.outputStrip}
              style={
                {
                  '--strip-index': strip.index,
                  '--shift-x': strip.shiftX,
                  '--shift-y': strip.shiftY,
                  '--tilt': strip.tilt,
                } as CSSProperties
              }
            />
          ))}
        </div>
      </div>

      <div className={styles.content}>
        <h2 ref={headlineRef} className={styles.headline}>
          {COPY.shredder.headline}
        </h2>
        <p ref={subtextRef} className={styles.subtext}>
          {COPY.shredder.subtext}
        </p>
      </div>

      <div ref={businessmanRef} className={styles.businessman} aria-hidden="true">
        {!imageMissing ? (
          <img
            src="/images/businessman-shrug.png"
            alt=""
            className={styles.businessmanImage}
            loading="lazy"
            decoding="async"
            onError={() => setImageMissing(true)}
          />
        ) : null}
        <div className={styles.businessmanFallback} hidden={!imageMissing}>
          <span className={styles.armLeft} />
          <span className={styles.armRight} />
        </div>
      </div>

      <div
        ref={machineRef}
        className={`${styles.machineFrame} ${powered ? styles.machineFrameActive : ''}`}
      >
        <div className={styles.machineBackdrop} aria-hidden="true">
          <span className={`${styles.machineWing} ${styles.machineWingLeft}`} />
          <span className={styles.machineCore} />
          <span className={`${styles.machineWing} ${styles.machineWingRight}`} />
          <span className={styles.machineSlot} />
        </div>
        <ShredderCanvas active={powered} />
        <div className={styles.slotGlow} aria-hidden="true" />
        <div className={styles.labelBadge} aria-hidden="true">
          <span className={styles.badgeIcon} />
          <span>SHREDDER</span>
        </div>
      </div>
    </section>
  );
}

export default Shredder;
