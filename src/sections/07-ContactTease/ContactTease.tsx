import { useEffect, useMemo, useRef } from 'react';
import { useGSAP } from '@gsap/react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SectionAnchor } from '../../components/shared/SectionAnchor';
import { COPY } from '../../utils/constants';
import styles from './ContactTease.module.css';

gsap.registerPlugin(ScrollTrigger);

function ContactTease() {
  const sectionRef = useRef<HTMLElement>(null);
  const subtextRef = useRef<HTMLParagraphElement>(null);
  const starRefs = useRef<Array<HTMLDivElement | null>>([]);
  const headlineLines = useMemo(
    () => COPY.contactTease.headlineLines.map((line) => line.split(' ')),
    [],
  );

  useGSAP(
    () => {
      const section = sectionRef.current;
      if (!section || !subtextRef.current) {
        return;
      }

      const words = section.querySelectorAll('[data-contact-word="true"]');

      gsap.fromTo(
        words,
        { opacity: 0, y: 40 },
        {
          opacity: 1,
          y: 0,
          duration: 0.7,
          ease: 'power3.out',
          stagger: 0.06,
          scrollTrigger: {
            trigger: section,
            start: 'top 70%',
            toggleActions: 'play none none reverse',
          },
        },
      );

      gsap.fromTo(
        subtextRef.current,
        { opacity: 0, y: 22 },
        {
          opacity: 1,
          y: 0,
          duration: 0.7,
          ease: 'power3.out',
          delay: 0.2,
          scrollTrigger: {
            trigger: section,
            start: 'top 66%',
            toggleActions: 'play none none reverse',
          },
        },
      );
    },
    { scope: sectionRef },
  );

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) {
      return;
    }

    const stars = starRefs.current.filter(Boolean) as HTMLDivElement[];
    const animations: gsap.core.Timeline[] = [];
    let cancelled = false;

    const spawnStar = (star: HTMLDivElement) => {
      if (cancelled) {
        return;
      }

      const width = section.clientWidth;
      const height = section.clientHeight;
      const isMobile = window.innerWidth < 768;
      const size = gsap.utils.random(isMobile ? 30 : 42, isMobile ? 54 : 84);
      const startX = gsap.utils.random(width * 0.12, width * 0.88);
      const startY = gsap.utils.random(height * 0.28, height * 0.78);
      const driftX = gsap.utils.random(-190, 190);
      const driftY = gsap.utils.random(-180, 60);
      const rotation = gsap.utils.random(-160, 160);

      gsap.set(star, {
        width: size,
        height: size,
        x: startX,
        y: startY,
        opacity: 0,
        rotation: gsap.utils.random(0, 360),
        scale: gsap.utils.random(0.55, 1.35),
      });

      const timeline = gsap.timeline({
        delay: gsap.utils.random(0, 1.2),
        onComplete: () => spawnStar(star),
      });

      timeline
        .to(star, { opacity: 0.95, duration: 0.55, ease: 'sine.out' })
        .to(
          star,
          {
            x: startX + driftX,
            y: startY + driftY,
            rotation: `+=${rotation}`,
            duration: gsap.utils.random(3.2, 5.2),
            ease: 'sine.inOut',
          },
          0,
        )
        .to(star, { opacity: 0, duration: 0.75, ease: 'sine.in' }, '>-0.7');

      animations.push(timeline);
    };

    stars.forEach((star) => spawnStar(star));

    return () => {
      cancelled = true;
      animations.forEach((animation) => animation.kill());
    };
  }, []);

  return (
    <section id="section-contact-tease" ref={sectionRef} className={styles.section}>
      <SectionAnchor id="contact" threshold={0.35} />
      <div className={styles.vignette} />

      <div className={styles.stars}>
        {Array.from({ length: 7 }).map((_, index) => (
          <div
            key={index}
            ref={(node) => {
              starRefs.current[index] = node;
            }}
            className={styles.star}
          >
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <defs>
                <linearGradient id={`goldGradient-${index}`} x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#ffd700" />
                  <stop offset="50%" stopColor="#c9a84c" />
                  <stop offset="100%" stopColor="#8b6914" />
                </linearGradient>
              </defs>
              <path
                fill={`url(#goldGradient-${index})`}
                d="M12 0l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 16.74l-6.18 3.28L7 14.14l-5-4.87 6.91-3.01L12 0z"
              />
            </svg>
          </div>
        ))}
      </div>

      <div className={styles.content}>
        <h2 className={styles.headline}>
          {headlineLines.map((line, lineIndex) => (
            <span key={lineIndex} className={styles.line}>
              {line.map((word) => (
                <span
                  key={`${lineIndex}-${word}`}
                  className={styles.word}
                  data-contact-word="true"
                >
                  {word}
                </span>
              ))}
            </span>
          ))}
        </h2>

        <p ref={subtextRef} className={styles.subtext}>
          {COPY.contactTease.subtext}
        </p>
      </div>
    </section>
  );
}

export default ContactTease;
