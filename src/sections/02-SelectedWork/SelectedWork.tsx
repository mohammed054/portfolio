import { useRef, useState, type PointerEvent } from 'react';
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
  const activeIndexRef = useRef(0);
  const positionRef = useRef({ value: 0 });
  const targetPositionRef = useRef(0);
  const isDraggingRef = useRef(false);
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
        const resolvedPosition = gsap.utils.clamp(0, PROJECTS.length - 1, rawPosition);
        const lowerIndex = Math.floor(resolvedPosition);
        const upperIndex = Math.min(PROJECTS.length - 1, Math.ceil(resolvedPosition));
        const mix = resolvedPosition - lowerIndex;
        const nextX = gsap.utils.interpolate(
          centerOffsets[lowerIndex] ?? 0,
          centerOffsets[upperIndex] ?? 0,
          mix,
        );
        const visualPerspectiveBias = window.innerWidth > 768 ? viewport.clientWidth * 0.62 : 0;

        setTrackX(nextX - visualPerspectiveBias);

        frames.forEach((frame, index) => {
          const offset = index - resolvedPosition;
          const distance = Math.abs(offset);
          const directionLift = offset * -34;
          const scale = gsap.utils.clamp(0.68, 1 - distance * 0.14, 1);
          const y = -Math.min(170, Math.pow(distance, 1.05) * 26) + directionLift;
          const rotationX = gsap.utils.clamp(-28, -8 - distance * 3.2, -8);
          const rotationY = gsap.utils.clamp(-68, offset * -22, 68);
          const rotationZ = gsap.utils.clamp(-18, offset * -5.5, 18);
          const z = -Math.min(560, Math.pow(distance, 1.18) * 160);
          const opacity = gsap.utils.clamp(0.16, 1 - distance * 0.22, 1);

          gsap.set(frame, {
            y,
            z,
            rotationX,
            rotationY,
            rotationZ,
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
          Math.round(resolvedPosition),
        );

        if (nextIndex !== activeIndexRef.current) {
          activeIndexRef.current = nextIndex;
          setActiveIndex(nextIndex);
        }
      };

      let centerOffsets = getCenterOffsets();
      applyPosition(0, centerOffsets);

      const pinTrigger = ScrollTrigger.create({
        trigger: section,
        start: 'top top',
        end: () => `+=${Math.max(window.innerHeight * 1.15, 820)}`,
        pin: true,
        pinSpacing: true,
        anticipatePin: 1,
        invalidateOnRefresh: true,
      });

      gsap.set(track, {
        rotationX: 8,
        rotationY: -8,
        rotationZ: -3.5,
        transformPerspective: 2400,
      });
      applyPosition(positionRef.current.value, centerOffsets);

      gsap.fromTo(
        stage,
        { scale: 0.76, opacity: 0 },
        {
          scale: 1,
          opacity: 1,
          ease: 'none',
          scrollTrigger: {
            trigger: section,
            start: 'top 94%',
            end: 'top 36%',
            scrub: true,
          },
        },
      );

      const syncPosition = () => {
        const current = positionRef.current.value;
        const target = targetPositionRef.current;
        const delta = target - current;
        const next = Math.abs(delta) < 0.002 ? target : current + delta * 0.085;

        if (next !== current) {
          positionRef.current.value = next;
          applyPosition(next, centerOffsets);
        }
      };

      const resizeObserver = new ResizeObserver(() => {
        centerOffsets = getCenterOffsets();
        applyPosition(positionRef.current.value, centerOffsets);
      });

      resizeObserver.observe(viewport);
      gsap.ticker.add(syncPosition);

      return () => {
        pinTrigger.kill();
        gsap.ticker.remove(syncPosition);
        resizeObserver.disconnect();
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

  const setTargetPosition = (rawPosition: number) => {
    const clampedPosition = Math.max(0, Math.min(PROJECTS.length - 1, rawPosition));
    targetPositionRef.current = clampedPosition;
  };

  const goTo = (targetIndex: number) => {
    setTargetPosition(targetIndex);
  };

  const navigateFromPointer = (event: PointerEvent<HTMLDivElement>) => {
    const viewport = viewportRef.current;
    if (!viewport) {
      return;
    }

    const bounds = viewport.getBoundingClientRect();
    if (bounds.width <= 0) {
      return;
    }

    const progress = gsap.utils.clamp(0, 1, (event.clientX - bounds.left) / bounds.width);
    setTargetPosition(progress * (PROJECTS.length - 1));
  };

  const handlePointerDown = (event: PointerEvent<HTMLDivElement>) => {
    isDraggingRef.current = true;
    event.currentTarget.setPointerCapture(event.pointerId);
    navigateFromPointer(event);
  };

  const handlePointerMove = (event: PointerEvent<HTMLDivElement>) => {
    if (event.pointerType === 'mouse' || isDraggingRef.current) {
      navigateFromPointer(event);
    }
  };

  const handlePointerUp = (event: PointerEvent<HTMLDivElement>) => {
    isDraggingRef.current = false;
    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }
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
          {activeProject.description ? (
            <p className={styles.projectDescription}>{activeProject.description}</p>
          ) : null}
          {activeProject.tech?.length ? (
            <ul className={styles.projectTags} aria-label={`${activeProject.name} technologies`}>
              {activeProject.tech.map((tech) => (
                <li key={tech}>{tech}</li>
              ))}
            </ul>
          ) : null}
        </div>

        <div
          className={styles.stripShell}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerCancel={handlePointerUp}
        >
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
