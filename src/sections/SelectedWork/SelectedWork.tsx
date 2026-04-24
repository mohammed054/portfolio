import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import './SelectedWork.css';

gsap.registerPlugin(ScrollTrigger);

export interface Project {
  id: number;
  name: string;
  category: string;
  viewUrl: string;
  color: string; // placeholder color until real images
  accent: string;
}

const PROJECTS: Project[] = [
  { id: 1,  name: 'Design is Funny',         category: '3D Brand Identity',       viewUrl: '#', color: '#1a1a3e', accent: '#ff6b6b' },
  { id: 2,  name: 'eHealth Arena',           category: '3D Virtual Showroom',     viewUrl: '#', color: '#0e2a1a', accent: '#4ade80' },
  { id: 3,  name: 'Axfood Digital',          category: 'Web Experience',          viewUrl: '#', color: '#2a1a0e', accent: '#fb923c' },
  { id: 4,  name: 'Volvo Innovation',        category: 'Interactive Prototype',   viewUrl: '#', color: '#0e1a2a', accent: '#60a5fa' },
  { id: 5,  name: 'Spotify Campaign',        category: 'Motion & Creative Dev',   viewUrl: '#', color: '#1a0e2a', accent: '#a78bfa' },
  { id: 6,  name: 'IKEA Space Planner',      category: 'WebGL Application',       viewUrl: '#', color: '#1a1a0e', accent: '#facc15' },
  { id: 7,  name: 'H&M Fashion Tech',        category: 'AR Experience',           viewUrl: '#', color: '#2a0e1a', accent: '#f472b6' },
  { id: 8,  name: 'ABB Industrial AI',       category: 'AI Dashboard',            viewUrl: '#', color: '#0a1a1a', accent: '#22d3ee' },
  { id: 9,  name: 'Northvolt Launch',        category: 'Brand & Web',             viewUrl: '#', color: '#1a1a1a', accent: '#e2e8f0' },
  { id: 10, name: 'SEB Visualizer',          category: 'Data Visualization',      viewUrl: '#', color: '#0e1a2a', accent: '#38bdf8' },
  { id: 11, name: 'Voi Mobility',            category: 'Product Web Experience',  viewUrl: '#', color: '#0e2a0e', accent: '#86efac' },
];

const SPROCKET_COUNT = 24;

export function SelectedWork() {
  const sectionRef   = useRef<HTMLElement>(null);
  const pinRef       = useRef<HTMLDivElement>(null);
  const stripRef     = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);
  const activeRef = useRef(0);

  useEffect(() => {
    const section = sectionRef.current;
    const pin     = pinRef.current;
    const strip   = stripRef.current;
    if (!section || !pin || !strip) return;

    const cardWidth  = strip.querySelector<HTMLElement>('.sw-frame')?.offsetWidth ?? 480;
    const gap        = 32;
    const totalTravel = (PROJECTS.length - 1) * (cardWidth + gap);

    const ctx = gsap.context(() => {
      // Pin + horizontal scroll
      ScrollTrigger.create({
        trigger: section,
        start: 'top top',
        end: `+=${totalTravel + window.innerHeight * 0.5}`,
        pin: pin,
        anticipatePin: 1,
        scrub: 1.2,
        onUpdate: (self) => {
          const raw   = self.progress * (PROJECTS.length - 1);
          const idx   = Math.round(raw);
          const clamp = Math.max(0, Math.min(PROJECTS.length - 1, idx));
          if (clamp !== activeRef.current) {
            activeRef.current = clamp;
            setActive(clamp);
          }
          gsap.to(strip, {
            x: -raw * (cardWidth + gap),
            ease: 'none',
            duration: 0,
          });
        },
      });

      // Scale-in on enter
      gsap.fromTo(pin,
        { scale: 0.88, opacity: 0 },
        {
          scale: 1, opacity: 1, duration: 0.8, ease: 'power2.out',
          scrollTrigger: { trigger: section, start: 'top 80%', toggleActions: 'play none none reverse' },
        }
      );
    }, section);

    return () => ctx.revert();
  }, []);

  const navigate = (dir: -1 | 1) => {
    const next = Math.max(0, Math.min(PROJECTS.length - 1, active + dir));
    setActive(next);
    activeRef.current = next;
    // Programmatic scroll — calculate target scroll position
    const section = sectionRef.current;
    if (!section) return;
    const st = ScrollTrigger.getAll().find(t => t.trigger === section);
    if (st) {
      const cardWidth = stripRef.current?.querySelector<HTMLElement>('.sw-frame')?.offsetWidth ?? 480;
      const gap = 32;
      const totalTravel = (PROJECTS.length - 1) * (cardWidth + gap);
      const targetProgress = next / (PROJECTS.length - 1);
      const scrollY = st.start as number + targetProgress * (totalTravel + window.innerHeight * 0.5);
      window.scrollTo({ top: scrollY, behavior: 'smooth' });
    }
  };

  const proj = PROJECTS[active];

  return (
    <section className="sw" id="work" ref={sectionRef} aria-label="Selected Work">
      <div className="sw__pin" ref={pinRef}>

        {/* Section header */}
        <div className="sw__header">
          <h2 className="sw__title">Selected Work</h2>
          <p className="sw__desc">Browse our project carousel to explore our selected work.</p>
        </div>

        {/* Active project metadata */}
        <div className="sw__meta" aria-live="polite">
          <span className="sw__meta-name">{proj.name}</span>
          <span className="sw__meta-row">
            <span className="sw__meta-cat">{proj.category}</span>
            <a href={proj.viewUrl} className="sw__meta-link">View project →</a>
          </span>
        </div>

        {/* Film strip */}
        <div className="sw__film-wrap">
          {/* Sprocket holes top */}
          <div className="sw__sprockets sw__sprockets--top" aria-hidden="true">
            {Array.from({ length: SPROCKET_COUNT }).map((_, i) => (
              <div key={i} className="sw__sprocket" />
            ))}
          </div>

          {/* The scrolling strip */}
          <div className="sw__strip-viewport">
            <div className="sw__strip" ref={stripRef}>
              {PROJECTS.map((p, i) => (
                <div
                  key={p.id}
                  className={`sw-frame ${i === active ? 'sw-frame--active' : ''}`}
                  aria-label={`Project: ${p.name}`}
                  onClick={() => window.open(p.viewUrl, '_blank')}
                >
                  {/* Placeholder thumbnail */}
                  <div
                    className="sw-frame__thumb"
                    style={{ background: p.color }}
                    aria-hidden="true"
                  >
                    <div className="sw-frame__thumb-inner" style={{ color: p.accent }}>
                      <span className="sw-frame__num">{String(i + 1).padStart(2, '0')}</span>
                      <span className="sw-frame__proj-name">{p.name}</span>
                    </div>
                    {/* Fake screen grid overlay */}
                    <div className="sw-frame__grid" />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Sprocket holes bottom */}
          <div className="sw__sprockets sw__sprockets--bottom" aria-hidden="true">
            {Array.from({ length: SPROCKET_COUNT }).map((_, i) => (
              <div key={i} className="sw__sprocket" />
            ))}
          </div>
        </div>

        {/* Navigation */}
        <div className="sw__nav" role="group" aria-label="Project navigation">
          <button
            className="sw__nav-btn"
            onClick={() => navigate(-1)}
            disabled={active === 0}
            aria-label="Previous project"
          >
            ←
          </button>

          {/* Dot pagination */}
          <div className="sw__dots" role="list">
            {PROJECTS.map((p, i) => (
              <button
                key={p.id}
                className={`sw__dot ${i === active ? 'sw__dot--active' : ''}`}
                onClick={() => {
                  setActive(i);
                  activeRef.current = i;
                }}
                aria-label={`Go to project ${i + 1}: ${p.name}`}
                aria-current={i === active ? 'true' : undefined}
                role="listitem"
              />
            ))}
          </div>

          <button
            className="sw__nav-btn"
            onClick={() => navigate(1)}
            disabled={active === PROJECTS.length - 1}
            aria-label="Next project"
          >
            →
          </button>
        </div>

      </div>
    </section>
  );
}
