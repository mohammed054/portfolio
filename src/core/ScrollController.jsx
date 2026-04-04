import { useScroll } from '../systems/useScroll.js'
import { SCROLL } from '../config/variables.js'

export function ScrollController() {
  useScroll()

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
        zIndex: 0,
      }}
    />
  )
}

export function ScrollHeight() {
  return (
    <div
      style={{
        height: `${SCROLL.scrollHeight}vh`,
      }}
    />
  )
}
