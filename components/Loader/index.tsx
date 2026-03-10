'use client'
import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { personal } from '@/lib/data'

/**
 * Loader — Spec §4 Loader / Intro Screen
 *
 * Colors:    --background (#080B14), --accent1 (#4F8EF7)
 * Type:      Syne 800, --t-96
 * Motion:    --dur-cinematic (1200ms) stroke, --ease-enter
 * Spacing:   --sp-* only
 * A11y:      role="status", aria-label, reduced-motion fade
 */
interface LoaderProps {
  onComplete: () => void
}

export default function Loader({ onComplete }: LoaderProps) {
  const [progress, setProgress] = useState(0)
  const [exiting, setExiting] = useState(false)

  useEffect(() => {
    // Session check — never show twice
    if (typeof window !== 'undefined' && sessionStorage.getItem('loaderShown')) {
      onComplete()
      return
    }

    // Simulate progressive asset loading
    const steps = [10, 22, 38, 52, 64, 76, 87, 94, 100]
    let i = 0
    const id = setInterval(() => {
      if (i < steps.length) {
        setProgress(steps[i++])
      } else {
        clearInterval(id)
        // Hold at 100% briefly, then exit
        setTimeout(() => {
          setExiting(true)
          sessionStorage.setItem('loaderShown', '1')
          setTimeout(onComplete, 700) // dur-slow + buffer
        }, 250)
      }
    }, 200)

    return () => clearInterval(id)
  }, [onComplete])

  return (
    <AnimatePresence>
      {!exiting && (
        <motion.div
          /* Spec: vertical split wipe exit */
          key="loader"
          className="fixed inset-0 z-[100] flex flex-col items-center justify-center"
          style={{ background: 'var(--background)' }}
          exit={{ opacity: 0 }}
          transition={{
            duration: 0.6,                          /* --dur-slow */
            ease: [0.22, 1, 0.36, 1],              /* --ease-enter */
          }}
          role="status"
          aria-label="Loading portfolio"
          aria-live="polite"
        >
          {/* Ambient radial glow — accent-glow token */}
          <div
            className="pointer-events-none absolute inset-0"
            style={{
              background:
                'radial-gradient(ellipse 60% 40% at 50% 50%, var(--accent-glow) 0%, transparent 70%)',
            }}
            aria-hidden="true"
          />

          {/* ── Initials SVG — stroke animated ─────── */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: 0.6,                        /* --dur-slow */
              ease: [0.22, 1, 0.36, 1],            /* --ease-enter */
            }}
            /* mb: 2×--sp-6 = 48px = --sp-12 */
            style={{ marginBottom: 'var(--sp-12)', position: 'relative' }}
            aria-hidden="true"
          >
            <svg viewBox="0 0 240 120" width="240" height="120" overflow="visible">
              {/* Ghost fill — very low opacity background */}
              <text
                x="50%" y="88"
                textAnchor="middle"
                fontFamily="var(--font-display)"
                fontWeight="800"
                fontSize="96"
                fill="rgba(240,244,255,0.03)"
              >
                {personal.initials}
              </text>

              {/* Animated stroke — accent1, dur-cinematic */}
              <motion.text
                x="50%" y="88"
                textAnchor="middle"
                fontFamily="var(--font-display)"
                fontWeight="800"
                fontSize="96"
                fill="none"
                stroke="var(--accent1)"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                initial={{ strokeDasharray: 1200, strokeDashoffset: 1200 }}
                animate={{ strokeDashoffset: 0 }}
                transition={{
                  duration: 1.2,                    /* --dur-cinematic */
                  ease: [0.22, 1, 0.36, 1],         /* --ease-enter */
                  delay: 0.15,
                }}
              >
                {personal.initials}
              </motion.text>

              {/* Glow halo behind stroke */}
              <motion.text
                x="50%" y="88"
                textAnchor="middle"
                fontFamily="var(--font-display)"
                fontWeight="800"
                fontSize="96"
                fill="none"
                stroke="rgba(79,142,247,0.18)"
                strokeWidth="8"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.8, duration: 0.6 }}
              >
                {personal.initials}
              </motion.text>
            </svg>

            {/* Blur glow orb */}
            <div
              className="absolute inset-0 -z-10"
              style={{
                filter: 'blur(40px)',
                background:
                  'radial-gradient(circle, rgba(79,142,247,0.18) 0%, transparent 70%)',
              }}
            />
          </motion.div>

          {/* ── Progress bar ────────────────────────── */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.3 }}
            aria-hidden="true"
            style={{
              /* w: 256px, h: 1px, bg: --border */
              width: '256px',
              height: '1px',
              background: 'var(--border)',
              borderRadius: '999px',
              overflow: 'hidden',
              position: 'relative',
            }}
          >
            {/* Fill */}
            <motion.div
              style={{
                position: 'absolute',
                inset: 0,
                background: 'linear-gradient(90deg, var(--accent1), var(--accent2))',
                borderRadius: '999px',
                transformOrigin: 'left',
                scaleX: progress / 100,
              }}
              transition={{
                duration: 0.4,                      /* --dur-base + buffer */
                ease: [0.22, 1, 0.36, 1],
              }}
            />
            {/* Shimmer sweep */}
            <motion.div
              style={{
                position: 'absolute',
                inset: 0,
                backgroundImage:
                  'linear-gradient(90deg, transparent, rgba(255,255,255,0.35), transparent)',
                backgroundSize: '200% 100%',
              }}
              animate={{ backgroundPosition: ['200% center', '-200% center'] }}
              transition={{ duration: 1.8, repeat: Infinity, ease: 'linear' }}
            />
          </motion.div>

          {/* Progress counter — mono, t-12, text-muted */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.45 }}
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: 'var(--t-12)',
              color: 'var(--text-muted)',
              letterSpacing: '0.2em',
              marginTop: 'var(--sp-4)',
              fontWeight: 400,
              lineHeight: 'var(--lh-mono)',
            }}
          >
            {Math.round(progress)}%
          </motion.p>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
