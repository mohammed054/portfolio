'use client'

import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { Float } from '@react-three/drei'
import { motion, useReducedMotion } from 'framer-motion'
import { useEffect, useMemo, useRef } from 'react'
import * as THREE from 'three'
import { profile } from '@/lib/data'

type Props = { onExplore: () => void }

function HeroMesh() {
  const meshRef = useRef<THREE.Mesh>(null)
  const { invalidate, gl } = useThree()
  const geom = useMemo(() => new THREE.BoxGeometry(2.2, 1.2, 0.4), [])
  const mat = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: new THREE.Color('rgb(79, 142, 247)'),
        metalness: 0.75,
        roughness: 0.2,
      }),
    [],
  )

  useFrame(({ pointer }) => {
    const mesh = meshRef.current
    if (!mesh) return
    mesh.rotation.y = THREE.MathUtils.lerp(mesh.rotation.y, pointer.x * 0.2, 0.08)
    mesh.rotation.x = THREE.MathUtils.lerp(mesh.rotation.x, -pointer.y * 0.2, 0.08)
    invalidate()
  })

  useEffect(() => {
    gl.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    return () => {
      geom.dispose()
      mat.dispose()
    }
  }, [geom, gl, mat])

  return (
    <Float speed={0.6}>
      <mesh ref={meshRef} geometry={geom} material={mat} onPointerMove={() => invalidate()} />
    </Float>
  )
}

function HeroFallback() {
  return <div className="absolute inset-0 bg-gradient-to-b from-[var(--surface)] to-[var(--background)]" aria-hidden="true" />
}

export default function Hero({ onExplore }: Props) {
  const prefersReducedMotion = useReducedMotion()

  return (
    <section id="hero" className="relative flex h-screen items-center justify-center overflow-hidden">
      <div className="absolute inset-0 hidden md:block">
        {prefersReducedMotion ? (
          <HeroFallback />
        ) : (
          <Canvas frameloop="demand" camera={{ position: [0, 0, 4] }}>
            <ambientLight intensity={0.4} />
            <directionalLight intensity={0.8} position={[2, 2, 3]} color="rgb(79, 142, 247)" />
            <HeroMesh />
          </Canvas>
        )}
      </div>
      <div className="absolute inset-0 md:hidden">
        <HeroFallback />
      </div>

      <div className="section-inner z-10 px-6 text-center">
        <p className="eyebrow mx-auto w-fit text-[var(--text-secondary)] before:bg-[var(--text-muted)]">{profile.eyebrow}</p>
        <h1 className="t-display mt-6 text-5xl md:text-8xl">{profile.name}</h1>
        <p className="t-h3 mt-4 text-[var(--text-secondary)]">{profile.subline}</p>
        <motion.button className="btn btn-primary mt-8" onClick={onExplore} whileHover={{ scale: 1.04 }}>
          <span>{profile.heroCta}</span>
        </motion.button>
      </div>
    </section>
  )
}
