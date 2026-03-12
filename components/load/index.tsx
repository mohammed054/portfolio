'use client'

/**
 * components/Loader/index.tsx — v3
 * ─────────────────────────────────────────────────────────────────────────────
 * FIXES in this version:
 *  • Scroll is FULLY LOCKED via wheel interception (preventDefault). No page
 *    scroll leaks out. No 500vh hack — internal progress is accumulated from
 *    wheel delta.
 *  • Stars appear IMMEDIATELY on mount (time-based, no scroll needed).
 *  • Scrolling = flying FORWARD through stars toward MH. Camera Z goes
 *    from 80 → 4 as progress 0 → 0.55.
 *  • Stars are perfectly ROUND — circular canvas texture on PointsMaterial.
 *    No more square pixels.
 *
 * Journey:
 *  AUTO  0 → 2s      Stars materialise from void (time, no scroll)
 *  WHEEL 0% → 50%    Camera flies forward through star field → MH appears
 *  WHEEL 50% → 68%   MH fully revealed · torus rings · orbit particles · hover
 *  WHEEL 68% → 95%   Black hole · hyperstream · chromatic aberration vortex
 *  WHEEL 95% → 100%  White flash → onComplete()
 * ─────────────────────────────────────────────────────────────────────────────
 */

import { useEffect, useRef, useState } from 'react'
import * as THREE from 'three'
import gsap from 'gsap'
import { motion, AnimatePresence } from 'framer-motion'

// ─── GLSL post-process: gravitational vortex + chromatic aberration ───────────

const PP_VERT = /* glsl */ `
  varying vec2 vUv;
  void main() { vUv = uv; gl_Position = vec4(position, 1.0); }
`

const PP_FRAG = /* glsl */ `
  uniform float uProgress;
  uniform float uTime;
  uniform sampler2D uScene;
  varying vec2 vUv;

  void main() {
    vec2  center = vec2(0.5);
    vec2  delta  = vUv - center;
    float dist   = length(delta);
    float angle  = atan(delta.y, delta.x);

    /* gravitational spiral */
    float spin   = uProgress * 12.0 * (1.0 - smoothstep(0.0, 0.75, dist));
    float wa     = angle + spin;
    float col0   = dist * (1.0 - uProgress * 0.72 * max(0.0, 1.0 - dist * 1.4));
    vec2  wUv    = center + vec2(cos(wa), sin(wa)) * col0;

    /* chromatic aberration */
    float ab = uProgress * 0.035;
    float r  = texture2D(uScene, wUv + vec2( ab, 0.0)).r;
    float g  = texture2D(uScene, wUv               ).g;
    float b  = texture2D(uScene, wUv - vec2( ab, 0.0)).b;

    /* singularity darkness */
    float hole = smoothstep(0.0, 0.06 + uProgress * 0.13, dist);
    float dark = 1.0 - uProgress * (1.0 - smoothstep(0.0, 0.65, dist));
    vec3  c    = vec3(r, g, b) * hole * dark;

    /* accretion ring glow */
    float ring = smoothstep(0.035, 0.09, dist) - smoothstep(0.09, 0.17, dist);
    c += vec3(0.28, 0.55, 1.0) * ring * uProgress * 3.5;

    /* terminal white flash */
    c = mix(c, vec3(1.0), smoothstep(0.84, 1.0, uProgress));

    gl_FragColor = vec4(c, 1.0);
  }
`

// ─── Circular star texture (solves the square-pixel problem) ─────────────────

function makeStarTexture(): THREE.Texture {
  const size   = 64
  const canvas = document.createElement('canvas')
  canvas.width = canvas.height = size
  const ctx    = canvas.getContext('2d')!
  const r      = size / 2

  // Radial gradient: bright centre → transparent edge
  const grad = ctx.createRadialGradient(r, r, 0, r, r, r)
  grad.addColorStop(0.0, 'rgba(255,255,255,1)')
  grad.addColorStop(0.25, 'rgba(255,255,255,0.9)')
  grad.addColorStop(0.55, 'rgba(255,255,255,0.3)')
  grad.addColorStop(1.0,  'rgba(255,255,255,0)')
  ctx.fillStyle = grad
  ctx.fillRect(0, 0, size, size)

  const tex       = new THREE.CanvasTexture(canvas)
  tex.needsUpdate = true
  return tex
}

// ─── Letter shape builders (ExtrudeGeometry — no font file needed) ────────────

function shapeM(): THREE.Shape {
  const s = new THREE.Shape()
  s.moveTo(0.00, 0.00); s.lineTo(0.00, 3.00)
  s.lineTo(0.75, 1.55); s.lineTo(1.50, 3.00)
  s.lineTo(1.50, 0.00); s.lineTo(1.20, 0.00)
  s.lineTo(1.20, 2.40); s.lineTo(0.75, 1.05)
  s.lineTo(0.30, 2.40); s.lineTo(0.30, 0.00)
  s.closePath(); return s
}

function shapeH(): THREE.Shape {
  const s = new THREE.Shape()
  s.moveTo(0.00, 0.00); s.lineTo(0.00, 3.00)
  s.lineTo(0.30, 3.00); s.lineTo(0.30, 1.75)
  s.lineTo(1.20, 1.75); s.lineTo(1.20, 3.00)
  s.lineTo(1.50, 3.00); s.lineTo(1.50, 0.00)
  s.lineTo(1.20, 0.00); s.lineTo(1.20, 1.45)
  s.lineTo(0.30, 1.45); s.lineTo(0.30, 0.00)
  s.closePath(); return s
}

// ─── Component ────────────────────────────────────────────────────────────────

interface LoaderProps {
  onComplete?: () => void
}

export default function Loader({ onComplete }: LoaderProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [hint,    setHint]    = useState(false)
  const [visible, setVisible] = useState(true)

  useEffect(() => {
    // Show "scroll to fly" hint after stars have appeared (~2.5s)
    const t = setTimeout(() => setHint(true), 2500)
    return () => clearTimeout(t)
  }, [])

  useEffect(() => {
    if (!canvasRef.current) return

    /* ── Lock body scroll ─────────────────────────────────────────────── */
    const prevOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    const canvas = canvasRef.current
    const W = window.innerWidth
    const H = window.innerHeight

    /* ── Renderer ─────────────────────────────────────────────────────── */
    const renderer = new THREE.WebGLRenderer({ canvas, antialias: true })
    renderer.setSize(W, H)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    renderer.setClearColor(0x000000, 1)

    /* ── Main scene / camera ──────────────────────────────────────────── */
    const scene  = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(75, W / H, 0.01, 3000)
    camera.position.set(0, 0, 80)   // start far back — will fly to z≈4

    /* ── Post-process: render → RT → vortex quad ──────────────────────── */
    const rt = new THREE.WebGLRenderTarget(W, H)
    const ppUniforms = {
      uProgress: { value: 0 },
      uTime:     { value: 0 },
      uScene:    { value: rt.texture },
    }
    const ppScene = new THREE.Scene()
    const ppCam   = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1)
    ppScene.add(new THREE.Mesh(
      new THREE.PlaneGeometry(2, 2),
      new THREE.ShaderMaterial({
        uniforms:       ppUniforms,
        vertexShader:   PP_VERT,
        fragmentShader: PP_FRAG,
        depthTest:      false,
      })
    ))

    /* ── Star texture (round, not square) ─────────────────────────────── */
    const starTex = makeStarTexture()

    /* ── Star field: two layers for depth ────────────────────────────── */
    //  Layer A — distant stars (tiny, more spread out)
    const A_N  = 4000
    const aPos = new Float32Array(A_N * 3)
    for (let i = 0; i < A_N; i++) {
      // Tunnel: stars spread in a cylinder around the Z axis
      const theta = Math.random() * Math.PI * 2
      const rad   = 15 + Math.random() * 120       // ring radius
      aPos[i * 3]     = Math.cos(theta) * rad
      aPos[i * 3 + 1] = Math.sin(theta) * rad
      aPos[i * 3 + 2] = -200 + Math.random() * 400  // deep tunnel
    }
    const aGeo = new THREE.BufferGeometry()
    aGeo.setAttribute('position', new THREE.BufferAttribute(aPos, 3))
    const aMat = new THREE.PointsMaterial({
      map:             starTex,
      size:            0.28,          // world-space, small
      sizeAttenuation: true,
      transparent:     true,
      alphaTest:       0.02,
      opacity:         0,
      depthWrite:      false,
      color:           0xffffff,
    })
    const aPts = new THREE.Points(aGeo, aMat)
    scene.add(aPts)

    //  Layer B — nearer, slightly larger, blue-tinted
    const B_N  = 1200
    const bPos = new Float32Array(B_N * 3)
    for (let i = 0; i < B_N; i++) {
      const theta = Math.random() * Math.PI * 2
      const rad   = 5 + Math.random() * 30
      bPos[i * 3]     = Math.cos(theta) * rad
      bPos[i * 3 + 1] = Math.sin(theta) * rad
      bPos[i * 3 + 2] = -100 + Math.random() * 200
    }
    const bGeo = new THREE.BufferGeometry()
    bGeo.setAttribute('position', new THREE.BufferAttribute(bPos, 3))
    const bMat = new THREE.PointsMaterial({
      map:             starTex,
      size:            0.18,
      sizeAttenuation: true,
      transparent:     true,
      alphaTest:       0.02,
      opacity:         0,
      depthWrite:      false,
      color:           0xa8c8ff,
    })
    const bPts = new THREE.Points(bGeo, bMat)
    scene.add(bPts)

    /* ── MH Initials ─────────────────────────────────────────────────── */
    const ext: THREE.ExtrudeGeometryOptions = {
      depth: 0.55, bevelEnabled: true,
      bevelThickness: 0.09, bevelSize: 0.06, bevelSegments: 8,
    }
    const letterMat = new THREE.MeshStandardMaterial({
      color:             new THREE.Color(0xcce0ff),
      metalness:         0.97,
      roughness:         0.04,
      emissive:          new THREE.Color(0x4F8EF7),
      emissiveIntensity: 0,
    })
    const mMesh = new THREE.Mesh(new THREE.ExtrudeGeometry(shapeM(), ext), letterMat)
    const hMesh = new THREE.Mesh(new THREE.ExtrudeGeometry(shapeH(), ext), letterMat)
    mMesh.position.set(-2.1, -1.5, 0)
    hMesh.position.set( 0.5, -1.5, 0)

    const initials = new THREE.Group()
    initials.add(mMesh, hMesh)
    initials.position.set(0, 0, -5)   // sitting ahead in the tunnel
    initials.scale.setScalar(0)        // hidden until fly-in
    scene.add(initials)

    /* ── Orbit particles around MH ───────────────────────────────────── */
    const O1 = 180
    const o1Pos = new Float32Array(O1 * 3)
    const o1Ang = new Float32Array(O1); const o1R = new Float32Array(O1)
    const o1Spd = new Float32Array(O1); const o1Y  = new Float32Array(O1)
    const o1Tx  = new Float32Array(O1); const o1Tz = new Float32Array(O1)
    for (let i = 0; i < O1; i++) {
      o1Ang[i] = Math.random() * Math.PI * 2
      o1R[i]   = 1.8 + Math.random() * 3.8
      o1Spd[i] = (0.004 + Math.random() * 0.013) * (Math.random() > .5 ? 1 : -1)
      o1Y[i]   = (Math.random() - 0.5) * 4
      o1Tx[i]  = (Math.random() - 0.5) * 0.8
      o1Tz[i]  = (Math.random() - 0.5) * 0.5
    }
    const o1Geo = new THREE.BufferGeometry()
    o1Geo.setAttribute('position', new THREE.BufferAttribute(o1Pos, 3))
    const o1Mat = new THREE.PointsMaterial({
      map: starTex, color: 0x4F8EF7, size: 0.12,
      sizeAttenuation: true, transparent: true, alphaTest: 0.02,
      opacity: 0, depthWrite: false,
    })
    const o1Pts = new THREE.Points(o1Geo, o1Mat)
    scene.add(o1Pts)

    const O2 = 90
    const o2Pos = new Float32Array(O2 * 3)
    const o2Ang = new Float32Array(O2); const o2R = new Float32Array(O2)
    const o2Spd = new Float32Array(O2); const o2Y = new Float32Array(O2)
    for (let i = 0; i < O2; i++) {
      o2Ang[i] = Math.random() * Math.PI * 2
      o2R[i]   = 5.0 + Math.random() * 2.5
      o2Spd[i] = 0.0035 * (Math.random() > .5 ? 1 : -1)
      o2Y[i]   = (Math.random() - 0.5) * 6
    }
    const o2Geo = new THREE.BufferGeometry()
    o2Geo.setAttribute('position', new THREE.BufferAttribute(o2Pos, 3))
    const o2Mat = new THREE.PointsMaterial({
      map: starTex, color: 0x8B5CF6, size: 0.09,
      sizeAttenuation: true, transparent: true, alphaTest: 0.02,
      opacity: 0, depthWrite: false,
    })
    scene.add(new THREE.Points(o2Geo, o2Mat))

    /* ── Torus rings ─────────────────────────────────────────────────── */
    type RC = { r: number; tube: number; color: number; rx: number; ry: number; rz: number }
    const ringCfg: RC[] = [
      { r: 4.2, tube: 0.018, color: 0x4F8EF7, rx: Math.PI * .5,  ry: 0,           rz: 0           },
      { r: 5.6, tube: 0.012, color: 0x8B5CF6, rx: Math.PI * .3,  ry: 0,           rz: Math.PI*.1  },
      { r: 3.3, tube: 0.010, color: 0x7dd3fc, rx: Math.PI * .72, ry: Math.PI*.2,  rz: 0           },
      { r: 6.8, tube: 0.008, color: 0x6366f1, rx: Math.PI * .12, ry: 0,           rz: Math.PI*.38 },
    ]
    const rings = ringCfg.map(c => {
      const m = new THREE.Mesh(
        new THREE.TorusGeometry(c.r, c.tube, 8, 140),
        new THREE.MeshBasicMaterial({ color: c.color, transparent: true, opacity: 0 })
      )
      m.rotation.set(c.rx, c.ry, c.rz)
      m.scale.setScalar(0)
      scene.add(m)
      return m
    })

    /* ── Lighting ────────────────────────────────────────────────────── */
    scene.add(new THREE.AmbientLight(0x080d20, 4))
    const kL = new THREE.DirectionalLight(0x6ab4ff, 8); kL.position.set(5, 10, 8); scene.add(kL)
    const rL = new THREE.DirectionalLight(0x8B5CF6, 4); rL.position.set(-7, -4, -5); scene.add(rL)
    const fP = new THREE.PointLight(0x4F8EF7, 5, 30); fP.position.set(0, 2, 6); scene.add(fP)
    scene.add(new THREE.PointLight(0x8B5CF6, 3, 25))

    /* ── State ────────────────────────────────────────────────────────── */
    const state = {
      progress:   0,     // 0→1, driven by wheel accumulation
      vortex:     0,     // 0→1 for post-process shader
      starOpacity: 0,    // driven by time (auto)
      completed:  false,
    }

    const mouse = { x: 0, y: 0, tx: 0, ty: 0 }
    const onMouse = (e: MouseEvent) => {
      mouse.tx = (e.clientX / W - 0.5) * 2
      mouse.ty = -(e.clientY / H - 0.5) * 2
    }
    window.addEventListener('mousemove', onMouse)

    /* ── Wheel accumulation — THIS is what drives the whole experience ── */
    const TOTAL_WHEEL = 3500   // total px to scroll from 0→1
    let accumulated   = 0

    const onWheel = (e: WheelEvent) => {
      e.preventDefault()
      if (state.completed) return
      accumulated = Math.max(0, Math.min(TOTAL_WHEEL, accumulated + e.deltaY))
      state.progress = accumulated / TOTAL_WHEEL
    }
    window.addEventListener('wheel', onWheel, { passive: false })

    /* Touch support */
    let touchStartY = 0
    const onTouchStart = (e: TouchEvent) => { touchStartY = e.touches[0].clientY }
    const onTouchMove  = (e: TouchEvent) => {
      e.preventDefault()
      if (state.completed) return
      const dy = touchStartY - e.touches[0].clientY
      touchStartY = e.touches[0].clientY
      accumulated = Math.max(0, Math.min(TOTAL_WHEEL, accumulated + dy * 3))
      state.progress = accumulated / TOTAL_WHEEL
    }
    window.addEventListener('touchstart', onTouchStart, { passive: false })
    window.addEventListener('touchmove',  onTouchMove,  { passive: false })

    /* ── Resize ──────────────────────────────────────────────────────── */
    const onResize = () => {
      const w = window.innerWidth, h = window.innerHeight
      camera.aspect = w / h
      camera.updateProjectionMatrix()
      renderer.setSize(w, h)
      rt.setSize(w, h)
    }
    window.addEventListener('resize', onResize)

    /* ── Original star Z values for hyperstream reset ─────────────────── */
    const aOrigZ = new Float32Array(A_N)
    for (let i = 0; i < A_N; i++) aOrigZ[i] = aPos[i * 3 + 2]
    const bOrigZ = new Float32Array(B_N)
    for (let i = 0; i < B_N; i++) bOrigZ[i] = bPos[i * 3 + 2]

    /* ── Render loop ─────────────────────────────────────────────────── */
    const clock = new THREE.Clock()
    let raf: number

    // Target values — lerped in render loop for smoothness
    let camZTarget     = 80
    let initialsScale  = 0
    let ringScale      = 0
    let orbitOpacity   = 0
    let vortexTarget   = 0

    const tick = () => {
      raf = requestAnimationFrame(tick)
      const t = clock.getElapsedTime()
      const p = state.progress  // 0→1

      /* ── Auto: stars fade in by themselves over first 2.5s ───────────── */
      const autoStarOpacity = Math.min(1, t / 2.2)
      aMat.opacity = autoStarOpacity
      bMat.opacity = autoStarOpacity * 0.6

      /* ── Mouse lerp ──────────────────────────────────────────────────── */
      mouse.x += (mouse.tx - mouse.x) * 0.04
      mouse.y += (mouse.ty - mouse.y) * 0.04

      /* ═════ PHASE 1: Fly-through (0 → 0.5) ═════
         Camera zooms from z=80 toward z=5.
         Stars stream past. MH grows from z=-5 ahead.                     */
      if (p <= 0.5) {
        const fly = p / 0.5                               // 0→1
        camZTarget = 80 - fly * 74                        // 80 → 6
        initialsScale = Math.max(0, (fly - 0.6) / 0.4)   // starts scaling at 60% fly-in

        // Slight camera drift with mouse while flying
        camera.position.x += (mouse.x * 0.8 - camera.position.x) * 0.025
        camera.position.y += (mouse.y * 0.5 - camera.position.y) * 0.025
      }

      /* ═════ PHASE 2: MH Revealed (0.5 → 0.68) ═════ */
      if (p > 0.5 && p <= 0.68) {
        const reveal = (p - 0.5) / 0.18                  // 0→1
        initialsScale = 1
        ringScale     = reveal
        orbitOpacity  = reveal

        // Mouse parallax while holding
        camera.position.x += (mouse.x * 0.6 - camera.position.x) * 0.02
        camera.position.y += (mouse.y * 0.4 - camera.position.y) * 0.02
      }

      /* ═════ PHASE 3: Black Hole (0.68 → 1.0) ═════ */
      if (p > 0.68) {
        const bh = (p - 0.68) / 0.32                     // 0→1
        vortexTarget  = bh
        initialsScale = Math.max(0.001, 1 - bh * 1.2)
        camZTarget    = 6 + bh * 60                       // rush forward (camera goes far)
        ringScale     = Math.max(0, 1 - bh * 1.5)
        orbitOpacity  = Math.max(0, 1 - bh * 2)

        // Hyperspace: push stars toward camera
        const speed = bh * 180
        const aPa   = aGeo.attributes.position.array as Float32Array
        const bPa   = bGeo.attributes.position.array as Float32Array
        for (let i = 0; i < A_N; i++) {
          aPa[i*3+2] += speed * 0.016
          if (aPa[i*3+2] > 80) aPa[i*3+2] = aOrigZ[i]
        }
        for (let i = 0; i < B_N; i++) {
          bPa[i*3+2] += speed * 0.016
          if (bPa[i*3+2] > 80) bPa[i*3+2] = bOrigZ[i]
        }
        aGeo.attributes.position.needsUpdate = true
        bGeo.attributes.position.needsUpdate = true

        aMat.size = 0.28 + bh * 2.0   // stars stretch
        bMat.size = 0.18 + bh * 1.5
      }

      /* ── Complete at 98% ────────────────────────────────────────────── */
      if (p >= 0.98 && !state.completed) {
        state.completed = true
        setHint(false)
        setTimeout(() => {
          setVisible(false)
          document.body.style.overflow = prevOverflow
          onComplete?.()
        }, 150)
      }

      /* ── Apply smooth lerps ─────────────────────────────────────────── */
      camera.position.z += (camZTarget - camera.position.z) * 0.06

      state.vortex += (vortexTarget - state.vortex) * 0.06
      ppUniforms.uProgress.value = state.vortex
      ppUniforms.uTime.value     = t

      /* ── Initials scale, glow, mouse tilt ───────────────────────────── */
      const sTarget = Math.max(0.001, initialsScale)
      initials.scale.lerp(new THREE.Vector3(sTarget, sTarget, sTarget), 0.08)

      if (initialsScale > 0.05) {
        initials.rotation.y = mouse.x * 0.42 + Math.sin(t * 0.22) * 0.04
        initials.rotation.x = -mouse.y * 0.26
        initials.rotation.z = mouse.x * 0.06
        letterMat.emissiveIntensity = 0.4 + Math.sin(t * 1.9) * 0.28
        fP.position.set(mouse.x * 3, mouse.y * 2, camera.position.z - 5)
      }

      /* ── Rings ──────────────────────────────────────────────────────── */
      const rs = Math.max(0, Math.min(1, ringScale))
      rings.forEach((ring, i) => {
        ring.scale.lerp(new THREE.Vector3(rs, rs, rs), 0.07)
        const mat = ring.material as THREE.MeshBasicMaterial
        mat.opacity = rs * (0.45 - i * 0.07)
      })
      if (rings[0].scale.x > 0.05) {
        rings[0].rotation.y =  t * 0.10
        rings[1].rotation.y = -t * 0.07
        rings[1].rotation.x = Math.PI * 0.3 + Math.sin(t * 0.2) * 0.05
        rings[2].rotation.z =  t * 0.05
        rings[3].rotation.y =  t * 0.04
      }

      /* ── Orbit particles ────────────────────────────────────────────── */
      const oo = Math.max(0, Math.min(0.9, orbitOpacity))
      o1Mat.opacity = oo
      o2Mat.opacity = oo * 0.65

      const o1a = o1Geo.attributes.position.array as Float32Array
      for (let i = 0; i < O1; i++) {
        o1Ang[i] += o1Spd[i]
        const r = o1R[i], a = o1Ang[i]
        o1a[i*3]     = Math.cos(a) * r + o1Tz[i] * Math.sin(a)
        o1a[i*3 + 1] = o1Y[i]  + Math.sin(t * 0.4 + i * 0.3) * 0.2 + o1Tx[i] * Math.sin(a)
        o1a[i*3 + 2] = Math.sin(a) * r * 0.45
      }
      o1Geo.attributes.position.needsUpdate = true

      const o2a = o2Geo.attributes.position.array as Float32Array
      for (let i = 0; i < O2; i++) {
        o2Ang[i] += o2Spd[i]
        const r = o2R[i], a = o2Ang[i]
        o2a[i*3]     = Math.cos(a) * r
        o2a[i*3 + 1] = o2Y[i] + Math.sin(t * 0.3 + i) * 0.15
        o2a[i*3 + 2] = Math.sin(a) * r * 0.3
      }
      o2Geo.attributes.position.needsUpdate = true

      /* ── Render: scene → RT → post-process ─────────────────────────── */
      renderer.setRenderTarget(rt)
      renderer.render(scene, camera)
      renderer.setRenderTarget(null)
      renderer.render(ppScene, ppCam)
    }
    tick()

    return () => {
      cancelAnimationFrame(raf)
      document.body.style.overflow = prevOverflow
      window.removeEventListener('mousemove', onMouse)
      window.removeEventListener('wheel',     onWheel)
      window.removeEventListener('touchstart', onTouchStart)
      window.removeEventListener('touchmove',  onTouchMove)
      window.removeEventListener('resize',    onResize)
      renderer.dispose()
      rt.dispose()
      starTex.dispose()
    }
  }, [onComplete])

  if (!visible) return null

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 9000,
      background: '#000',
    }}>
      <canvas
        ref={canvasRef}
        style={{ display: 'block', width: '100%', height: '100%' }}
      />

      {/* ── Scroll hint ── */}
      <AnimatePresence>
        {hint && (
          <motion.div
            key="hint"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.9 }}
            style={{
              position: 'fixed', bottom: '2.5rem', left: '50%',
              transform: 'translateX(-50%)',
              display: 'flex', flexDirection: 'column', alignItems: 'center',
              gap: '0.75rem', pointerEvents: 'none', zIndex: 9001,
            }}
          >
            <span style={{
              fontSize: '8px', letterSpacing: '0.45em',
              color: 'rgba(255,255,255,0.18)',
              fontFamily: '"JetBrains Mono", monospace',
              textTransform: 'uppercase',
            }}>
              scroll to fly
            </span>
            <motion.div
              animate={{ scaleY: [1, 1.7, 1], opacity: [0.15, 0.6, 0.15] }}
              transition={{ repeat: Infinity, duration: 2.4, ease: 'easeInOut' }}
              style={{
                width: '1px', height: '54px',
                background: 'linear-gradient(to bottom, rgba(79,142,247,0.7), transparent)',
                transformOrigin: 'top',
              }}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}