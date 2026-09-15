import { useState } from 'react'
import { MessageCircle, Phone, Mail, X } from 'lucide-react'

function ChatWidget() {
  const [open, setOpen] = useState(false)

  return (
    <div className="fixed bottom-6 left-6 z-40 max-sm:bottom-4 max-sm:left-4">
      {open && (
        <div className="mb-4 bg-white rounded-2xl shadow-[0_8px_30px_rgba(0,0,0,0.15)] w-[280px] overflow-hidden">
          <div className="bg-[#A886CD] px-5 py-4 flex items-center justify-between">
            <div>
              <p className="text-white font-semibold text-sm font-[Poppins]">Contact Us</p>
              <p className="text-white/80 text-xs">Choose a channel to reach us</p>
            </div>
            <button onClick={() => setOpen(false)} className="text-white/80 hover:text-white transition-colors">
              <X size={18} />
            </button>
          </div>
          <div className="p-4 space-y-2">
            <a href="tel:+201055544244" className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-light-bg transition-colors group">
              <div className="w-10 h-10 bg-[#25D366] rounded-full flex items-center justify-center text-white shrink-0">
                <Phone size={18} />
              </div>
              <div>
                <p className="text-sm font-semibold text-text-dark font-[Poppins]">Phone</p>
                <p className="text-xs text-text-muted">+20 105 554 4244</p>
              </div>
            </a>
            <a href="https://wa.me/201055544244" target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-light-bg transition-colors group">
              <div className="w-10 h-10 bg-[#25D366] rounded-full flex items-center justify-center text-white shrink-0">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/></svg>
              </div>
              <div>
                <p className="text-sm font-semibold text-text-dark font-[Poppins]">WhatsApp</p>
                <p className="text-xs text-text-muted">+20 105 554 4244</p>
              </div>
            </a>
            <a href="mailto:info@sabernasr.com" className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-light-bg transition-colors group">
              <div className="w-10 h-10 bg-[#FF5B4A] rounded-full flex items-center justify-center text-white shrink-0">
                <Mail size={18} />
              </div>
              <div>
                <p className="text-sm font-semibold text-text-dark font-[Poppins]">Email</p>
                <p className="text-xs text-text-muted">info@sabernasr.com</p>
              </div>
            </a>
          </div>
        </div>
      )}
      <div className="flex items-center gap-3">
        {open && (
          <div className="bg-white rounded-full shadow-[0_2px_12px_rgba(0,0,0,0.12)] px-4 py-2.5 text-[0.833rem] text-text-dark font-medium whitespace-nowrap">
            Contact us
          </div>
        )}
        <button
          onClick={() => setOpen(!open)}
          className="w-14 h-14 bg-[#A886CD] rounded-full flex items-center justify-center text-white shadow-[0_4px_16px_rgba(168,134,205,0.4)] hover:scale-110 transition-transform duration-300"
        >
          {open ? <X size={24} /> : <MessageCircle size={24} />}
        </button>
      </div>
    </div>
  )
}

export default ChatWidget
