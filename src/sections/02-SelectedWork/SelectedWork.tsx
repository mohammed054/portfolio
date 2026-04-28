import { useRef, useState } from 'react';
import { useGSAP } from '@gsap/react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import FilmStrip from './FilmStrip';
import { SectionAnchor } from '../../components/shared/SectionAnchor';
import { COPY, PROJECTS } from '../../utils/constants';
import styles from './SelectedWork.module.css';

gsap.registerPlugin(ScrollTrigger);

function ArrowIcon({ direction }: { direction: 'left' | 'right' }) {
  const rotation = direction === 'left' ? 'rotate(180 12 12)' : undefined;

  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <g transform={rotation}>
        <path
          d="M5 12H18M18 12L12.6 6.6M18 12L12.6 17.4"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </g>
    </svg>
  );
}

function SelectedWork() {
  const sectionRef = useRef<HTMLElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<ScrollTrigger | null>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  useGSAP(
    () => {
      const section = sectionRef.current;
      if (!section) {
        return;
      }

      const totalSteps = Math.max(1, PROJECTS.length - 1);
      const scrollDistance = window.innerHeight * (totalSteps * 0.72 + 1.12);

      triggerRef.current = ScrollTrigger.create({
        trigger: section,
        start: 'top top',
        end: `+=${scrollDistance}`,
        pin: true,
        scrub: 1.2,
        anticipatePin: 1,
        invalidateOnRefresh: true,
        onUpdate: (self) => {
          const nextIndex = gsap.utils.clamp(
            0,
            PROJECTS.length - 1,
            Math.round(self.progress * totalSteps),
          );
          setActiveIndex(nextIndex);
        },
      });

      if (headerRef.current) {
        gsap.fromTo(
          headerRef.current,
          { opacity: 0, y: 24 },
          { opacity: 1, y: 0, duration: 0.8, ease: 'power2.out' },
        );

        gsap.to(headerRef.current, {
          opacity: 0,
          y: -22,
          ease: 'none',
          scrollTrigger: {
            trigger: section,
            start: 'top top',
            end: '+=18%',
            scrub: true,
          },
        });
      }

      return () => {
        triggerRef.current?.kill();
      };
    },
    { scope: sectionRef },
  );

  const goTo = (targetIndex: number) => {
    const trigger = triggerRef.current;
    if (!trigger) {
      return;
    }

    const clampedIndex = Math.max(0, Math.min(PROJECTS.length - 1, targetIndex));
    const totalSteps = Math.max(1, PROJECTS.length - 1);
    const progress = clampedIndex / totalSteps;
    const scrollY = trigger.start + progress * (trigger.end - trigger.start);

    setActiveIndex(clampedIndex);

    gsap.to(window, {
      duration: 0.6,
      ease: 'power3.inOut',
      scrollTo: {
        y: scrollY,
        autoKill: false,
      },
    });
  };

  const activeProject = PROJECTS[activeIndex] ?? PROJECTS[0];

  return (
    <section id="section-work" ref={sectionRef} className={styles.section}>
      <SectionAnchor id="work" threshold={0.2} />

      <div ref={headerRef} className={styles.sectionHeader}>
        <h2 className={styles.sectionTitle}>{COPY.selectedWork.title}</h2>
        <p className={styles.sectionSubtitle}>{COPY.selectedWork.subtitle}</p>
      </div>

      <div className={styles.meta} aria-live="polite">
        <h3 className={styles.projectName}>{activeProject.name}</h3>
        <p className={styles.projectMetaRow}>
          <span>{activeProject.category}</span>
          <span className={styles.separator} aria-hidden="true" />
          <a
            href={activeProject.url}
            className={styles.viewLink}
            target="_blank"
            rel="noopener noreferrer"
          >
            View project
          </a>
        </p>
      </div>

      <div className={styles.stripShell}>
        <FilmStrip projects={PROJECTS} activeIndex={activeIndex} />
      </div>

      <div className={styles.nav}>
        <button
          type="button"
          className={styles.navBtn}
          onClick={() => goTo(activeIndex - 1)}
          disabled={activeIndex === 0}
          aria-label="Previous project"
        >
          <ArrowIcon direction="left" />
        </button>

        <div className={styles.dots} role="tablist" aria-label="Project pagination">
          {PROJECTS.map((project, index) => (
            <button
              key={project.id}
              type="button"
              className={`${styles.dot} ${index === activeIndex ? styles.dotActive : ''}`}
              role="tab"
              aria-selected={index === activeIndex}
              aria-label={`Go to ${project.name}`}
              onClick={() => goTo(index)}
            />
          ))}
        </div>

        <button
          type="button"
          className={styles.navBtn}
          onClick={() => goTo(activeIndex + 1)}
          disabled={activeIndex === PROJECTS.length - 1}
          aria-label="Next project"
        >
          <ArrowIcon direction="right" />
        </button>
      </div>
    </section>
  );
}

export default SelectedWork;
