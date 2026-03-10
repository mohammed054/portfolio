'use client'

import { Canvas, useFrame } from '@react-three/fiber'
import { useMemo, useRef, useState } from 'react'
import * as THREE from 'three'
import { motion, useReducedMotion } from 'framer-motion'
import { skillDomains, theme } from '@/lib/data'

function Constellation({ onPick }: { onPick: (name: string) => void }) {
  const group = useRef<THREE.Group>(null)
  const nodes = useMemo(() => skillDomains.flatMap((d) => d.nodes), [])
  useFrame(({ clock, invalidate }) => {
    if (!group.current) return
    group.current.rotation.y = clock.getElapsedTime() * 0.1
    invalidate()
  })

  return (
    <group ref={group}>
      {nodes.map((node, i) => {
        const t = (i / nodes.length) * Math.PI * 2
        const p: [number, number, number] = [Math.cos(t) * 2, Math.sin(t * 1.5) * 0.6, Math.sin(t) * 2]
        return (
          <mesh key={node.name} position={p} onClick={() => onPick(node.name)}>
            <sphereGeometry args={[0.1, 12, 12]} />
            <meshStandardMaterial color={i % 2 ? theme.accent1 : theme.accent2} />
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
          <div className="glass hidden min-h-[460px] rounded-2xl md:block">
            {!reduced && (
              <Canvas frameloop="demand" camera={{ position: [0, 0, 5] }}>
                <ambientLight intensity={0.45} />
                <pointLight position={[2, 2, 3]} intensity={0.9} color={theme.accent1} />
                <Constellation onPick={(name) => setActive(skillDomains.flatMap((d) => d.nodes).find((n) => n.name === name) ?? active)} />
              </Canvas>
            )}
          </div>

          <div className="grid gap-4">
            {skillDomains.map((domain) => (
              <button key={domain.id} className="glass rounded-xl p-4 text-left" onClick={() => setActive(domain.nodes[0])}>
                <p className="t-h4">{domain.label}</p>
                <p className="t-body-sm mt-2">{domain.nodes.map((n) => n.name).join(' · ')}</p>
              </button>
            ))}
            {active && (
              <motion.div className="glass rounded-xl p-5" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
                <p className="t-h4">{active.name}</p>
                <p className="t-mono mt-2 text-[var(--text-secondary)]">{active.years} years · {active.proficiency}%</p>
                <p className="t-body mt-2">{active.description}</p>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
