import { useProgress, useSystemState } from '../core/ExperienceProvider.jsx'

export function Overlay() {
  const progress = useProgress()
  const state = useSystemState()

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
        zIndex: 100,
      }}
    >
      <DebugPanel progress={progress} state={state} />
    </div>
  )
}

function DebugPanel({ progress, state }) {
  return (
    <div
      style={{
        position: 'absolute',
        top: 16,
        left: 16,
        fontFamily: 'monospace',
        fontSize: 11,
        color: '#0066FF',
        lineHeight: 1.8,
        opacity: 0.85,
        userSelect: 'none',
      }}
    >
      <div style={{ color: '#444', marginBottom: 4 }}>SYSTEM</div>
      <div>
        PROGRESS{' '}
        <span style={{ color: '#FFFFFF' }}>{progress.toFixed(4)}</span>
      </div>
      <div>
        STATE{' '}
        <span style={{ color: '#FF6B00' }}>{state}</span>
      </div>
      <div style={{ marginTop: 8, color: '#333' }}>
        {'━'.repeat(20)}
      </div>
      <ProgressBar progress={progress} />
    </div>
  )
}

function ProgressBar({ progress }) {
  return (
    <div style={{ marginTop: 4 }}>
      <div
        style={{
          width: 160,
          height: 1,
          background: '#111',
          position: 'relative',
        }}
      >
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            height: '100%',
            width: `${progress * 100}%`,
            background: '#0066FF',
            transition: 'none',
          }}
        />
      </div>
    </div>
  )
}
