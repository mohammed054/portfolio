'use client';

import { useEffect, useRef, useState } from 'react';
import { useSceneStore } from '@/store/scene';

const NAV_ITEMS = [
  { id: 'about',   label: 'About' },
  { id: 'work',    label: 'Work' },
  { id: 'contact', label: 'Contact' },
];

export default function Navigation() {
  const heroExited = useSceneStore(s => s.heroExited);
  const [scrolled, setScrolled] = useState(false);
  const [active,   setActive]   = useState('');
  const rafRef = useRef<number>(0);

  /* Show on scroll / hero exit */
  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 40);

      /* Active section detection */
      for (const item of NAV_ITEMS) {
        const el = document.getElementById(item.id);
        if (!el) continue;
        const rect = el.getBoundingClientRect();
        if (rect.top <= window.innerHeight * 0.55 && rect.bottom >= 0) {
          setActive(item.id);
          break;
        }
      }
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  const isVisible = heroExited;

  return (
    <nav
      className={`nav-root${isVisible ? ' nav-visible' : ''}${scrolled ? ' nav-scrolled' : ''}`}
      role="navigation"
      aria-label="Primary navigation"
    >
      {/* Logo */}
      <button
        className="nav-logo"
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        aria-label="Scroll to top"
      >
        MH
      </button>

      {/* Nav links */}
      <ul className="nav-links" role="list">
        {NAV_ITEMS.map(item => (
          <li key={item.id}>
            <button
              className={`nav-link${active === item.id ? ' active' : ''}`}
              onClick={() => scrollTo(item.id)}
              aria-current={active === item.id ? 'page' : undefined}
            >
              {item.label}
            </button>
          </li>
        ))}
      </ul>

      {/* Availability CTA */}
      <a
        href="mailto:hello@mohammedhassoun.dev"
        className="nav-cta"
        aria-label="Contact Mohammed Hassoun"
      >
        <span className="nav-avail-dot" aria-hidden="true" />
        Available
      </a>
    </nav>
  );
}