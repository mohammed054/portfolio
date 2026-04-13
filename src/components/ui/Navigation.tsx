'use client';

import { STATE_LABELS } from '@/lib/systemStates';
import { initAudio, isAudioInitialized } from '@/lib/audioEngine';
import { useSystemStore } from '@/store/systemStore';

export const Navigation = () => {
  const status = useSystemStore((state) => state.status);
  const audioEnabled = useSystemStore((state) => state.audioEnabled);
  const reducedMotion = useSystemStore((state) => state.reducedMotion);
  const toggleAudio = useSystemStore((state) => state.toggleAudio);
  const stateLabel = STATE_LABELS[status.state];

  const handleAudioToggle = async () => {
    if (reducedMotion) {
      return;
    }

    toggleAudio();

    if (!audioEnabled && !isAudioInitialized()) {
      await initAudio();
    }
  };

  return (
    <nav
      aria-label="System navigation"
      style={{
        position: 'fixed',
        inset: '0 0 auto 0',
        zIndex: 'var(--z-nav)' as string,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: 'clamp(18px, 2.2vw, 28px) var(--margin-outer)',
        pointerEvents: 'none',
      }}
    >
      <span
        style={{
          fontFamily: 'var(--font-suisse)',
          fontSize: '14px',
          fontWeight: 700,
          letterSpacing: '0.14em',
          color: 'var(--white)',
          userSelect: 'none',
        }}
      >
        MH
      </span>

      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '18px',
          pointerEvents: 'auto',
        }}
      >
        <span
          className="text-mono"
          aria-live="polite"
          style={{
            color: 'var(--mono-label)',
            transition: 'opacity var(--duration-mid) var(--ease-out)',
          }}
        >
          {stateLabel}
        </span>

        <button
          type="button"
          onClick={handleAudioToggle}
          disabled={reducedMotion}
          aria-label={
            reducedMotion
              ? 'Audio disabled because reduced motion is enabled'
              : audioEnabled
                ? 'Disable audio'
                : 'Enable audio'
          }
          style={{
            width: '22px',
            height: '22px',
            display: 'grid',
            placeItems: 'center',
            padding: 0,
            background: 'transparent',
            border: 'none',
            opacity: reducedMotion ? 0.35 : 1,
          }}
        >
          <span
            aria-hidden="true"
            style={{
              width: '7px',
              height: '7px',
              borderRadius: '999px',
              background: audioEnabled ? 'var(--white)' : 'transparent',
              border: `1px solid ${audioEnabled ? 'var(--white)' : 'var(--mono-label)'}`,
              transition: 'all var(--duration-fast) var(--ease-out)',
            }}
          />
        </button>
      </div>
    </nav>
  );
};
