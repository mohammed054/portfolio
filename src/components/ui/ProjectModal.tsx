'use client';

import Image from 'next/image';
import { useEffect, useRef } from 'react';
import { useProjectStore } from '@/store/projectStore';
import { useSystemStore } from '@/store/systemStore';

const CLEAR_DELAY_MS = 520;

export const ProjectModal = () => {
  const activeProject = useProjectStore((state) => state.activeProject);
  const modalOpen = useProjectStore((state) => state.modalOpen);
  const closeProject = useProjectStore((state) => state.closeProject);
  const clearProject = useProjectStore((state) => state.clearProject);
  const setCursorContext = useSystemStore((state) => state.setCursorContext);
  const modalRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    document.body.classList.toggle('modal-open', modalOpen);
    return () => document.body.classList.remove('modal-open');
  }, [modalOpen]);

  useEffect(() => {
    if (!activeProject) {
      return;
    }

    if (modalOpen) {
      window.setTimeout(() => closeButtonRef.current?.focus(), 30);
      return;
    }

    const timer = window.setTimeout(() => {
      clearProject();
    }, CLEAR_DELAY_MS);

    return () => window.clearTimeout(timer);
  }, [activeProject, clearProject, modalOpen]);

  useEffect(() => {
    if (!modalOpen || !modalRef.current) {
      return;
    }

    const root = modalRef.current;
    const getFocusable = () =>
      Array.from(
        root.querySelectorAll<HTMLElement>(
          'button, a[href], [tabindex]:not([tabindex="-1"])'
        )
      );

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        closeProject();
        return;
      }

      if (event.key !== 'Tab') {
        return;
      }

      const focusable = getFocusable();
      if (!focusable.length) {
        return;
      }

      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      const activeElement = document.activeElement as HTMLElement | null;

      if (event.shiftKey && activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [closeProject, modalOpen]);

  if (!activeProject) {
    return null;
  }

  return (
    <>
      <div
        aria-hidden="true"
        onClick={closeProject}
        style={{
          position: 'fixed',
          inset: 0,
          zIndex: 180,
          background: 'rgba(5,5,7,0.72)',
          opacity: modalOpen ? 1 : 0,
          transition: 'opacity var(--duration-mid) var(--ease-out)',
          pointerEvents: modalOpen ? 'auto' : 'none',
        }}
      />

      <div
        ref={modalRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="project-modal-title"
        style={{
          position: 'fixed',
          inset: 'auto 0 0 0',
          zIndex: 220,
          transform: modalOpen ? 'translateY(0)' : 'translateY(104%)',
          transition: 'transform var(--duration-mid) var(--ease-out)',
          padding: '0 clamp(18px, 3vw, 32px) clamp(18px, 3vw, 28px)',
          pointerEvents: modalOpen ? 'auto' : 'none',
        }}
      >
        <div
          style={{
            margin: '0 auto',
            maxWidth: '1160px',
            background: 'rgba(13, 15, 26, 0.98)',
            borderTop: '1px solid var(--panel-edge)',
            padding: 'clamp(28px, 5vw, 52px)',
          }}
        >
          <div
            style={{
              display: 'grid',
              gap: '24px',
              gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
              alignItems: 'start',
            }}
          >
            <div>
              <div
                style={{
                  position: 'relative',
                  aspectRatio: '16 / 10',
                  overflow: 'hidden',
                  background: 'var(--panel-active)',
                }}
              >
                <Image
                  src={activeProject.thumbnail}
                  alt={activeProject.title}
                  fill
                  sizes="(max-width: 768px) 100vw, 44vw"
                  style={{ objectFit: 'cover', opacity: 0.86 }}
                  priority
                />
              </div>
            </div>

            <div>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  justifyContent: 'space-between',
                  gap: '24px',
                  marginBottom: '20px',
                }}
              >
                <div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', marginBottom: '12px' }}>
                    {activeProject.category.map((category) => (
                      <span key={category} className="text-mono">
                        {category}
                      </span>
                    ))}
                    <span className="text-mono" style={{ opacity: 0.55 }}>
                      {activeProject.year}
                    </span>
                  </div>

                  <h2 id="project-modal-title" className="text-h2">
                    {activeProject.title}
                  </h2>
                  <p className="text-mono" style={{ marginTop: '10px' }}>
                    {activeProject.client}
                  </p>
                </div>

                <button
                  ref={closeButtonRef}
                  type="button"
                  onClick={closeProject}
                  onMouseEnter={() => setCursorContext('hover')}
                  onMouseLeave={() => setCursorContext('default')}
                  style={{
                    padding: 0,
                    border: 'none',
                    background: 'transparent',
                    color: 'var(--mono-label)',
                    fontFamily: 'var(--font-mono)',
                    fontSize: '11px',
                    letterSpacing: '0.12em',
                    textTransform: 'uppercase',
                    flexShrink: 0,
                  }}
                >
                  Close
                </button>
              </div>

              <p
                style={{
                  maxWidth: '62ch',
                  color: 'var(--white-dim)',
                  marginBottom: '24px',
                }}
              >
                {activeProject.description}
              </p>

              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
                {activeProject.tech.map((tech) => (
                  <span
                    key={tech}
                    className="text-mono"
                    style={{
                      padding: '6px 10px',
                      border: '1px solid var(--panel-edge)',
                    }}
                  >
                    {tech}
                  </span>
                ))}
              </div>

              {activeProject.url ? (
                <a
                  href={activeProject.url}
                  target="_blank"
                  rel="noreferrer"
                  onMouseEnter={() => setCursorContext('view')}
                  onMouseLeave={() => setCursorContext('default')}
                  style={{
                    display: 'inline-flex',
                    marginTop: '24px',
                    color: 'var(--white)',
                    fontFamily: 'var(--font-mono)',
                    fontSize: '11px',
                    letterSpacing: '0.12em',
                    textTransform: 'uppercase',
                    borderBottom: '1px solid rgba(255,255,255,0.2)',
                    paddingBottom: '4px',
                  }}
                >
                  View project
                </a>
              ) : null}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
