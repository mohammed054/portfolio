import { useEffect, useRef } from 'react'

/**
 * CursorDot — custom cursor replacement (GLOBAL-DOT-MARKER).
 * Confirmed live: trx_addons_mouse_helper with mouse_helper_centered: "1"
 * and mouse_helper_delay: "4". Uses mix-blend-mode: difference for
 * color-adaptive behavior (black on white, white on dark).
 * Hidden on touch devices per spec.
 */
export default function CursorDot() {
  const dotRef = useRef(null)

  useEffect(() => {
    const isTouchDevice = window.matchMedia('(pointer: coarse)').matches
    if (isTouchDevice) return

    const dot = dotRef.current
    if (!dot) return

    let mouseX = 0
    let mouseY = 0
    let currentX = 0
    let currentY = 0

    const onMouseMove = (e) => {
      mouseX = e.clientX
      mouseY = e.clientY
    }

    const animate = () => {
      const dx = mouseX - currentX
      const dy = mouseY - currentY
      currentX += dx * 0.15
      currentY += dy * 0.15
      dot.style.transform = `translate(${currentX - 6}px, ${currentY - 6}px)`
      requestAnimationFrame(animate)
    }

    document.addEventListener('mousemove', onMouseMove)
    const frame = requestAnimationFrame(animate)

    return () => {
      document.removeEventListener('mousemove', onMouseMove)
      cancelAnimationFrame(frame)
    }
  }, [])

  return (
    <div
      ref={dotRef}
      className="pointer-events-none fixed left-0 top-0 z-50 h-3 w-3 rounded-full mix-blend-difference"
      style={{ backgroundColor: 'white' }}
    />
  )
}
