// ============================================================
// SHADER REBUILD — Navbar
// src/components/Navbar/Navbar.tsx
// ============================================================

import { useState, useEffect } from 'react';
import { NAV_LINKS, CONTACT } from '../../utils/constants';
import styles from './Navbar.module.css';

// ─── SVG SUB-COMPONENTS ──────────────────────────────────────

/** Rainbow speed-line icon — 6 horizontal stripes tapering right */
function ShaderLogoIcon() {
  const colors = ['#e63946', '#f4a261', '#e9c46a', '#2a9d8f', '#457b9d', '#6a0572'];
  const heights = [5, 4, 5, 4, 5, 4];
  const widths  = [32, 28, 24, 20, 16, 12]; // taper to the right

  let y = 0;
  return (
    <svg
      width="36"
      height="30"
      viewBox="0 0 36 30"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      {colors.map((color, i) => {
        const rect = (
          <rect
            key={i}
            x={0}
            y={y}
            width={widths[i]}
            height={heights[i]}
            rx={1}
            fill={color}
          />
        );
        y += heights[i] + 1;
        return rect;
      })}
    </svg>
  );
}

/** Retro telephone receiver SVG icon */
function TelephoneIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="currentColor"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <path d="M3.654 1.328a.678.678 0 0 0-1.015-.063L1.605 2.3c-.483.484-.661 1.169-.45 1.77a17.6 17.6 0 0 0 4.168 6.608 17.6 17.6 0 0 0 6.608 4.168c.601.211 1.286.033 1.77-.45l1.034-1.034a.678.678 0 0 0-.063-1.015l-2.307-1.794a.68.68 0 0 0-.58-.122l-2.19.547a1.75 1.75 0 0 1-1.657-.459L5.482 8.062a1.75 1.75 0 0 1-.46-1.657l.548-2.19a.68.68 0 0 0-.122-.58L3.654 1.328z" />
    </svg>
  );
}

// ─── MOBILE MENU ─────────────────────────────────────────────

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
  activeSection: string;
}

function MobileMenu({ isOpen, onClose, activeSection }: MobileMenuProps) {
  return (
    <div
      className={`${styles.mobileMenu} ${isOpen ? styles.mobileMenuOpen : ''}`}
      aria-hidden={!isOpen}
    >
      <button
        className={styles.mobileClose}
        onClick={onClose}
        aria-label="Close navigation menu"
      >
        ✕
      </button>
      <nav className={styles.mobileLinks}>
        {NAV_LINKS.map((link) => (
          <a
            key={link.sectionId}
            href={link.href}
            className={`${styles.mobileLink} ${
              activeSection === link.sectionId ? styles.mobileLinkActive : ''
            }`}
            onClick={onClose}
          >
            {link.label}
          </a>
        ))}
        <a
          href={CONTACT.calUrl}
          className={styles.mobileCta}
          target="_blank"
          rel="noopener noreferrer"
          onClick={onClose}
        >
          Book a call
        </a>
      </nav>
    </div>
  );
}

// ─── MAIN NAVBAR ─────────────────────────────────────────────

export function Navbar() {
  const [activeSection, setActiveSection] = useState('home');
  const [menuOpen, setMenuOpen] = useState(false);

  // Sync active section from body data attribute (set by SectionAnchor)
  useEffect(() => {
    const observer = new MutationObserver(() => {
      const section = document.body.dataset.activeSection ?? 'home';
      setActiveSection(section);
    });
    observer.observe(document.body, { attributes: true, attributeFilter: ['data-active-section'] });
    return () => observer.disconnect();
  }, []);

  return (
    <>
      <header className={styles.navbar} role="banner">
        {/* Logo */}
        <a href="#home" className={styles.logo} aria-label="Shader — back to top">
          <ShaderLogoIcon />
          <span className={styles.wordmark}>SHADER</span>
        </a>

        {/* Desktop navigation */}
        <nav className={styles.links} aria-label="Main navigation">
          {NAV_LINKS.map((link) => (
            <a
              key={link.sectionId}
              href={link.href}
              className={`${styles.link} ${
                activeSection === link.sectionId ? styles.linkActive : ''
              }`}
            >
              {link.label}
            </a>
          ))}
        </nav>

        {/* Desktop CTA */}
        <a
          href={CONTACT.calUrl}
          className={styles.cta}
          target="_blank"
          rel="noopener noreferrer"
        >
          <TelephoneIcon />
          <span>Book a call</span>
        </a>

        {/* Mobile hamburger */}
        <button
          className={styles.hamburger}
          onClick={() => setMenuOpen(true)}
          aria-label="Open navigation menu"
          aria-expanded={menuOpen}
        >
          <span />
          <span />
          <span />
        </button>
      </header>

      <MobileMenu
        isOpen={menuOpen}
        onClose={() => setMenuOpen(false)}
        activeSection={activeSection}
      />
    </>
  );
}
