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
      viewBox="0 0 24 24"
      aria-hidden="true"
      focusable="false"
    >
      <path
        d="M7.6 3.5c.4-.4 1-.5 1.5-.2l2.1 1.2c.6.3.8 1 .6 1.6L11 8.4c-.1.4 0 .8.3 1.1l3.2 3.2c.3.3.7.4 1.1.3l2.3-.9c.6-.2 1.3 0 1.6.6l1.2 2.1c.3.5.2 1.1-.2 1.5l-1.7 1.7c-.7.7-1.7 1-2.7.8-2.7-.6-5.6-2.6-8.1-5.1S3.4 8.6 2.8 5.9c-.2-1 .1-2 .8-2.7z"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
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
