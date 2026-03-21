'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSceneStore } from '@/store/scene';

const navItems = [
  { id: 'about',        label: 'About' },
  { id: 'skills',       label: 'Skills' },
  { id: 'projects',     label: 'Work' },
  { id: 'testimonials', label: 'Reviews' },
  { id: 'contact',      label: 'Contact' },
];

export default function Navigation() {
  const isLoaded = useSceneStore((s) => s.isLoaded);
  const activeSection = useSceneStore((s) => s.activeSection);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 60);
    window.addEventListener('scroll', handler, { passive: true });
    return () => window.removeEventListener('scroll', handler);
  }, []);

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <AnimatePresence>
      {isLoaded && (
        <motion.nav
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
          className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-8 py-6"
          style={{
            background: scrolled
              ? 'rgba(0, 0, 16, 0.85)'
              : 'transparent',
            backdropFilter: scrolled ? 'blur(16px)' : 'none',
            borderBottom: scrolled ? '1px solid rgba(28, 31, 45, 0.8)' : 'none',
            transition: 'all 0.4s ease',
          }}
        >
          {/* Logo */}
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="font-display font-bold text-lg text-text-primary tracking-widest hover:text-accent-primary transition-colors duration-300"
            aria-label="Scroll to top"
          >
            MH
          </button>

          {/* Nav links */}
          <ul className="hidden md:flex items-center gap-8 list-none">
            {navItems.map((item) => (
              <li key={item.id}>
                <button
                  onClick={() => scrollTo(item.id)}
                  className="relative font-body text-sm font-medium transition-colors duration-300"
                  style={{
                    color:
                      activeSection === item.id
                        ? 'var(--accent-secondary)'
                        : 'var(--text-secondary)',
                  }}
                  aria-current={activeSection === item.id ? 'page' : undefined}
                >
                  {item.label}
                  {/* Active indicator */}
                  {activeSection === item.id && (
                    <motion.span
                      layoutId="nav-indicator"
                      className="absolute -bottom-1 left-0 right-0 h-px"
                      style={{
                        background: 'linear-gradient(90deg, #7A3CFF, #00D0FF)',
                      }}
                    />
                  )}
                </button>
              </li>
            ))}
          </ul>

          {/* CTA */}
          <a
            href="mailto:hello@mohammedhassoun.dev"
            className="hidden md:flex items-center gap-2 font-mono text-xs tracking-widest px-4 py-2 rounded-full border border-border-subtle text-text-secondary hover:border-accent-primary hover:text-accent-primary transition-all duration-300"
          >
            <span
              className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse"
              aria-hidden="true"
            />
            Available
          </a>
        </motion.nav>
      )}
    </AnimatePresence>
  );
}
