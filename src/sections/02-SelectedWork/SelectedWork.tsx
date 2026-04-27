import { useRef, useState } from 'react';
import { useGSAP } from '@gsap/react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import FilmStrip from './FilmStrip';
import { SectionAnchor } from '../../components/shared/SectionAnchor';
import { COPY, PROJECTS } from '../../utils/constants';
import styles from './SelectedWork.module.css';

gsap.registerPlugin(ScrollTrigger);

function SelectedWork() {
  const sectionRef = useRef<HTMLElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const stripRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<ScrollTrigger | null>(null);
  const frameProgressRef = useRef<number[]>([]);
  const [activeIndex, setActiveIndex] = useState(0);

  useGSAP(
    () => {
      const section = sectionRef.current;
      const strip = stripRef.current;
      const wrapper = wrapperRef.current;
      if (!section || !strip || !wrapper) {
        return;
      }

      const init = () => {
        let totalX = strip.scrollWidth - window.innerWidth;
        if (totalX <= 0) {
          return;
        }

        const updateFrameProgresses = () => {
          totalX = strip.scrollWidth - window.innerWidth;
          const frames = Array.from(
            strip.querySelectorAll<HTMLElement>('[data-project-frame="true"]'),
          );

          frameProgressRef.current = frames.map((frame) => {
            const centerOffset =
              frame.offsetLeft + frame.offsetWidth / 2 - window.innerWidth / 2;

            return totalX > 0 ? gsap.utils.clamp(0, totalX, centerOffset) / totalX : 0;
          });
        };

        updateFrameProgresses();

        const tween = gsap.to(strip, {
          x: () => -(strip.scrollWidth - window.innerWidth),
          ease: 'none',
          scrollTrigger: {
            trigger: section,
            start: 'top top',
            end: () => `+=${totalX + window.innerWidth * 0.5}`,
            pin: true,
            scrub: 1.5,
            anticipatePin: 1,
            invalidateOnRefresh: true,
            onRefresh: updateFrameProgresses,
            onUpdate: (self) => {
              const frameProgresses = frameProgressRef.current;
              const index = frameProgresses.reduce(
                (closestIndex, progress, currentIndex) => {
                  const closestDistance = Math.abs(
                    frameProgresses[closestIndex] - self.progress,
                  );
                  const currentDistance = Math.abs(progress - self.progress);

                  return currentDistance < closestDistance
                    ? currentIndex
                    : closestIndex;
                },
                0,
              );
              setActiveIndex(index);
            },
          },
        });

        triggerRef.current = tween.scrollTrigger ?? null;

        gsap.fromTo(
          wrapper,
          { scale: 0.6, opacity: 0 },
          {
            scale: 1,
            opacity: 1,
            scrollTrigger: {
              trigger: section,
              start: 'top 90%',
              end: 'top 20%',
              scrub: true,
            },
          },
        );

        if (headerRef.current) {
          gsap.to(headerRef.current, {
            opacity: 0,
            y: -24,
            ease: 'none',
            scrollTrigger: {
              trigger: section,
              start: 'top top',
              end: '+=20%',
              scrub: true,
            },
          });
        }
      };

      const raf = requestAnimationFrame(init);

      return () => {
        cancelAnimationFrame(raf);
        triggerRef.current?.kill();
      };
    },
    { scope: sectionRef },
  );

  const goTo = (targetIndex: number) => {
    const trigger = triggerRef.current;
    const frameProgresses = frameProgressRef.current;
    if (!trigger || frameProgresses.length === 0) {
      return;
    }

    const clampedIndex = Math.max(0, Math.min(PROJECTS.length - 1, targetIndex));
    const progress = frameProgresses[clampedIndex] ?? 0;
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
        <p className={styles.projectCategory}>
          <span>{activeProject.category}</span>
          <a
            href={activeProject.url}
            className={styles.viewLink}
            target="_blank"
            rel="noopener noreferrer"
          >
            View project →
          </a>
        </p>
      </div>

      <div ref={wrapperRef} className={styles.stripShell}>
        <FilmStrip
          projects={PROJECTS}
          activeIndex={activeIndex}
          stripRef={stripRef}
        />
      </div>

      <div className={styles.nav}>
        <button
          type="button"
          className={styles.navBtn}
          onClick={() => goTo(activeIndex - 1)}
          disabled={activeIndex === 0}
          aria-label="Previous project"
        >
          ←
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
          →
        </button>
      </div>
    </section>
  );
}

export default SelectedWork;
