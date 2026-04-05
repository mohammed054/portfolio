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

function OriginMarker() {
  return (
    <mesh position={[0, 0, 0]}>
      <boxGeometry args={[1, 1, 1]} />
      <meshBasicMaterial color={COLORS.structure} wireframe />
    </mesh>
  )
}

function DepthReferenceGrid() {
  const lines = []
  for (let i = -5; i <= 5; i++) {
    lines.push(
      <line key={`x${i}`}>
        <bufferGeometry attach="geometry"
          onUpdate={self => {
            const pts = new Float32Array([-50, 0, i * 10, 50, 0, i * 10])
            self.setAttribute('position', new THREE.BufferAttribute(pts, 3))
          }}
        />
        <lineBasicMaterial color="#0A0C12" />
      </line>
    )
    lines.push(
      <line key={`z${i}`}>
        <bufferGeometry attach="geometry"
          onUpdate={self => {
            const pts = new Float32Array([i * 10, 0, -50, i * 10, 0, 50])
            self.setAttribute('position', new THREE.BufferAttribute(pts, 3))
          }}
        />
        <lineBasicMaterial color="#0A0C12" />
      </line>
    )
  }
  return <>{lines}</>
}

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
      <CameraRig />
      <IdleState />
      <ActivatingState />
      <Suspense fallback={null}>
        <IdentifyingState />
      </Suspense>
      <Suspense fallback={null}>
        <RoutingState />
      </Suspense>
      <Suspense fallback={null}>
        <ExecutingState />
      </Suspense>
      <OriginMarker />
      <DepthReferenceGrid />
    </Canvas>
  )
}