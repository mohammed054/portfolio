import { useEffect } from 'react'
import { useSystemStore } from '../core/ExperienceProvider.jsx'
import { normalizePointer } from '../utils/math.js'

export function useMouse() {
  const setMouse = useSystemStore((s) => s.setMouse)

  useEffect(() => {
    function onPointerMove(e) {
      const x = normalizePointer(e.clientX, window.innerWidth)
      const y = -normalizePointer(e.clientY, window.innerHeight)
      setMouse(x, y)
    }

    window.addEventListener('pointermove', onPointerMove)
    return () => window.removeEventListener('pointermove', onPointerMove)
  }, [setMouse])
}
