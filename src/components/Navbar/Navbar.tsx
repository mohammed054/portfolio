import { Link } from 'react-router-dom';
import styles from './Navbar.module.css';

const navLinks = [
  { to: '#home', label: 'Home' },
  { to: '#work', label: 'Selected Work' },
  { to: '#about-us', label: 'About Us' },
  { to: '#contact', label: 'Contact' },
];

function Navbar() {
  return (
    <nav className={styles.navbar}>
      <div className={styles.logo}>
        <svg className={styles.logoIcon} viewBox="0 0 40 40" fill="none">
          <rect x="0" y="0" width="40" height="6" fill="var(--color-rainbow-1)" />
          <rect x="0" y="8" width="40" height="6" fill="var(--color-rainbow-2)" />
          <rect x="0" y="16" width="40" height="6" fill="var(--color-rainbow-3)" />
          <rect x="0" y="24" width="40" height="6" fill="var(--color-rainbow-4)" />
          <rect x="0" y="32" width="40" height="6" fill="var(--color-rainbow-5)" />
        </svg>
        <span className={styles.logoText}>SHADER</span>
      </div>
      
      <ul className={styles.navLinks}>
        {navLinks.map((link) => (
          <li key={link.to}>
            <a href={link.to} className={styles.navLink}>
              {link.label}
            </a>
          </li>
        ))}
      </ul>

      <a href="https://cal.com/simon-hedlund-kglzne" target="_blank" rel="noopener noreferrer" className={styles.bookCall}>
        <svg className={styles.phoneIcon} viewBox="0 0 24 24" fill="currentColor">
          <path d="M20.01 15.38c-1.23 0-2.42-.2-3.53-.56a.977.977 0 0 0-1.01.24l-2.2 2.2a15.161 15.161 0 0 1-6.59-6.59l2.2-2.21a.96.96 0 0 0 .25-1A11.36 11.36 0 0 1 8.56 3.98c0-1.23.2-2.42.56-3.53a.98.98 0 0 0-.24-1.01L6.21.82C5.88.54 5.4.38 4.9.38c-1.06 0-2.13.85-2.82 1.74C1.23 3.13.96 5.5.96 7.46c0 .89.14 1.76.4 2.58a.97.97 0 0 0 .68.86l1.44.37c.56.14 1.14.21 1.73.21.5 0 1-.04 1.48-.12a.97.97 0 0 0 .88-.49l.6-1.25c.3-.63.46-1.32.46-2.04 0-1.83-1.42-3.32-3.17-3.32-.19 0-.38.02-.56.04l-.37-.74c.3-.14.58-.31.85-.5l1.25 1.25c.27.27.4.63.37 1a2.42 2.42 0 0 1-.5 1.28l-.6 1.25a.97.97 0 0 0 0 1.12c.16.32.43.58.76.73l1.44.37c.73.19 1.52.29 2.33.29 2.76 0 5.02-2.14 5.36-4.86a.97.97 0 0 0-.4-1.02l-1.38-1.38c.21-.3.37-.63.49-.98l.74.37z"/>
        </svg>
        Book a call
      </a>
    </nav>
  );
}

export default Navbar;