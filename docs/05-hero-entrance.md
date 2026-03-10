🌌 Hero / Entrance Scene

Concept: The visitor isn’t just on a website — they’re entering your space.
Full 3D, interactive, professional, but not playful.

1. Layout

Full viewport canvas: 100vw × 100vh

Centered text overlay (z-index above canvas)

Scroll indicator at bottom-center (animated chevron → encourages scroll)

CTA below headline for direct engagement

2. 3D Scene
Element	Style / Behavior
Background	Custom GLSL shader: slow-moving nebula/aurora effect. Living gradient, subtle motion, never distracting
Foreground	3D mesh of initials (MH), extruded geometry, metallic reflective material
Idle animation	Subtle rotation: 0.2°/s
Cursor interaction	Slight tilt toward cursor (±8°)
Particles	~800 points forming constellation pattern, connected with thin lines when close (< threshold), drift slowly, repel gently from cursor
Lighting	Soft ambient + one directional accent light (matches Accent 1 / 4F8EF7)
3. Text Hierarchy
Type	Content	Style
Eyebrow	"Full Stack Engineer · AI Specialist"	12px, DM Sans, muted (#7A89A8), letter-spacing 0.2em
Headline	"Mohammed Hassoun"	96px, Syne 800, white
Subline	"I build things that matter."	24px, DM Sans 400, secondary (#7A89A8)
CTA	[Explore My Universe →]	Outlined button, glow on hover, spring animation, Accent 1 border
4. Interactions

Idle: Slow particle drift + initials rotate

Cursor move: Canvas responds within 80ms

Hover CTA: Border animates, faint particle burst

Click CTA: GSAP camera dolly forward → fade into About section

Scroll down: Camera forward → particles disperse outward

5. Implementation Notes
import { Canvas } from '@react-three/fiber'
import { Html, useGLTF, useProgress } from '@react-three/drei'
import { motion } from 'framer-motion'
import { useState } from 'react'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { gsap } from 'gsap'

const Hero = () => {
  const { progress } = useProgress()
  const [ctaClicked, setCtaClicked] = useState(false)

  const handleCTAClick = () => {
    setCtaClicked(true)
    gsap.to(camera.position, { z: 5, duration: 1.2, ease: "power2.inOut" })
  }

  return (
    <div className="relative w-full h-screen">
      <Canvas frameloop="demand">
        <ambientLight intensity={0.5} />
        <directionalLight position={[5, 5, 5]} intensity={0.6} color="#4F8EF7" />
        <InitialsMesh cursor={ctaClicked} />
        <ParticleConstellation />
        <NebulaShader />
      </Canvas>

      <div className="absolute inset-0 flex flex-col items-center justify-center text-center z-10">
        <span className="text-[12px] text-[#7A89A8] tracking-widest">Full Stack Engineer · AI Specialist</span>
        <h1 className="text-[96px] font-syne text-white mt-4">Mohammed Hassoun</h1>
        <p className="text-[24px] text-[#7A89A8] mt-2">I build things that matter.</p>
        <motion.button
          onClick={handleCTAClick}
          className="mt-8 px-6 py-3 border border-[#4F8EF7] text-[#4F8EF7] rounded"
          whileHover={{ scale: 1.05, boxShadow: '0 0 12px #4F8EF7' }}
        >
          Explore My Universe →
        </motion.button>
      </div>
      <ScrollIndicator />
    </div>
  )
}
6. Responsive Strategy

Mobile (<768px):

Swap full 3D canvas for lightweight Lottie / CSS 3D transforms

Reduce particle count, disable nebula shader

Tablet (768–1024px):

Simplify 3D scene (fewer particles, lighter meshes)

Desktop (>1024px):

Full 3D experience

7. Accessibility

Text overlays always readable on top of 3D

Prefers-reduced-motion: disable particle drift + rotation, fade-in text only

Keyboard navigation: CTA focusable, triggers camera dolly on enter

8. Key Takeaways

First visual impression = space + professionalism

Interactivity = subtle, not gimmicky

Performance tuned → frameloop="demand", adaptive pixel ratio, lazy-load assets

Fully responsive & accessible