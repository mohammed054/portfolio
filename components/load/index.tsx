'use client'

import { useEffect, useState } from 'react'
import { useProgress } from '@react-three/drei'
import { motion, useReducedMotion } from 'framer-motion'
import { profile } from '@/lib/data'

type Props = { onDone: () => void }

export default function Loader({ onDone }: Props) {
  const [ready, setReady] = useState(false)
  const [skip, setSkip] = useState(true)
  const prefersReducedMotion = useReducedMotion()
  const { progress } = useProgress()

  useEffect(() => {
    const wasShown = sessionStorage.getItem('loaderShown') === '1'
    if (wasShown) {
      onDone()
      return
    }
    setSkip(false)
  }, [onDone])

  useEffect(() => {
    if (skip) return
    if (progress >= 100) {
      const timeout = window.setTimeout(() => {
        setReady(true)
      }, 250)
      return () => window.clearTimeout(timeout)
    }
    return undefined
  }, [progress, skip])

  useEffect(() => {
    if (!ready) return
    sessionStorage.setItem('loaderShown', '1')
    const timeout = window.setTimeout(onDone, 500)
    return () => window.clearTimeout(timeout)
  }, [ready, onDone])

  if (skip) return null

  return (
    <motion.div
      aria-label="Loading Portfolio"
      className="fixed inset-0 z-50 flex flex-col items-center justify-center gap-6 bg-[var(--background)]"
      initial={{ opacity: 1 }}
      animate={ready ? { opacity: 0, clipPath: 'inset(0 50% 0 50%)' } : { opacity: 1, clipPath: 'inset(0 0% 0 0%)' }}
      transition={{ duration: prefersReducedMotion ? 0.2 : 0.7, ease: [0.22, 1, 0.36, 1] }}
    >
      <motion.div
        className="t-display text-6xl md:text-8xl"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1, scale: ready ? 0.95 : 1 }}
      >
        {profile.initials}
      </motion.div>
      <div className="h-1 w-64 overflow-hidden rounded-full bg-[var(--border)]">
        <motion.div
          className="h-full bg-[var(--accent1)]"
          animate={{ width: `${Math.max(progress, 6)}%` }}
          transition={{ duration: 0.3 }}
        />
      </div>
    </motion.div>
  )
}
