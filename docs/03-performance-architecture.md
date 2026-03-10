⚡ Performance Architecture

Goal: Even with heavy 3D, the site feels lightning-fast, smooth, and responsive.

1. Loading Strategy

Critical path (<3s) → what user sees immediately

→ HTML shell
→ Fonts (preload, subset)
→ Above-fold CSS
→ Hero 3D scene (compressed)

Deferred / Lazy-loaded

→ Below-fold 3D sections (use IntersectionObserver)
→ Project screenshots (lazy)
→ Video content (on-demand)

Never block

→ Analytics
→ Third-party scripts
→ Social embeds
2. 3D Asset Optimization
Category	Guideline
Geometry	Max 10k polys per object
Textures	WebP, max 1024×1024, KTX2 compressed
GLTF models	Draco compression, instancing for repeated objects
Draw calls	Merge static meshes; instancing for particles
Shadows	Baked textures only; no real-time shadows on mobile
3. Target Metrics (Lighthouse / UX)
Metric	Target
LCP (Largest Contentful Paint)	< 2.5s
FID (First Input Delay)	< 100ms
CLS (Cumulative Layout Shift)	< 0.1
FPS	60fps desktop / 30fps mobile acceptable
Bundle size	< 200kb initial JS, 3D chunks code-split
4. Canvas & Frame Management
// Adaptive pixel ratio
const { gl } = useThree()
gl.setPixelRatio(Math.min(window.devicePixelRatio, 2)) // Cap at 2x
gl.setSize(width, height)

// Only render on state change
<Canvas frameloop="demand" />

// Dispose assets when leaving viewport
useEffect(() => {
  return () => {
    geometry.dispose()
    material.dispose()
    texture.dispose()
  }
}, [])

Frame invalidation: Only redraw when something moves

Offscreen rendering: Use @react-three/offscreen for preloading or background computations

Adaptive quality: GPU detection via detect-gpu → scale particles, shadow complexity, and textures

5. Asset Loading Patterns

Hero / Above-the-fold

Preload fonts + 3D mesh + shader background

Show intro loader tied to useProgress (from Drei)

Below-the-fold

Load timelines, skill constellation, projects on intersection

Use lazy-loading + Suspense for heavy components

Preload next section asynchronously (predictive loading)

Images / Videos

WebP / H.264 / WebM

Compressed, resized for device

Only load full-resolution on desktop

6. Scroll-triggered Rendering
// GSAP + ScrollTrigger for 3D sections
ScrollTrigger.create({
  trigger: "#skills",
  start: "top center",
  onEnter: () => loadSkillsScene(),
  onLeaveBack: () => disposeSkillsScene()
})

Dispose sections when not in view → frees GPU and memory

Predictive loading → start loading next 3D scene just before user scrolls there

7. Performance Tips

Preload fonts & critical CSS

Compress GLTF + textures

Instancing → particles, repeated objects

Baked lighting → avoid runtime shadows on mobile/tablet

Adaptive rendering → reduce polygon & particle count on low-tier GPUs

Frame loop demand → don’t render unnecessarily

Lazy-load videos/images below fold

Web workers for heavy computations (offscreen rendering)

✅ Key Takeaways

Always separate critical vs deferred assets

Adaptive rendering ensures smooth 60fps on desktop, 30fps mobile

Dispose unused 3D assets to free memory and GPU

Preload & compress everything to reduce load times

Use ScrollTrigger + lazy-loading for seamless cinematic scrolling