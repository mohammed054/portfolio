'use client'

import { useEffect, useMemo, useState } from 'react'
import { useProgress } from '@react-three/drei'
import { motion, useReducedMotion } from 'framer-motion'
import { profile } from '@/lib/data'

type Props = { onDone: () => void }

export default function Loader({ onDone }: Props) {
  const [enabled, setEnabled] = useState(false)
  const [exit, setExit] = useState(false)
  const reduced = useReducedMotion()
  const { progress } = useProgress()

  useEffect(() => {
    if (sessionStorage.getItem('loaderShown') === '1') {
      onDone()
      return
    }
    setEnabled(true)
  }, [onDone])

  useEffect(() => {
    if (!enabled || progress < 100) return
    const timer = window.setTimeout(() => setExit(true), 240)
    return () => window.clearTimeout(timer)
  }, [enabled, progress])

  useEffect(() => {
    if (!exit) return
    sessionStorage.setItem('loaderShown', '1')
    const timer = window.setTimeout(onDone, reduced ? 180 : 720)
    return () => window.clearTimeout(timer)
  }, [exit, onDone, reduced])

  const pct = useMemo(() => Math.max(4, Math.min(100, Math.round(progress))), [progress])

  if (!enabled) return null

  return (
    <motion.div
      aria-label="Loading Portfolio"
      className="fixed inset-0 z-50 grid place-items-center bg-[var(--background)]"
      initial={{ opacity: 1, clipPath: 'inset(0 0 0 0)' }}
      animate={exit ? { clipPath: 'inset(0 50% 0 50%)', opacity: 0 } : { clipPath: 'inset(0 0 0 0)', opacity: 1 }}
      transition={{ duration: reduced ? 0.2 : 0.85, ease: [0.22, 1, 0.36, 1] }}
    >
      <div className="flex w-full max-w-xl flex-col items-center gap-4 px-6">
        <svg viewBox="0 0 360 120" className="w-full max-w-sm" role="img" aria-label={profile.initials}>
          <text
            x="50%"
            y="50%"
            dominantBaseline="middle"
            textAnchor="middle"
            className="fill-transparent stroke-[var(--accent1)] text-[96px] font-extrabold [font-family:var(--font-display)]"
            style={{ strokeDasharray: 460, strokeDashoffset: exit ? 0 : 460, filter: 'drop-shadow(0 0 14px var(--accent-glow))', transition: 'stroke-dashoffset var(--dur-cinematic) var(--ease-enter)' }}
          >
            {profile.initials}
          </text>
        </svg>

        <div className="h-px w-72 bg-[var(--border)]">
          <motion.div className="h-px bg-[var(--accent1)]" animate={{ width: `${pct}%` }} transition={{ duration: 0.25 }} />
        </div>
        <p className="t-mono text-[var(--text-secondary)]">{pct}%</p>
      </div>
    </motion.div>
  )
}
