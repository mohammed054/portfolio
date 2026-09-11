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
      className="fixed right-6 bottom-1/4 z-40 flex flex-col items-center gap-2 group"
    >
      <ArrowUp size={20} className="text-text-dark group-hover:text-primary transition-colors" />
      <span className="text-[10px] text-text-muted -rotate-90 origin-center whitespace-nowrap">
        Go to Top
      </span>
    </button>
  )
}

export default GoToTop
