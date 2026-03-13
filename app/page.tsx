// app/page.tsx
'use client'

import React, { useRef, useState, useCallback, useEffect, Suspense } from 'react'
import { Canvas } from '@react-three/fiber'
import Universe from '../components/Universe'
import HeroWorld from '../components/HeroWorld'
import Worlds from '../components/Worlds'
import UIOverlay from '../components/UIOverlay'

export const SECTIONS = ['hero', 'projects', 'about', 'testimonials', 'contact'] as const
export type SectionName = (typeof SECTIONS)[number]
export const SECTION_COUNT = SECTIONS.length

export default function HomePage() {
  const [sectionIndex, setSectionIndex] = useState(0)
  const [isTransitioning, setIsTransitioning] = useState(false)
  const mousePos = useRef({ x: 0, y: 0 })
  const transitionTimer = useRef<NodeJS.Timeout>()

  // Throttled section navigation
  const goToSection = useCallback((index: number) => {
    if (isTransitioning) return
    const clamped = Math.max(0, Math.min(SECTION_COUNT - 1, index))
    if (clamped === sectionIndex) return
    setIsTransitioning(true)
    setSectionIndex(clamped)
    clearTimeout(transitionTimer.current)
    transitionTimer.current = setTimeout(() => setIsTransitioning(false), 1100)
  }, [sectionIndex, isTransitioning])

  // Keyboard navigation
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight' || e.key === 'ArrowDown') goToSection(sectionIndex + 1)
      if (e.key === 'ArrowLeft'  || e.key === 'ArrowUp')   goToSection(sectionIndex - 1)
      if (e.key >= '1' && e.key <= '5') goToSection(Number(e.key) - 1)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [goToSection, sectionIndex])

  // Global mouse tracking (normalised -1 to 1)
  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      mousePos.current.x = (e.clientX / window.innerWidth)  * 2 - 1
      mousePos.current.y = (e.clientY / window.innerHeight) * 2 - 1
    }
    window.addEventListener('mousemove', onMove)
    return () => window.removeEventListener('mousemove', onMove)
  }, [])

  return (
    <main
      style={{ width: '100vw', height: '100vh', overflow: 'hidden', background: '#080B14' }}
      aria-label="Mohammed Hassoun Portfolio"
    >
      {/* ── 3-D Canvas ─────────────────────────────────────────── */}
      <Canvas
        shadows
        dpr={[1, 2]}
        gl={{ antialias: true, alpha: false, powerPreference: 'high-performance' }}
        camera={{ position: [0, 0, 8], fov: 52, near: 0.1, far: 500 }}
        style={{ position: 'absolute', inset: 0 }}
      >
        <Suspense fallback={null}>
          {/* Camera rig, stars, lights */}
          <Universe
            sectionIndex={sectionIndex}
            onSectionChange={goToSection}
            mousePos={mousePos}
            isTransitioning={isTransitioning}
          />

          {/* Hero-only 3-D world */}
          <HeroWorld
            visible={sectionIndex === 0}
            mousePos={mousePos}
          />

          {/* All other section 3-D worlds */}
          <Worlds
            sectionIndex={sectionIndex}
            mousePos={mousePos}
          />
        </Suspense>
      </Canvas>

      {/* ── HTML / CSS UI layer ────────────────────────────────── */}
      <UIOverlay
        sectionIndex={sectionIndex}
        onSectionChange={goToSection}
        isTransitioning={isTransitioning}
      />

      {/* Accessibility: sr-only section hint */}
      <p className="sr-only" aria-live="polite">
        Current section: {SECTIONS[sectionIndex]}. Use arrow keys or swipe to navigate.
      </p>
    </main>
  )
}