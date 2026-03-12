'use client'

import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { ScrollToPlugin } from 'gsap/ScrollToPlugin'
import { motion, AnimatePresence, useMotionValue, useSpring } from 'framer-motion'

import Load         from '@/components/load'
import Hero         from '@/components/hero'
import About        from '@/components/about'
import Skills       from '@/components/skills'
import Projects     from '@/components/projects'
import Testimonials from '@/components/testimonials'
import Contact      from '@/components/contact'

gsap.registerPlugin(ScrollTrigger, ScrollToPlugin)

const SECTIONS = [
  { id: 'about',        label: 'About'       },
  { id: 'skills',       label: 'Skills'      },
  { id: 'projects',     label: 'Projects'    },
  { id: 'testimonials', label: 'Recognition' },
  { id: 'contact',      label: 'Contact'     },
] as const
type SectionId = typeof SECTIONS[number]['id']

/* ── Smooth scroll ─────────────────────────────────────────────────────────── */
function initSmoothScroll(damping = 0.08) {
  if (typeof window === 'undefined') return () => {}
  let targetY  = window.scrollY
  let currentY = window.scrollY
  let rafId: number

  const onWheel = (e: WheelEvent) => {
    e.preventDefault()
    const maxY = document.documentElement.scrollHeight - window.innerHeight
    targetY = Math.max(0, Math.min(maxY, targetY + e.deltaY * 1.2))
  }
  const onScroll = () => {
    if (Math.abs(window.scrollY - currentY) > 4) {
      currentY = window.scrollY
      targetY  = window.scrollY
    }
  }
  const loop = () => {
    rafId = requestAnimationFrame(loop)
    const diff = targetY - currentY
    if (Math.abs(diff) < 0.05) return
    currentY += diff * damping
    window.scrollTo(0, currentY)
    ScrollTrigger.update()
  }

  window.addEventListener('wheel',  onWheel,  { passive: false })
  window.addEventListener('scroll', onScroll, { passive: true })
  loop()

  return () => {
    cancelAnimationFrame(rafId)
    window.removeEventListener('wheel',  onWheel)
    window.removeEventListener('scroll', onScroll)
  }
}

/* ── Page ──────────────────────────────────────────────────────────────────── */
export default function Page() {
  const [loaderDone, setLoaderDone] = useState(false)
  const [heroDone,   setHeroDone]   = useState(false)
  const [activeSection, setActiveSection] = useState<SectionId>('about')

  const rootRef  = useRef<HTMLDivElement>(null)
  const smoothStop = useRef<(() => void) | null>(null)

  /* Custom cursor */
  const cx = useMotionValue(-200)
  const cy = useMotionValue(-200)
  const sx = useSpring(cx, { stiffness: 500, damping: 35 })
  const sy = useSpring(cy, { stiffness: 500, damping: 35 })
  const [curHov, setCurHov] = useState(false)

  useEffect(() => {
    const fn = (e: MouseEvent) => { cx.set(e.clientX); cy.set(e.clientY) }
    window.addEventListener('mousemove', fn)
    return () => window.removeEventListener('mousemove', fn)
  }, [cx, cy])

  useEffect(() => {
    if (!heroDone) return
    const els = document.querySelectorAll('a, button, [data-cursor-hover]')
    const on  = () => setCurHov(true)
    const off = () => setCurHov(false)
    els.forEach(el => { el.addEventListener('mouseenter', on); el.addEventListener('mouseleave', off) })
    return () => els.forEach(el => { el.removeEventListener('mouseenter', on); el.removeEventListener('mouseleave', off) })
  }, [heroDone])

  /* Scroll lock until loader done */
  useEffect(() => {
    document.body.style.overflow = loaderDone ? '' : 'hidden'
  }, [loaderDone])

  /* Smooth scroll starts only after hero exits */
  useEffect(() => {
    if (!heroDone) return
    window.scrollTo({ top: 0 })
    smoothStop.current = initSmoothScroll(0.075)
    return () => { smoothStop.current?.() }
  }, [heroDone])

  /* GSAP section triggers */
  useLayoutEffect(() => {
    if (!heroDone) return
    const ctx = gsap.context(() => {
      SECTIONS.forEach(({ id }) => {
        const el = document.getElementById(id)
        if (!el) return
        ScrollTrigger.create({
          trigger: el, start: 'top 55%', end: 'bottom 45%',
          onEnter:     () => setActiveSection(id as SectionId),
          onEnterBack: () => setActiveSection(id as SectionId),
        })
        gsap.fromTo(
          el,
          { opacity: 0, y: 40 },
          { opacity: 1, y: 0, duration: 1, ease: 'power2.out',
            scrollTrigger: { trigger: el, start: 'top 80%', end: 'top 30%', scrub: 1.2 } }
        )
      })
    }, rootRef)
    return () => ctx.revert()
  }, [heroDone])

  /* Keyboard nav */
  useEffect(() => {
    if (!heroDone) return
    const ids = SECTIONS.map(s => s.id)
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== 'ArrowDown' && e.key !== 'ArrowUp') return
      e.preventDefault()
      const cur  = ids.indexOf(activeSection)
      const next = e.key === 'ArrowDown' ? Math.min(ids.length - 1, cur + 1) : Math.max(0, cur - 1)
      const el   = document.getElementById(ids[next])
      if (el) gsap.to(window, { duration: 1.2, scrollTo: el, ease: 'power3.inOut' })
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [heroDone, activeSection])

  return (
    <>
      {/* ── Custom cursor ── */}
      <motion.div
        aria-hidden
        style={{
          position: 'fixed', left: sx, top: sy,
          width: curHov ? 36 : 10, height: curHov ? 36 : 10,
          borderRadius: '50%',
          background: curHov ? 'transparent' : '#4F8EF7',
          border: curHov ? '1px solid rgba(79,142,247,0.6)' : 'none',
          transform: 'translate(-50%, -50%)',
          pointerEvents: 'none', zIndex: 9999, mixBlendMode: 'screen',
          transition: 'width 0.2s, height 0.2s, background 0.2s',
        }}
      />

      {/* ── Progress bar ── */}
      <AnimatePresence>
        {heroDone && (
          <motion.div
            key="pbar"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            style={{
              position: 'fixed', top: 0, left: 0, height: 2,
              zIndex: 1000, pointerEvents: 'none',
              background: 'linear-gradient(90deg, #4F8EF7, #8B5CF6)',
              width: `${(SECTIONS.findIndex(s => s.id === activeSection) + 1) / SECTIONS.length * 100}%`,
              transition: 'width 0.5s cubic-bezier(0.4,0,0.2,1)',
            }}
          />
        )}
      </AnimatePresence>

      {/* ── Side nav dots ── */}
      <AnimatePresence>
        {heroDone && (
          <motion.nav
            key="sidenav"
            initial={{ opacity: 0, x: 12 }} animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 }}
            style={{
              position: 'fixed', right: '1.75rem', top: '50%',
              transform: 'translateY(-50%)',
              display: 'flex', flexDirection: 'column', gap: '14px',
              zIndex: 1000,
            }}
          >
            {SECTIONS.map(({ id, label }) => (
              <button
                key={id} title={label} data-cursor-hover
                onClick={() => {
                  const el = document.getElementById(id)
                  if (el) gsap.to(window, { duration: 1.2, scrollTo: el, ease: 'power3.inOut' })
                }}
                style={{
                  width: 6, height: 6, borderRadius: '50%',
                  border: 'none', cursor: 'pointer', padding: 0,
                  background: activeSection === id ? '#4F8EF7' : 'rgba(255,255,255,0.15)',
                  transform: activeSection === id ? 'scale(1.5)' : 'scale(1)',
                  transition: 'all 0.3s',
                }}
              />
            ))}
          </motion.nav>
        )}
      </AnimatePresence>

      {/* ── LOADER ──
           NOTE: If your Load component uses "onDone" as the prop name,
           change onComplete → onDone below. Check components/load/index.tsx.
      ── */}
      <AnimatePresence>
        {!loaderDone && (
          <Load
            key="loader"
            onDone={() => setTimeout(() => setLoaderDone(true), 120)}
          />
        )}
      </AnimatePresence>

      {/* ── HERO — fixed overlay, exits via black hole ── */}
      <AnimatePresence>
        {loaderDone && !heroDone && (
          <Hero
            key="hero"
            onComplete={() => setHeroDone(true)}
          />
        )}
      </AnimatePresence>

      {/* ── SECTIONS — visible after hero exits ── */}
      <AnimatePresence>
        {heroDone && (
          <motion.div
            key="main"
            ref={rootRef}
            initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            style={{ position: 'relative', width: '100%', overflowX: 'hidden' }}
          >
            <section id="about">        <About />        </section>
            <SectionDivider />
            <section id="skills">       <Skills />       </section>
            <SectionDivider />
            <section id="projects">     <Projects />     </section>
            <SectionDivider />
            <section id="testimonials"> <Testimonials /> </section>
            <SectionDivider />
            <section id="contact">      <Contact />      </section>

            <footer style={{
              padding: '3rem 2rem', textAlign: 'center',
              borderTop: '1px solid rgba(26,32,53,0.8)',
              background: '#080B14',
            }}>
              <span style={{
                fontFamily: 'var(--font-mono, "JetBrains Mono", monospace)',
                fontSize: '9px', letterSpacing: '0.3em',
                color: '#3D4A66', textTransform: 'uppercase',
              }}>
                Mohammed Hassoun  ·  {new Date().getFullYear()}
              </span>
            </footer>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}

/* ── Section divider ── */
function SectionDivider() {
  return (
    <div aria-hidden style={{ position: 'relative', height: 100, overflow: 'hidden', pointerEvents: 'none' }}>
      <div style={{
        position: 'absolute', inset: 0,
        background: 'radial-gradient(ellipse 70% 1px at 50% 50%, rgba(79,142,247,0.15) 0%, transparent 100%)',
      }} />
      <motion.div
        animate={{ backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'] }}
        transition={{ duration: 7, repeat: Infinity, ease: 'linear' }}
        style={{
          position: 'absolute', left: '12%', right: '12%', top: '50%', height: 1,
          background: 'linear-gradient(90deg, transparent, #4F8EF7, #8B5CF6, #4F8EF7, transparent)',
          backgroundSize: '200% 100%', opacity: 0.35,
        }}
      />
    </div>
  )
}