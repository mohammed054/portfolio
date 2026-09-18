import { NavLink } from 'react-router-dom'
import { Search, Grid3x3 } from 'lucide-react'

const navLinks = [
  { label: 'Home', to: '/' },
  { label: 'About Us', to: '/about' },
  { label: 'Our Portfolio', to: '/portfolio' },
  { label: 'Contact Us', to: '/contact' },
]

export default function Header() {
  return (
    <header className="sticky top-0 z-40 flex items-center justify-between border-b border-gray-100 bg-white px-6 py-4 md:px-10">
      {/* GLOBAL-LOGO placeholder — real mark not sourced yet (spec 4.1) */}
      <NavLink to="/" className="flex items-center gap-2">
        <span className="flex h-8 w-8 items-center justify-center rounded-md bg-primary text-sm font-bold text-white">
          S
        </span>
        <span className="text-lg font-extrabold tracking-tight text-ink">DESIGN</span>
      </NavLink>

      <nav className="hidden gap-8 text-sm font-medium md:flex">
        {navLinks.map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            className={({ isActive }) =>
              `border-b-2 pb-1 transition-colors ${
                isActive ? 'border-accent text-accent' : 'border-transparent text-ink hover:text-accent'
              }`
            }
          >
            {link.label}
          </NavLink>
        ))}
      </nav>

      {/* GLOBAL-NAV-ICONS — destinations/behavior unconfirmed, see spec 4.1 */}
      <div className="flex items-center gap-4 text-ink">
        <button aria-label="Search" className="hover:text-accent">
          <Search size={20} />
        </button>
        <button aria-label="Menu" className="hover:text-accent">
          <Grid3x3 size={20} />
        </button>
      </div>
    </header>
  )
}
