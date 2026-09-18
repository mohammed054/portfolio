import { useEffect, useState } from 'react'
import { ArrowUp } from 'lucide-react'

export default function GoToTop() {
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
      className="fixed bottom-10 right-6 z-30 flex flex-col items-center gap-2 text-ink"
      aria-label="Go to top"
    >
      <ArrowUp size={18} />
      <span className="text-[9px] font-medium uppercase tracking-widest [writing-mode:vertical-rl]">
        Go to top
      </span>
    </button>
  )
}
