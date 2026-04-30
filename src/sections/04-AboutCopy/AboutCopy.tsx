import { useRef } from 'react';
import { useGSAP } from '@gsap/react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { CONTACT, COPY } from '../../utils/constants';
import { SectionAnchor } from '../../components/shared/SectionAnchor';
import styles from './AboutCopy.module.css';

gsap.registerPlugin(ScrollTrigger);

function PhoneIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      <path
        d="M7.6 3.5c.4-.4 1-.5 1.5-.2l2.1 1.2c.6.3.8 1 .6 1.6L11 8.4c-.1.4 0 .8.3 1.1l3.2 3.2c.3.3.7.4 1.1.3l2.3-.9c.6-.2 1.3 0 1.6.6l1.2 2.1c.3.5.2 1.1-.2 1.5l-1.7 1.7c-.7.7-1.7 1-2.7.8-2.7-.6-5.6-2.6-8.1-5.1S3.4 8.6 2.8 5.9c-.2-1 .1-2 .8-2.7z"
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

        <div ref={couponRef} className={styles.coupon} aria-label="Book a Consultation coupon">
          <img src="/textures/scissors.png" alt="" className={styles.scissors} aria-hidden="true" />
          <div className={styles.couponHeader}>
            <p>Act now!</p>
            <h3>Book a Consultation.</h3>
          </div>

          <label className={styles.emailLine}>
            <span>Email:</span>
            <input type="email" aria-label="Email" />
          </label>

          <a
            href={CONTACT.calUrl}
            className={styles.bookButton}
            target="_blank"
            rel="noopener noreferrer"
          >
            <PhoneIcon />
            <span>Book a Call Today</span>
          </a>
        </div>
      </div>
    </section>
  );
}

export default AboutCopy;
