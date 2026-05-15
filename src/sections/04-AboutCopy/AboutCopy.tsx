import { useRef } from 'react';
import { useGSAP } from '@gsap/react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { CONTACT, COPY } from '../../utils/constants';
import { SectionAnchor } from '../../components/shared/SectionAnchor';
import styles from './AboutCopy.module.css';

gsap.registerPlugin(ScrollTrigger);

function ExternalLinkIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      <path
        d="M8 16L16 8M11 8H16V13M7.4 4.5H5.8C4.8 4.5 4 5.3 4 6.3V18.2C4 19.2 4.8 20 5.8 20H17.7C18.7 20 19.5 19.2 19.5 18.2V16.6"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function AboutCopy() {
  const sectionRef = useRef<HTMLElement>(null);
  const copyRef = useRef<HTMLDivElement>(null);
  const couponRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      if (!sectionRef.current || !copyRef.current || !couponRef.current) {
        return;
      }

      gsap.fromTo(
        [copyRef.current, couponRef.current],
        { opacity: 0, y: 28 },
        {
          opacity: 1,
          y: 0,
          duration: 0.7,
          stagger: 0.12,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 70%',
            toggleActions: 'play none none reverse',
          },
        },
      );
    },
    { scope: sectionRef },
  );

  return (
    <section id="section-business" ref={sectionRef} className={styles.section}>
      <SectionAnchor id="business" threshold={0.35} />
      <div className={styles.paperTexture} aria-hidden="true" />

      <div className={styles.container}>
        <div ref={copyRef} className={styles.copyColumn}>
          <h2>{COPY.business.headline}</h2>
          <div className={styles.bodyCopy}>
            <p>{COPY.business.col1}</p>
            <p>{COPY.business.col2}</p>
          </div>
        </div>

        <div ref={couponRef} className={styles.coupon} aria-label="Contact Mohamed Hassoun">
          <img src="/textures/scissors.png" alt="" className={styles.scissors} aria-hidden="true" />
          <div className={styles.couponHeader}>
            <p>Available for</p>
            <h3>Freelance Builds.</h3>
          </div>

          <div className={styles.emailLine}>
            <span>Email:</span>
            <a href={`mailto:${CONTACT.email}`}>{CONTACT.email}</a>
          </div>

          <a
            href={CONTACT.social.github}
            className={styles.bookButton}
            target="_blank"
            rel="noopener noreferrer"
          >
            <ExternalLinkIcon />
            <span>Open GitHub</span>
          </a>
        </div>
      </div>
    </section>
  );
}

export default AboutCopy;
