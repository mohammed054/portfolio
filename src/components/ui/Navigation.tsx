'use client';

import { useEffect, useState } from 'react';
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

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 40);
      // When in PostHero, about is always the active section
      // PostHeroSection owns the full scroll range
      if (heroExited) {
        setActive('about');
        return;
      }
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
  }, [heroExited]);

  // Immediately mark about active when hero exits (before first scroll event)
  useEffect(() => {
    if (heroExited) setActive('about');
  }, [heroExited]);

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <nav
      className={`nav-root${heroExited ? ' nav-visible' : ''}${scrolled ? ' nav-scrolled' : ''}`}
      role="navigation"
      aria-label="Primary navigation"
    >
      <button
        className="nav-logo"
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        aria-label="Scroll to top"
      >
        MH
      </button>

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
    </nav>
  );
}