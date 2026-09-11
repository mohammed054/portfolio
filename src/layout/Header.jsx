import { useState, useEffect } from 'react'
import { Link, NavLink } from 'react-router-dom'
import { Search, Grid3X3, Menu, X } from 'lucide-react'

function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [sidePanelOpen, setSidePanelOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const navLinkClass = ({ isActive }) =>
    `text-[15px] font-medium transition-colors duration-300 hover:text-primary ${
      isActive
        ? 'text-primary border-b-2 border-primary pb-1'
        : 'text-text-dark'
    }`

  return (
    <>
      <header
        className={`fixed top-0 left-0 w-full z-50 flex items-center justify-between transition-all duration-300 ${
          scrolled
            ? 'bg-white shadow-sm py-3 px-[50px] max-md:px-5'
            : 'bg-white py-5 px-[50px] max-md:px-5'
        }`}
      >
        <Link to="/" className="flex items-center gap-2 shrink-0">
          <PlaceholderLogo />
        </Link>

        <nav className="hidden lg:flex items-center gap-8">
          <NavLink to="/" className={navLinkClass}>Home</NavLink>
          <NavLink to="/about/" className={navLinkClass}>About Us</NavLink>
          <NavLink to="/our-portfolio/" className={navLinkClass}>Our Portfolio</NavLink>
          <NavLink to="/contact-us/" className={navLinkClass}>Contact Us</NavLink>
        </nav>

        <div className="flex items-center gap-3">
          <button className="w-10 h-10 flex items-center justify-center hover:text-primary transition-colors hidden lg:block">
            <Search size={18} />
          </button>
          <button
            onClick={() => setSidePanelOpen(true)}
            className="w-10 h-10 flex items-center justify-center hover:text-primary transition-colors hidden lg:block"
          >
            <Grid3X3 size={18} />
          </button>
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="w-10 h-10 flex items-center justify-center lg:hidden"
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </header>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 bg-dark-bg z-[60] flex flex-col items-center justify-center gap-8 lg:hidden">
          <button
            onClick={() => setMobileMenuOpen(false)}
            className="absolute top-5 right-5 text-white w-10 h-10 flex items-center justify-center"
          >
            <X size={24} />
          </button>
          <Link to="/" onClick={() => setMobileMenuOpen(false)} className="text-white text-2xl font-semibold font-[Poppins]">Home</Link>
          <Link to="/about/" onClick={() => setMobileMenuOpen(false)} className="text-white text-2xl font-semibold font-[Poppins]">About Us</Link>
          <Link to="/our-portfolio/" onClick={() => setMobileMenuOpen(false)} className="text-white text-2xl font-semibold font-[Poppins]">Our Portfolio</Link>
          <Link to="/contact-us/" onClick={() => setMobileMenuOpen(false)} className="text-white text-2xl font-semibold font-[Poppins]">Contact Us</Link>
        </div>
      )}

      {/* Side Panel */}
      {sidePanelOpen && (
        <div className="fixed inset-0 z-[70]">
          <div
            className="absolute inset-0 bg-black/50 transition-opacity"
            onClick={() => setSidePanelOpen(false)}
          />
          <div className="absolute left-0 top-0 h-full w-[388px] bg-white p-10 flex flex-col max-sm:w-full max-sm:p-6">
            <button
              onClick={() => setSidePanelOpen(false)}
              className="self-end mb-10 w-10 h-10 flex items-center justify-center hover:text-primary transition-colors"
            >
              <X size={24} />
            </button>
            <nav className="flex flex-col gap-6 mb-10">
              <Link to="/" onClick={() => setSidePanelOpen(false)} className="text-lg font-semibold text-text-dark hover:text-primary transition-colors font-[Poppins]">Home</Link>
              <Link to="/about/" onClick={() => setSidePanelOpen(false)} className="text-lg font-semibold text-text-dark hover:text-primary transition-colors font-[Poppins]">About Us</Link>
              <Link to="/our-portfolio/" onClick={() => setSidePanelOpen(false)} className="text-lg font-semibold text-text-dark hover:text-primary transition-colors font-[Poppins]">Our Portfolio</Link>
              <Link to="/contact-us/" onClick={() => setSidePanelOpen(false)} className="text-lg font-semibold text-text-dark hover:text-primary transition-colors font-[Poppins]">Contact Us</Link>
            </nav>
            <div className="border-t border-footer-border pt-6 mt-auto">
              <p className="text-sm text-text-muted mb-4 font-medium">Have a Project?</p>
              <div className="flex gap-4">
                <a href="mailto:info@sabernasr.com" className="text-sm text-text-muted hover:text-primary transition-colors">Email</a>
                <a href="https://wa.me/201055544244" className="text-sm text-text-muted hover:text-primary transition-colors">WhatsApp</a>
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
    <div className="flex items-center gap-1.5">
      <div className="w-9 h-9 bg-secondary rounded flex items-center justify-center text-white font-bold text-base font-[Poppins]">
        S
      </div>
      <span className="font-bold text-[17px] text-text-dark tracking-tight font-[Poppins]">DESIGN</span>
    </div>
  )
}

export default Header
