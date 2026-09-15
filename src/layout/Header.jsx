import { useState, useEffect } from 'react'
import { Link, NavLink } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { Search, Grid3X3, Menu, X } from 'lucide-react'

function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [sidePanelOpen, setSidePanelOpen] = useState(false)

  const navLinkClass = ({ isActive }) =>
    `nav-underline text-[15px] transition-colors duration-300 hover:text-primary pb-1 ${
      isActive ? 'text-primary active' : 'text-text-dark'
    }`

  return (
    <>
      <header
        className="fixed top-0 left-0 w-full z-50 flex items-center justify-between bg-white px-[50px] max-md:px-5"
        style={{ padding: '20px 50px' }}
      >
        <Link to="/" className="flex items-center gap-2 shrink-0">
          <PlaceholderLogo />
        </Link>

        <nav className="hidden lg:flex items-center gap-8" style={{ borderBottom: '1px solid #DDDDDD', paddingBottom: '37px', marginLeft: '0px' }}>
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
                    className="block px-5 py-2.5 text-[0.833rem] text-text-dark hover:text-primary hover:bg-light-bg transition-colors"
                    style={{ fontFamily: "'europa', sans-serif" }}
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
          <button className="w-10 h-10 flex items-center justify-center hover:text-primary transition-colors hidden lg:block" style={{ marginLeft: '8px' }}>
            <Search size={18} />
          </button>
          <button
            onClick={() => setSidePanelOpen(true)}
            className="w-10 h-10 flex items-center justify-center hover:text-primary transition-colors hidden lg:block"
            style={{ marginLeft: '5px', marginBottom: '-6px' }}
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
                  <Link to={path} onClick={() => setMobileMenuOpen(false)} className="text-white text-2xl font-semibold" style={{ fontFamily: "'sofia-pro', 'Poppins', sans-serif" }}>{label}</Link>
                </motion.div>
              )
            })}
            <div className="flex gap-4 mt-8">
              <a href="https://www.facebook.com/Saber.Nasr.Elbendary/" target="_blank" rel="noopener noreferrer" className="text-white/70 hover:text-white transition-colors">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z"/></svg>
              </a>
              <a href="https://wa.me/201055544244" target="_blank" rel="noopener noreferrer" className="text-white/70 hover:text-white transition-colors">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/></svg>
              </a>
              <a href="tel:+201055544244" className="text-white/70 hover:text-white transition-colors">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72 12.84 12.84 0 00.7 2.81 2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45 12.84 12.84 0 002.81.7A2 2 0 0122 16.92z"/></svg>
              </a>
              <a href="mailto:info@sabernasr.com" className="text-white/70 hover:text-white transition-colors">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
              </a>
            </div>
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
              <div className="mb-10">
                <img src="/images/logos/main-logo.png" alt="Saber Nasr Design" className="max-h-[40px] w-auto object-contain" />
              </div>
              <button
                onClick={() => setSidePanelOpen(false)}
                className="self-end mb-10 w-10 h-10 flex items-center justify-center hover:text-primary transition-colors"
              >
                <X size={24} />
              </button>
              <nav className="flex flex-col gap-6 mb-10">
                <Link to="/" onClick={() => setSidePanelOpen(false)} className="text-lg font-semibold text-text-dark hover:text-primary transition-colors" style={{ fontFamily: "'sofia-pro', 'Poppins', sans-serif" }}>Home</Link>
                <Link to="/about/" onClick={() => setSidePanelOpen(false)} className="text-lg font-semibold text-text-dark hover:text-primary transition-colors" style={{ fontFamily: "'sofia-pro', 'Poppins', sans-serif" }}>About Us</Link>
                <Link to="/our-portfolio/" onClick={() => setSidePanelOpen(false)} className="text-lg font-semibold text-text-dark hover:text-primary transition-colors" style={{ fontFamily: "'sofia-pro', 'Poppins', sans-serif" }}>Our Portfolio</Link>
                <Link to="/contact-us/" onClick={() => setSidePanelOpen(false)} className="text-lg font-semibold text-text-dark hover:text-primary transition-colors" style={{ fontFamily: "'sofia-pro', 'Poppins', sans-serif" }}>Contact Us</Link>
              </nav>
              <div className="border-t pt-6 mt-auto space-y-4" style={{ borderColor: '#DDDDDD' }}>
                <div>
                  <p className="text-[0.722rem] font-semibold tracking-wider uppercase mb-1" style={{ fontFamily: "'europa', sans-serif", color: '#A5A6AA' }}>Have a Project?</p>
                  <a href="mailto:info@sabernasr.com" className="text-[0.889rem] hover:text-primary transition-colors" style={{ color: '#A5A6AA' }}>info@sabernasr.com</a>
                </div>
                <div>
                  <p className="text-[0.722rem] font-semibold tracking-wider uppercase mb-1" style={{ fontFamily: "'europa', sans-serif", color: '#A5A6AA' }}>Want to Work with Me?</p>
                  <Link to="/about/" onClick={() => setSidePanelOpen(false)} className="text-[0.889rem] text-primary hover:text-primary-hover transition-colors">Send Brief</Link>
                </div>
                <div>
                  <p className="text-[0.722rem] font-semibold tracking-wider uppercase mb-1" style={{ fontFamily: "'europa', sans-serif", color: '#A5A6AA' }}>Want to Buy Illustrations?</p>
                  <a href="https://sabernasr.com/shop/" target="_blank" rel="noopener noreferrer" className="text-[0.889rem] text-primary hover:text-primary-hover transition-colors">Go to Shop</a>
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
    <div className="flex items-center">
      <img src="/images/logos/main-logo.png" alt="Saber Nasr Design" className="max-h-[40px] w-auto object-contain" />
    </div>
  )
}

export default Header
