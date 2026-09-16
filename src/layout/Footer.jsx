import { Link } from 'react-router-dom'

function FacebookIcon({ size = 16 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
      <path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z"/>
    </svg>
  )
}

function WhatsappIcon({ size = 16 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
      <path d="M12 2C6.477 2 2 6.477 2 12c0 1.89.525 3.66 1.438 5.168L2 22l4.832-1.438A9.955 9.955 0 0012 22c5.523 0 10-4.477 10-10S17.523 2 12 2z" fill="none" stroke="currentColor" strokeWidth="2"/>
    </svg>
  )
}

function PhoneIcon({ size = 16 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72 12.84 12.84 0 00.7 2.81 2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45 12.84 12.84 0 002.81.7A2 2 0 0122 16.92z"/>
    </svg>
  )
}

function MailIcon({ size = 16 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
      <polyline points="22,6 12,13 2,6"/>
    </svg>
  )
}

function Footer() {
  return (
    <footer className="bg-dark-bg text-footer-text">
      <div className="container-main grid grid-cols-[40%_19%_40%] items-center py-6 max-md:grid-cols-1 max-md:gap-5 max-md:text-center">
        <div className="text-[16px]" style={{ fontFamily: "'europa', sans-serif" }}>
          &copy; 2026 All Rights Reserved to Saber Nasr.
        </div>

        <Link to="/" className="flex items-center justify-center gap-1.5 max-md:justify-center">
          <img src="/images/logos/footer-logo-light.png" alt="Saber Nasr Design" className="max-h-[40px] w-auto object-contain" />
        </Link>

        <div className="flex items-center gap-3 justify-end max-md:justify-center">
          <a href="https://www.facebook.com/Saber.Nasr.Elbendary/" target="_blank" rel="noopener noreferrer" className="footer-social-icon hover:text-white transition-colors">
            <FacebookIcon size={16} />
          </a>
          <a href="https://wa.me/201098083841" target="_blank" rel="noopener noreferrer" className="footer-social-icon hover:text-white transition-colors">
            <WhatsappIcon size={16} />
          </a>
          <a href="tel:+201098083841" className="footer-social-icon hover:text-white transition-colors">
            <PhoneIcon size={16} />
          </a>
          <a href="mailto:info@sabernasr.com" className="footer-social-icon hover:text-white transition-colors">
            <MailIcon size={16} />
          </a>
        </div>
      </div>
    </footer>
  )
}

export default Footer
