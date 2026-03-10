'use client'
import { useState } from 'react'
import dynamic from 'next/dynamic'

// Loader (critical path — no lazy loading)
import Loader from '@/components/Loader'

// Navigation
import Navigation from '@/components/Navigation'

// Sections — lazy loaded for performance
const Hero = dynamic(() => import('@/components/Hero'), {
  ssr: false,
  loading: () => <div className="h-screen bg-bg" aria-hidden="true" />,
})

const About = dynamic(() => import('@/components/About'), {
  loading: () => <div className="h-96 bg-bg" aria-hidden="true" />,
})

const Skills = dynamic(() => import('@/components/Skills'), {
  loading: () => <div className="h-96 bg-bg" aria-hidden="true" />,
})

const Projects = dynamic(() => import('@/components/Projects'), {
  loading: () => <div className="h-96 bg-bg" aria-hidden="true" />,
})

const Testimonials = dynamic(() => import('@/components/Testimonials'), {
  loading: () => <div className="h-96 bg-bg" aria-hidden="true" />,
})

const Contact = dynamic(() => import('@/components/Contact'), {
  loading: () => <div className="h-96 bg-bg" aria-hidden="true" />,
})

export default function Home() {
  const [loaderDone, setLoaderDone] = useState(false)

  return (
    <main>
      {/* Loading screen */}
      <Loader onComplete={() => setLoaderDone(true)} />

      {/* Site content — rendered after loader */}
      {loaderDone && (
        <>
          <Navigation />

          {/* Skip nav for accessibility */}
          <a
            href="#about"
            className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-50 glass px-4 py-2 rounded-lg text-accent font-dm text-sm"
          >
            Skip to content
          </a>

          <Hero />
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
