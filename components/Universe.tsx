// components/Universe.tsx
'use client'

import React, { useRef, useMemo, useEffect, MutableRefObject } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'

// ─── Layout constants (shared with Worlds / HeroWorld) ──────────
export const SECTION_SPACING = 24          // world-units between sections
export const SECTION_COUNT   = 5

// Camera Z depth per section — cinematic depth variety
const CAM_Z: number[] = [8, 6.5, 7.5, 6.5, 7]
// Camera Y offset per section (tilt-down on About per spec)
const CAM_Y: number[] = [0, -0.4, -1.2, -0.4, 0]

// Cinematic easing — cubic-bezier equivalent via lerp factor
const LERP_CAM  = 0.055   // smooth dolly
const LERP_ROT  = 0.045   // mouse parallax rotation

// ─── Star layer config ───────────────────────────────────────────
interface StarLayerCfg {
  count:   number
  spread:  number
  size:    number
  speed:   number
  parallaxFactor: number
  opacity: number
  color:   number
}

const STAR_LAYERS: StarLayerCfg[] = [
  // Far — very slow, faint white
  { count: 2400, spread: 340, size: 0.06, speed: 0.00008, parallaxFactor: 0.04, opacity: 0.75, color: 0xffffff },
  // Mid — interactive, slightly blue-tinted
  { count: 900,  spread: 180, size: 0.13, speed: 0.00022, parallaxFactor: 0.12, opacity: 0.60, color: 0xc8d8ff },
  // Near — soft glow, accent-coloured, most reactive
  { count: 260,  spread: 100, size: 0.22, speed: 0.00048, parallaxFactor: 0.28, opacity: 0.50, color: 0x8baeff },
]

// ─── Helpers ─────────────────────────────────────────────────────
function buildStarField(cfg: StarLayerCfg): THREE.Points {
  const geo  = new THREE.BufferGeometry()
  const pos  = new Float32Array(cfg.count * 3)
  const alph = new Float32Array(cfg.count)

  for (let i = 0; i < cfg.count; i++) {
    pos[i * 3]     = (Math.random() - 0.5) * cfg.spread
    pos[i * 3 + 1] = (Math.random() - 0.5) * cfg.spread * 0.55
    pos[i * 3 + 2] = (Math.random() - 0.5) * cfg.spread * 0.4 - cfg.spread * 0.1
    alph[i]        = 0.3 + Math.random() * 0.7
  }

  geo.setAttribute('position', new THREE.BufferAttribute(pos,  3))
  geo.setAttribute('alpha',    new THREE.BufferAttribute(alph, 1))

  const mat = new THREE.PointsMaterial({
    color:          new THREE.Color(cfg.color),
    size:           cfg.size,
    sizeAttenuation:true,
    transparent:    true,
    opacity:        cfg.opacity,
    depthWrite:     false,
  })

  return new THREE.Points(geo, mat)
}

// ─── Props ────────────────────────────────────────────────────────
interface UniverseProps {
  sectionIndex:    number
  onSectionChange: (i: number) => void
  mousePos:        MutableRefObject<{ x: number; y: number }>
  isTransitioning: boolean
}

// ─── Component ───────────────────────────────────────────────────
export default function Universe({
  sectionIndex,
  onSectionChange,
  mousePos,
  isTransitioning,
}: UniverseProps) {
  const { camera } = useThree()

  // Live refs for smooth animation
  const camPos    = useRef(new THREE.Vector3(0, 0, CAM_Z[0]))
  const camRot    = useRef(new THREE.Euler())
  const targetX   = useRef(0)
  const targetY   = useRef(0)
  const targetZ   = useRef(CAM_Z[0])
  const rollRef   = useRef(0)       // cinematic roll between sections
  const rollTarget= useRef(0)
  const clock     = useRef(0)

  // Stars — built once
  const starLayers = useMemo(() => STAR_LAYERS.map(buildStarField), [])

  // Sync target when section changes
  useEffect(() => {
    targetX.current = sectionIndex * SECTION_SPACING
    targetY.current = CAM_Y[sectionIndex]
    targetZ.current = CAM_Z[sectionIndex]

    // Trigger a momentary roll for cinematic flavour
    const dir = sectionIndex > (sectionIndex - 1) ? 1 : -1
    rollTarget.current = dir * 0.04
    setTimeout(() => { rollTarget.current = 0 }, 700)
  }, [sectionIndex])

  // ── Wheel / touch / keyboard scroll detection ─────────────────
  useEffect(() => {
    let wheelTimer: NodeJS.Timeout
    const onWheel = (e: WheelEvent) => {
      e.preventDefault()
      clearTimeout(wheelTimer)
      wheelTimer = setTimeout(() => {
        onSectionChange(sectionIndex + (e.deltaY > 0 ? 1 : -1))
      }, 60)
    }

    let touchStartX = 0
    let touchStartY = 0
    const onTouchStart = (e: TouchEvent) => {
      touchStartX = e.touches[0].clientX
      touchStartY = e.touches[0].clientY
    }
    const onTouchEnd = (e: TouchEvent) => {
      const dx = touchStartX - e.changedTouches[0].clientX
      const dy = touchStartY - e.changedTouches[0].clientY
      if (Math.abs(dx) > Math.abs(dy) && Math.abs(dx) > 40) {
        onSectionChange(sectionIndex + (dx > 0 ? 1 : -1))
      }
    }

    window.addEventListener('wheel',       onWheel,      { passive: false })
    window.addEventListener('touchstart',  onTouchStart, { passive: true  })
    window.addEventListener('touchend',    onTouchEnd,   { passive: true  })
    return () => {
      window.removeEventListener('wheel',      onWheel)
      window.removeEventListener('touchstart', onTouchStart)
      window.removeEventListener('touchend',   onTouchEnd)
    }
  }, [sectionIndex, onSectionChange])

  // ── Per-frame animation ───────────────────────────────────────
  useFrame((_, delta) => {
    clock.current += delta

    // ── Camera position lerp (cinematic dolly) ──────────────────
    camPos.current.x += (targetX.current - camPos.current.x) * LERP_CAM
    camPos.current.y += (targetY.current - camPos.current.y) * LERP_CAM
    camPos.current.z += (targetZ.current - camPos.current.z) * LERP_CAM

    // Subtle sinusoidal drift (breathing)
    const breathX = Math.sin(clock.current * 0.32) * 0.06
    const breathY = Math.sin(clock.current * 0.21) * 0.04

    camera.position.set(
      camPos.current.x + breathX,
      camPos.current.y + breathY,
      camPos.current.z
    )

    // ── Mouse-driven rotation (parallax) ────────────────────────
    const mx = mousePos.current.x
    const my = mousePos.current.y
    camRot.current.x += (-my * 0.045 - camRot.current.x) * LERP_ROT
    camRot.current.y += (-mx * 0.07  - camRot.current.y) * LERP_ROT

    // ── Cinematic roll ──────────────────────────────────────────
    rollRef.current += (rollTarget.current - rollRef.current) * 0.04
    camRot.current.z += (rollRef.current - camRot.current.z) * 0.06

    camera.rotation.order = 'YXZ'
    camera.rotation.x = camRot.current.x
    camera.rotation.y = camRot.current.y
    camera.rotation.z = camRot.current.z

    // ── Starfield parallax & rotation ───────────────────────────
    starLayers.forEach((layer, i) => {
      const cfg = STAR_LAYERS[i]
      layer.rotation.y += cfg.speed
      layer.rotation.x += cfg.speed * 0.4

      // Parallax: stars shift less than camera → depth illusion
      layer.position.x = camPos.current.x * cfg.parallaxFactor
      layer.position.y = camPos.current.y * cfg.parallaxFactor * 0.5

      // Mid-layer reacts to cursor (interactive per spec)
      if (i === 1) {
        layer.position.x += mx * 0.35
        layer.position.y -= my * 0.20
      }

      // Twinkle: oscillate opacity
      const mat = layer.material as THREE.PointsMaterial
      mat.opacity = cfg.opacity * (0.85 + Math.sin(clock.current * 0.9 + i * 2.1) * 0.15)
    })
  })

  return (
    <group>
      {/* Stars */}
      {starLayers.map((stars, i) => (
        <primitive key={`star-layer-${i}`} object={stars} />
      ))}

      {/* Scene-wide ambient + accent lights */}
      <ambientLight intensity={0.18} />

      {/* Hero light */}
      <pointLight
        position={[0, 4, 6]}
        intensity={2.5}
        color="#4F8EF7"
        distance={40}
        decay={2}
      />

      {/* Projects accent */}
      <pointLight
        position={[SECTION_SPACING, 6, 4]}
        intensity={2}
        color="#8B5CF6"
        distance={35}
        decay={2}
      />

      {/* About accent */}
      <pointLight
        position={[SECTION_SPACING * 2, 2, 5]}
        intensity={1.8}
        color="#4F8EF7"
        distance={35}
        decay={2}
      />

      {/* Testimonials */}
      <pointLight
        position={[SECTION_SPACING * 3, 4, 4]}
        intensity={1.8}
        color="#8B5CF6"
        distance={35}
        decay={2}
      />

      {/* Contact beacon */}
      <pointLight
        position={[SECTION_SPACING * 4, 0, 6]}
        intensity={2.2}
        color="#4F8EF7"
        distance={40}
        decay={2}
      />
    </group>
  )
}