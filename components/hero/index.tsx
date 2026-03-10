'use client'

import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { motion, useReducedMotion } from 'framer-motion'
import { useEffect, useMemo, useRef, useState } from 'react'
import * as THREE from 'three'
import { profile, theme } from '@/lib/data'

type Props = { onExplore: () => void }

function Nebula() {
  const mat = useRef<THREE.ShaderMaterial>(null)
  const { invalidate } = useThree()
  useFrame(({ clock }) => {
    if (!mat.current) return
    mat.current.uniforms.uTime.value = clock.getElapsedTime()
    invalidate()
  })
  return (
    <mesh position={[0, 0, -3]}>
      <planeGeometry args={[14, 10]} />
      <shaderMaterial
        ref={mat}
        uniforms={{ uTime: { value: 0 } }}
        vertexShader={'varying vec2 vUv; void main(){ vUv=uv; gl_Position = projectionMatrix*modelViewMatrix*vec4(position,1.0);}'}
        fragmentShader={"uniform float uTime; varying vec2 vUv; void main(){ vec2 p=vUv*2.0-1.0; float t=uTime*0.07; float n=sin((p.x+t)*4.0)*cos((p.y-t)*3.0); float m=sin(length(p)*8.0-t*3.0); float c = 0.5 + 0.5*(n*0.55+m*0.45); vec3 a=vec3(0.031,0.043,0.078); vec3 b=vec3(0.31,0.557,0.969); vec3 d=vec3(0.545,0.361,0.965); vec3 col=mix(a,mix(b,d,c),0.62); gl_FragColor=vec4(col,0.95);}"}
      />
    </mesh>
  )
}

function InitialsMesh() {
  const group = useRef<THREE.Group>(null)
  const mats = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: new THREE.Color(theme.textPrimary),
        metalness: 0.9,
        roughness: 0.2,
      }),
    [],
  )
  const box = useMemo(() => new THREE.BoxGeometry(0.22, 1.45, 0.24), [])
  const arm = useMemo(() => new THREE.BoxGeometry(0.7, 0.2, 0.24), [])
  const { invalidate } = useThree()

  useFrame(({ pointer }) => {
    if (!group.current) return
    group.current.rotation.y = THREE.MathUtils.lerp(group.current.rotation.y, pointer.x * 0.14 + performance.now() * 0.00008, 0.06)
    group.current.rotation.x = THREE.MathUtils.lerp(group.current.rotation.x, -pointer.y * 0.14, 0.06)
    invalidate()
  })

  useEffect(() => () => {
    mats.dispose()
    box.dispose()
    arm.dispose()
  }, [arm, box, mats])

  return (
    <group ref={group}>
      <mesh geometry={box} material={mats} position={[-0.72, 0, 0]} />
      <mesh geometry={box} material={mats} position={[-0.2, 0, 0]} />
      <mesh geometry={arm} material={mats} position={[-0.46, 0.25, 0]} />
      <mesh geometry={box} material={mats} position={[0.36, 0, 0]} />
      <mesh geometry={box} material={mats} position={[0.92, 0, 0]} />
      <mesh geometry={arm} material={mats} position={[0.64, 0.3, 0]} rotation={[0, 0, 0.9]} />
      <mesh geometry={arm} material={mats} position={[0.64, -0.3, 0]} rotation={[0, 0, -0.9]} />
    </group>
  )
}

function Particles() {
  const points = useRef<THREE.Points>(null)
  const { invalidate } = useThree()
  const positions = useMemo(() => {
    const arr = new Float32Array(800 * 3)
    for (let i = 0; i < 800; i += 1) {
      arr[i * 3] = (Math.random() - 0.5) * 11
      arr[i * 3 + 1] = (Math.random() - 0.5) * 5
      arr[i * 3 + 2] = (Math.random() - 0.5) * 4
    }
    return arr
  }, [])

  useFrame(({ pointer, clock }) => {
    if (!points.current) return
    points.current.rotation.y = clock.getElapsedTime() * 0.03
    points.current.position.x = pointer.x * 0.22
    points.current.position.y = pointer.y * 0.15
    invalidate()
  })

  return (
    <points ref={points}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" count={positions.length / 3} itemSize={3} args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial size={0.02} color={theme.accent1} transparent opacity={0.8} />
    </points>
  )
}

export default function Hero({ onExplore }: Props) {
  const reduced = useReducedMotion()
  const [mobile, setMobile] = useState(false)

  useEffect(() => {
    const q = window.matchMedia('(max-width: 767px)')
    setMobile(q.matches)
    const fn = (e: MediaQueryListEvent) => setMobile(e.matches)
    q.addEventListener('change', fn)
    return () => q.removeEventListener('change', fn)
  }, [])

  return (
    <section id="hero" className="relative flex h-screen items-center justify-center overflow-hidden">
      {!mobile && !reduced ? (
        <Canvas frameloop="demand" camera={{ position: [0, 0, 4] }}>
          <ambientLight intensity={0.45} />
          <directionalLight intensity={0.8} position={[3, 3, 4]} color={theme.accent1} />
          <Nebula />
          <Particles />
          <InitialsMesh />
        </Canvas>
      ) : (
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,var(--surface),var(--background))]" aria-hidden="true" />
      )}

      <div className="section-inner absolute z-10 px-6 text-center">
        <p className="eyebrow mx-auto w-fit">{profile.eyebrow}</p>
        <h1 className="t-display mt-6 text-5xl md:text-8xl">{profile.name}</h1>
        <p className="t-h3 mt-3 text-[var(--text-secondary)]">{profile.subline}</p>
        <motion.button className="btn btn-primary mt-8" onClick={onExplore} whileHover={{ scale: 1.04 }}>
          <span>{profile.heroCta}</span>
        </motion.button>
      </div>
    </section>
  )
}
