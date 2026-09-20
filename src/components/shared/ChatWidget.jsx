import { useState } from 'react'
import { MessageCircle } from 'lucide-react'

// TODO(spec 4.3): swap this for the real third-party embed once the
// provider is identified live (Tawk.to / Crisp / WhatsApp widget / etc.)
// — do not ship this stub click handler to production.
export default function ChatWidget() {
  return (
    <div className="fixed bottom-6 left-6 z-40 flex items-center gap-3">
      <span className="rounded-full bg-white px-4 py-2 text-sm font-medium text-ink shadow-md">
        Contact us
      </span>
      <button
        className="flex h-14 w-14 items-center justify-center rounded-full bg-purple-500 text-white shadow-lg transition-transform hover:scale-105"
        aria-label="Open chat"
      >
        <MessageCircle size={22} />
      </button>
    </div>
  )
}
