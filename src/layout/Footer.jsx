import { Phone, Mail, MessageCircle } from 'lucide-react'

function FacebookIcon({ size = 16 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
      <path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z"/>
    </svg>
  )
}

function Footer() {
  return (
    <footer className="bg-dark-bg text-footer-text py-6">
      <div className="container-main flex items-center justify-between max-md:flex-col max-md:gap-4">
        <div className="text-sm">
          &copy; 2026 All Rights Reserved to Saber Nasr.
        </div>

        <div className="flex items-center gap-1">
          <div className="w-10 h-10 bg-secondary rounded-sm flex items-center justify-center text-white font-bold text-lg">
            S
          </div>
          <span className="font-bold text-lg text-white tracking-tight">DESIGN</span>
        </div>

        <div className="flex items-center gap-4">
          <a href="https://www.facebook.com/Saber.Nasr.Elbendary/" target="_blank" rel="noopener noreferrer" className="w-10 h-10 border border-footer-border rounded-full flex items-center justify-center hover:bg-white/10 transition-colors">
            <FacebookIcon size={16} />
          </a>
          <a href="https://wa.me/201055544244" target="_blank" rel="noopener noreferrer" className="w-10 h-10 border border-footer-border rounded-full flex items-center justify-center hover:bg-white/10 transition-colors">
            <MessageCircle size={16} />
          </a>
          <a href="tel:+201055544244" className="w-10 h-10 border border-footer-border rounded-full flex items-center justify-center hover:bg-white/10 transition-colors">
            <Phone size={16} />
          </a>
          <a href="mailto:info@sabernasr.com" className="w-10 h-10 border border-footer-border rounded-full flex items-center justify-center hover:bg-white/10 transition-colors">
            <Mail size={16} />
          </a>
        </div>
      </div>
    </footer>
  )
}

export default Footer
