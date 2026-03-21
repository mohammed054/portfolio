00_Design_System.md — Procedural 3D Code-Driven Portfolio
🎨 0. Design System (Global Foundation)

Purpose: All sections inherit from these tokens — colors, typography, spacing, motion, and procedural 3D parameters. Everything is interaction-first — objects appear only when triggered by scroll, click, or cursor proximity.

Color Palette (Cosmic / Interstellar Theme)
--background-deep:      #000010  /* Cosmic void */
--surface-dark:         #0B0F1A  /* Floating panels, subtle shadows */
--border-subtle:        #1C1F2D  /* Minimal separators */
--accent-primary:       #7A3CFF  /* Purple glow for highlights & particles */
--accent-secondary:     #00D0FF  /* Electric blue for stars & skill nodes */
--accent-glow:          rgba(122,60,255,0.15) /* Subtle bloom / procedural glow */
--text-primary:         #F4F7FF
--text-secondary:       #7A89A8
--text-muted:           #3B4251
--error-red:            #FF5C5C
Typography
Type	Font / Weight	Usage
Display	Syne 700–800	Hero headings, 3D initials
Body	DM Sans 400–500	Paragraphs, labels
Mono	JetBrains Mono	Code snippets, stats

Scale: 12 / 14 / 16 / 20 / 24 / 32 / 48 / 64 / 96px
Line heights: 1.1 tight (headings), 1.6 relaxed (body)
Letter-spacing: 0–0.05em (body), 0.2em (hero)

Spacing System
Base unit: 4px
Scale: 4 / 8 / 12 / 16 / 24 / 32 / 48 / 64 / 96 / 128px
Section vertical padding: 96–128px on desktop
3D layering offset: 1–2 units (meters) for floating object depth
Motion Tokens
Duration: fast=150ms, base=300ms, slow=600ms, cinematic=1200ms
Easing:
enter: cubic-bezier(0.22,1,0.36,1) (springy)
exit: cubic-bezier(0.55,0,1,0.45)
standard: cubic-bezier(0.4,0,0.2,1)
Scale: hover 1.03–1.05
Rotation: idle ±2–5° on floating elements
🏗️ 1. Technical Stack
Layer	Tool / Library	Purpose
Framework	Next.js 14 (App Router)	SSR, routing, optimized images
3D Engine	Three.js + React Three Fiber (R3F)	Procedural 3D scenes
3D Helpers	Drei	Cameras, loaders, text, mesh helpers
Scroll Animation	GSAP + ScrollTrigger	Scroll-driven camera & object movement
UI Animation	Framer Motion	Layout transitions, micro-interactions
Physics / Micro-interactions	@react-spring/three	Floating objects, springy motion
Styling	Tailwind CSS + CSS Variables	Global design tokens
Shaders / Glow	GLSL / PostProcessing	Accretion disk, particle bloom
Performance Optimization	@react-three/offscreen	Web worker rendering, adaptive quality
Asset Pipeline	Procedural meshes & shaders	Fully generated in code, no Blender import
📱 2. Responsive & Fallback Strategy
Device	Strategy
Mobile <768px	Swap heavy 3D canvas → CSS 3D transforms / Lottie procedural equivalents. Particle density reduced. Nebula shader disabled.
Tablet 768–1024	Lower object count, reduce particle & node density, simpler shaders.
Desktop >1024	Full procedural 3D experience with stars, black hole, initials, particles.

Reduced Motion: Disable scroll-driven animations. Fade-only fallback.

Example:

const isMobile = useMediaQuery('(max-width: 768px)');
const prefersReducedMotion = useReducedMotion();
return isMobile ? <StaticHero /> : <ProceduralHero3D />;
⚡ 3. Scroll Architecture (Code-Driven)

Scroll → Camera Mapping: scrollY → camera.position.z (or follow path)
Interpolation: lerp / GSAP for smooth cinematic motion
Triggering: All objects appear only after user scroll / click / hover

Section Pinning Order: Hero → About → Skills → Projects → Testimonials → Contact

ScrollTrigger Pattern:

ScrollTrigger.create({
  trigger: "#about",
  start: "top top",
  end: "+=200%",
  pin: true,
  scrub: 1.5,
  onUpdate: (self) => {
    camera.position.lerpVectors(startPos, endPos, self.progress);
  }
});
🌌 4. Procedural 3D Tokens
Token	Value / Range	Notes
--star-density	800–1000 points	Procedural constellation pattern
--star-speed	0.001–0.003 units/frame	Slow drift
--blackhole-radius	2 units	Central interactive object
--accretion-disk-radius	3 units	Rotates procedurally
--disk-rotation-speed	0.01 rad/frame	Continuous rotation
--initials-font-size	1.5–2 units	3D initials
--particle-glow-strength	1.2–2	Emission for points
--scene-layer-offset	1–2 units	Z-depth for floating meshes
--camera-dolly-speed	0.01–0.03 per scroll unit	Scroll-controlled motion

Note: Everything is generated procedurally — no static models.

📂 5. Asset Guidelines (Procedural)
Stars: BufferGeometry + PointsMaterial, drift, flicker, repel from cursor
Black Hole Core: SphereGeometry + ShaderMaterial, lensing effect
Accretion Disk: TorusGeometry + emissive shader, rotation animation
MH Initials: TextGeometry + MeshStandardMaterial + emission
Floating Particles: Instanced spheres, connected lines, idle rotation
Timeline / Skill Nodes: IcosahedronGeometry + LineSegments
Project Cards: PlaneGeometry + texture, slight tilt on hover/scroll
🚀 6. Performance Rules
const { gl } = useThree();
gl.setPixelRatio(Math.min(window.devicePixelRatio, 2));
gl.setSize(width, height);

// Frame-loop on demand
<Canvas frameloop="demand" />

// Dispose off-screen assets
useEffect(() => {
  return () => {
    geometry.dispose();
    material.dispose();
    texture.dispose();
  }
}, []);
Max 10k polygons per object
Compressed textures (WebP / KTX2)
Instancing for repeated meshes
Target: LCP < 2.5s, FPS 60 desktop / 30 mobile, JS < 200kb initial
♿ 7. Accessibility Tokens
Keyboard-focusable elements
ARIA labels on all buttons / icons
3D scene decorative only, overlay text always readable
Color contrast: AA minimum, AAA target for critical UI
Prefers-reduced-motion respected — fade-only fallback
🔁 8. Section Layering & Procedural Rules
Section	Procedural Layering & Interactions
Hero	Stars + particles, black hole, initials appear on scroll / click
About / Timeline	Glowing path, milestones spawn on scroll, camera fly-through
Skills / Constellation	Nodes spawn procedurally, orbit, camera rotates around cluster
Projects Gallery	Floating planes, tilt + hover reveal, staggered entry
Testimonials	Floating panels, subtle parallax, appear on scroll
Contact	Low-poly mesh plane, cursor-reactive wave, form overlay appears on interaction