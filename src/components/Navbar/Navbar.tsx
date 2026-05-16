import { useEffect, useState } from 'react';
import { CONTACT, NAV_LINKS } from '../../utils/constants';
import styles from './Navbar.module.css';

function scrollToHash(href: string) {
  const target = document.querySelector(href);

  if (!target) {
    return;
  }

  const prefersReducedMotion = window.matchMedia(
    '(prefers-reduced-motion: reduce)',
  ).matches;

  target.scrollIntoView({
    behavior: prefersReducedMotion ? 'auto' : 'smooth',
    block: 'start',
  });

  history.pushState(null, '', href);
}

export function Navbar() {
  const [activeSection, setActiveSection] = useState('home');
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const sections = NAV_LINKS.map((link) => ({
      id: link.sectionId ?? '',
      element: link.href ? document.querySelector(link.href) : null,
    })).filter((section): section is { id: string; element: Element } =>
      Boolean(section.id && section.element),
    );

    const observer = new IntersectionObserver(
      (entries) => {
        const current = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];

        if (current?.target.id) {
          setActiveSection(current.target.id);
          document.body.dataset.activeSection = current.target.id;
        }
      },
      {
        rootMargin: '-32% 0px -52% 0px',
        threshold: [0, 0.2, 0.5, 0.8],
      },
    );

    sections.forEach(({ element }) => observer.observe(element));

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!menuOpen) {
      return;
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setMenuOpen(false);
      }
    };

    document.addEventListener('keydown', handleKeyDown);

    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [menuOpen]);

  return (
    <>
      <header className={styles.navbar}>
        <a
          href="#home"
          className={styles.logo}
          aria-label="Mohamed Hassoun home"
          onClick={(event) => {
            event.preventDefault();
            scrollToHash('#home');
            setMenuOpen(false);
          }}
        >
          <span className={styles.logoMark}>MH</span>
          <span className={styles.wordmark}>Mohamed Hassoun</span>
        </a>

        <nav className={styles.links} aria-label="Main navigation">
          {NAV_LINKS.map((link) => {
            const isActive = link.sectionId === activeSection;

            return (
              <a
                key={link.label}
                href={link.href}
                className={`${styles.link} ${isActive ? styles.linkActive : ''}`}
                aria-current={isActive ? 'page' : undefined}
                onClick={(event) => {
                  event.preventDefault();
                  if (link.href) {
                    scrollToHash(link.href);
                  }
                }}
              >
                {link.label}
              </a>
            );
          })}
        </nav>

        <a href={CONTACT.calUrl} className={styles.cta}>
          Email Mohamed
        </a>

        <button
          type="button"
          className={styles.hamburger}
          aria-label="Open navigation menu"
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen(true)}
        >
          <span />
          <span />
          <span />
        </button>
      </header>

      {menuOpen && (
        <div className={styles.mobileMenu}>
          <button
            type="button"
            className={styles.mobileClose}
            aria-label="Close navigation menu"
            onClick={() => setMenuOpen(false)}
          >
            Close
          </button>

          <nav className={styles.mobileLinks} aria-label="Mobile navigation">
            {NAV_LINKS.map((link) => {
              const isActive = link.sectionId === activeSection;

              return (
                <a
                  key={link.label}
                  href={link.href}
                  className={`${styles.mobileLink} ${
                    isActive ? styles.mobileLinkActive : ''
                  }`}
                  onClick={(event) => {
                    event.preventDefault();
                    setMenuOpen(false);
                    if (link.href) {
                      scrollToHash(link.href);
                    }
                  }}
                >
                  {link.label}
                </a>
              );
            })}

            <a
              href={CONTACT.calUrl}
              className={styles.mobileCta}
              onClick={() => setMenuOpen(false)}
            >
              Email Mohamed
            </a>
          </nav>
        </div>
      )}
    </>
  );
}
