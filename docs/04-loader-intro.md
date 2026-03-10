🎬 Loader / Intro Screen

Purpose: With heavy 3D, users otherwise see 2–4s of blank screen.
Turn it into a brand-building, elegant introduction.

1. Experience Flow

Page loads → branded loader appears instantly

Pure CSS / SVG / small JS

No blocking heavy scripts

Show animated initials or wordmark

Stroke animation on letters (Syne font)

Subtle glow effect using Accent 1 (#4F8EF7)

Loading bar fills as 3D assets load

Use useProgress() from Drei to track 3D asset loading

Optional: animate particles inside the loader

At 100% → elegant transition into Hero

Vertical split wipe or morphing transition

Canvas and hero scene appear instantly

Loader is never shown again for the session (sessionStorage flag)

2. Visual Design
Element	Style / Behavior
Background	#080B14 (deep navy-black)
Center	Initials in Syne 96px, stroke-animated, Accent 1 glow
Progress	Thin line below initials, Accent 1 fill, subtle pulse
Transition	Vertical split wipe → reveals hero underneath
3. Motion / Animation

Initials stroke animation → ~1.2s duration

Progress line fill → easing: cubic-bezier(0.22, 1, 0.36, 1)

Glow pulse → small scale: 1.02–1.04

Transition to Hero → vertical split wipe + fade-in

Use Framer Motion for springy animations, subtle physics for smoothness

4. Implementation Notes
import { useProgress } from '@react-three/drei'
import { motion } from 'framer-motion'

const Loader = () => {
  const { active, progress } = useProgress()

  // Session check: never show loader twice
  if (sessionStorage.getItem('loaderShown')) return null

  return (
    <div className="fixed inset-0 bg-[#080B14] flex flex-col items-center justify-center z-50">
      <motion.div
        className="text-white text-[96px] font-syne"
        initial={{ opacity: 0, strokeDashoffset: 100 }}
        animate={{ opacity: 1, strokeDashoffset: 0 }}
      >
        MH
      </motion.div>
      <motion.div
        className="h-1 w-64 bg-[#1A2035] mt-6 relative overflow-hidden"
        initial={{ scaleX: 0 }}
        animate={{ scaleX: progress / 100 }}
        transition={{ ease: [0.22, 1, 0.36, 1], duration: 0.6 }}
      >
        <div className="absolute inset-0 bg-[#4F8EF7]"/>
      </motion.div>
    </div>
  )
}

useProgress() tracks all 3D assets loaded

sessionStorage prevents repeated loader on page revisit

Loader should be lightweight, no heavy DOM / JS computations

5. Accessibility

Screen readers: aria-label="Loading Portfolio"

Respect prefers-reduced-motion: fallback → static initials + simple fade

Loader must not block keyboard focus

6. Key Takeaways

Loader = brand-first impression

Lightweight, fast, visually professional and clean

Smooth transition → hero scene

Never reappear in the same session

Fully responsive: scales properly on mobile, tablet, desktop