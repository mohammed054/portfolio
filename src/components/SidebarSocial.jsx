import { Mail, Phone, MessageCircle } from 'lucide-react'

function FacebookIcon({ size = 16 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
      <path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z"/>
    </svg>
  )
}

function SidebarSocial() {
  const items = [
    { icon: Mail, label: 'Email', href: 'mailto:info@sabernasr.com' },
    { icon: Phone, label: 'Phone', href: 'tel:+201055544244' },
    { icon: MessageCircle, label: 'Whatsapp', href: 'https://wa.me/201055544244' },
    { icon: FacebookIcon, label: 'Facebook', href: 'https://www.facebook.com/Saber.Nasr.Elbendary/' },
  ]

  return (
    <div className="fixed left-0 top-1/2 -translate-y-1/2 z-40 hidden xl:flex flex-col items-center gap-7 pl-5">
      {items.map((item, i) => (
        <a
          key={i}
          href={item.href}
          target={item.href.startsWith('http') ? '_blank' : undefined}
          rel={item.href.startsWith('http') ? 'noopener noreferrer' : undefined}
          className="flex flex-col items-center gap-2.5 group"
        >
          <span className="text-[10px] font-medium text-text-muted -rotate-90 origin-center whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            {item.label}
          </span>
          <item.icon size={15} className="text-text-muted group-hover:text-primary transition-colors duration-300" />
        </a>
      ))}
    </div>
  )
}

export default SidebarSocial
