import { MessageCircle } from 'lucide-react'

function ChatWidget() {
  return (
    <div className="fixed bottom-6 left-6 z-40 flex items-center gap-3">
      <div className="bg-white rounded-full shadow-lg px-4 py-2 text-sm text-text-dark font-medium">
        Contact us
      </div>
      <button className="w-14 h-14 bg-chat-purple rounded-full flex items-center justify-center text-white shadow-lg hover:scale-110 transition-transform">
        <MessageCircle size={24} />
      </button>
    </div>
  )
}

export default ChatWidget
