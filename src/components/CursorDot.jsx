import { useEffect, useState, useCallback } from 'react'

function CursorDot() {
  const [pos, setPos] = useState({ x: -100, y: -100 })
  const [isTouchDevice, setIsTouchDevice] = useState(true)
  const [isHovering, setIsHovering] = useState(false)

  const checkHoverTarget = useCallback((e) => {
    const target = e.target.closest('a, button, [role="button"], input, textarea, .cursor-pointer, .group')
    setIsHovering(!!target)
  }, [])

  useEffect(() => {
    const touchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0
    setIsTouchDevice(touchDevice)
    if (touchDevice) return

    const onMove = (e) => {
      setPos({ x: e.clientX, y: e.clientY })
      checkHoverTarget(e)
    }
    window.addEventListener('mousemove', onMove)
    return () => window.removeEventListener('mousemove', onMove)
  }, [checkHoverTarget])

  if (isTouchDevice) return null

  return (
    <div
      className="fixed pointer-events-none z-[9999] rounded-full mix-blend-difference bg-white"
      style={{
        left: pos.x - (isHovering ? 16 : 6),
        top: pos.y - (isHovering ? 16 : 6),
        width: isHovering ? 32 : 12,
        height: isHovering ? 32 : 12,
        transition: 'left 0.15s ease-out, top 0.15s ease-out, width 0.3s ease, height 0.3s ease',
      }}
    />
  )
}

export default CursorDot
