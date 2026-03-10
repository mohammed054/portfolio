'use client'
import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useScrollProgress } from '@/hooks'
import { personal } from '@/lib/data'

/**
 * Navigation — Design System compliance:
 * Colors:   --accent1, --border, --surface, --text-secondary, --text-primary, --background
 * Type:     font-display for logo; font-body 500 --t-14 for links
 * Motion:   --dur-base (300ms) transitions; --ease-std; --dur-slow (600ms) entrance
 * Spacing:  --sp-* units only
 */

const NAV_LINKS = [
  { label: 'About',        href: '#about' },
  { label: 'Skills',       href: '#skills' },
  { label: 'Projects',     href: '#projects' },
  { label: 'Testimonials', href: '#testimonials' },
  { label: 'Contact',      href: '#contact' },
]

function scrollTo(href: string) {
  const el = document.querySelector(href)
  if (el) el.scrollIntoView({ behavior: 'smooth' })
}

export default function Navigation() {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const progress = useScrollProgress()

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 48)
    window.addEventListener('scroll', fn, { passive: true })
    return () => window.removeEventListener('scroll', fn)
  }, [])

  const handleLink = (href: string) => {
    setMenuOpen(false)
    scrollTo(href)
  }

  return (
    <>
      {/* Scroll progress — accent1 → accent2 gradient, 1px */}
      <div
        className="fixed top-0 left-0 z-50 h-px pointer-events-none"
        style={{
          width: `${progress * 100}%`,
          background: 'linear-gradient(90deg, var(--accent1), var(--accent2))',
          transition: `width var(--dur-fast) var(--ease-std)`,
        }}
        aria-hidden="true"
      />

      {/* Nav bar */}
      <motion.header
        className="fixed top-0 left-0 right-0 z-40"
        style={{
          background: scrolled ? 'rgba(14,18,32,0.65)' : 'transparent',
          backdropFilter: scrolled ? 'blur(16px)' : 'none',
          borderBottom: scrolled ? '1px solid var(--border)' : '1px solid transparent',
          transition: `background var(--dur-base) var(--ease-std),
                       border-color var(--dur-base) var(--ease-std)`,
        }}
        initial={{ y: -72 }}
        animate={{ y: 0 }}
        transition={{
          duration: 0.6,                            /* --dur-slow */
          ease: [0.22, 1, 0.36, 1],                /* --ease-enter */
          delay: 0.1,
        }}
      >
        <nav
          className="section-inner flex items-center justify-between"
          style={{ padding: 'var(--sp-4) var(--sp-6)' }}
          role="navigation"
          aria-label="Main navigation"
        >
          {/* Logo — font-display 700, accent1 */}
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            style={{
              fontFamily: 'var(--font-display)',
              fontWeight: 700,
              fontSize: 'var(--t-20)',
              color: 'var(--text-primary)',
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              lineHeight: 'var(--lh-heading)',
              transition: `color var(--dur-base) var(--ease-std)`,
            }}
            onMouseEnter={e => (e.currentTarget.style.color = 'var(--accent1)')}
            onMouseLeave={e => (e.currentTarget.style.color = 'var(--text-primary)')}
            aria-label="Scroll to top"
          >
            <span style={{ color: 'var(--accent1)' }}>{personal.initials}</span>
          </button>

          {/* Desktop links — body 500, t-14, text-secondary */}
          <ul
            className="hidden md:flex items-center list-none"
            style={{ gap: 'var(--sp-8)' }}
          >
            {NAV_LINKS.map((link, i) => (
              <li key={link.label}>
                <motion.button
                  onClick={() => handleLink(link.href)}
                  initial={{ opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.15 + i * 0.06, duration: 0.3 }}
                  style={{
                    fontFamily: 'var(--font-body)',
                    fontWeight: 500,
                    fontSize: 'var(--t-14)',
                    color: 'var(--text-secondary)',
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    padding: '4px 0',
                    position: 'relative',
                    transition: `color var(--dur-base) var(--ease-std)`,
                  }}
                  onMouseEnter={e => (e.currentTarget.style.color = 'var(--text-primary)')}
                  onMouseLeave={e => (e.currentTarget.style.color = 'var(--text-secondary)')}
                >
                  {link.label}
                  {/* Animated underline: accent1, 300ms */}
                  <span
                    style={{
                      position: 'absolute',
                      bottom: 0,
                      left: 0,
                      width: '0%',
                      height: '1px',
                      background: 'var(--accent1)',
                      transition: `width var(--dur-base) var(--ease-enter)`,
                    }}
                    className="link-underline"
                  />
                </motion.button>
              </li>
            ))}
          </ul>

          {/* CTA — btn-primary token */}
          <motion.button
            className="hidden md:block btn btn-primary"
            onClick={() => handleLink('#contact')}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            style={{ padding: '10px var(--sp-6)' }}
          >
            <span>Let's Talk</span>
          </motion.button>

          {/* Mobile hamburger */}
          <button
            className="md:hidden flex flex-col justify-center items-center"
            style={{ gap: '6px', padding: 'var(--sp-2)', background: 'none', border: 'none', cursor: 'pointer' }}
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label={menuOpen ? 'Close navigation' : 'Open navigation'}
            aria-expanded={menuOpen}
            aria-controls="mobile-nav"
          >
            {[0, 1, 2].map((_, i) => (
              <motion.span
                key={i}
                style={{ display: 'block', width: '20px', height: '1px', background: 'var(--text-primary)', borderRadius: '1px' }}
                animate={
                  menuOpen
                    ? i === 0 ? { rotate: 45, y: 7 }
                    : i === 1 ? { opacity: 0 }
                    : { rotate: -45, y: -7 }
                    : { rotate: 0, y: 0, opacity: 1 }
                }
                transition={{ duration: 0.2 }}
              />
            ))}
          </button>
        </nav>
      </motion.header>

      {/* Mobile overlay menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            id="mobile-nav"
            className="fixed inset-0 z-30 md:hidden flex flex-col items-center justify-center"
            style={{
              background: 'rgba(8,11,20,0.97)',
              backdropFilter: 'blur(20px)',
              gap: 'var(--sp-8)',
            }}
            initial={{ opacity: 0, scale: 0.97 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.97 }}
            transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
          >
            {NAV_LINKS.map((link, i) => (
              <motion.button
                key={link.label}
                onClick={() => handleLink(link.href)}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.06 }}
                style={{
                  fontFamily: 'var(--font-display)',
                  fontWeight: 800,
                  fontSize: 'var(--t-32)',
                  color: 'var(--text-secondary)',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  lineHeight: 'var(--lh-display)',
                  transition: `color var(--dur-base) var(--ease-std)`,
                }}
                onMouseEnter={e => (e.currentTarget.style.color = 'var(--accent1)')}
                onMouseLeave={e => (e.currentTarget.style.color = 'var(--text-secondary)')}
              >
                {link.label}
              </motion.button>
            ))}
            <motion.button
              className="btn btn-primary"
              onClick={() => handleLink('#contact')}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: NAV_LINKS.length * 0.06 }}
              style={{ marginTop: 'var(--sp-4)' }}
            >
              <span>Let's Talk</span>
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Underline hover style — injected once */}
      <style>{`
        button:hover .link-underline { width: 100% !important; }
      `}</style>
    </>
  )
}
