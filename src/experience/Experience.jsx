import { useMemo } from 'react'
import { Canvas } from '@react-three/fiber'
import { Suspense } from 'react'
import * as THREE from 'three'
import { CameraRig } from './CameraRig'
import { IdleState } from '../states/IdleState'
import { ActivatingState } from '../states/ActivatingState'
import { IdentifyingState } from '../states/IdentifyingState'
import { RoutingState } from '../states/RoutingState'
import { ExecutingState } from '../states/ExecutingState'
import { CAMERA_FOV, COLORS } from '../config/variables'

// ─────────────────────────────────────────────────────────────────────────────
// OriginMarker
// 1×1×1 wireframe at world origin. Debug reference only.
// ─────────────────────────────────────────────────────────────────────────────

function OriginMarker() {
  return (
    <mesh position={[0, 0, 0]}>
      <boxGeometry args={[1, 1, 1]} />
      <meshBasicMaterial color={COLORS.structure} wireframe />
    </mesh>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// DepthReferenceGrid
// Subtle grid lines in world space for spatial reference during development.
// Color matches the substrate (#0A0C12) — near-invisible in production.
//
// FIX: The original code used `onUpdate` on bufferGeometry — a deprecated R3F
// v8 API that no longer fires reliably. Geometry was created with no position
// data, producing console errors and no rendered lines.
// Fix: Use declarative <bufferAttribute> with attach="attributes-position".
// ─────────────────────────────────────────────────────────────────────────────

function DepthReferenceGrid() {
  // Build all position arrays once — useMemo prevents recreation on re-renders
  const lineData = useMemo(() => {
    const lines = []
    for (let i = -5; i <= 5; i++) {
      lines.push({
        key: `x${i}`,
        pts: new Float32Array([-50, 0, i * 10, 50, 0, i * 10]),
      })
      lines.push({
        key: `z${i}`,
        pts: new Float32Array([i * 10, 0, -50, i * 10, 0, 50]),
      })
    }
    return lines
  }, [])

  return (
    <>
      {lineData.map(({ key, pts }) => (
        <line key={key}>
          <bufferGeometry>
            {/* R3F v8 declarative buffer attribute — replaces deprecated onUpdate */}
            <bufferAttribute
              attach="attributes-position"
              count={2}
              array={pts}
              itemSize={3}
            />
          </bufferGeometry>
          <lineBasicMaterial color="#0A0C12" />
        </line>
      ))}
    </>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// Experience
// Root WebGL canvas. All state layers are ALWAYS mounted — visibility is
// controlled internally via progress, never via React mount/unmount.
//
// Suspense boundaries exist to catch async font loads from @react-three/drei
// Text. fallback={null} means the canvas shows nothing during load rather than
// a spinner. IdentifyingState stays mounted (visible={t>0}) so the font loads
// at startup, not lazily at progress=0.15.
// ─────────────────────────────────────────────────────────────────────────────

export default function Experience() {
  return (
    <Canvas
      camera={{ position: [0, 0, 100], fov: CAMERA_FOV.default, near: 0.1, far: 2000 }}
      gl={{ antialias: true, alpha: false }}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        background: COLORS.background,
      }}
    >
      {/* Camera — the only component that writes to camera state */}
      <CameraRig />

      {/* State layers — all always mounted, visibility via progress */}
      <IdleState />
      <ActivatingState />

      {/* Suspense catches async font loads from drei Text */}
      <Suspense fallback={null}>
        <IdentifyingState />
      </Suspense>
      <Suspense fallback={null}>
        <RoutingState />
      </Suspense>
      <Suspense fallback={null}>
        <ExecutingState />
      </Suspense>

      {/* Debug / development aids — remove for production */}
      <OriginMarker />
      <DepthReferenceGrid />
    </Canvas>
  )
}