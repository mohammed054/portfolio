import { useEffect, useRef } from 'react'
import Lenis from 'lenis'
import { useSystemStore } from '../core/ExperienceProvider.jsx'
import { lenisEasing } from '../utils/easing.js'
import { SCROLL } from '../config/variables.js'

export function useScroll() {
  const lenisRef = useRef(null)
  const setProgress = useSystemStore((s) => s.setProgress)
  const rafRef = useRef(null)

  useEffect(() => {
    console.log('[useScroll] Initializing Lenis with config:', SCROLL)
    
    const lenis = new Lenis({
      duration: SCROLL.duration,
      easing: lenisEasing,
      smoothWheel: true,
      wheelMultiplier: 1.0,
      touchMultiplier: 2.0,
    })

    console.log('[useScroll] Lenis instance:', lenis)
    lenisRef.current = lenis

    lenis.on('scroll', ({ progress }) => {
      console.log('[useScroll] Scroll event - progress:', progress)
      setProgress(progress)
    })

    function raf(time) {
      lenis.raf(time)
      rafRef.current = requestAnimationFrame(raf)
    }

    rafRef.current = requestAnimationFrame(raf)

    return () => {
      console.log('[useScroll] Cleaning up Lenis')
      cancelAnimationFrame(rafRef.current)
      lenis.destroy()
    }
  }, [setProgress])

  return lenisRef
}
