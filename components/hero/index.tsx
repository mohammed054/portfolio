'use client'

import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { useState, useRef, useEffect, useCallback, useMemo } from 'react'
import * as THREE from 'three'
import { motion, AnimatePresence } from 'framer-motion'

type Props = { onComplete?: () => void }

/* ─────────────────────────────────────────────────────────────────────────────
   STAR FIELD
───────────────────────────────────────────────────────────────────────────── */
function StarField({ active, dying }: { active: boolean; dying: boolean }) {
  const FAR  = 2400
  const MID  = 700
  const NEAR = 250

  const farRef  = useRef<THREE.Points>(null)
  const midRef  = useRef<THREE.Points>(null)
  const nearRef = useRef<THREE.Points>(null)

  const farOp  = useRef(0)
  const midOp  = useRef(0)
  const nearOp = useRef(0)
  const bhProg = useRef(0)

  const farOrig  = useRef<Float32Array | null>(null)
  const midOrig  = useRef<Float32Array | null>(null)
  const nearOrig = useRef<Float32Array | null>(null)

  // ── useMemo fixes the "useRef with factory" TS error ──
  const { farPos, midPos, nearPos } = useMemo(() => {
    const shell = (n: number, r: number, s: number) => {
      const p = new Float32Array(n * 3)
      for (let i = 0; i < n; i++) {
        const th = Math.random() * Math.PI * 2
        const ph = Math.acos(2 * Math.random() - 1)
        const ri = r + (Math.random() - 0.5) * s
        p[i * 3]     = ri * Math.sin(ph) * Math.cos(th)
        p[i * 3 + 1] = ri * Math.sin(ph) * Math.sin(th)
        p[i * 3 + 2] = ri * Math.cos(ph)
      }
      return p
    }
    return {
      farPos:  shell(FAR,  60, 28),
      midPos:  shell(MID,  26, 10),
      nearPos: shell(NEAR, 12,  4),
    }
  }, [])   // empty deps = generated once, stable across renders

  useEffect(() => {
    farOrig.current  = new Float32Array(farPos)
    midOrig.current  = new Float32Array(midPos)
    nearOrig.current = new Float32Array(nearPos)
  }, [farPos, midPos, nearPos])

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime()

    const tFar  = dying ? 0 : active ? 0.72 : 0
    const tMid  = dying ? 0 : active ? 0.88 : 0
    const tNear = dying ? 0 : active ? 1.00 : 0
    const spd   = active && !dying ? 0.032 : 0.01

    farOp.current  += (tFar  - farOp.current)  * spd
    midOp.current  += (tMid  - midOp.current)  * spd
    nearOp.current += (tNear - nearOp.current) * spd

    if (farRef.current)  (farRef.current.material  as THREE.PointsMaterial).opacity = Math.max(0, farOp.current)
    if (midRef.current)  (midRef.current.material  as THREE.PointsMaterial).opacity = Math.max(0, midOp.current)
    if (nearRef.current) (nearRef.current.material as THREE.PointsMaterial).opacity = Math.max(0, nearOp.current)

    if (farRef.current)  farRef.current.rotation.y  = t * 0.009
    if (midRef.current)  midRef.current.rotation.y  = t * 0.014
    if (nearRef.current) nearRef.current.rotation.y = t * 0.021

    if (dying) {
      bhProg.current = Math.min(1, bhProg.current + 0.022)
      const e = bhProg.current ** 3

      const collapse = (
        ref: React.RefObject<THREE.Points | null>,
        orig: Float32Array | null,
        count: number
      ) => {
        if (!ref.current || !orig) return
        const arr = ref.current.geometry.attributes.position.array as Float32Array
        for (let i = 0; i < count; i++) {
          const ang = e * Math.PI * 7 + i * 0.007
          const r   = 1 - e
          arr[i * 3]     = orig[i * 3]     * r + Math.cos(ang) * e * 0.25
          arr[i * 3 + 1] = orig[i * 3 + 1] * r + Math.sin(ang) * e * 0.25
          arr[i * 3 + 2] = orig[i * 3 + 2] * r
        }
        ref.current.geometry.attributes.position.needsUpdate = true
      }

      collapse(farRef,  farOrig.current,  FAR)
      collapse(midRef,  midOrig.current,  MID)
      collapse(nearRef, nearOrig.current, NEAR)
    }
  })

  return (
    <>
      {/* Far — tiny crisp white */}
      <points ref={farRef}>
        <bufferGeometry>
          {/* ✅ R3F v8: use args={[array, itemSize]} */}
          <bufferAttribute attach="attributes-position" args={[farPos, 3]} />
        </bufferGeometry>
        <pointsMaterial size={0.055} color="#d0e4ff" transparent opacity={0} sizeAttenuation depthWrite={false} />
      </points>

      {/* Mid — blue */}
      <points ref={midRef}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[midPos, 3]} />
        </bufferGeometry>
        <pointsMaterial size={0.13} color="#6aaeff" transparent opacity={0} sizeAttenuation depthWrite={false} />
      </points>

      {/* Near — large violet */}
      <points ref={nearRef}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[nearPos, 3]} />
        </bufferGeometry>
        <pointsMaterial size={0.28} color="#b39dff" transparent opacity={0} sizeAttenuation depthWrite={false} />
      </points>
    </>
  )
}

/* ─────────────────────────────────────────────────────────────────────────────
   NEBULA DUST
───────────────────────────────────────────────────────────────────────────── */
function Nebula({ active }: { active: boolean }) {
  const ref   = useRef<THREE.Points>(null)
  const op    = useRef(0)
  const COUNT = 450

  const pos = useMemo(() => {
    const p = new Float32Array(COUNT * 3)
    for (let i = 0; i < COUNT; i++) {
      p[i * 3]     = (Math.random() - 0.5) * 36
      p[i * 3 + 1] = (Math.random() - 0.5) * 18
      p[i * 3 + 2] = (Math.random() - 0.5) * 36 - 8
    }
    return p
  }, [])

  useFrame(({ clock }) => {
    if (!ref.current) return
    const t = clock.getElapsedTime()
    op.current += ((active ? 0.14 : 0) - op.current) * 0.01
    ;(ref.current.material as THREE.PointsMaterial).opacity = op.current
    ref.current.rotation.y = t * 0.003
  })

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[pos, 3]} />
      </bufferGeometry>
      <pointsMaterial
        size={2.4} color="#1a3aaa"
        transparent opacity={0}
        sizeAttenuation depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  )
}

/* ─────────────────────────────────────────────────────────────────────────────
   MH INITIALS MESH
───────────────────────────────────────────────────────────────────────────── */
function Initials({ active, dying }: { active: boolean; dying: boolean }) {
  const group = useRef<THREE.Group>(null)
  const mouse = useRef({ x: 0, y: 0 })
  const sc    = useRef(0)
  const depth = useRef(0)

  useEffect(() => {
    const fn = (e: MouseEvent) => {
      mouse.current.x =  (e.clientX / window.innerWidth  - 0.5) * 0.65
      mouse.current.y = -(e.clientY / window.innerHeight - 0.5) * 0.32
    }
    window.addEventListener('mousemove', fn)
    return () => window.removeEventListener('mousemove', fn)
  }, [])

  // Memoised so materials/geometries aren't re-created every render
  const { mat, bar, diag, mid } = useMemo(() => ({
    mat: new THREE.MeshStandardMaterial({
      color: '#ddeeff', metalness: 0.96, roughness: 0.04,
      emissive: new THREE.Color('#0e2a70'), emissiveIntensity: 0.55,
    }),
    bar:  new THREE.BoxGeometry(0.22, 1.8, 0.32),
    diag: new THREE.BoxGeometry(0.84, 0.2,  0.32),
    mid:  new THREE.BoxGeometry(0.78, 0.2,  0.32),
  }), [])

  useFrame(({ clock }) => {
    if (!group.current) return
    const t = clock.getElapsedTime()

    if (active && !dying) sc.current += (2.4 - sc.current) * 0.05
    if (dying)            sc.current += (0   - sc.current) * 0.065
    if (dying)            depth.current = Math.min(1, depth.current + 0.022)

    group.current.scale.setScalar(Math.max(0, sc.current))
    group.current.rotation.y = Math.sin(t * 0.28) * 0.22 + mouse.current.x * 0.75
    group.current.rotation.x = Math.cos(t * 0.18) * 0.09 + mouse.current.y * 0.45
    group.current.position.z = -1 - depth.current * 35
  })

  return (
    <group ref={group} position={[0, 0.05, -1]} scale={0}>
      {/* M */}
      <mesh geometry={bar}  material={mat} position={[-1.55,  0,     0]} />
      <mesh geometry={bar}  material={mat} position={[-0.88,  0,     0]} />
      <mesh geometry={diag} material={mat} position={[-1.215,  0.46, 0]} rotation={[0, 0,  0.82]} />
      <mesh geometry={diag} material={mat} position={[-1.215, -0.1,  0]} rotation={[0, 0, -0.82]} />
      {/* H */}
      <mesh geometry={bar} material={mat} position={[0.88, 0, 0]} />
      <mesh geometry={bar} material={mat} position={[1.55, 0, 0]} />
      <mesh geometry={mid} material={mat} position={[1.22, 0, 0]} />
    </group>
  )
}

/* ─────────────────────────────────────────────────────────────────────────────
   BLACK HOLE DISC
───────────────────────────────────────────────────────────────────────────── */
function BlackHole({ active }: { active: boolean }) {
  const ref = useRef<THREE.Mesh>(null)
  const sc  = useRef(0)

  useFrame(({ clock }) => {
    if (!ref.current) return
    sc.current += ((active ? 20 : 0) - sc.current) * 0.045
    ref.current.scale.setScalar(sc.current)
    ref.current.rotation.z = clock.getElapsedTime() * 0.55
  })

  return (
    <mesh ref={ref} position={[0, 0, 2.5]} scale={0}>
      <circleGeometry args={[1, 80]} />
      <meshBasicMaterial color="#000000" depthWrite={false} />
    </mesh>
  )
}

/* ─────────────────────────────────────────────────────────────────────────────
   CAMERA RIG
───────────────────────────────────────────────────────────────────────────── */
function Camera({ dying }: { dying: boolean }) {
  const { camera } = useThree()
  const prog = useRef(0)

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime()
    camera.position.x += (Math.sin(t * 0.13) * 0.14 - camera.position.x) * 0.022
    camera.position.y += (Math.cos(t * 0.09) * 0.07 - camera.position.y) * 0.022

    if (dying) {
      prog.current = Math.min(1, prog.current + 0.017)
      const rush = prog.current ** 4
      camera.position.z = 6 - rush * 95
      ;(camera as THREE.PerspectiveCamera).fov = 52 + rush * 75
      camera.updateProjectionMatrix()
    }
  })
  return null
}

/* ─────────────────────────────────────────────────────────────────────────────
   HERO ORCHESTRATOR
───────────────────────────────────────────────────────────────────────────── */
export default function Hero({ onComplete }: Props) {
  const [active, setActive] = useState(false)
  const [dying,  setDying]  = useState(false)
  const [text,   setText]   = useState(false)

  useEffect(() => {
    document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = '' }
  }, [])

  const bang = useCallback(() => {
    if (active) return
    setActive(true)
    setTimeout(() => setText(true), 520)
  }, [active])

  useEffect(() => {
    const onClick = () => bang()
    const onKey   = () => bang()
    const onWheel = (e: WheelEvent) => { e.preventDefault(); bang() }

    window.addEventListener('click',   onClick, { once: true })
    window.addEventListener('keydown', onKey,   { once: true })
    window.addEventListener('wheel',   onWheel, { passive: false, once: true } as EventListenerOptions)
    return () => {
      window.removeEventListener('click',   onClick)
      window.removeEventListener('keydown', onKey)
      window.removeEventListener('wheel',   onWheel as EventListener)
    }
  }, [bang])

  const enter = () => {
    setDying(true)
    setText(false)
    setTimeout(() => {
      document.body.style.overflow = ''
      onComplete?.()
    }, 1800)
  }

  return (
    <section style={{
      position: 'fixed', inset: 0,
      width: '100vw', height: '100vh',
      overflow: 'hidden', zIndex: 10,
      background: '#080B14',
    }}>
      <Canvas
        style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }}
        camera={{ position: [0, 0, 6], fov: 52 }}
        gl={{ antialias: true, alpha: false }}
        dpr={[1, 2]}
      >
        <color attach="background" args={['#080B14']} />
        <ambientLight intensity={0.18} />
        <pointLight position={[0,   0,  4.5]} intensity={2.8} color="#4F8EF7" />
        <pointLight position={[4,   3,  0  ]} intensity={1.5} color="#8B5CF6" />
        <pointLight position={[-3, -2,  0  ]} intensity={1.0} color="#2255ff" />

        <Camera    dying={dying} />
        <StarField active={active} dying={dying} />
        <Nebula    active={active} />
        <Initials  active={active} dying={dying} />
        <BlackHole active={dying} />
      </Canvas>

      {/* ── Pre-bang hint ── */}
      <AnimatePresence>
        {!active && (
          <motion.div
            key="hint"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, transition: { duration: 0.25 } }}
            transition={{ delay: 0.9, duration: 1.2 }}
            style={{
              position: 'absolute', inset: 0, zIndex: 10,
              display: 'flex', flexDirection: 'column',
              alignItems: 'center', justifyContent: 'center',
              pointerEvents: 'none',
            }}
          >
            <motion.div
              animate={{ scale: [1, 1.22, 1], opacity: [0.28, 0.65, 0.28] }}
              transition={{ duration: 2.6, repeat: Infinity, ease: 'easeInOut' }}
              style={{
                width: 80, height: 80, borderRadius: '50%',
                border: '1px solid rgba(79,142,247,0.4)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                marginBottom: '1.4rem',
              }}
            >
              <motion.div
                animate={{ scale: [1, 1.6, 1], opacity: [0.45, 1, 0.45] }}
                transition={{ duration: 2.6, repeat: Infinity, ease: 'easeInOut', delay: 0.45 }}
                style={{
                  width: 10, height: 10, borderRadius: '50%',
                  background: '#4F8EF7',
                  boxShadow: '0 0 18px #4F8EF7, 0 0 36px rgba(79,142,247,0.55)',
                }}
              />
            </motion.div>
            <motion.span
              animate={{ opacity: [0.2, 0.55, 0.2] }}
              transition={{ duration: 3.2, repeat: Infinity, ease: 'easeInOut' }}
              style={{
                fontFamily: 'var(--font-mono, "JetBrains Mono", monospace)',
                fontSize: '0.58rem', letterSpacing: '0.3em',
                textTransform: 'uppercase', color: '#3D4A66',
              }}
            >
              touch anything
            </motion.span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Post-bang text ── */}
      <AnimatePresence>
        {text && !dying && (
          <motion.div
            key="content"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, transition: { duration: 0.9 } }}
            style={{
              position: 'absolute', inset: 0, zIndex: 10,
              display: 'flex', flexDirection: 'column',
              alignItems: 'center', justifyContent: 'center',
              textAlign: 'center', padding: '0 1.5rem',
              pointerEvents: 'none',
            }}
          >
            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0, duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
              style={{
                fontFamily: 'var(--font-mono, "JetBrains Mono", monospace)',
                fontSize: '0.65rem', letterSpacing: '0.25em',
                textTransform: 'uppercase', color: '#4F8EF7',
                display: 'flex', alignItems: 'center', gap: '12px',
              }}
            >
              <span style={{ display: 'block', width: 28, height: 1, background: '#4F8EF7', flexShrink: 0 }} />
              Full-Stack  ·  3D  ·  AI
            </motion.p>

            <motion.h1
              initial={{ opacity: 0, scale: 0.75, y: 32 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ delay: 0.12, duration: 1.0, ease: [0.22, 1, 0.36, 1] }}
              style={{
                fontFamily: 'var(--font-display, "Syne", sans-serif)',
                fontWeight: 800,
                fontSize: 'clamp(6rem, 20vw, 15rem)',
                lineHeight: 0.9, letterSpacing: '-0.04em',
                marginTop: '0.6rem',
                background: 'linear-gradient(135deg, #b8d4ff 0%, #4F8EF7 35%, #8B5CF6 68%, #c084fc 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
                filter: 'drop-shadow(0 0 60px rgba(79,142,247,0.6))',
              }}
            >
              MH
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.75, ease: [0.22, 1, 0.36, 1] }}
              style={{
                fontFamily: 'var(--font-body, "DM Sans", sans-serif)',
                fontWeight: 300,
                fontSize: 'clamp(0.95rem, 2.4vw, 1.3rem)',
                color: '#7A89A8', letterSpacing: '0.04em',
                marginTop: '1.6rem', maxWidth: 500,
              }}
            >
              I make things that{' '}
              <span style={{ color: '#4F8EF7', fontWeight: 400 }}>move,</span>{' '}
              <span style={{ color: '#8B5CF6', fontWeight: 400 }}>think,</span>{' '}
              and <span style={{ color: '#b8d4ff', fontWeight: 400 }}>matter.</span>
            </motion.p>

            <motion.button
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.48, duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
              onClick={enter}
              onMouseEnter={e => {
                const el = e.currentTarget
                el.style.background = '#4F8EF7'
                el.style.color      = '#080B14'
                el.style.transform  = 'scale(1.04)'
                el.style.boxShadow  = '0 0 36px rgba(79,142,247,0.45)'
              }}
              onMouseLeave={e => {
                const el = e.currentTarget
                el.style.background = 'transparent'
                el.style.color      = '#4F8EF7'
                el.style.transform  = 'scale(1)'
                el.style.boxShadow  = 'none'
              }}
              style={{
                marginTop: '2.8rem', padding: '14px 36px',
                border: '1px solid #4F8EF7', borderRadius: '10px',
                background: 'transparent', color: '#4F8EF7',
                fontFamily: 'var(--font-body, "DM Sans", sans-serif)',
                fontWeight: 500, fontSize: '0.875rem',
                letterSpacing: '0.06em', cursor: 'pointer',
                pointerEvents: 'all',
                display: 'flex', alignItems: 'center', gap: '10px',
                transition: 'all 0.28s cubic-bezier(0.4, 0, 0.2, 1)',
              }}
            >
              Enter the universe
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <path d="M1 7h12M8 2l5 5-5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </motion.button>

            {/* Scroll nudge */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.8 }}
              style={{
                position: 'absolute', bottom: 32,
                left: '50%', transform: 'translateX(-50%)',
                pointerEvents: 'none',
              }}
            >
              <motion.div
                animate={{ scaleY: [0, 1, 0], opacity: [0, 0.5, 0] }}
                transition={{ duration: 2.2, repeat: Infinity, ease: 'easeInOut', delay: 0.5 }}
                style={{
                  width: 1, height: 56,
                  background: 'linear-gradient(to bottom, #4F8EF7, transparent)',
                  transformOrigin: 'top',
                }}
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Black hole vignette ── */}
      <AnimatePresence>
        {dying && (
          <motion.div
            key="vignette"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.65, duration: 1.1 }}
            style={{
              position: 'absolute', inset: 0, zIndex: 20,
              background: 'radial-gradient(circle at center, #000 0%, transparent 60%)',
              pointerEvents: 'none',
            }}
          />
        )}
      </AnimatePresence>
    </section>
  )
}