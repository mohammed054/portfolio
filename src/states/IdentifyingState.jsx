import { useRef, useMemo, useEffect } from 'react'
import { useFrame } from '@react-three/fiber'
import { Text } from '@react-three/drei'
import * as THREE from 'three'
import { useExperience } from '../core/ExperienceProvider'
import {
  STATES,
  COLORS,
  COLOR_STATE,
  TYPE,
} from '../config/variables'
import { clamp, range } from '../utils/math'

// ─────────────────────────────────────────────────────────────────────────────
// Constants
// ─────────────────────────────────────────────────────────────────────────────

// Z position where typography lives in world space.
// Camera travels z=100→0 over progress 0→1.
// At progress≈0.225 (mid-IDENTIFYING), camera z≈77.5 → crosses this plane.
const TEXT_Z = 77

const TRACE_WIDTH = 220

// Normalized t within IDENTIFYING at which the camera crosses the text plane
const SCAN_PEAK_T   = 0.52
const SCAN_WINDOW_T = 0.09

// Y positions for horizontal amber traces (relative to group origin)
const TRACE_ROWS = [
  { y:  11.5, weight: 0.9  },
  { y:   6.0, weight: 1.0  },
  { y:   0.5, weight: 0.7  },
  { y:  -6.5, weight: 1.0  },
  { y: -10.5, weight: 0.85 },
]

// ─────────────────────────────────────────────────────────────────────────────
// AmberTrace
// Single horizontal dashed line with animated dashOffset.
// ─────────────────────────────────────────────────────────────────────────────

function AmberTrace({ y, index, weight, intensityRef, scanPulseRef }) {
  const lineRef = useRef()

  const geometry = useMemo(() => {
    const geo = new THREE.BufferGeometry()
    const pts = new Float32Array([
      -TRACE_WIDTH / 2, 0, 0,
       TRACE_WIDTH / 2, 0, 0,
    ])
    geo.setAttribute('position', new THREE.BufferAttribute(pts, 3))
    return geo
  }, [])

  const material = useMemo(() => new THREE.LineDashedMaterial({
    color:       new THREE.Color(COLORS.activation),
    dashSize:    2.8,
    gapSize:     6.0,
    linewidth:   1,
    transparent: true,
    opacity:     0,
    depthWrite:  false,
    blending:    THREE.AdditiveBlending,
  }), [])

  // LineDashedMaterial requires computeLineDistances() on the Line object
  useEffect(() => {
    if (lineRef.current) lineRef.current.computeLineDistances()
  }, [])

  useFrame((state) => {
    if (!lineRef.current) return

    const intensity = intensityRef.current
    const scanPulse = scanPulseRef.current

    const driftFactor = 1 + index * 0.14
    const scanBoost   = 1 + scanPulse * 2.2

    // Only animate dashOffset when active — avoids accumulation during idle
    if (intensity > 0.001) {
      material.dashOffset = -(state.clock.elapsedTime * 0.24 * driftFactor * intensity)
    }
    material.opacity = clamp(0.30 * intensity * weight * scanBoost, 0, 0.95)
  })

  return (
    <line ref={lineRef} geometry={geometry} position={[0, y, 0]}>
      <primitive object={material} attach="material" />
    </line>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// ScanLine
// Thin horizontal plane that fires once as the camera crosses the text plane.
// ─────────────────────────────────────────────────────────────────────────────

function ScanLine({ scanPulseRef }) {
  const meshRef = useRef()

  useFrame(() => {
    if (!meshRef.current) return
    const p = scanPulseRef.current
    meshRef.current.material.opacity = p * 0.72
    meshRef.current.scale.x = 1 + p * 0.06
  })

  return (
    <mesh ref={meshRef} position={[0, 0, 0.4]}>
      <planeGeometry args={[400, 0.07]} />
      <meshBasicMaterial
        color={new THREE.Color(COLORS.structure)}
        transparent
        opacity={0}
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </mesh>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// IdentifyingState
// Progress range: STATES.IDENTIFYING = { start: 0.15, end: 0.30 }
//
// CRITICAL ARCHITECTURE FIX:
//   ALL hooks MUST be called unconditionally, before ANY conditional logic.
//   The original code called useRef AFTER a conditional `return null` — this
//   violated React's Rules of Hooks. When progress crossed 0.15, the hook
//   count changed (1 → 3), React threw, the Suspense boundary caught it
//   silently, and the entire canvas went blank permanently.
//
//   Fix: move all hooks to the top. Use <group visible={t > 0}> instead of
//   returning null. This also keeps Text components mounted so the font
//   preloads at startup rather than lazily at progress=0.15.
// ─────────────────────────────────────────────────────────────────────────────

export function IdentifyingState() {
  const { progress } = useExperience()

  // ─── ALL HOOKS UNCONDITIONALLY AT THE TOP ─────────────────────────────────
  const intensityRef = useRef(0)
  const scanPulseRef = useRef(0)
  // ─────────────────────────────────────────────────────────────────────────

  // Normalized position within this state [0, 1]
  const t = range(progress, STATES.IDENTIFYING.start, STATES.IDENTIFYING.end)

  // Presence envelope — safe for all t including t <= 0
  const presence =
    t <= 0 ? 0 :
    t < 0.12 ? t / 0.12 :
    t > 0.86 ? (1 - t) / 0.14 :
    1.0

  const amberIntensity = COLOR_STATE.IDENTIFYING.activation * presence
  const rolePresence   = clamp((t - 0.08) / 0.12, 0, 1) * presence
  const scanPulse      = t > 0
    ? clamp(1 - Math.abs(t - SCAN_PEAK_T) / SCAN_WINDOW_T, 0, 1)
    : 0

  // Update refs on every render — child useFrame callbacks read from these
  intensityRef.current = amberIntensity
  scanPulseRef.current = scanPulse

  // ─── VISIBLE PROP INSTEAD OF RETURNING NULL ───────────────────────────────
  // Returning null unmounts children, violating the "always mounted" rule,
  // preventing font preload, and causing remount flashes at the state boundary.
  // visible={t > 0} hides the group in Three.js while keeping React tree alive.
  return (
    <group position={[0, 0, TEXT_Z]} visible={t > 0}>

      {/* ── MOHAMMED HASSOUN ───────────────────────────────────────────────── */}
      <Text
        position={[0, TYPE.nameScale * 0.48, 0]}
        rotation={[0, TYPE.rotationOffset, 0]}
        fontSize={TYPE.nameScale}
        color={COLORS.structure}
        anchorX="center"
        anchorY="middle"
        fillOpacity={presence}
        letterSpacing={0.04}
        outlineWidth={0}
        depthOffset={0}
      >
        MOHAMMED HASSOUN
      </Text>

      {/* ── FULL STACK ENGINEER ────────────────────────────────────────────── */}
      {/* Offset back on Z by depthOffset — spatial separation so camera       */}
      {/* passes name plane before role plane                                   */}
      <Text
        position={[0, -TYPE.roleScale * 0.62, -TYPE.depthOffset]}
        rotation={[0, -TYPE.rotationOffset * 0.55, 0]}
        fontSize={TYPE.roleScale}
        color={COLORS.structure}
        anchorX="center"
        anchorY="middle"
        fillOpacity={rolePresence}
        letterSpacing={0.16}
        outlineWidth={0}
        depthOffset={0}
      >
        FULL STACK ENGINEER
      </Text>

      {/* ── AMBER TRACES ───────────────────────────────────────────────────── */}
      {TRACE_ROWS.map(({ y, weight }, i) => (
        <AmberTrace
          key={i}
          y={y}
          index={i}
          weight={weight}
          intensityRef={intensityRef}
          scanPulseRef={scanPulseRef}
        />
      ))}

      {/* ── SCAN LINE ──────────────────────────────────────────────────────── */}
      <ScanLine scanPulseRef={scanPulseRef} />

    </group>
  )
}