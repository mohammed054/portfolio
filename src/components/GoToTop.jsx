import { useState, useEffect } from 'react'
import { ArrowUp } from 'lucide-react'

function GoToTop() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 400)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  if (!visible) return null

  return (
    <button
      onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
      className="fixed right-6 bottom-1/4 z-40 flex flex-col items-center gap-2 group max-sm:right-3"
      aria-label="Go to top"
    >
      <div className="w-10 h-10 border border-card-border rounded-full flex items-center justify-center bg-white shadow-sm group-hover:bg-primary group-hover:text-white group-hover:border-primary transition-all duration-300">
        <ArrowUp size={16} />
      </div>
      <span className="text-[9px] font-semibold text-text-muted tracking-wider uppercase -rotate-90 origin-center whitespace-nowrap mt-1">
        Go to Top
      </span>
    </button>
  )
}

export default GoToTop
