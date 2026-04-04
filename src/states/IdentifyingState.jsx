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
// Camera travels from z=100→0 over progress 0→1.
// At progress=0.225 (midpoint of IDENTIFYING), camera z ≈ 77.5 → camera crosses this plane.
const TEXT_Z = 77

// Horizontal extent of amber traces
const TRACE_WIDTH = 220

// Normalized t within IDENTIFYING at which the camera crosses the text plane
const SCAN_PEAK_T   = 0.52
const SCAN_WINDOW_T = 0.09

// Font uses default drei font (no custom font needed)
// const FONT_URL = '/fonts/Inter-Bold.woff'

// Y positions for horizontal amber traces (relative to group origin)
// Intentionally asymmetric — they bracket the two text elements
const TRACE_ROWS = [
  { y: 11.5, weight: 0.9 },
  { y:  6.0, weight: 1.0 },
  { y:  0.5, weight: 0.7 },
  { y: -6.5, weight: 1.0 },
  { y: -10.5, weight: 0.85 },
]

// ─────────────────────────────────────────────────────────────────────────────
// AmberTrace
// Single horizontal dashed line with animated dashOffset.
// Intensity and scan boost are passed as refs to avoid closure staleness.
// ─────────────────────────────────────────────────────────────────────────────

function AmberTrace({ y, index, weight, intensityRef, scanPulseRef }) {
  const lineRef = useRef()

  // Geometry: two end-points of a horizontal segment
  const geometry = useMemo(() => {
    const geo = new THREE.BufferGeometry()
    const pts = new Float32Array([
      -TRACE_WIDTH / 2, 0, 0,
       TRACE_WIDTH / 2, 0, 0,
    ])
    geo.setAttribute('position', new THREE.BufferAttribute(pts, 3))
    return geo
  }, [])

  // Dashed line material — one instance per trace so dashOffset is independent
  const material = useMemo(() => new THREE.LineDashedMaterial({
    color:      new THREE.Color(COLORS.activation),
    dashSize:   2.8,
    gapSize:    6.0,
    linewidth:  1,
    transparent: true,
    opacity:    0,
    depthWrite: false,
    blending:   THREE.AdditiveBlending,
  }), [])

  // LineDashedMaterial requires computeLineDistances() on the Line object
  useEffect(() => {
    if (lineRef.current) lineRef.current.computeLineDistances()
  }, [])

  useFrame((state) => {
    if (!lineRef.current) return

    const intensity  = intensityRef.current
    const scanPulse  = scanPulseRef.current

    // Each trace scrolls at a slightly different speed — controlled imperfection
    const driftFactor = 1 + index * 0.14
    const scanBoost   = 1 + scanPulse * 2.2

    material.dashOffset = -(state.clock.elapsedTime * 0.24 * driftFactor * intensity)
    material.opacity    = clamp(0.30 * intensity * weight * scanBoost, 0, 0.95)
  })

  return (
    <line ref={lineRef} geometry={geometry} position={[0, y, 0]}>
      <primitive object={material} attach="material" />
    </line>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// ScanLine
// A thin horizontal plane that fires once as the camera crosses the text plane.
// Driven purely by scanPulseRef — no independent timing.
// ─────────────────────────────────────────────────────────────────────────────

function ScanLine({ scanPulseRef }) {
  const meshRef = useRef()

  useFrame(() => {
    if (!meshRef.current) return
    const p = scanPulseRef.current
    meshRef.current.material.opacity = p * 0.72
    // Brief scale pulse on the horizontal axis
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
// Layout (all positions relative to group at [0, 0, TEXT_Z]):
//   Name  →  [0,  y+,  0              ]  large scale, slight +rotY
//   Role  →  [0,  y-,  -TYPE.depthOffset]  smaller, slight -rotY, staggered reveal
//   Traces → 5 horizontal amber lines bracketing both text elements
//   Scan  → thin flash plane at z≈0, fires at t=SCAN_PEAK_T
// ─────────────────────────────────────────────────────────────────────────────

export function IdentifyingState() {
  const { progress } = useExperience()

  // Normalized position within this state [0, 1]
  const t = range(progress, STATES.IDENTIFYING.start, STATES.IDENTIFYING.end)

  // Outside state — render nothing (component stays mounted in Experience tree)
  if (t <= 0) return null

  // Presence envelope: fast rise (0→12%), full, then decay (86%→100%)
  const presence =
    t < 0.12 ? t / 0.12 :
    t > 0.86 ? (1 - t) / 0.14 :
    1.0

  // Amber channel intensity from the colour state map
  const amberIntensity = COLOR_STATE.IDENTIFYING.activation * presence  // → 0.85

  // Role text stagger: appears at t=0.08, fully visible by t=0.20
  const rolePresence = clamp((t - 0.08) / 0.12, 0, 1) * presence

  // Scan pulse — peaks once at SCAN_PEAK_T, width = SCAN_WINDOW_T
  const scanPulse = clamp(1 - Math.abs(t - SCAN_PEAK_T) / SCAN_WINDOW_T, 0, 1)

  // Refs for useFrame closures in child components (avoids stale capture)
  const intensityRef  = useRef(amberIntensity)
  const scanPulseRef  = useRef(scanPulse)
  intensityRef.current  = amberIntensity
  scanPulseRef.current  = scanPulse

  return (
    <group position={[0, 0, TEXT_Z]}>

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
      {/* Offset back on Z by depthOffset — creates spatial separation, */}
      {/* so the camera passes the name plane before the role plane.    */}
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
