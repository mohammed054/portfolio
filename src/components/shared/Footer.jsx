import { Mail, MessageCircle, Phone, Facebook } from 'lucide-react'

export default function Footer() {
  const socialItems = [
    { label: 'Facebook', Icon: Facebook },
    { label: 'WhatsApp', Icon: MessageCircle },
    { label: 'Phone', Icon: Phone },
    { label: 'Email', Icon: Mail },
  ]

  return (
    <footer className="bg-dark px-6 py-10 text-white md:px-10">
      <div className="mx-auto flex max-w-6xl flex-col items-center gap-6 text-center md:flex-row md:justify-between md:text-left">
        <p className="text-sm text-gray-400">© {new Date().getFullYear()} All Rights Reserved to Template.</p>

        <div className="flex items-center gap-2 font-extrabold">
          <span className="flex h-7 w-7 items-center justify-center rounded-md bg-primary text-sm">S</span>
          DESIGN
        </div>

        <div className="flex gap-3">
          {socialItems.map(({ label, Icon }) => (
            <span
              key={label}
              aria-label={label}
              className="flex h-9 w-9 items-center justify-center rounded-full border border-gray-600 text-xs transition-colors hover:border-white"
            >
              <Icon size={18} />
            </span>
          ))}
        </div>
      </div>
    </footer>
  )
}