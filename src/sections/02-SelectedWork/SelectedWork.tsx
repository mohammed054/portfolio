import { useRef, useState } from 'react';
import { useGSAP } from '@gsap/react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import FilmStrip from './FilmStrip';
import { SectionAnchor } from '../../components/shared/SectionAnchor';
import { PROJECTS } from '../../utils/constants';
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
  const stageRef = useRef<HTMLDivElement>(null);
  const viewportRef = useRef<HTMLDivElement | null>(null);
  const trackRef = useRef<HTMLDivElement | null>(null);
  const frameRefs = useRef<Array<HTMLElement | null>>([]);
  const triggerRef = useRef<ScrollTrigger | null>(null);
  const activeIndexRef = useRef(0);
  const positionRef = useRef(0);
  const [activeIndex, setActiveIndex] = useState(0);

  useGSAP(
    () => {
      const section = sectionRef.current;
      const stage = stageRef.current;
      const viewport = viewportRef.current;
      const track = trackRef.current;
      const frames = frameRefs.current.filter(Boolean) as HTMLElement[];

      if (!section || !stage || !viewport || !track || frames.length === 0) {
        return;
      }

      const exposureElements = frames.map((frame) =>
        frame.querySelector<HTMLElement>('[class*="exposure"]'),
      );
      const setTrackX = gsap.quickSetter(track, 'x', 'px');

      const getCenterOffsets = () => {
        const viewportCenter = viewport.clientWidth * 0.5;
        return frames.map(
          (frame) => viewportCenter - (frame.offsetLeft + frame.offsetWidth * 0.5),
        );
      };

      const applyPosition = (rawPosition: number, centerOffsets: number[]) => {
        const lowerIndex = Math.floor(rawPosition);
        const upperIndex = Math.min(PROJECTS.length - 1, Math.ceil(rawPosition));
        const mix = rawPosition - lowerIndex;
        const nextX = gsap.utils.interpolate(
          centerOffsets[lowerIndex] ?? 0,
          centerOffsets[upperIndex] ?? 0,
          mix,
        );

        setTrackX(nextX);

        frames.forEach((frame, index) => {
          const offset = index - rawPosition;
          const distance = Math.abs(offset);
          const scale = gsap.utils.clamp(0.74, 1 - distance * 0.16, 1);
          const y = Math.min(148, distance * 26);
          const rotationY = gsap.utils.clamp(-54, offset * -18, 54);
          const z = -Math.min(420, Math.pow(distance, 1.14) * 140);
          const opacity = gsap.utils.clamp(0.18, 1 - distance * 0.24, 1);

          gsap.set(frame, {
            y,
            z,
            rotationY,
            scale,
            opacity,
            zIndex: 200 - Math.round(distance * 10),
            transformPerspective: 2000,
          });

          const exposure = exposureElements[index];
          if (exposure) {
            const brightness = Math.max(0.68, 1.08 - distance * 0.14);
            const saturation = Math.max(0.78, 1 - distance * 0.06);
            exposure.style.filter = `brightness(${brightness}) saturate(${saturation}) contrast(1.04)`;
          }
        });

        const nextIndex = gsap.utils.clamp(
          0,
          PROJECTS.length - 1,
          Math.round(rawPosition),
        );

        if (nextIndex !== activeIndexRef.current) {
          activeIndexRef.current = nextIndex;
          setActiveIndex(nextIndex);
        }
      };

      let centerOffsets = getCenterOffsets();
      applyPosition(0, centerOffsets);

      const scrollDistance =
        Math.abs(centerOffsets[0] - centerOffsets[centerOffsets.length - 1]) +
        window.innerHeight * 2.2;

      triggerRef.current = ScrollTrigger.create({
        trigger: section,
        start: 'top top',
        end: `+=${scrollDistance}`,
        pin: true,
        scrub: 1.2,
        anticipatePin: 1,
        invalidateOnRefresh: true,
        onRefresh: () => {
          centerOffsets = getCenterOffsets();
          applyPosition(positionRef.current, centerOffsets);
        },
        onUpdate: (self) => {
          positionRef.current = self.progress * (PROJECTS.length - 1);
          applyPosition(positionRef.current, centerOffsets);
        },
      });

      gsap.fromTo(
        stage,
        { scale: 0.76, opacity: 0 },
        {
          scale: 1,
          opacity: 1,
          ease: 'none',
          scrollTrigger: {
            trigger: section,
            start: 'top 90%',
            end: 'top 20%',
            scrub: true,
          },
        },
      );

      return () => {
        triggerRef.current?.kill();
        exposureElements.forEach((exposure) => {
          if (exposure) {
            exposure.style.filter = '';
          }
        });
      };
    },
    { scope: sectionRef },
  );

  const setFrameRef = (index: number, element: HTMLElement | null) => {
    frameRefs.current[index] = element;
  };

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
    activeIndexRef.current = clampedIndex;
    positionRef.current = clampedIndex;

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
      <div ref={stageRef} className={styles.stage}>
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
          <FilmStrip
            projects={PROJECTS}
            activeIndex={activeIndex}
            viewportRef={viewportRef}
            trackRef={trackRef}
            setFrameRef={setFrameRef}
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
      </div>
    </section>
  );
}

export default SelectedWork;
