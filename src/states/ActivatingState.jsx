import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { useSystemStore } from '../core/ExperienceProvider'
import {
  STATES,
  COLORS,
  LIGHTING,
  SNAP,
  INTERACTION_STATE,
} from '../config/variables'
import { clamp, lerp, progressRange } from '../utils/math'

// All x/z positions are multiples of GRID.spacing (40)
// y centers are above the substrate plane at y = -2
const PANEL_CONFIGS = [
  { id: 0, pos: [ -80, 20,    0], size: [60, 40, 4], delay: 0.00 },
  { id: 1, pos: [  80, 25,  -40], size: [80, 50, 4], delay: 0.06 },
  { id: 2, pos: [-160, 20,  -40], size: [40, 60, 4], delay: 0.12 },
  { id: 3, pos: [ 160, 20,    0], size: [60, 40, 4], delay: 0.18 },
  { id: 4, pos: [   0, 25,  -80], size: [80, 40, 4], delay: 0.06 },
  { id: 5, pos: [ -40, 20, -120], size: [60, 50, 4], delay: 0.24 },
]

const INTERACTION_MULT = INTERACTION_STATE.ACTIVATING

function ActivatingPanel({ config }) {
  const groupRef    = useRef()
  const surfaceRef  = useRef()
  const edgesMatRef = useRef()
  const hovered     = useRef(false)
  const snapX       = useRef(0)
  const snapY       = useRef(0)

  const { pos, size, delay } = config

  const edgesGeo = useMemo(
    () => new THREE.EdgesGeometry(new THREE.BoxGeometry(...size)),
    []
  )

  useFrame(() => {
    if (!groupRef.current || !surfaceRef.current || !edgesMatRef.current) return

    const { progress, mouse } = useSystemStore.getState()

    const localT  = progressRange(progress, STATES.ACTIVATING.start, STATES.ACTIVATING.end)
    const identT  = progressRange(progress, STATES.ACTIVATING.end,   STATES.IDENTIFYING.end)

    // Per-panel staggered activation
    const remaining = 1.0 - delay
    const panelT    = clamp((localT - delay) / (remaining + 0.001), 0, 1)

    // Edge-first: edges lead, surface fills after
    const edgeT    = clamp(panelT / 0.35, 0, 1)
    const surfaceT = clamp((panelT - 0.35) / 0.65, 0, 1)

    // Fade out as system enters IDENTIFYING
    const fadeOut  = 1.0 - clamp(identT * 2.0, 0, 1)

    // Rise from substrate — panel emerges upward from grid plane
    const dropDepth = size[1] * 1.5
    const riseY     = lerp(pos[1] - dropDepth, pos[1], clamp(panelT * 1.3, 0, 1))

    // Hover snap — constrained, mechanical, returns on release
    const targetSnapX = hovered.current ? mouse.x * SNAP.strength * INTERACTION_MULT * 10 : 0
    const targetSnapY = hovered.current ? mouse.y * SNAP.strength * INTERACTION_MULT *  4 : 0
    snapX.current = lerp(snapX.current, targetSnapX, SNAP.returnSpeed)
    snapY.current = lerp(snapY.current, targetSnapY, SNAP.returnSpeed)

    groupRef.current.position.set(
      pos[0] + snapX.current,
      riseY  + snapY.current,
      pos[2],
    )

    // Edges — low-intensity blue, boost on hover
    const baseOpacity   = edgeT * LIGHTING.edgeBase          * fadeOut * 0.5
    const hoverOpacity  = edgeT * LIGHTING.edgeActiveBoost   * fadeOut * 0.35
    edgesMatRef.current.opacity = clamp(hovered.current ? hoverOpacity : baseOpacity, 0, 1)

    // Surface — dark fill, appears after edges are established
    surfaceRef.current.material.opacity = clamp(surfaceT * 0.92 * fadeOut, 0, 1)

    groupRef.current.visible = edgeT > 0.005
  })

  return (
    <group
      ref={groupRef}
      position={pos}
      onPointerEnter={() => { hovered.current = true }}
      onPointerLeave={() => { hovered.current = false }}
    >
      <mesh ref={surfaceRef}>
        <boxGeometry args={size} />
        <meshBasicMaterial
          color={COLORS.panel}
          transparent
          opacity={0}
          depthWrite={true}
        />
      </mesh>

      <lineSegments geometry={edgesGeo}>
        <lineBasicMaterial
          ref={edgesMatRef}
          color={COLORS.data}
          transparent
          opacity={0}
          linewidth={1}
        />
      </lineSegments>
    </group>
  )
}

export function ActivatingState() {
  return (
    <group>
      {PANEL_CONFIGS.map(config => (
        <ActivatingPanel key={config.id} config={config} />
      ))}
    </group>
  )
}
