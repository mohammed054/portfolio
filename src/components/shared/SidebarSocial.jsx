import { Mail, Phone, MessageCircle, Facebook } from 'lucide-react'

// hrefs sourced from live site — spec 4.2
const items = [
  { label: 'Email', Icon: Mail, href: 'mailto:info@sabernasr.com' },
  { label: 'Phone', Icon: Phone, href: 'tel:+201055544244' },
  { label: 'Whatsapp', Icon: MessageCircle, href: 'https://wa.me/201055544244' },
  { label: 'Facebook', Icon: Facebook, href: 'https://www.facebook.com/Saber.Nasr.Elbendary/' },
]

export default function SidebarSocial() {
  return (
    <>
      {/* Fixed sidebar on desktop, hidden on mobile - will reappear as bottom bar in Phase 7 */}
      <div className="fixed left-6 top-1/2 z-30 -translate-y-1/2 flex-col gap-10 lg:flex">
        {items.map(({ label, Icon, href }) => (
          <a
            key={label}
            href={href}
            className="flex flex-col items-center gap-2 text-gray-400 transition-colors hover:text-ink"
          >
            <span className="text-[10px] font-medium uppercase tracking-widest [writing-mode:vertical-rl]">
              {label}
            </span>
            <Icon size={16} />
          </a>
        ))}
      </div>

      {/* Mobile fallback: social links as a bottom bar (shown below lg: in desktop, full-width on mobile) */}
      <div className="mt-8 border-t border-gray-200 pt-8 lg:hidden">
        <div className="flex flex-col items-center gap-4 text-gray-400">
          {items.map(({ label, Icon }) => (
            <div key={label} className="flex flex-col items-center gap-2">
              <Icon size={24} />
              <span className="text-[10px] font-medium uppercase tracking-widest [writing-mode:vertical-rl]">
                {label}
              </span>
            </div>
          ))}
        </div>
      </div>
    </>
  )
}
