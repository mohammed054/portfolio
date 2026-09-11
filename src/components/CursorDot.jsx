import { useEffect, useState } from 'react'

function CursorDot() {
  const [pos, setPos] = useState({ x: 0, y: 0 })

  useEffect(() => {
    const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0
    if (isTouchDevice) return

    const onMove = (e) => setPos({ x: e.clientX, y: e.clientY })
    window.addEventListener('mousemove', onMove)
    return () => window.removeEventListener('mousemove', onMove)
  }, [])

  const isTouchDevice = typeof window !== 'undefined' && ('ontouchstart' in window || navigator.maxTouchPoints > 0)
  if (isTouchDevice) return null

  return (
    <div
      className="fixed pointer-events-none z-[9999] w-3 h-3 rounded-full mix-blend-difference bg-white"
      style={{
        left: pos.x - 6,
        top: pos.y - 6,
        transition: 'left 0.1s ease-out, top 0.1s ease-out',
      }}
    />
  )
}

export default CursorDot
