'use client';

interface LoaderProps {
  onComplete?: () => void;
}

export const Loader = ({ onComplete }: LoaderProps) => {
  return (
    <div
      aria-label="Loading"
      role="progressbar"
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={100}
      onAnimationEnd={() => onComplete?.()}
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 'var(--z-loader)' as string,
        display: 'grid',
        placeItems: 'center',
        background: 'var(--bg)',
        animation: 'loader-exit 0.65s var(--ease-out) 1.8s forwards',
      }}
    >
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '22px',
        }}
      >
        <span
          style={{
            fontFamily: 'var(--font-suisse)',
            fontSize: '14px',
            fontWeight: 700,
            letterSpacing: '0.14em',
            color: 'var(--white)',
          }}
        >
          MH
        </span>

        <div
          style={{
            width: '200px',
            height: '1px',
            background: 'var(--white-ghost)',
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          <div
            style={{
              position: 'absolute',
              inset: '0 auto 0 0',
              width: '0%',
              height: '100%',
              background: 'rgba(255,255,255,0.45)',
              animation: 'loader-progress 1.45s linear 0.12s forwards',
            }}
          />
        </div>
      </div>
    </div>
  );
};
