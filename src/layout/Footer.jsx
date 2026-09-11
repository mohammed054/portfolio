import { Phone, Mail, MessageCircle } from 'lucide-react'
import { Link } from 'react-router-dom'

function FacebookIcon({ size = 16 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
      <path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z"/>
    </svg>
  )
}

function Footer() {
  return (
    <footer className="bg-dark-bg text-footer-text">
      <div className="container-main flex items-center justify-between py-7 max-md:flex-col max-md:gap-5">
        <div className="text-sm font-medium">
          &copy; 2026 All Rights Reserved to Saber Nasr.
        </div>

        <Link to="/" className="flex items-center gap-1.5">
          <div className="w-9 h-9 bg-secondary rounded flex items-center justify-center text-white font-bold text-base font-[Poppins]">
            S
          </div>
          <span className="font-bold text-[17px] text-white tracking-tight font-[Poppins]">DESIGN</span>
        </Link>

        <div className="flex items-center gap-3">
          <a href="https://www.facebook.com/Saber.Nasr.Elbendary/" target="_blank" rel="noopener noreferrer" className="footer-social-icon">
            <FacebookIcon size={16} />
          </a>
          <a href="https://wa.me/201055544244" target="_blank" rel="noopener noreferrer" className="footer-social-icon">
            <MessageCircle size={16} />
          </a>
          <a href="tel:+201055544244" className="footer-social-icon">
            <Phone size={16} />
          </a>
          <a href="mailto:info@sabernasr.com" className="footer-social-icon">
            <Mail size={16} />
          </a>
        </div>
      </div>

      <div className="container-main border-t border-footer-border py-6">
        <div className="flex items-center gap-4 max-md:flex-col max-md:gap-3">
          <label className="text-sm font-medium text-footer-text whitespace-nowrap">Newsletter</label>
          <input
            type="email"
            placeholder="Enter your email"
            className="flex-1 bg-ch-charcoal border border-ch-border text-white placeholder-ch-muted px-4 py-2.5 text-sm rounded outline-none focus:border-secondary transition-colors"
          />
          <button className="btn-pill btn-pill-primary text-sm px-6 py-2.5">
            Subscribe
          </button>
        </div>
      </div>
    </footer>
  )
}

export default Footer
