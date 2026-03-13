// components/Worlds.tsx
'use client'

import React, { useRef, useMemo, MutableRefObject } from 'react'
import { useFrame } from '@react-three/fiber'
import { RoundedBox, Sphere, Line, Float } from '@react-three/drei'
import * as THREE from 'three'
import { SECTION_SPACING } from './Universe'

// ─── Section origins ────────────────────────────────────────────
// Section 0 (Hero) = x:0, handled by HeroWorld
const OX = (i: number) => i * SECTION_SPACING  // section X origin

interface WorldsProps {
  sectionIndex: number
  mousePos:     MutableRefObject<{ x: number; y: number }>
}

// ═══════════════════════════════════════════════════════════════
//  PROJECTS WORLD  (section index 1)
// ═══════════════════════════════════════════════════════════════

const PROJECTS = [
  { title: 'AI Dashboard',   color: '#4F8EF7', accent: '#8B5CF6', x: -6, y:  1.2, z: -1   },
  { title: 'Neural API',     color: '#8B5CF6', accent: '#4F8EF7', x:  0, y:  0,   z:  0.5 },
  { title: 'Real-time Chat', color: '#4F8EF7', accent: '#8B5CF6', x:  6, y: -1.2, z: -1   },
]

function ProjectCard({
  project,
  active,
}: {
  project: (typeof PROJECTS)[0]
  active: boolean
}) {
  const meshRef   = useRef<THREE.Mesh>(null!)
  const glowRef   = useRef<THREE.PointLight>(null!)
  const hovered   = useRef(false)
  const scaleRef  = useRef(active ? 1 : 0.01)

  useFrame(({ clock }) => {
    if (!meshRef.current) return
    const t       = clock.getElapsedTime()
    const target  = active ? 1 : 0.01
    scaleRef.current += (target - scaleRef.current) * 0.07
    meshRef.current.scale.setScalar(scaleRef.current)
    meshRef.current.visible = scaleRef.current > 0.02

    // Float bob
    meshRef.current.position.y = project.y + Math.sin(t * 0.6 + project.x) * 0.12

    // Hover glow pulse
    if (glowRef.current) {
      glowRef.current.intensity = hovered.current
        ? 3 + Math.sin(t * 3) * 0.5
        : 0.8 + Math.sin(t * 1.2 + project.x) * 0.3
    }
  })

  return (
    <group
      position={[project.x, project.y, project.z]}
      onPointerEnter={() => { hovered.current = true  }}
      onPointerLeave={() => { hovered.current = false }}
    >
      {/* Card mesh */}
      <mesh ref={meshRef}>
        <RoundedBox args={[3.4, 2.1, 0.08]} radius={0.14} smoothness={4}>
          <meshStandardMaterial
            color={project.color}
            emissive={project.color}
            emissiveIntensity={0.12}
            metalness={0.4}
            roughness={0.3}
            transparent
            opacity={0.18}
          />
        </RoundedBox>

        {/* Card border glow */}
        <RoundedBox args={[3.42, 2.12, 0.04]} radius={0.15} smoothness={4}>
          <meshStandardMaterial
            color={project.accent}
            emissive={project.accent}
            emissiveIntensity={1.5}
            wireframe
            transparent
            opacity={0.25}
          />
        </RoundedBox>
      </mesh>

      {/* Accent point light behind card */}
      <pointLight
        ref={glowRef}
        position={[0, 0, -0.5]}
        color={project.color}
        intensity={0.8}
        distance={6}
        decay={2}
      />

      {/* Orbiting particle flare around hovered card */}
      <ParticleOrbit radius={2.2} count={28} color={project.accent} speed={0.9} active={active} />
    </group>
  )
}

// Small orbit of particles around an object
function ParticleOrbit({
  radius, count, color, speed, active,
}: {
  radius: number; count: number; color: string; speed: number; active: boolean
}) {
  const ref    = useRef<THREE.Points>(null!)
  const angles = useMemo(() => Array.from({ length: count }, (_, i) => (i / count) * Math.PI * 2), [count])
  const scales = useMemo(() => Array.from({ length: count }, () => 0.6 + Math.random() * 0.8),     [count])

  const geo = useMemo(() => {
    const g   = new THREE.BufferGeometry()
    const pos = new Float32Array(count * 3)
    angles.forEach((a, i) => {
      pos[i * 3]     = Math.cos(a) * radius
      pos[i * 3 + 1] = (Math.random() - 0.5) * 0.3
      pos[i * 3 + 2] = Math.sin(a) * radius
    })
    g.setAttribute('position', new THREE.BufferAttribute(pos, 3))
    return g
  }, [angles, radius, count])

  useFrame(({ clock }) => {
    if (!ref.current) return
    ref.current.rotation.y  = clock.getElapsedTime() * speed
    ref.current.rotation.x  = Math.sin(clock.getElapsedTime() * 0.3) * 0.2
    const mat = ref.current.material as THREE.PointsMaterial
    mat.opacity = active ? 0.55 + Math.sin(clock.getElapsedTime() * 2) * 0.2 : 0
  })

  return (
    <points ref={ref} geometry={geo}>
      <pointsMaterial
        color={color}
        size={0.06}
        sizeAttenuation
        transparent
        opacity={0}
        depthWrite={false}
      />
    </points>
  )
}

function ProjectsWorld({ active }: { active: boolean }) {
  const ox = OX(1)
  return (
    <group position={[ox, 0, 0]}>
      {PROJECTS.map((p, i) => (
        <ProjectCard key={p.title} project={p} active={active} />
      ))}
    </group>
  )
}

// ═══════════════════════════════════════════════════════════════
//  ABOUT / CONSTELLATION WORLD  (section index 2)
// ═══════════════════════════════════════════════════════════════

const SKILLS = [
  { label: 'React',       x: -4.5, y:  2.2, z: 0,    color: '#61DAFB' },
  { label: 'Next.js',     x: -2.0, y:  3.1, z: 0.5,  color: '#ffffff' },
  { label: 'TypeScript',  x:  1.5, y:  2.8, z: -0.3, color: '#3178C6' },
  { label: 'Python',      x:  4.2, y:  1.5, z: 0.2,  color: '#FFD43B' },
  { label: 'AI / LLMs',   x:  3.0, y: -1.0, z: 0.8,  color: '#8B5CF6' },
  { label: 'Three.js',    x: -1.0, y: -2.0, z: -0.5, color: '#4F8EF7' },
  { label: 'Node.js',     x: -4.0, y: -1.5, z: 0.3,  color: '#68A063' },
  { label: 'PostgreSQL',  x:  0.2, y:  0.4, z: 1.0,  color: '#336791' },
]

const CONNECTIONS = [
  [0, 1], [1, 2], [2, 3], [3, 4],
  [4, 5], [5, 6], [6, 0], [7, 1],
  [7, 4], [2, 7],
]

function SkillNode({ skill, active }: { skill: (typeof SKILLS)[0]; active: boolean }) {
  const ref      = useRef<THREE.Mesh>(null!)
  const lightRef = useRef<THREE.PointLight>(null!)
  const hovered  = useRef(false)

  useFrame(({ clock }) => {
    if (!ref.current) return
    const t = clock.getElapsedTime()
    ref.current.position.y = skill.y + Math.sin(t * 0.5 + skill.x) * 0.08

    const baseScale = active ? 1 : 0
    const hoverBonus = hovered.current ? 0.25 : 0
    ref.current.scale.setScalar(baseScale + hoverBonus)

    if (lightRef.current) {
      lightRef.current.intensity = (hovered.current ? 3 : 1.2) + Math.sin(t * 2 + skill.x) * 0.4
    }
  })

  return (
    <group position={[skill.x, skill.y, skill.z]}>
      <Sphere
        ref={ref}
        args={[0.22, 20, 20]}
        onPointerEnter={() => { hovered.current = true  }}
        onPointerLeave={() => { hovered.current = false }}
      >
        <meshStandardMaterial
          color={skill.color}
          emissive={skill.color}
          emissiveIntensity={1.8}
          metalness={0.3}
          roughness={0.2}
        />
      </Sphere>
      <pointLight
        ref={lightRef}
        color={skill.color}
        intensity={1.2}
        distance={4}
        decay={2}
      />
    </group>
  )
}

function ConstellationLines({ active }: { active: boolean }) {
  const linesRef = useRef<THREE.Group>(null!)

  useFrame(() => {
    if (!linesRef.current) return
    const target = active ? 1 : 0
    linesRef.current.children.forEach((child) => {
      const mat = (child as THREE.Line).material as THREE.LineBasicMaterial
      mat.opacity += (target - mat.opacity) * 0.05
    })
  })

  return (
    <group ref={linesRef}>
      {CONNECTIONS.map(([a, b], i) => {
        const sa = SKILLS[a]
        const sb = SKILLS[b]
        return (
          <Line
            key={`conn-${i}`}
            points={[
              [sa.x, sa.y, sa.z],
              [sb.x, sb.y, sb.z],
            ]}
            color="#4F8EF7"
            lineWidth={0.6}
            transparent
            opacity={0}
            dashed={false}
          />
        )
      })}
    </group>
  )
}

function AboutWorld({ active }: { active: boolean }) {
  const ox = OX(2)
  return (
    <group position={[ox, 0, 0]}>
      {SKILLS.map((s) => (
        <SkillNode key={s.label} skill={s} active={active} />
      ))}
      <ConstellationLines active={active} />
    </group>
  )
}

// ═══════════════════════════════════════════════════════════════
//  TESTIMONIALS WORLD  (section index 3)
// ═══════════════════════════════════════════════════════════════

const TESTIMONIALS_3D = [
  { x: -5.5, y:  0.8, z: -1.5, rot: 0.25  },
  { x:  0,   y:  0,   z:  0.5, rot: 0     },
  { x:  5.5, y: -0.8, z: -1.5, rot: -0.25 },
]

function TestimonialCard({
  cfg, active, index,
}: {
  cfg: (typeof TESTIMONIALS_3D)[0]; active: boolean; index: number
}) {
  const ref      = useRef<THREE.Group>(null!)
  const scaleRef = useRef(0)

  useFrame(({ clock }) => {
    if (!ref.current) return
    const t = clock.getElapsedTime()
    const target = active ? 1 : 0
    scaleRef.current += (target - scaleRef.current) * 0.055
    ref.current.scale.setScalar(Math.max(0.001, scaleRef.current))
    ref.current.visible = scaleRef.current > 0.02
    ref.current.position.y = cfg.y + Math.sin(t * 0.45 + index * 1.8) * 0.1

    // Slight rotation as they enter (per spec: "rotate slightly into place")
    ref.current.rotation.y = cfg.rot * (1 - scaleRef.current) + cfg.rot * 0.15 * Math.sin(t * 0.3 + index)
  })

  return (
    <group ref={ref} position={[cfg.x, cfg.y, cfg.z]}>
      <RoundedBox args={[3.2, 2.0, 0.07]} radius={0.12} smoothness={4}>
        <meshStandardMaterial
          color="#8B5CF6"
          emissive="#8B5CF6"
          emissiveIntensity={0.1}
          transparent
          opacity={0.14}
          metalness={0.3}
          roughness={0.4}
        />
      </RoundedBox>
      <RoundedBox args={[3.22, 2.02, 0.05]} radius={0.13} smoothness={4}>
        <meshStandardMaterial
          color="#4F8EF7"
          emissive="#4F8EF7"
          emissiveIntensity={1.2}
          wireframe
          transparent
          opacity={0.18}
        />
      </RoundedBox>
      <pointLight
        position={[0, 0, 0.5]}
        color="#8B5CF6"
        intensity={1 + index * 0.3}
        distance={5}
        decay={2}
      />
    </group>
  )
}

function TestimonialsWorld({ active }: { active: boolean }) {
  const ox = OX(3)
  return (
    <group position={[ox, 0, 0]}>
      {TESTIMONIALS_3D.map((cfg, i) => (
        <TestimonialCard key={`tcard-${i}`} cfg={cfg} active={active} index={i} />
      ))}
    </group>
  )
}

// ═══════════════════════════════════════════════════════════════
//  CONTACT / BEACON WORLD  (section index 4)
// ═══════════════════════════════════════════════════════════════

function BeaconOrbit({
  radius,
  count,
  speed,
  color,
  active,
}: {
  radius: number; count: number; speed: number; color: string; active: boolean
}) {
  const ref = useRef<THREE.Points>(null!)

  const geo = useMemo(() => {
    const g   = new THREE.BufferGeometry()
    const pos = new Float32Array(count * 3)
    for (let i = 0; i < count; i++) {
      const a = (i / count) * Math.PI * 2
      pos[i * 3]     = Math.cos(a) * radius
      pos[i * 3 + 1] = (Math.random() - 0.5) * 0.5
      pos[i * 3 + 2] = Math.sin(a) * radius
    }
    g.setAttribute('position', new THREE.BufferAttribute(pos, 3))
    return g
  }, [count, radius])

  useFrame(({ clock }) => {
    if (!ref.current) return
    ref.current.rotation.y = clock.getElapsedTime() * speed
    ref.current.rotation.x = Math.sin(clock.getElapsedTime() * 0.4) * 0.15
    const mat = ref.current.material as THREE.PointsMaterial
    const targetOp = active ? 0.65 : 0
    mat.opacity += (targetOp - mat.opacity) * 0.06
  })

  return (
    <points ref={ref} geometry={geo}>
      <pointsMaterial
        color={color}
        size={0.07}
        sizeAttenuation
        transparent
        opacity={0}
        depthWrite={false}
      />
    </points>
  )
}

function BeaconCore({ active }: { active: boolean }) {
  const ref      = useRef<THREE.Mesh>(null!)
  const lightRef = useRef<THREE.PointLight>(null!)
  const scaleRef = useRef(0)

  useFrame(({ clock }) => {
    if (!ref.current) return
    const t = clock.getElapsedTime()
    const target = active ? 1 : 0
    scaleRef.current += (target - scaleRef.current) * 0.07
    ref.current.scale.setScalar(scaleRef.current)
    ref.current.visible = scaleRef.current > 0.02
    ref.current.rotation.y += 0.008
    ref.current.rotation.x = Math.sin(t * 0.5) * 0.1

    if (lightRef.current) {
      // Gentle pulse per spec
      lightRef.current.intensity = (2 + Math.sin(t * 1.5) * 0.8) * scaleRef.current
    }
  })

  return (
    <group>
      <Sphere ref={ref} args={[0.75, 32, 32]}>
        <meshStandardMaterial
          color="#4F8EF7"
          emissive="#4F8EF7"
          emissiveIntensity={1.4}
          metalness={0.5}
          roughness={0.1}
          transparent
          opacity={0.88}
        />
      </Sphere>
      <pointLight
        ref={lightRef}
        position={[0, 0, 0]}
        color="#4F8EF7"
        intensity={2}
        distance={12}
        decay={2}
      />
    </group>
  )
}

function ContactWorld({ active }: { active: boolean }) {
  const ox = OX(4)
  return (
    <group position={[ox, 0, 0]}>
      <BeaconCore active={active} />
      <BeaconOrbit radius={2.0} count={40} speed={0.55}  color="#4F8EF7" active={active} />
      <BeaconOrbit radius={3.0} count={32} speed={-0.38} color="#8B5CF6" active={active} />
      <BeaconOrbit radius={4.2} count={24} speed={0.22}  color="#4F8EF7" active={active} />
    </group>
  )
}

// ═══════════════════════════════════════════════════════════════
//  ROOT EXPORT
// ═══════════════════════════════════════════════════════════════

export default function Worlds({ sectionIndex, mousePos }: WorldsProps) {
  return (
    <group>
      <ProjectsWorld   active={sectionIndex === 1} />
      <AboutWorld      active={sectionIndex === 2} />
      <TestimonialsWorld active={sectionIndex === 3} />
      <ContactWorld    active={sectionIndex === 4} />
    </group>
  )
}