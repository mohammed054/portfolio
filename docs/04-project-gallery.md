04_Projects_Gallery.md — Procedural 3D Projects Gallery (Space-Traveler Flow)
1. Concept / Experience
Visitor flies through a cinematic 3D tunnel of projects, not a static grid.
Each project is a floating 3D plane or panel that appears only when the camera is near.
Scroll drives camera along spline paths; cursor subtly tilts panels and particles.
Click → project overlay / case study panel emerges near the panel, floating in 3D space.
Immersion-first → user feels like they are navigating a galaxy of projects.
2. Layout / Camera Path
Full viewport canvas: 100vw × 100vh
Camera follows curved spline path, weaving between project panels
Scroll triggers camera movement; cursor → small orbital adjustments
Optional faint nebula or stars background for depth
const projectCurve = new CatmullRomCurve3([
  new Vector3(0,0,0),
  new Vector3(2,1,-4),
  new Vector3(-3,2,-8),
  new Vector3(1,-1,-12),
  new Vector3(0,0,-16),
]);

<CurveCamera path={projectCurve} scrollTriggerId="#projects" />
Camera lerp smooth → gives tunnel-flying effect
3. Project Panels / Planes
Component	Style / Behavior
Panel Geometry	PlaneGeometry, slight tilt ±5°
Panel Material	MeshStandardMaterial + emissive outline
Panel Size	width 3–4 units, height 2–3 units
Panel Idle Motion	slight float ±0.2 units Y, idle rotation ±2°
Panel Spawn	Only visible when camera < 5 units distance
Hover	scale 1.05–1.1, subtle glow pulse
Click	Floating overlay appears near camera

Procedural Panel Example:

projects.forEach((p, i) => {
  const pos = projectCurve.getPoint(i / projects.length)
  p.mesh.position.copy(pos)
  p.mesh.rotation.set(rand(-0.05,0.05), rand(-0.05,0.05), 0)
});
4. Floating Overlay / Case Study Panel
Appears on click near camera, oriented toward camera
Structure:
┌─────────────────────────────┐
│ Project Name                │
│ Tag: Web App / AI Tool      │
│ Stack: React · Node · Python│
│ Description: One punchy line│
│ Demo / Screenshots          │
└─────────────────────────────┘
Panel animation: spring + fade + subtle Z offset
Close → panel disappears, camera returns to orbit path
const handlePanelClick = (project) => {
  projectPanel.show(project)
  gsap.to(camera.position, { x: project.position.x, y: project.position.y, z: project.position.z - 2, duration: 1.2, ease: "power2.inOut" })
};
5. Procedural Particles / Tunnel Effect
Around each panel → ~200–300 points drifting slowly
Particle density increases near panels → guides user attention
Lines connect particles subtly if distance < threshold
Cursor → particles repel or flow toward panels
<InstancedMesh args={[sphereGeo, particleMaterial, particleCount]} />
particles.position.set(rand(-5,5), rand(-3,3), rand(-10,0))
Tunnel-like particle flow → user feels moving through 3D space
6. Scroll & Interaction Behavior
Scroll progress → camera moves along project spline path
Panels spawn staggered, only when within proximity
Hover → panel glow + particle burst
Click → overlay opens; camera slightly orbits the panel
Cursor → tilts cluster and particles subtly, no abrupt motion
ScrollTrigger.create({
  trigger:"#projects",
  start:"top top",
  end:"+="+(projects.length*500)+"px",
  scrub:1.5,
  onUpdate:(self)=>{
    const camPos = projectCurve.getPoint(self.progress)
    camera.position.lerp(camPos, 0.1)
    projects.forEach(p=>{
      if(camPos.distanceTo(p.mesh.position)<5) p.mesh.show()
    })
  }
})
7. Procedural / Code-Driven Rules
Everything generated in code — no static assets
Panel positions, rotation, glow, spawn → controlled via 00_Design_System.md tokens
Panels & overlays → appear only on user interaction
Scroll-driven → user feels continuous space-travel
Particles → enhance 3D depth and immersion, responsive to cursor
8. Shader / Glow Notes
Panels → emissive outline, subtle vertex flicker
Particles → emissive glow, color = domain accent or project theme
Post-processing: UnrealBloomPass for cinematic glow
9. Performance Rules
Adaptive particle count / shader complexity per device
Frameloop = "demand"
Dispose off-screen objects
Max poly per object = 10k
Target FPS = 60 desktop / 30 mobile
Textures compressed (WebP/KTX2), instancing for repeated elements

✅ Outcome:

User flies through project constellations, full space-travel vibe
No auto-appear → everything scroll or click-triggered
Camera, panels, and particles → fully procedural, responsive, interactive
Project overlays → reveal only on engagement, keeping immersion intact