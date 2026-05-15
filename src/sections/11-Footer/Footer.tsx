import { useRef } from 'react';
import { useGSAP } from '@gsap/react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SectionAnchor } from '../../components/shared/SectionAnchor';
import { CONTACT, COPY } from '../../utils/constants';
import { prefersReducedMotion } from '../../utils/motion';
import styles from './Footer.module.css';

gsap.registerPlugin(ScrollTrigger);

function GlobeIcon() {
  return (
    <svg viewBox="0 0 48 48" aria-hidden="true">
      <circle cx="24" cy="24" r="18.5" />
      <ellipse cx="24" cy="24" rx="18.5" ry="8" />
      <ellipse cx="24" cy="24" rx="18.5" ry="13" />
      <line x1="24" y1="5.5" x2="24" y2="42.5" />
      <ellipse cx="24" cy="24" rx="7.8" ry="18.5" />
    </svg>
  );
}

function Laurel({ mirrored = false }: { mirrored?: boolean }) {
  return (
    <svg
      viewBox="0 0 30 52"
      aria-hidden="true"
      className={mirrored ? styles.laurelRight : styles.laurelLeft}
    >
      <path d="M21.5 46C13 39.5 8.5 31.4 8 21.7C7.6 13.4 11 6.8 18.3 3.8" />
      <path d="M18.3 38.3C12.4 36.9 8.8 33.9 7.4 29.2" />
      <path d="M15.5 30.3C10 28.8 6.8 25.6 5.8 20.6" />
      <path d="M14.7 21.8C9.7 20.3 6.8 17.1 6.2 12.6" />
      <path d="M17.2 13.3C13 11.9 10.5 9.2 10 5.3" />
    </svg>
  );
}

function Footer() {
  const sectionRef = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      if (!sectionRef.current) {
        return;
      }

      const columns = sectionRef.current.querySelectorAll('[data-footer-col]');
      const card = sectionRef.current.querySelector(`.${styles.ceoCard}`);
      const footerBar = sectionRef.current.querySelectorAll('[data-footer-bar]');

      if (prefersReducedMotion) {
        gsap.set([columns, card, footerBar], { opacity: 1, y: 0, scale: 1, x: 0 });
        return;
      }

      gsap.fromTo(
        columns,
        { opacity: 0, y: 20 },
        {
          opacity: 1,
          y: 0,
          duration: 0.55,
          stagger: 0.1,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 78%',
            toggleActions: 'play none none reverse',
          },
        },
      );

      if (card) {
        gsap.fromTo(
          card,
          { opacity: 0, scale: 0.96, y: 24 },
          {
            opacity: 1,
            scale: 1,
            y: 0,
            duration: 0.65,
            ease: 'back.out(1.18)',
            scrollTrigger: {
              trigger: card,
              start: 'top 84%',
              toggleActions: 'play none none reverse',
            },
          },
        );
      }

      gsap.fromTo(
        footerBar,
        { opacity: 0, y: 18 },
        {
          opacity: 1,
          y: 0,
          duration: 0.55,
          stagger: 0.1,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 62%',
            toggleActions: 'play none none reverse',
          },
        },
      );
    },
    { scope: sectionRef },
  );

  return (
    <footer id="section-contact" ref={sectionRef} className={styles.footer}>
      <SectionAnchor id="contact" threshold={0.25} />

      <div className={styles.intro}>
        <h2 className={styles.heading}>{COPY.contact.headline}</h2>
        <p className={styles.subheading}>{COPY.contact.subtext}</p>
      </div>

      <div className={styles.contactGrid}>
        <div className={styles.column} data-footer-col>
          <h3>Email</h3>
          <p>
            <a href={`mailto:${CONTACT.email}`}>{CONTACT.email}</a>
          </p>
          <p>
            <a href={CONTACT.calUrl}>
              Start a project inquiry
            </a>
          </p>
        </div>

        <div className={styles.column} data-footer-col>
          <h3>Location</h3>
          <p>{CONTACT.address.street}</p>
          <p>{CONTACT.address.city}</p>
          <p>{CONTACT.address.country}</p>
        </div>

        <div className={styles.column} data-footer-col>
          <h3>Code</h3>
          <p>
            <a href={CONTACT.social.github} target="_blank" rel="noopener noreferrer">
              GitHub
            </a>
          </p>
          <p>
            <a href="https://github.com/mohammed054/portfolio" target="_blank" rel="noopener noreferrer">
              This portfolio repo
            </a>
          </p>
          <p>
            <span>mohammed054</span>
          </p>
        </div>
      </div>

      <div className={styles.ceoCard}>
        <div className={styles.ceoVisual} aria-hidden="true">
          <div className={styles.profileMonogram}>MH</div>
        </div>

        <div className={styles.ceoText}>
          <h4>{COPY.contact.ceoHeading}</h4>
          <p>
            {COPY.contact.ceoCopy}{' '}
            <a href={`mailto:${CONTACT.ceoEmail}`}>{CONTACT.ceoEmail}</a>
          </p>
        </div>
      </div>

      <div className={styles.footerBar}>
        <div className={styles.badge} data-footer-bar>
          <div className={styles.iconWrap}>
            <GlobeIcon />
          </div>
          <p>REMOTE-FRIENDLY SOFTWARE DEVELOPMENT</p>
        </div>

        <div className={styles.center} data-footer-bar>
          <div className={styles.logo}>
            <svg viewBox="0 0 56 36" fill="none" aria-hidden="true">
              <rect x="0" y="1" width="40" height="4" fill="var(--color-rainbow-1)" />
              <rect x="0" y="7" width="40" height="4" fill="var(--color-rainbow-2)" />
              <rect x="0" y="13" width="40" height="4" fill="var(--color-rainbow-3)" />
              <rect x="0" y="19" width="40" height="4" fill="var(--color-rainbow-4)" />
              <rect x="0" y="25" width="40" height="4" fill="var(--color-rainbow-5)" />
            </svg>
            <span>HASSOUN</span>
          </div>
          <p className={styles.tagline}>{CONTACT.tagline}</p>
          <p className={styles.copyright}>{CONTACT.copyright}</p>
        </div>

        <div className={styles.badge} data-footer-bar>
          <div className={styles.accessibilityMark}>
            <Laurel />
            <a href="/accessibility-statement">READ OUR ACCESSIBILITY STATEMENT</a>
            <Laurel mirrored />
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
