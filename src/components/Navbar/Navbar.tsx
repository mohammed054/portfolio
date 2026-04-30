import { useEffect, useMemo, useState } from 'react';
import { gsap } from 'gsap';
import { NAV_LINKS, SECTION_THEMES, CONTACT } from '../../utils/constants';
import styles from './Navbar.module.css';

function LogoIcon() {
  const stripes = [
    '#e63946',
    '#f4a261',
    '#e9c46a',
    '#2a9d8f',
    '#457b9d',
    '#6a0572',
  ];

  return (
    <svg
      className={styles.logoIcon}
      viewBox="0 0 92 40"
      aria-hidden="true"
      focusable="false"
    >
      {stripes.map((color, index) => (
        <path
          key={color}
          d={`M2 ${4 + index * 6} H${50 + index * 6} L${90 - index * 2} ${8 + index * 6} H2 Z`}
          fill={color}
        />
      ))}
    </svg>
  );
}

function TelephoneIcon() {
  return (
    <svg
      className={styles.phoneIcon}
      viewBox="0 0 32 32"
      aria-hidden="true"
      focusable="false"
    >
      <path
        d="M6.4 13.8c.9-4.7 5-8.1 9.8-8.1 4.6 0 8.6 3.1 9.7 7.5.2.9-.3 1.8-1.1 2.1l-4.1 1.5c-.8.3-1.7-.1-2.1-.9l-.7-1.5c-.3-.7-1-1.1-1.8-1.1h-.5c-.8 0-1.5.5-1.8 1.2l-.6 1.5c-.3.8-1.2 1.2-2 1l-3.8-1.2c-.8-.3-1.3-1.1-1.1-2z"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M12.2 19.4c.8 1.1 2.1 1.8 3.7 1.8 1.7 0 3-.7 3.8-1.9M10.1 22.6h11.8M13.2 25.6h5.6"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function Navbar() {
  const [activeSection, setActiveSection] = useState(
    document.body.dataset.activeSection ?? 'home',
  );
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const observer = new MutationObserver(() => {
      setActiveSection(document.body.dataset.activeSection ?? 'home');
    });

    observer.observe(document.body, {
      attributes: true,
      attributeFilter: ['data-active-section'],
    });

    return () => observer.disconnect();
  }, []);

  const theme = useMemo(
    () => SECTION_THEMES[activeSection] ?? 'light',
    [activeSection],
  );

  const scrollToHash = (href: string) => {
    const target = document.querySelector(href);
    if (!target) {
      return false;
    }

    gsap.to(window, {
      duration: 0.85,
      ease: 'power3.inOut',
      scrollTo: {
        y: target,
        offsetY: 0,
        autoKill: false,
      },
    });

    return true;
  };

  return (
    <>
      <header className={styles.navbar} data-theme={theme}>
        <a
          href="#home"
          className={styles.logo}
          aria-label="Shader home"
          onClick={(event) => {
            event.preventDefault();
            scrollToHash('#home');
          }}
        >
          <LogoIcon />
          <span className={styles.wordmark}>SHADER</span>
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

        <a
          href={CONTACT.calUrl}
          className={styles.cta}
          target="_blank"
          rel="noopener noreferrer"
        >
          <TelephoneIcon />
          <span>Book a call</span>
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

      <div
        className={`${styles.mobileMenu} ${menuOpen ? styles.mobileMenuOpen : ''}`}
        aria-hidden={!menuOpen}
      >
        <button
          type="button"
          className={styles.mobileClose}
          aria-label="Close navigation menu"
          onClick={() => setMenuOpen(false)}
        >
          Close
        </button>

        <div className={styles.mobileLinks}>
          {NAV_LINKS.map((link) => {
            const isActive = link.sectionId === activeSection;

            return (
              <a
                key={link.label}
                href={link.href}
                className={`${styles.mobileLink} ${isActive ? styles.mobileLinkActive : ''}`}
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
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => setMenuOpen(false)}
          >
            Book a call
          </a>
        </div>
      </div>
    </>
  );
}
