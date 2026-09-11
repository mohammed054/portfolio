import { MessageCircle } from 'lucide-react'

function ChatWidget() {
  return (
    <div className="fixed bottom-6 left-6 z-40 flex items-center gap-3 max-sm:bottom-4 max-sm:left-4">
      <div className="bg-white rounded-full shadow-[0_2px_12px_rgba(0,0,0,0.12)] px-4 py-2.5 text-sm text-text-dark font-medium whitespace-nowrap">
        Contact us
      </div>
      <button className="w-14 h-14 bg-chat-purple rounded-full flex items-center justify-center text-white shadow-[0_4px_16px_rgba(168,134,205,0.4)] hover:scale-110 transition-transform duration-300">
        <MessageCircle size={24} />
      </button>
    </div>
  )
}

export default ChatWidget
