import { useEffect, useState } from 'react'

function CursorDot() {
  const [pos, setPos] = useState({ x: -100, y: -100 })
  const [isTouchDevice, setIsTouchDevice] = useState(true)

  useEffect(() => {
    const touchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0
    setIsTouchDevice(touchDevice)
    if (touchDevice) return

    const onMove = (e) => setPos({ x: e.clientX, y: e.clientY })
    window.addEventListener('mousemove', onMove)
    return () => window.removeEventListener('mousemove', onMove)
  }, [])

  if (isTouchDevice) return null

  return (
    <div
      className="fixed pointer-events-none z-[9999] w-3 h-3 rounded-full mix-blend-difference bg-white"
      style={{
        left: pos.x - 6,
        top: pos.y - 6,
        transition: 'left 0.15s ease-out, top 0.15s ease-out',
      }}
    />
  )
}

export default CursorDot
