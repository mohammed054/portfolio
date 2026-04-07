'use client';

import { PROJECTS } from '@/lib/projectData';
import { useProjectStore } from '@/store/projectStore';
import { useSystemStore } from '@/store/systemStore';
import { SystemState } from '@/types/system';

export const SystemOverlay = () => {
  const status = useSystemStore((state) => state.status);
  const setCursorContext = useSystemStore((state) => state.setCursorContext);
  const openProject = useProjectStore((state) => state.openProject);

  const showProjectIndex =
    status.state === SystemState.Executing ||
    status.state === SystemState.Processing ||
    status.state === SystemState.Resolved;

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 'var(--z-html-world)' as string,
        pointerEvents: 'none',
      }}
    >
      {status.state === SystemState.Activating ? (
        <div
          className="text-mono"
          style={{
            position: 'absolute',
            top: 'clamp(76px, 10vh, 112px)',
            left: 'var(--margin-outer)',
            opacity: status.local,
          }}
        >
          &gt; SYSTEM INIT
        </div>
      ) : null}

      {showProjectIndex ? (
        <div
          style={{
            position: 'absolute',
            right: 'var(--margin-outer)',
            bottom: '72px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'flex-end',
            gap: '8px',
            pointerEvents: 'auto',
          }}
        >
          <span className="text-mono" style={{ opacity: 0.36 }}>
            PROJECT INDEX
          </span>
          {PROJECTS.map((project) => (
            <button
              key={project.id}
              type="button"
              onClick={() => openProject(project)}
              onMouseEnter={() => setCursorContext('hover')}
              onMouseLeave={() => setCursorContext('default')}
              style={{
                alignSelf: 'flex-end',
                padding: '0',
                background: 'transparent',
                border: 'none',
                color: 'var(--white-dim)',
                fontFamily: 'var(--font-mono)',
                fontSize: '11px',
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
              }}
            >
              {project.title}
            </button>
          ))}
        </div>
      ) : null}
    </div>
  );
};
