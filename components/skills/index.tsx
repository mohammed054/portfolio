'use client'

import { Canvas, useFrame } from '@react-three/fiber'
import { useEffect, useMemo, useRef, useState } from 'react'
import * as THREE from 'three'
import { skillDomains } from '@/lib/data'
import { useReducedMotion } from 'framer-motion'

function OrbitingNodes() {
  const group = useRef<THREE.Group>(null)
  const meshes = useRef<THREE.Mesh[]>([])
  const items = useMemo(() => skillDomains.flatMap((d) => d.nodes), [])

  useFrame(({ clock, invalidate }) => {
    const g = group.current
    if (!g) return
    g.rotation.y = clock.getElapsedTime() * 0.12
    invalidate()
  })

  useEffect(() => {
    return () => {
      meshes.current.forEach((m) => {
        m.geometry.dispose()
        ;(m.material as THREE.Material).dispose()
      })
    }
  }, [])

  return (
    <group ref={group}>
      {items.map((item, i) => {
        const angle = (i / items.length) * Math.PI * 2
        const x = Math.cos(angle) * 2
        const z = Math.sin(angle) * 2
        return (
          <mesh
            key={item.name}
            ref={(m) => {
              if (m) meshes.current[i] = m
            }}
            position={[x, 0.3 * Math.sin(i), z]}
          >
            <sphereGeometry args={[0.13, 16, 16]} />
            <meshStandardMaterial color={i % 2 ? 'rgb(79, 142, 247)' : 'rgb(139, 92, 246)'} />
          </mesh>
        )
      })}
    </group>
  )
}

export default function Skills() {
  const reduced = useReducedMotion()
  const [active, setActive] = useState(skillDomains[0]?.nodes[0])

  return (
    <section id="skills" className="section">
      <div className="section-inner">
        <p className="eyebrow">Skills Constellation</p>
        <div className="mt-8 grid gap-6 lg:grid-cols-[1.2fr_1fr]">
          <div className="glass relative hidden min-h-[420px] rounded-2xl md:block">
            {reduced ? null : (
              <Canvas frameloop="demand" camera={{ position: [0, 0, 5] }}>
                <ambientLight intensity={0.5} />
                <directionalLight intensity={0.9} position={[2, 2, 3]} />
                <OrbitingNodes />
              </Canvas>
            )}
          </div>

          <div className="grid gap-3">
            {skillDomains.map((domain) => (
              <button
                key={domain.id}
                className="glass rounded-xl p-4 text-left"
                onClick={() => setActive(domain.nodes[0])}
              >
                <p className="t-h4">{domain.label}</p>
                <p className="t-body-sm">{domain.nodes.map((n) => n.name).join(' · ')}</p>
              </button>
            ))}
            {active && (
              <div className="glass rounded-xl p-4">
                <p className="t-h4">{active.name}</p>
                <p className="t-body-sm">{active.years} years · {active.proficiency}%</p>
                <p className="t-body mt-2">{active.description}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
