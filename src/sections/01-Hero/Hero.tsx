import { useEffect, useRef, useState } from 'react';
import { useGSAP } from '@gsap/react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import HeroScene from './HeroScene';
import { SectionAnchor } from '../../components/shared/SectionAnchor';
import { COPY, FEATURES } from '../../utils/constants';
import { prefersReducedMotion } from '../../utils/motion';
import { heroSceneQuality, isLowPerformanceDevice } from '../../utils/performance';
import styles from './Hero.module.css';

gsap.registerPlugin(ScrollTrigger);

function ScrollArrowIcon() {
  return (
    <svg
      className={styles.icon}
      viewBox="0 0 16 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M8 3V18M8 18L3 13M8 18L13 13"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function Hero() {
  const containerRef = useRef<HTMLElement>(null);
  const viewportRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const ctaRef = useRef<HTMLParagraphElement>(null);
  const linesRef = useRef<HTMLSpanElement[]>([]);
  const [isSceneVisible, setIsSceneVisible] = useState(true);

  useEffect(() => {
    const section = containerRef.current;
    if (!section) {
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsSceneVisible(entry.isIntersecting);
      },
      {
        threshold: 0.02,
        rootMargin: '24% 0px 24% 0px',
      },
    );

    observer.observe(section);
    return () => observer.disconnect();
  }, []);

  useGSAP(
    () => {
      const lines = linesRef.current.filter(Boolean);
      const section = containerRef.current;
      const viewport = viewportRef.current;

      if (!section || !viewport || !textRef.current || !ctaRef.current || lines.length === 0) {
        return;
      }

      ScrollTrigger.create({
        trigger: section,
        start: 'top top',
        end: 'bottom bottom',
        pin: viewport,
        pinSpacing: false,
        anticipatePin: 1,
      });

      if (prefersReducedMotion) {
        gsap.set(lines, { x: 0, opacity: 1, filter: 'blur(0px)' });
        gsap.set(ctaRef.current, { opacity: 1, y: 0 });
        return;
      }

      gsap.set(lines, { x: -28, opacity: 0, filter: 'blur(12px)' });
      gsap.set(ctaRef.current, { opacity: 0, y: 16 });

      gsap
        .timeline({ delay: 0.3 })
        .to(lines, {
          x: 0,
          opacity: 1,
          filter: 'blur(0px)',
          duration: 0.82,
          stagger: 0.08,
          ease: 'power3.out',
        })
        .to(
          ctaRef.current,
          {
            opacity: 1,
            y: 0,
            duration: 0.6,
            ease: 'power2.out',
          },
          '-=0.18',
        );

      gsap.to(textRef.current, {
        yPercent: -32,
        opacity: 0,
        ease: 'none',
        scrollTrigger: {
          trigger: section,
          start: 'top top',
          end: '45% top',
          scrub: true,
        },
      });
    },
    { scope: containerRef },
  );

  return (
    <section
      id="section-hero"
      ref={containerRef}
      className={`${styles.hero} ${isLowPerformanceDevice ? styles.heroLowPower : ''}`}
    >
      <SectionAnchor id="home" threshold={0.3} />
      <div className={styles.heroViewport} ref={viewportRef}>
        <div className={styles.scene3d} aria-hidden="true">
          {FEATURES.enable3D && isSceneVisible ? <HeroScene quality={heroSceneQuality} /> : null}
        </div>

        <div className={styles.vignette} aria-hidden="true" />
        <div className={styles.fogLeft} aria-hidden="true" />
        <div className={styles.fogBloom} aria-hidden="true" />
        <div className={styles.fogBottom} aria-hidden="true" />

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
              <ScrollArrowIcon />
              <ScrollArrowIcon />
              <ScrollArrowIcon />
            </span>
          </p>
        </div>
      </div>
    </section>
  );
}

export default Hero;
