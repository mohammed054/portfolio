'use client'
import { Suspense, useRef, useMemo, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { Float, MeshTransmissionMaterial, Environment } from '@react-three/drei'
import * as THREE from 'three'
import { personal } from '@/lib/data'
import { useMediaQuery, useReducedMotion } from '@/hooks'

/* ── Nebula Shader Background ─────────────────────────── */
const nebulaVert = `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`
const nebulaFrag = `
  uniform float u_time;
  uniform vec2 u_mouse;
  varying vec2 vUv;

  float hash(vec2 p) {
    return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453);
  }

  float noise(vec2 p) {
    vec2 i = floor(p);
    vec2 f = fract(p);
    f = f * f * (3.0 - 2.0 * f);
    return mix(
      mix(hash(i), hash(i + vec2(1,0)), f.x),
      mix(hash(i + vec2(0,1)), hash(i + vec2(1,1)), f.x),
      f.y
    );
  }

  float fbm(vec2 p) {
    float v = 0.0; float a = 0.5;
    for(int i = 0; i < 5; i++) {
      v += a * noise(p);
      p *= 2.2; a *= 0.5;
    }
    return v;
  }

  void main() {
    vec2 uv = vUv;
    vec2 mouse = u_mouse * 0.08;

    float t = u_time * 0.08;
    vec2 p = uv * 2.5 + mouse;

    float f = fbm(p + fbm(p + t));
    float f2 = fbm(p * 1.3 - t * 0.5);

    vec3 col1 = vec3(0.03, 0.05, 0.12); // deep navy
    vec3 col2 = vec3(0.12, 0.22, 0.55); // electric blue
    vec3 col3 = vec3(0.22, 0.10, 0.40); // violet

    vec3 color = mix(col1, col2, f * f);
    color = mix(color, col3, f2 * 0.4);

    // Center glow
    float dist = length(uv - vec2(0.5));
    color += vec3(0.02, 0.05, 0.12) * (1.0 - dist * 2.0);

    gl_FragColor = vec4(color, 1.0);
  }
`

function NebulaBackground() {
  const meshRef = useRef<THREE.Mesh>(null)
  const uniforms = useMemo(() => ({
    u_time: { value: 0 },
    u_mouse: { value: new THREE.Vector2(0, 0) },
  }), [])

  useFrame(({ clock, mouse }) => {
    uniforms.u_time.value = clock.getElapsedTime()
    uniforms.u_mouse.value.lerp(mouse, 0.05)
  })

  return (
    <mesh ref={meshRef} position={[0, 0, -5]}>
      <planeGeometry args={[20, 12]} />
      <shaderMaterial
        vertexShader={nebulaVert}
        fragmentShader={nebulaFrag}
        uniforms={uniforms}
      />
    </mesh>
  )
}

/* ── Particle Constellation ───────────────────────────── */
function Particles({ count = 600 }: { count?: number }) {
  const pointsRef = useRef<THREE.Points>(null)
  const mouse = useRef(new THREE.Vector2())

  const { positions, originalPositions } = useMemo(() => {
    const positions = new Float32Array(count * 3)
    const originalPositions = new Float32Array(count * 3)
    for (let i = 0; i < count; i++) {
      const x = (Math.random() - 0.5) * 14
      const y = (Math.random() - 0.5) * 8
      const z = (Math.random() - 0.5) * 4
      positions[i * 3] = x; positions[i * 3 + 1] = y; positions[i * 3 + 2] = z
      originalPositions[i * 3] = x; originalPositions[i * 3 + 1] = y; originalPositions[i * 3 + 2] = z
    }
    return { positions, originalPositions }
  }, [count])

  useFrame(({ clock, mouse: m }) => {
    if (!pointsRef.current) return
    mouse.current.lerp(m, 0.08)
    const t = clock.getElapsedTime()
    const pos = pointsRef.current.geometry.attributes.position.array as Float32Array

    for (let i = 0; i < count; i++) {
      const ox = originalPositions[i * 3]
      const oy = originalPositions[i * 3 + 1]
      const oz = originalPositions[i * 3 + 2]

      // Drift
      pos[i * 3]     = ox + Math.sin(t * 0.3 + i * 0.7) * 0.08
      pos[i * 3 + 1] = oy + Math.cos(t * 0.2 + i * 0.9) * 0.06
      pos[i * 3 + 2] = oz + Math.sin(t * 0.15 + i) * 0.04

      // Repel from mouse
      const dx = pos[i * 3] - mouse.current.x * 7
      const dy = pos[i * 3 + 1] - mouse.current.y * 4
      const dist = Math.sqrt(dx * dx + dy * dy)
      if (dist < 1.5) {
        const force = (1.5 - dist) / 1.5 * 0.3
        pos[i * 3]     += (dx / dist) * force
        pos[i * 3 + 1] += (dy / dist) * force
      }
    }
    pointsRef.current.geometry.attributes.position.needsUpdate = true
  })

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={count}
          array={positions}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.022}
        color="#4F8EF7"
        transparent
        opacity={0.7}
        sizeAttenuation
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </points>
  )
}

/* ── Floating Icosahedron ─────────────────────────────── */
function FloatingGem() {
  const meshRef = useRef<THREE.Mesh>(null)

  useFrame(({ clock, mouse }) => {
    if (!meshRef.current) return
    const t = clock.getElapsedTime()
    meshRef.current.rotation.y = t * 0.2
    meshRef.current.rotation.x = Math.sin(t * 0.15) * 0.1 + mouse.y * 0.08
    meshRef.current.rotation.z = mouse.x * 0.06
  })

  return (
    <Float speed={1.2} rotationIntensity={0.3} floatIntensity={0.6}>
      <mesh ref={meshRef} position={[3, 0.3, 0]}>
        <icosahedronGeometry args={[1.2, 1]} />
        <meshStandardMaterial
          color="#4F8EF7"
          metalness={0.9}
          roughness={0.05}
          envMapIntensity={2}
          wireframe={false}
        />
      </mesh>
      {/* Wireframe overlay */}
      <mesh position={[3, 0.3, 0]}>
        <icosahedronGeometry args={[1.21, 1]} />
        <meshBasicMaterial
          color="#4F8EF7"
          wireframe
          transparent
          opacity={0.15}
        />
      </mesh>
    </Float>
  )
}

/* ── Camera Rig ───────────────────────────────────────── */
function CameraRig() {
  const { camera } = useThree()
  useFrame(({ mouse, clock }) => {
    camera.position.x += (mouse.x * 0.5 - camera.position.x) * 0.04
    camera.position.y += (mouse.y * 0.3 - camera.position.y) * 0.04
    camera.lookAt(0, 0, 0)
  })
  return null
}

/* ── Static Hero Fallback ─────────────────────────────── */
function StaticHero() {
  return (
    <div className="absolute inset-0 overflow-hidden">
      {/* Gradient orbs */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full blur-3xl opacity-20"
        style={{ background: 'radial-gradient(circle, #4F8EF7, transparent)' }} />
      <div className="absolute bottom-1/3 right-1/4 w-72 h-72 rounded-full blur-3xl opacity-15"
        style={{ background: 'radial-gradient(circle, #8B5CF6, transparent)' }} />
      {/* Grid lines */}
      <div className="absolute inset-0 opacity-5"
        style={{
          backgroundImage: `linear-gradient(#4F8EF7 1px, transparent 1px), linear-gradient(90deg, #4F8EF7 1px, transparent 1px)`,
          backgroundSize: '60px 60px',
        }}
      />
    </div>
  )
}

/* ── Hero Component ───────────────────────────────────── */
export default function Hero() {
  const isMobile = useMediaQuery('(max-width: 768px)')
  const reducedMotion = useReducedMotion()

  const containerVariants = {
    hidden: {},
    show: { transition: { staggerChildren: 0.12, delayChildren: 0.3 } },
  }
  const itemVariants = {
    hidden: { opacity: 0, y: 28 },
    show: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] } },
  }

  const handleExplore = () => {
    const next = document.getElementById('about')
    if (next) next.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <section
      id="hero"
      className="relative w-full h-screen flex items-center justify-center overflow-hidden"
      aria-label="Hero section"
    >
      {/* 3D Canvas */}
      {!isMobile && !reducedMotion ? (
        <div className="absolute inset-0">
          <Canvas
            camera={{ position: [0, 0, 6], fov: 70 }}
            gl={{
              antialias: true,
              alpha: false,
              powerPreference: 'high-performance',
            }}
            dpr={[1, 2]}
          >
            <Suspense fallback={null}>
              <NebulaBackground />
              <Particles count={500} />
              <FloatingGem />
              <Environment preset="city" />
              <CameraRig />
            </Suspense>
          </Canvas>
        </div>
      ) : (
        <StaticHero />
      )}

      {/* Text Overlay */}
      <div className="relative z-10 text-center px-6 max-w-5xl mx-auto pointer-events-none">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="show"
          className="flex flex-col items-center gap-6"
        >
          {/* Eyebrow */}
          <motion.p
            variants={itemVariants}
            className="section-eyebrow text-xs md:text-sm pointer-events-auto"
          >
            {personal.tagline}
          </motion.p>

          {/* Headline */}
          <motion.h1
            variants={itemVariants}
            className="font-syne font-extrabold leading-none tracking-tight text-text-primary"
            style={{ fontSize: 'clamp(3rem, 9vw, 7rem)' }}
          >
            {personal.headline.split('\n').map((line, i) => (
              <span key={i} className="block">
                {i === 1 ? <span className="text-gradient">{line}</span> : line}
              </span>
            ))}
          </motion.h1>

          {/* Subline */}
          <motion.p
            variants={itemVariants}
            className="font-dm text-text-secondary max-w-xl leading-relaxed"
            style={{ fontSize: 'clamp(1rem, 2vw, 1.25rem)' }}
          >
            {personal.subline}
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            variants={itemVariants}
            className="flex flex-col sm:flex-row gap-4 mt-2 pointer-events-auto"
          >
            <motion.button
              onClick={handleExplore}
              className="group relative px-8 py-3.5 font-dm font-medium text-sm rounded-xl border border-accent text-accent overflow-hidden transition-all duration-300 hover:text-bg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.98 }}
            >
              <span className="absolute inset-0 bg-accent origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-300" />
              <span className="relative z-10">Explore My Work →</span>
            </motion.button>

            <motion.a
              href={personal.social.github}
              target="_blank"
              rel="noopener noreferrer"
              className="px-8 py-3.5 font-dm font-medium text-sm rounded-xl border border-border text-text-secondary hover:border-accent hover:text-accent transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.98 }}
            >
              View GitHub
            </motion.a>
          </motion.div>
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.2, duration: 0.6 }}
      >
        <span className="font-mono text-xs text-text-muted tracking-widest uppercase">Scroll</span>
        <motion.div
          className="w-px h-10 bg-gradient-to-b from-text-muted to-transparent"
          animate={{ scaleY: [0, 1, 0] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
          style={{ originY: 0 }}
        />
      </motion.div>
    </section>
  )
}
