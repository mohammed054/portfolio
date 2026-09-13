import { useState, useEffect } from 'react'
import { Link, NavLink } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
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
    `nav-underline text-[0.833rem] font-medium transition-colors duration-300 hover:text-primary pb-1 ${
      isActive ? 'text-primary active' : 'text-text-dark'
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
          <div className="relative group">
            <NavLink to="/our-portfolio/" className={navLinkClass}>Our Portfolio</NavLink>
            <div className="absolute top-full left-0 pt-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
              <div className="bg-white border border-card-border rounded-lg shadow-lg py-2 min-w-[180px]">
                {[
                  { slug: 'web', label: 'Web' },
                  { slug: 'logo', label: 'Logo' },
                  { slug: 'social-media', label: 'Social Media' },
                  { slug: 'pdfs', label: 'PDFs' },
                  { slug: 'video', label: 'Video' },
                ].map((sub) => (
                  <NavLink
                    key={sub.slug}
                    to={`/our-portfolio/${sub.slug}/`}
                    className="block px-5 py-2.5 text-[0.833rem] text-text-dark hover:text-primary hover:bg-light-bg transition-colors font-[Poppins]"
                  >
                    {sub.label}
                  </NavLink>
                ))}
              </div>
            </div>
          </div>
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

      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 bg-dark-bg z-[60] flex flex-col items-center justify-center gap-8 lg:hidden"
          >
            <button
              onClick={() => setMobileMenuOpen(false)}
              className="absolute top-5 right-5 text-white w-10 h-10 flex items-center justify-center"
            >
              <X size={24} />
            </button>
            {['Home', 'About Us', 'Our Portfolio', 'Contact Us'].map((label, i) => {
              const path = label === 'Home' ? '/' : label === 'About Us' ? '/about/' : label === 'Our Portfolio' ? '/our-portfolio/' : '/contact-us/'
              return (
                <motion.div
                  key={label}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 + 0.1 }}
                >
                  <Link to={path} onClick={() => setMobileMenuOpen(false)} className="text-white text-2xl font-semibold font-[Poppins]">{label}</Link>
                </motion.div>
              )
            })}
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {sidePanelOpen && (
          <div className="fixed inset-0 z-[70]">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/50 transition-opacity"
              onClick={() => setSidePanelOpen(false)}
            />
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'tween', duration: 0.3, ease: 'easeInOut' }}
              className="absolute right-0 top-0 h-full w-[388px] bg-white p-10 flex flex-col max-sm:w-full max-sm:p-6"
            >
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
            <div className="border-t border-footer-border pt-6 mt-auto space-y-4">
              <div>
                <p className="text-[0.722rem] font-semibold tracking-wider uppercase text-text-muted mb-1 font-[Poppins]">Have a Project?</p>
                <a href="mailto:info@sabernasr.com" className="text-[0.889rem] text-text-muted hover:text-primary transition-colors">info@sabernasr.com</a>
              </div>
              <div>
                <p className="text-[0.722rem] font-semibold tracking-wider uppercase text-text-muted mb-1 font-[Poppins]">Want to Work with Me?</p>
                <Link to="/about/" onClick={() => setSidePanelOpen(false)} className="text-[0.889rem] text-primary hover:text-primary-hover transition-colors">Send Brief</Link>
              </div>
              <div>
                <p className="text-[0.722rem] font-semibold tracking-wider uppercase text-text-muted mb-1 font-[Poppins]">Want to Buy Illustrations?</p>
                <a href="#" className="text-[0.889rem] text-primary hover:text-primary-hover transition-colors">Go to Shop</a>
              </div>
            </div>
          </motion.div>
        </div>
        )}
      </AnimatePresence>
    </>
  )
}

function PlaceholderLogo() {
  return (
    <div className="flex items-center gap-1.5">
          <img src="/images/logos/main-logo.png" alt="Saber Nasr Design" className="max-h-[40px] w-auto object-contain" />
      <span className="font-bold text-[0.944rem] text-text-dark tracking-tight font-[Poppins]">DESIGN</span>
    </div>
  )
}

export default Header
