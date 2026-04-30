import { useEffect, useMemo, useRef, useState } from 'react';
import { useGSAP } from '@gsap/react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SectionAnchor } from '../../components/shared/SectionAnchor';
import { COPY } from '../../utils/constants';
import styles from './ContactTease.module.css';

gsap.registerPlugin(ScrollTrigger);

const GLITCH_CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789#$%&?';

function scrambleLine(line: string, resolveProgress: number) {
  return line
    .split('')
    .map((char, index) => {
      if (char === ' ') {
        return char;
      }

      const characterProgress = (index + 1) / line.length;
      if (characterProgress < resolveProgress) {
        return char;
      }

      return GLITCH_CHARS[Math.floor(Math.random() * GLITCH_CHARS.length)];
    })
    .join('');
}

function ContactTease() {
  const sectionRef = useRef<HTMLElement>(null);
  const headlineRef = useRef<HTMLHeadingElement>(null);
  const subtextRef = useRef<HTMLParagraphElement>(null);
  const finalLines = useMemo(() => [...COPY.contactTease.headlineLines], []);
  const [displayLines, setDisplayLines] = useState<string[]>(finalLines);

  useGSAP(
    () => {
      if (!sectionRef.current || !headlineRef.current || !subtextRef.current) {
        return;
      }

      gsap.fromTo(
        [headlineRef.current, subtextRef.current],
        { opacity: 0, y: 24, filter: 'blur(3px)' },
        {
          opacity: 1,
          y: 0,
          filter: 'blur(0px)',
          duration: 0.58,
          stagger: 0.12,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 68%',
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

    let interval = 0;
    let timeout = 0;

    const runGlitch = () => {
      window.clearInterval(interval);
      window.clearTimeout(timeout);

      const started = performance.now();
      interval = window.setInterval(() => {
        const elapsed = performance.now() - started;
        const progress = Math.min(1, elapsed / 760);
        const resolveProgress = Math.max(0, (progress - 0.2) / 0.8);

        setDisplayLines(finalLines.map((line) => scrambleLine(line, resolveProgress)));
      }, 42);

      timeout = window.setTimeout(() => {
        window.clearInterval(interval);
        setDisplayLines(finalLines);
      }, 820);
    };

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          runGlitch();
        }
      },
      { threshold: 0.42 },
    );

    observer.observe(section);

    return () => {
      observer.disconnect();
      window.clearInterval(interval);
      window.clearTimeout(timeout);
    };
  }, [finalLines]);

  return (
    <section id="section-contact-tease" ref={sectionRef} className={styles.section}>
      <SectionAnchor id="contact-tease" threshold={0.35} />
      <div className={styles.vignette} aria-hidden="true" />

      <div className={styles.content}>
        <h2
          ref={headlineRef}
          className={styles.headline}
          aria-label={finalLines.join(' ')}
        >
          {displayLines.map((line, lineIndex) => (
            <span key={lineIndex} className={styles.line}>
              {line}
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
