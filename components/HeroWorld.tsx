// components/HeroWorld.tsx
'use client'

import React, { useRef, useMemo, MutableRefObject } from 'react'
import { useFrame } from '@react-three/fiber'
import { MeshWobbleMaterial, Sphere, Torus } from '@react-three/drei'
import * as THREE from 'three'

interface HeroWorldProps {
  visible:  boolean
  mousePos: MutableRefObject<{ x: number; y: number }>
}

// ─── Orbital ring data ─────────────────────────────────────────
const RINGS = [
  { radius: 2.4, tube: 0.008, color: '#4F8EF7', speed: 0.38,  tiltX: 0.4,  tiltZ: 0.2  },
  { radius: 3.1, tube: 0.006, color: '#8B5CF6', speed: -0.27, tiltX: 0.9,  tiltZ: 1.1  },
  { radius: 3.8, tube: 0.005, color: '#4F8EF7', speed: 0.19,  tiltX: 1.4,  tiltZ: 0.5  },
  { radius: 4.6, tube: 0.004, color: '#8B5CF6', speed: -0.14, tiltX: 0.2,  tiltZ: 1.7  },
]

// ─── Floating particle cloud ───────────────────────────────────
function useParticleCloud(count: number, spreadRadius: number) {
  return useMemo(() => {
    const positions  = new Float32Array(count * 3)
    const phases     = new Float32Array(count)
    const speeds     = new Float32Array(count)

    for (let i = 0; i < count; i++) {
      // Distribute on sphere surface with some radial variation
      const phi   = Math.acos(2 * Math.random() - 1)
      const theta = Math.random() * Math.PI * 2
      const r     = spreadRadius * (0.7 + Math.random() * 0.6)

      positions[i * 3]     = r * Math.sin(phi) * Math.cos(theta)
      positions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta)
      positions[i * 3 + 2] = r * Math.cos(phi)

      phases[i] = Math.random() * Math.PI * 2
      speeds[i] = 0.4 + Math.random() * 0.8
    }

    return { positions, phases, speeds }
  }, [count, spreadRadius])
}

// ─── Inner glow sphere ─────────────────────────────────────────
function GlowSphere({ radius }: { radius: number }) {
  const ref = useRef<THREE.Mesh>(null!)
  useFrame(({ clock }) => {
    if (!ref.current) return
    const t = clock.getElapsedTime()
    const mat = ref.current.material as THREE.MeshStandardMaterial
    mat.opacity = 0.06 + Math.sin(t * 1.2) * 0.025
    ref.current.scale.setScalar(1 + Math.sin(t * 0.8) * 0.04)
  })
  return (
    <Sphere ref={ref} args={[radius, 32, 32]}>
      <meshStandardMaterial
        color="#4F8EF7"
        emissive="#4F8EF7"
        emissiveIntensity={1.2}
        transparent
        opacity={0.08}
        depthWrite={false}
        side={THREE.BackSide}
      />
    </Sphere>
  )
}

// ─── Orbital ring component ────────────────────────────────────
function OrbitalRing({
  radius, tube, color, speed, tiltX, tiltZ,
}: (typeof RINGS)[0]) {
  const ref = useRef<THREE.Mesh>(null!)
  useFrame((_, delta) => {
    if (!ref.current) return
    ref.current.rotation.y += speed * delta
  })
  return (
    <Torus
      ref={ref}
      args={[radius, tube, 6, 128]}
      rotation={[tiltX, 0, tiltZ]}
    >
      <meshStandardMaterial
        color={color}
        emissive={color}
        emissiveIntensity={2.5}
        transparent
        opacity={0.75}
        depthWrite={false}
      />
    </Torus>
  )
}

// ─── Floating particle cloud component ────────────────────────
function ParticleCloud({
  count = 320,
  spread = 4.5,
}: {
  count?: number
  spread?: number
}) {
  const pointsRef  = useRef<THREE.Points>(null!)
  const { positions, phases, speeds } = useParticleCloud(count, spread)

  const geometry = useMemo(() => {
    const geo = new THREE.BufferGeometry()
    geo.setAttribute('position', new THREE.BufferAttribute(positions.slice(), 3))
    return geo
  }, [positions])

  useFrame(({ clock }) => {
    if (!pointsRef.current) return
    const t   = clock.getElapsedTime()
    const pos = pointsRef.current.geometry.attributes.position as THREE.BufferAttribute
    const arr = pos.array as Float32Array

    for (let i = 0; i < count; i++) {
      const phase = phases[i]
      const spd   = speeds[i]
      const ox    = positions[i * 3]
      const oy    = positions[i * 3 + 1]
      const oz    = positions[i * 3 + 2]

      arr[i * 3]     = ox + Math.sin(t * spd + phase) * 0.12
      arr[i * 3 + 1] = oy + Math.cos(t * spd * 0.7 + phase) * 0.10
      arr[i * 3 + 2] = oz + Math.sin(t * spd * 0.5 + phase * 1.3) * 0.09
    }
    pos.needsUpdate = true

    // Global slow rotation
    pointsRef.current.rotation.y += 0.0006
    pointsRef.current.rotation.x  = Math.sin(t * 0.18) * 0.08
  })

  return (
    <points ref={pointsRef} geometry={geometry}>
      <pointsMaterial
        color="#8B5CF6"
        size={0.045}
        sizeAttenuation
        transparent
        opacity={0.65}
        depthWrite={false}
      />
    </points>
  )
}

// ─── Main hero crystal ─────────────────────────────────────────
function HeroCrystal({ mousePos }: { mousePos: MutableRefObject<{ x: number; y: number }> }) {
  const meshRef = useRef<THREE.Mesh>(null!)

  useFrame(({ clock }) => {
    if (!meshRef.current) return
    const t  = clock.getElapsedTime()
    const mx = mousePos.current.x
    const my = mousePos.current.y

    meshRef.current.rotation.y += 0.0025
    meshRef.current.rotation.x += (my * 0.06 - meshRef.current.rotation.x) * 0.04
    meshRef.current.rotation.z += (-mx * 0.04 - meshRef.current.rotation.z) * 0.04

    // Breathe scale
    const breath = 1 + Math.sin(t * 0.7) * 0.025
    meshRef.current.scale.setScalar(breath)
  })

  return (
    <mesh ref={meshRef}>
      <icosahedronGeometry args={[1.35, 4]} />
      <MeshWobbleMaterial
        color="#4F8EF7"
        emissive="#3070e0"
        emissiveIntensity={0.8}
        metalness={0.6}
        roughness={0.15}
        speed={1.4}
        factor={0.18}
        transparent
        opacity={0.90}
      />
    </mesh>
  )
}

// ─── Lens flare accent points ──────────────────────────────────
function LensFlare() {
  const ref = useRef<THREE.Points>(null!)

  const geo = useMemo(() => {
    const g = new THREE.BufferGeometry()
    const pts: number[] = []
    const flares = [
      [-2.2,  1.4, 0.5],
      [ 2.8, -0.8, 1.0],
      [-1.0, -2.2, 0.8],
      [ 1.5,  2.0, 0.3],
    ]
    flares.forEach(([x, y, z]) => pts.push(x, y, z))
    g.setAttribute('position', new THREE.BufferAttribute(new Float32Array(pts), 3))
    return g
  }, [])

  useFrame(({ clock }) => {
    if (!ref.current) return
    const mat = ref.current.material as THREE.PointsMaterial
    mat.opacity = 0.55 + Math.sin(clock.getElapsedTime() * 1.8) * 0.35
    ref.current.rotation.z += 0.003
  })

  return (
    <points ref={ref} geometry={geo}>
      <pointsMaterial
        color="#ffffff"
        size={0.18}
        sizeAttenuation
        transparent
        opacity={0.7}
        depthWrite={false}
      />
    </points>
  )
}

// ─── Exported component ────────────────────────────────────────
export default function HeroWorld({ visible, mousePos }: HeroWorldProps) {
  const groupRef = useRef<THREE.Group>(null!)

  useFrame(() => {
    if (!groupRef.current) return
    const targetOpacity = visible ? 1 : 0
    // Fade group in/out by scaling — R3F has no built-in opacity on group
    const current = groupRef.current.scale.x
    const next    = current + (targetOpacity - current) * 0.08
    groupRef.current.scale.setScalar(Math.max(0.001, next))
    groupRef.current.visible = groupRef.current.scale.x > 0.01
  })

  return (
    <group ref={groupRef} position={[0, 0, 0]}>
      {/* Glow aura (back-face sphere) */}
      <GlowSphere radius={2.2} />

      {/* Main crystal */}
      <HeroCrystal mousePos={mousePos} />

      {/* Orbital rings */}
      {RINGS.map((ring, i) => (
        <OrbitalRing key={`ring-${i}`} {...ring} />
      ))}

      {/* Floating particle cloud */}
      <ParticleCloud count={360} spread={5} />

      {/* Lens flare accents */}
      <LensFlare />
    </group>
  )
}