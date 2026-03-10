'use client'
import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { personal } from '@/lib/data'

interface LoaderProps {
  onComplete: () => void
}

export default function Loader({ onComplete }: LoaderProps) {
  const [progress, setProgress] = useState(0)
  const [done, setDone] = useState(false)

  // Check session: skip on revisit
  useEffect(() => {
    if (typeof window !== 'undefined' && sessionStorage.getItem('loaderShown')) {
      onComplete()
      return
    }

    // Simulate asset loading progress
    const steps = [15, 30, 45, 60, 72, 84, 93, 100]
    let i = 0
    const interval = setInterval(() => {
      if (i < steps.length) {
        setProgress(steps[i])
        i++
      } else {
        clearInterval(interval)
        setTimeout(() => {
          setDone(true)
          sessionStorage.setItem('loaderShown', '1')
          setTimeout(onComplete, 800)
        }, 300)
      }
    }, 220)

    return () => clearInterval(interval)
  }, [onComplete])

  return (
    <AnimatePresence>
      {!done && (
        <motion.div
          key="loader"
          className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-bg"
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          aria-label="Loading Portfolio"
          role="status"
        >
          {/* Ambient glow */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background: 'radial-gradient(ellipse 60% 40% at 50% 50%, rgba(79,142,247,0.08) 0%, transparent 70%)',
            }}
          />

          {/* Initials SVG — stroke animated */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="relative mb-10"
          >
            <svg
              viewBox="0 0 200 120"
              width="200"
              height="120"
              className="overflow-visible"
              aria-hidden="true"
            >
              {/* Background text for fill */}
              <text
                x="50%"
                y="80"
                textAnchor="middle"
                fontFamily="Syne, sans-serif"
                fontWeight="800"
                fontSize="96"
                fill="rgba(240,244,255,0.04)"
                stroke="none"
              >
                {personal.initials}
              </text>

              {/* Animated stroke */}
              <motion.text
                x="50%"
                y="80"
                textAnchor="middle"
                fontFamily="Syne, sans-serif"
                fontWeight="800"
                fontSize="96"
                fill="none"
                stroke="#4F8EF7"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                initial={{ strokeDasharray: 1000, strokeDashoffset: 1000, opacity: 1 }}
                animate={{ strokeDashoffset: 0, opacity: 1 }}
                transition={{ duration: 1.4, ease: [0.22, 1, 0.36, 1], delay: 0.2 }}
              >
                {personal.initials}
              </motion.text>

              {/* Glow text */}
              <motion.text
                x="50%"
                y="80"
                textAnchor="middle"
                fontFamily="Syne, sans-serif"
                fontWeight="800"
                fontSize="96"
                fill="none"
                stroke="rgba(79,142,247,0.2)"
                strokeWidth="6"
                strokeLinecap="round"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 1, delay: 0.8 }}
              >
                {personal.initials}
              </motion.text>
            </svg>

            {/* Glow orb behind initials */}
            <div
              className="absolute inset-0 -z-10 blur-3xl"
              style={{
                background: 'radial-gradient(circle, rgba(79,142,247,0.15) 0%, transparent 70%)',
              }}
            />
          </motion.div>

          {/* Progress bar */}
          <motion.div
            initial={{ opacity: 0, scaleX: 0 }}
            animate={{ opacity: 1, scaleX: 1 }}
            transition={{ delay: 0.4, duration: 0.5 }}
            className="relative w-64 h-px bg-border overflow-hidden rounded-full"
          >
            <motion.div
              className="absolute inset-0 origin-left rounded-full"
              style={{ background: 'linear-gradient(90deg, #4F8EF7, #8B5CF6)' }}
              initial={{ scaleX: 0 }}
              animate={{ scaleX: progress / 100 }}
              transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            />
            {/* Shimmer */}
            <motion.div
              className="absolute inset-0 rounded-full"
              style={{
                background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent)',
                backgroundSize: '200% 100%',
              }}
              animate={{ backgroundPosition: ['200% center', '-200% center'] }}
              transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }}
            />
          </motion.div>

          {/* Progress number */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="mt-4 font-mono text-xs text-text-muted tracking-widest"
          >
            {Math.round(progress)}%
          </motion.p>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
