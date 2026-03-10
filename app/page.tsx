'use client'

import { useEffect, useRef, useState } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { ScrollToPlugin } from 'gsap/ScrollToPlugin'
import Loader from '@/components/load'
import Hero from '@/components/hero'
import About from '@/components/about'
import Skills from '@/components/skills'
import Projects from '@/components/projects'
import Testimonials from '@/components/testimonials'
import Contact from '@/components/contact'

gsap.registerPlugin(ScrollTrigger, ScrollToPlugin)

export default function Page() {
  const [ready, setReady] = useState(false)
  const rootRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!ready) return
    const ctx = gsap.context(() => {
      ;['about', 'skills', 'projects', 'contact'].forEach((id) => {
        ScrollTrigger.create({
          trigger: `#${id}`,
          start: 'top top',
          end: '+=120%',
          pin: true,
          scrub: 1.2,
        })
      })
    }, rootRef)
    return () => ctx.revert()
  }, [ready])

  const handleExplore = () => {
    gsap.to(window, { duration: 1.2, scrollTo: '#about', ease: 'power2.inOut' })
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
