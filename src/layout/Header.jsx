import { useState } from 'react'
import { Link, NavLink } from 'react-router-dom'
import { Search, Grid3X3, Menu, X } from 'lucide-react'

function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [sidePanelOpen, setSidePanelOpen] = useState(false)

  return (
    <>
      <header className="fixed top-0 left-0 w-full bg-white z-50 px-[50px] py-5 flex items-center justify-between max-md:px-5 max-sm:px-4">
        <Link to="/" className="flex items-center gap-2">
          <PlaceholderLogo />
        </Link>

        <nav className="hidden lg:flex items-center gap-8">
          <NavLink to="/" className={({ isActive }) => `text-sm font-semibold transition-colors hover:text-primary ${isActive ? 'text-primary border-b-2 border-primary pb-1' : 'text-text-dark'}`}>
            Home
          </NavLink>
          <NavLink to="/about/" className={({ isActive }) => `text-sm font-semibold transition-colors hover:text-primary ${isActive ? 'text-primary border-b-2 border-primary pb-1' : 'text-text-dark'}`}>
            About Us
          </NavLink>
          <div className="relative group">
            <NavLink to="/our-portfolio/" className={({ isActive }) => `text-sm font-semibold transition-colors hover:text-primary ${isActive ? 'text-primary border-b-2 border-primary pb-1' : 'text-text-dark'}`}>
              Our Portfolio
            </NavLink>
          </div>
          <NavLink to="/contact-us/" className={({ isActive }) => `text-sm font-semibold transition-colors hover:text-primary ${isActive ? 'text-primary border-b-2 border-primary pb-1' : 'text-text-dark'}`}>
            Contact Us
          </NavLink>
        </nav>

        <div className="flex items-center gap-4">
          <button className="p-2 hover:text-primary transition-colors hidden lg:block">
            <Search size={20} />
          </button>
          <button onClick={() => setSidePanelOpen(true)} className="p-2 hover:text-primary transition-colors hidden lg:block">
            <Grid3X3 size={20} />
          </button>
          <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="p-2 lg:hidden">
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </header>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 bg-dark-bg z-[60] flex flex-col items-center justify-center gap-8 lg:hidden">
          <button onClick={() => setMobileMenuOpen(false)} className="absolute top-5 right-5 text-white">
            <X size={24} />
          </button>
          <Link to="/" onClick={() => setMobileMenuOpen(false)} className="text-white text-2xl font-semibold">Home</Link>
          <Link to="/about/" onClick={() => setMobileMenuOpen(false)} className="text-white text-2xl font-semibold">About Us</Link>
          <Link to="/our-portfolio/" onClick={() => setMobileMenuOpen(false)} className="text-white text-2xl font-semibold">Our Portfolio</Link>
          <Link to="/contact-us/" onClick={() => setMobileMenuOpen(false)} className="text-white text-2xl font-semibold">Contact Us</Link>
        </div>
      )}

      {/* Side Panel */}
      {sidePanelOpen && (
        <div className="fixed inset-0 z-[70]">
          <div className="absolute inset-0 bg-black/50" onClick={() => setSidePanelOpen(false)} />
          <div className="absolute left-0 top-0 h-full w-[388px] bg-white p-8 flex flex-col">
            <button onClick={() => setSidePanelOpen(false)} className="self-end mb-8">
              <X size={24} />
            </button>
            <nav className="flex flex-col gap-6 mb-8">
              <Link to="/" onClick={() => setSidePanelOpen(false)} className="text-lg font-semibold text-text-dark hover:text-primary">Home</Link>
              <Link to="/about/" onClick={() => setSidePanelOpen(false)} className="text-lg font-semibold text-text-dark hover:text-primary">About Us</Link>
              <Link to="/our-portfolio/" onClick={() => setSidePanelOpen(false)} className="text-lg font-semibold text-text-dark hover:text-primary">Our Portfolio</Link>
              <Link to="/contact-us/" onClick={() => setSidePanelOpen(false)} className="text-lg font-semibold text-text-dark hover:text-primary">Contact Us</Link>
            </nav>
            <div className="border-t border-footer-border pt-6 mt-auto">
              <p className="text-sm text-text-muted mb-4">Have a Project?</p>
              <div className="flex gap-4">
                <a href="mailto:info@sabernasr.com" className="text-sm text-text-muted hover:text-primary">Email</a>
                <a href="https://wa.me/201055544244" className="text-sm text-text-muted hover:text-primary">WhatsApp</a>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

function PlaceholderLogo() {
  return (
    <div className="flex items-center gap-1">
      <div className="w-10 h-10 bg-secondary rounded-sm flex items-center justify-center text-white font-bold text-lg">
        S
      </div>
      <span className="font-bold text-lg text-text-dark tracking-tight">DESIGN</span>
    </div>
  )
}

export default Header
