import { useEffect, useRef } from 'react'

const isTouch = typeof window !== 'undefined' && ('ontouchstart' in window || navigator.maxTouchPoints > 0)

function CursorDot() {
  const rafRef = useRef(null)
  const smoothPos = useRef({ x: -100, y: -100 })
  const mousePos = useRef({ x: -100, y: -100 })
  const targetPos = useRef({ x: -100, y: -100 })
  const isHoveringRef = useRef(false)

  useEffect(() => {
    if (isTouch) return

    const onMove = (e) => {
      mousePos.current = { x: e.clientX, y: e.clientY }

      const target = e.target.closest('a, button, [role="button"], input, textarea, .cursor-pointer, .group')
      const nowHovering = !!target

      if (target) {
        const rect = target.getBoundingClientRect()
        targetPos.current = { x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 }
      } else {
        targetPos.current = { x: e.clientX, y: e.clientY }
      }

      isHoveringRef.current = nowHovering
    }

    const animate = () => {
      const magneticStrength = isHoveringRef.current ? 0.15 : 0
      const dx = (targetPos.current.x - smoothPos.current.x) * magneticStrength
      const dy = (targetPos.current.y - smoothPos.current.y) * magneticStrength

      smoothPos.current = {
        x: smoothPos.current.x + (mousePos.current.x - smoothPos.current.x) * 0.15 + dx,
        y: smoothPos.current.y + (mousePos.current.y - smoothPos.current.y) * 0.15 + dy,
      }

      const dot = document.getElementById('cursor-dot')
      if (dot) {
        const size = isHoveringRef.current ? 32 : 12
        dot.style.left = `${smoothPos.current.x - size / 2}px`
        dot.style.top = `${smoothPos.current.y - size / 2}px`
        dot.style.width = `${size}px`
        dot.style.height = `${size}px`
      }

      rafRef.current = requestAnimationFrame(animate)
    }

    window.addEventListener('mousemove', onMove)
    rafRef.current = requestAnimationFrame(animate)

    return () => {
      window.removeEventListener('mousemove', onMove)
      cancelAnimationFrame(rafRef.current)
    }
  }, [])

  if (isTouch) return null

  return (
    <div
      id="cursor-dot"
      className="fixed pointer-events-none z-[9999] rounded-full mix-blend-difference bg-white"
      style={{
        left: -100,
        top: -100,
        width: 12,
        height: 12,
        transition: 'width 0.3s ease, height 0.3s ease',
      }}
    />
  )
}

export default CursorDot
