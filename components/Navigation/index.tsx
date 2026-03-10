'use client'
import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useScrollProgress } from '@/hooks'
import { personal } from '@/lib/data'

const navLinks = [
  { label: 'About',        href: '#about' },
  { label: 'Skills',       href: '#skills' },
  { label: 'Projects',     href: '#projects' },
  { label: 'Testimonials', href: '#testimonials' },
  { label: 'Contact',      href: '#contact' },
]

export default function Navigation() {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const scrollProgress = useScrollProgress()

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 60)
    window.addEventListener('scroll', handler, { passive: true })
    return () => window.removeEventListener('scroll', handler)
  }, [])

  const handleNavClick = (href: string) => {
    setMenuOpen(false)
    const el = document.querySelector(href)
    if (el) el.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <>
      {/* Scroll progress bar */}
      <motion.div
        className="fixed top-0 left-0 h-px z-50"
        style={{
          width: `${scrollProgress * 100}%`,
          background: 'linear-gradient(90deg, #4F8EF7, #8B5CF6)',
        }}
      />

      <motion.header
        className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
          scrolled ? 'glass border-b border-border' : 'bg-transparent'
        }`}
        initial={{ y: -80 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1], delay: 0.1 }}
      >
        <nav
          className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between"
          role="navigation"
          aria-label="Main navigation"
        >
          {/* Logo / Wordmark */}
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="font-syne font-bold text-lg text-text-primary hover:text-accent transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent rounded"
            aria-label="Scroll to top"
          >
            <span className="text-accent">{personal.initials}</span>
          </button>

          {/* Desktop links */}
          <ul className="hidden md:flex items-center gap-8 list-none">
            {navLinks.map((link, i) => (
              <li key={link.label}>
                <motion.button
                  onClick={() => handleNavClick(link.href)}
                  className="font-dm text-sm text-text-secondary hover:text-text-primary transition-colors duration-200 relative group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent rounded px-1 py-0.5"
                  initial={{ opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.15 + i * 0.06, duration: 0.4 }}
                >
                  {link.label}
                  <span className="absolute bottom-0 left-0 w-0 h-px bg-accent group-hover:w-full transition-all duration-300" />
                </motion.button>
              </li>
            ))}
          </ul>

          {/* CTA */}
          <motion.button
            onClick={() => handleNavClick('#contact')}
            className="hidden md:block font-dm text-sm px-4 py-2 rounded-lg border border-accent text-accent hover:bg-accent hover:text-bg transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            Let's Talk
          </motion.button>

          {/* Mobile hamburger */}
          <button
            className="md:hidden flex flex-col gap-1.5 p-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent rounded"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label={menuOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={menuOpen}
          >
            <motion.span
              className="block w-5 h-px bg-text-primary"
              animate={menuOpen ? { rotate: 45, y: 5 } : { rotate: 0, y: 0 }}
              transition={{ duration: 0.2 }}
            />
            <motion.span
              className="block w-5 h-px bg-text-primary"
              animate={menuOpen ? { opacity: 0 } : { opacity: 1 }}
              transition={{ duration: 0.2 }}
            />
            <motion.span
              className="block w-5 h-px bg-text-primary"
              animate={menuOpen ? { rotate: -45, y: -5 } : { rotate: 0, y: 0 }}
              transition={{ duration: 0.2 }}
            />
          </button>
        </nav>
      </motion.header>

      {/* Mobile menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            className="fixed inset-0 z-30 glass flex flex-col items-center justify-center gap-8 md:hidden"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
          >
            {navLinks.map((link, i) => (
              <motion.button
                key={link.label}
                onClick={() => handleNavClick(link.href)}
                className="font-syne text-3xl font-bold text-text-secondary hover:text-accent transition-colors duration-200"
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.07 }}
              >
                {link.label}
              </motion.button>
            ))}
            <motion.button
              onClick={() => handleNavClick('#contact')}
              className="mt-4 font-dm text-base px-8 py-3 rounded-lg border border-accent text-accent hover:bg-accent hover:text-bg transition-all duration-200"
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: navLinks.length * 0.07 }}
            >
              Let's Talk
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
