07_Scroll_Architecture.md — Procedural 3D Space-Scroll Blueprint
1. Concept / Experience
The entire portfolio feels like a continuous space voyage.
Scroll → camera moves along predefined spline paths, each section = tunnel or docking bay.
Nothing appears automatically — objects spawn/react only when approached.
Cursor interaction = subtle tilts, particle repulsion, parallax layers.
Sections include: Hero → About → Skills → Projects → Testimonials → Contact → Docking / Exit.
2. Section Tunnel Mapping
Section	Tunnel Type / Motion	Camera / Object Notes
Hero	Starfield → black hole → initials	Camera lerps from far Z → near black hole, particles drift, scroll triggers MH appearance
About Timeline	Curved diagonal tube with glowing timeline nodes	Camera follows spline along timeline, nodes spawn on scroll threshold
Skills	Constellation tunnel	Camera orbits node clusters, skills appear on proximity
Projects	Floating gallery corridor	Camera passes planes sequentially, planes tilt on hover, fade-in per scroll step
Testimonials	Slow parallax tunnel	Cards appear staggered, subtle floating motion
Contact	Docking station	Camera flies along spline, panels / social icons appear only on approach
3. ScrollTrigger / Camera Path Rules
Scroll Y → camera movement along 3D spline
Section spawn triggers:
Objects appear when camera distance < spawn threshold
Fade in / scale / rotation animations tied to scroll progress
Pin sections only when needed, otherwise smooth continuous flow
Idle micro-animations (particles, floating panels) always run, unless prefers-reduced-motion

Example (Hero → About):

const heroCurve = new CatmullRomCurve3([startPos, blackHolePos, initialsPos])
const aboutCurve = new CatmullRomCurve3([heroEnd, aboutStart, aboutEnd])

ScrollTrigger.create({
  trigger:"#hero",
  start:"top top",
  end:"+=600px",
  scrub:1.5,
  onUpdate:(self)=>{
    const camPos = heroCurve.getPoint(self.progress)
    camera.position.lerp(camPos,0.1)
    initials.mesh.rotation.y = lerp(0,Math.PI*0.5,self.progress)
  }
})

ScrollTrigger.create({
  trigger:"#about",
  start:"top top",
  end:"+=600px",
  scrub:1.5,
  onUpdate:(self)=>{
    const camPos = aboutCurve.getPoint(self.progress)
    camera.position.lerp(camPos,0.1)
    timelineNodes.forEach(node=>{
      if(camPos.distanceTo(node.mesh.position)<5) node.mesh.show()
    })
  }
})
4. Multi-Section Spline / Tunnel Planning
Continuous Spline connects all sections → Hero → About → Skills → Projects → Testimonials → Contact
Each section = sub-curve:
Hero = straight zoom into black hole
About = diagonal twist + glowing path
Skills = rotating constellation tube
Projects = horizontal / vertical tunnel with staggered planes
Testimonials = calm parallax tunnel
Contact = docking bay
Camera lerp = cubic-bezier smoothing between spline points
Object proximity check = distance-based spawn / fade-in
Tunnel radius / curvature adjustable via 00_Design_System tokens
5. Section Spawn / Interaction Rules
Rule	Description
Object spawn	Only appear when camera < X units from target
Particle density	Increases near focus elements (initials, skill nodes, project planes)
Floating motion	±0.1–0.2 units, subtle rotation ±1–3°
Cursor interaction	Tilt objects ±5°, repel nearby particles ±0.01 units/frame
Click interaction	Trigger info panels, expand project overlays, form animations
Scroll progress	Smooth lerp along spline, optionally cubic-bezier easing
6. Procedural / Code-Driven Guidelines
All objects procedural — stars, black hole, initials, skill nodes, project planes, panels
Distances, rotation, glow, spawn triggers → controlled via 00_Design_System.md tokens
Frameloop: “demand” → renders only when objects or camera move
Camera interpolation → lerp / cubic-bezier
Spline segments → chained, continuous, no jumps
ScrollTrigger: scrub = 1–1.5 for cinematic, non-linear feel
7. Performance Rules
Adaptive quality:
Mobile → fewer particles, simpler shaders
Tablet → reduced particle density, partial post-processing
Desktop → full procedural details
Max poly per object = 10k
Particle / node instancing
Texture compression: WebP / KTX2
Target FPS = 60 desktop / 30 mobile
8. Key Takeaways
Users never feel they’re scrolling a page, they’re traveling through 3D space
Each section = tunnel or docking station, objects appear on interaction / proximity
Full scroll-driven procedural control
Fully responsive, accessible, and performance-optimized

✅ Outcome:

Portfolio is a continuous immersive 3D voyage
Scroll → camera along tunnels, objects appear only when relevant
Hero → About → Skills → Projects → Testimonials → Contact = one cinematic journey
Fully procedural, fully code-driven, no static imports, ready for implementation