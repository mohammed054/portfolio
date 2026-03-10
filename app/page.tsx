'use client'

import { useEffect, useRef, useState } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Loader from '@/components/load'
import Hero from '@/components/hero'
import About from '@/components/about'
import Skills from '@/components/skills'
import Projects from '@/components/projects'
import Testimonials from '@/components/testimonials'
import Contact from '@/components/contact'

gsap.registerPlugin(ScrollTrigger)

export default function Page() {
  const [ready, setReady] = useState(false)
  const rootRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!ready) return
    const ctx = gsap.context(() => {
      const ids = ['about', 'skills', 'projects', 'contact']
      ids.forEach((id) => {
        ScrollTrigger.create({
          trigger: `#${id}`,
          start: 'top top',
          end: '+=120%',
          pin: true,
          scrub: 1,
        })
      })
    }, rootRef)
    return () => ctx.revert()
  }, [ready])

  const handleExplore = () => {
    const target = document.getElementById('about')
    if (!target) return
    target.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  return (
    <main ref={rootRef}>
      <Loader onDone={() => setReady(true)} />
      {ready && (
        <>
          <Hero onExplore={handleExplore} />
          <About />
          <Skills />
          <Projects />
          <Testimonials />
          <Contact />
        </>
      )}
    </main>
  )
}
