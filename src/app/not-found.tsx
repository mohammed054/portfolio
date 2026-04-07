'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

// ─────────────────────────────────────────────────────────────────────────────
// 404 — Minimal. System language. Redirects to home after 3s.
// ─────────────────────────────────────────────────────────────────────────────

export default function NotFound() {
  const router = useRouter();

  useEffect(() => {
    const timer = setTimeout(() => router.push('/'), 3000);
    return () => clearTimeout(timer);
  }, [router]);

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        background: 'var(--bg)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '16px',
        cursor: 'none',
      }}
    >
      <span
        style={{
          fontFamily: 'var(--font-mono, monospace)',
          fontSize: 'var(--text-label)',
          letterSpacing: '0.15em',
          color: 'var(--mono-label)',
          textTransform: 'uppercase',
        }}
      >
        ERROR 404
      </span>
      <span
        style={{
          fontFamily: 'var(--font-suisse, sans-serif)',
          fontSize: 'var(--text-h2)',
          fontWeight: 700,
          letterSpacing: '-0.03em',
          color: 'var(--white)',
        }}
      >
        PATH NOT FOUND
      </span>
      <span
        style={{
          fontFamily: 'var(--font-mono, monospace)',
          fontSize: 'var(--text-mono)',
          color: 'var(--mono-label)',
          marginTop: '8px',
        }}
      >
        {'> RETURNING TO SYSTEM...'}
      </span>
    </div>
  );
}
