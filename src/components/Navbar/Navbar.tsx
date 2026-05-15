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

function GithubIcon() {
  return (
    <svg
      className={styles.phoneIcon}
      viewBox="0 0 24 24"
      aria-hidden="true"
      focusable="false"
    >
      <path
        d="M12 2.6c-5.2 0-9.4 4.2-9.4 9.4 0 4.1 2.7 7.7 6.5 8.9.5.1.7-.2.7-.5v-1.8c-2.7.6-3.2-1.1-3.2-1.1-.4-1.1-1-1.4-1-1.4-.9-.6.1-.6.1-.6 1 .1 1.5 1 1.5 1 .8 1.5 2.2 1 2.7.8.1-.6.3-1 .6-1.3-2.1-.2-4.4-1.1-4.4-4.7 0-1 .4-1.9 1-2.6-.1-.2-.4-1.2.1-2.5 0 0 .8-.3 2.7 1 .8-.2 1.6-.3 2.5-.3.8 0 1.7.1 2.5.3 1.8-1.3 2.7-1 2.7-1 .5 1.3.2 2.3.1 2.5.6.7 1 1.5 1 2.6 0 3.6-2.2 4.5-4.4 4.7.4.3.7.9.7 1.8v2.6c0 .3.2.6.7.5 3.8-1.3 6.5-4.8 6.5-8.9 0-5.2-4.2-9.4-9.4-9.4z"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.45"
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
          aria-label="Mohamed Hassoun home"
          onClick={(event) => {
            event.preventDefault();
            scrollToHash('#home');
          }}
        >
          <LogoIcon />
          <span className={styles.wordmark}>HASSOUN</span>
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
          href={CONTACT.social.github}
          className={styles.cta}
          target="_blank"
          rel="noopener noreferrer"
        >
          <GithubIcon />
          <span>GitHub</span>
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
            href={CONTACT.social.github}
            className={styles.mobileCta}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => setMenuOpen(false)}
          >
            GitHub
          </a>
        </div>
      </div>
    </>
  );
}
