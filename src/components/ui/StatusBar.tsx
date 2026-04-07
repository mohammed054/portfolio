'use client';

import { useSystemStore } from '@/store/systemStore';
import { SystemState } from '@/types/system';

export const StatusBar = () => {
  const progress = useSystemStore((state) => state.progress);
  const systemState = useSystemStore((state) => state.status.state);

  const progressLabel = `${progress.toFixed(3)} / 1.000`;
  const rightLabel = progress < 0.04 ? 'SCROLL' : progress > 0.96 ? 'RESOLVED' : 'UP / DOWN';

  return (
    <div
      role="status"
      aria-label="System progress status"
      style={{
        position: 'fixed',
        inset: 'auto 0 0 0',
        zIndex: 'var(--z-overlay)' as string,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        height: '36px',
        padding: '0 var(--margin-outer)',
        pointerEvents: 'none',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        <span className="text-mono" style={{ opacity: 0.35 }}>
          +
        </span>
        <span className="text-mono">{progressLabel}</span>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        <span
          className="text-mono"
          style={{
            color: systemState === SystemState.Resolved ? 'var(--white-dim)' : 'var(--mono-label)',
          }}
        >
          {rightLabel}
        </span>
        <span className="text-mono" style={{ opacity: 0.35 }}>
          +
        </span>
      </div>
    </div>
  );
};
