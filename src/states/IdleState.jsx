import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { useSystemStore } from '../core/ExperienceProvider'
import { STATES, GRID, GRID_REACTIVITY } from '../config/variables'
import { progressRange } from '../utils/math'

const GRID_VERT = /* glsl */`
  varying vec3 vWorldPos;

  void main() {
    vec4 worldPosition = modelMatrix * vec4(position, 1.0);
    vWorldPos = worldPosition.xyz;
    gl_Position = projectionMatrix * viewMatrix * worldPosition;
  }
`

const GRID_FRAG = /* glsl */`
  varying vec3 vWorldPos;

  uniform float uSpacing;
  uniform vec3  uColor;
  uniform float uOpacity;
  uniform float uPulse;

  void main() {
    vec2 coord      = vWorldPos.xz / uSpacing;
    vec2 derivative = fwidth(coord);
    vec2 grid       = abs(fract(coord - 0.5) - 0.5) / derivative;
    float line      = min(grid.x, grid.y);
    float alpha     = 1.0 - min(line, 1.0);
    float opacity   = (uOpacity + uPulse) * alpha;

    if (opacity < 0.0005) discard;
    gl_FragColor = vec4(uColor, opacity);
  }
`

export function IdleState() {
  const matRef = useRef()

  useFrame(() => {
    if (!matRef.current) return

    const { progress } = useSystemStore.getState()

    const activatingT = progressRange(progress, STATES.ACTIVATING.start, STATES.ACTIVATING.end)
    const pulse       = GRID_REACTIVITY.pulseIntensity * Math.sin(activatingT * Math.PI)

    matRef.current.uniforms.uOpacity.value = GRID.opacity
    matRef.current.uniforms.uPulse.value   = pulse * GRID.opacity
  })

  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -2, 0]}>
      <planeGeometry args={[4000, 4000]} />
      <shaderMaterial
        ref={matRef}
        vertexShader={GRID_VERT}
        fragmentShader={GRID_FRAG}
        transparent
        depthWrite={false}
        side={THREE.DoubleSide}
        extensions={{ derivatives: true }}
        uniforms={{
          uSpacing : { value: GRID.spacing },
          uColor   : { value: new THREE.Color(GRID.color) },
          uOpacity : { value: GRID.opacity },
          uPulse   : { value: 0 },
        }}
      />
    </mesh>
  )
}
