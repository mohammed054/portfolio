import { Mail, Phone, MessageCircle, Facebook } from 'lucide-react'

// hrefs are TODOs — spec 4.2 flags these as needing live investigation
const items = [
  { label: 'Email', Icon: Mail, href: 'mailto:hello@example.com' },
  { label: 'Phone', Icon: Phone, href: 'tel:+10000000000' },
  { label: 'Whatsapp', Icon: MessageCircle, href: '#' },
  { label: 'Facebook', Icon: Facebook, href: '#' },
]

export default function SidebarSocial() {
  return (
    <div className="fixed left-6 top-1/2 z-30 hidden -translate-y-1/2 flex-col gap-10 lg:flex">
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
  )
}
