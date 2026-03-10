01-technical-stack.md
🏗️ Frontend Stack
Layer	Tool / Library	Purpose	Notes
Framework	React.js (Next.js 14, App Router)	Component-driven architecture, SSR for performance	You’re comfortable with React — Next.js gives SEO + fast routing
Styling	Tailwind CSS + CSS Variables	Consistent spacing, colors, typography	Use design system tokens defined in 00-design-system.md
Animations	Framer Motion	UI animations, layout transitions	Combine with GSAP for scroll-linked 3D
Scroll Control	GSAP + ScrollTrigger	Pinning, scrubbing, cinematic scroll	Camera dolly effects, section pinning
3D Engine	Three.js + React Three Fiber (R3F)	Declarative 3D in React	Canvas integration with React components
3D Helpers	Drei	Cameras, controls, loaders, helpers	Simplifies Three.js setup
Physics / Micro-interactions	@react-spring/three	Spring-based 3D interactions	Hover effects on particles, skill nodes
Offscreen Rendering	@react-three/offscreen	Web worker rendering	Heavy 3D scenes don’t block main thread
Lottie / CSS Fallbacks	Framer Motion / Lottie	Mobile fallback for heavy 3D	Respects prefers-reduced-motion
⚡ Backend Stack
Layer	Tool / Library	Purpose	Notes
Server	Express.js	REST API, form handling, projects	Minimal, fast, lightweight
Database	MongoDB	Store contact messages, projects, optional analytics	Use Atlas cloud for simplicity
API	Node.js	Handles API endpoints	Integrates with Express
Hosting	Vercel / Netlify	Frontend + SSR	Optimized for Next.js
Optional	Formspree / Resend API	Contact form backend	If you don’t want to implement full mail server
🎬 3D / Hero / Scene Strategy
Feature	Implementation	Notes
Hero Mesh	Extruded initials	Metallic material, rotates idle, reacts to cursor
Particles	~800 points	Connected lines, subtle drift, repel cursor
Shader	GLSL nebula / aurora	Background gradient, not static skybox
Asset Optimization	Draco-compressed GLTF, WebP textures	Max 10k polys per object, lazy-load below fold
Mobile / Tablet	Reduced complexity, CSS 3D / Lottie	Swap automatically using media queries
🔁 Scroll & Scene Architecture

Section Pinning → About / Timeline / Projects / Skills

Camera Dolly → GSAP ScrollTrigger, cubic-bezier easing

Particles / Nodes → Frame invalidation (<Canvas frameloop="demand">)

Lazy Loading → IntersectionObserver for below-fold content

Adaptive Quality → Detect GPU tier → adjust pixel ratio, particle count

🧩 Stack Integration Notes

Frontend + 3D

All Three.js meshes react to React state and scroll triggers.

Combine Framer Motion for UI panels with @react-spring/three for mesh physics.

Backend

Express serves API endpoints (contact form, project data).

MongoDB stores optional analytics / messages.

Deployment

Vercel recommended for full-stack Next.js deployment.

Consider next/image for compressed project images.

✅ Developer Guidelines

All 3D assets must be optimized: max 10k polys, compressed textures.

Mobile-first approach: heavy 3D scenes swap to CSS 3D or Lottie.

ScrollTrigger + GSAP for cinematic feel, never linear camera movement.

Framer Motion for UI transitions; match duration + easing tokens from design system.

Backend APIs lightweight, secure, minimal third-party dependencies.