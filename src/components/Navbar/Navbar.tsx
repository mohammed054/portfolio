import './Navbar.css';

const RAINBOW = ['#ff2020','#ff8c00','#ffe000','#00c800','#0088ff','#8800ff'];

const NAV_LINKS = [
  { label: 'Home', href: '#' },
  { label: 'Selected Work', href: '#work' },
  { label: 'About Us', href: '#about' },
  { label: 'Contact', href: '#contact' },
];

export function Navbar() {
  return (
    <nav className="navbar" aria-label="Main navigation">
      {/* Logo */}
      <a href="#" className="navbar__logo" aria-label="Shader home">
        <svg className="navbar__logo-icon" viewBox="0 0 60 60" aria-hidden="true">
          {RAINBOW.map((c, i) => (
            <rect key={i} x={i * 10} y={0} width={10} height={60} fill={c} />
          ))}
        </svg>
        <span className="navbar__logo-text">SHADER</span>
      </a>

      {/* Center links */}
      <ul className="navbar__links" role="list">
        {NAV_LINKS.map(({ label, href }) => (
          <li key={label}>
            <a href={href} className="navbar__link">{label}</a>
          </li>
        ))}
      </ul>

      {/* CTA */}
      <a
        href="https://cal.com/simon-hedlund-kglzne"
        className="navbar__cta"
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Book a call with Shader"
      >
        <span className="navbar__cta-icon" aria-hidden="true">📞</span>
        <span>Book a call</span>
      </a>
    </nav>
  );
}
