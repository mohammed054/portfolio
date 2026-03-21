06_Contact.md — Procedural 3D Contact (Docking Station Experience)
1. Concept / Experience
Visitors fly into a final 3D chamber — the Contact section.
Scroll → camera moves along a curved spline, feeling like entering a docking bay.
Panels, forms, and floating indicators spawn only when close.
Interaction = hover, click → particle bursts, glow, and micro-interactions.
Minimal text → accent colors and subtle 3D elements guide attention.
2. Layout / Camera Path
Full viewport canvas: 100vw × 100vh
Camera follows docking spline, approaching contact panels and form:
const contactCurve = new CatmullRomCurve3([
  new Vector3(0,0,-40),
  new Vector3(1,0.5,-44),
  new Vector3(-1,-0.5,-48),
  new Vector3(0,0,-52)
]);

<CurveCamera path={contactCurve} scrollTriggerId="#contact" />
Background: darker nebula with subtle particles
Canvas frameloop = "demand"
Scroll triggers → panels and form fade in only when near camera
3. Procedural Panels / Form Components
Component	Style / Behavior
Form Panel	PlaneGeometry, frosted-glass + emissive rim
Width / Height	width 3.5–4 units, height 2.5–3 units
Floating Motion	±0.15 units Y, subtle rotation ±1–2°
Spawn Distance	Visible when camera < 5 units away
Hover / Focus	Glow pulse + scale 1.02–1.05
Input Fields	Minimal, outlined, white text, accent glow on focus
Submit Button	Spring animation, particle burst on click, text → "Sent ✓"
Social Links	Floating icons in orbit around form, slight Y drift, hover glow pulse

Procedural Spawn Example:

const contactElements = [formPanel, socialIcons]
contactElements.forEach((el, i)=>{
  const pos = contactCurve.getPoint(i/contactElements.length)
  el.mesh.position.copy(pos)
  el.mesh.rotation.set(rand(-0.02,0.02), rand(-0.02,0.02), 0)
})
4. Interaction / Micro-Animation Table
Event	Effect
Idle	Form panel floats, social icons drift slowly
Cursor move	Panels tilt subtly, particles follow cursor
Scroll → approach	Elements fade in, camera lerps along spline
Hover input / button	Accent glow, subtle scale 1.03
Click Submit	Particle burst, button morph → "Sent ✓", reset inputs
Reduced Motion	Disable panel drift + glow, fade-only transitions
5. Procedural Particles & Ambient Elements
Particles float around panels → react to cursor and scroll proximity
Glow intensity tied to accent-primary / secondary from 00_Design_System.md
Optional lines connect particles near form → reinforces 3D depth & immersion
<InstancedMesh args={[sphereGeo, particleMaterial, particleCount]}>
  {positions.map(p => p.set(rand(-4,4), rand(-2,2), rand(-6,0)))}
</InstancedMesh>
Particle density increases near form and social icons → guides attention
6. Scroll & Camera Behavior
Camera moves along docking spline, giving sense of tunnel approach
ScrollTrigger manages camera position and panel spawn:
ScrollTrigger.create({
  trigger:"#contact",
  start:"top top",
  end:"+=400px",
  scrub:1.5,
  onUpdate:(self)=>{
    const camPos = contactCurve.getPoint(self.progress)
    camera.position.lerp(camPos, 0.1)
    contactElements.forEach(el=>{
      if(camPos.distanceTo(el.mesh.position)<5) el.mesh.show()
    })
  }
})
Camera rotation slightly follows cursor → immersive, subtle parallax
7. Shader / Glow Notes
Panels → emissive rim + soft alpha blur
Particles → vertex flicker, subtle glow tied to accent palette
Post-processing → UnrealBloomPass for cinematic, soft glow
Ambient light → dim, accent highlights on panels/forms
8. Procedural / Code-Driven Rules
Everything generated in code — no static assets
Distances, glow, rotation, particle behavior → controlled via 00_Design_System.md tokens
Panels, form, social icons → spawn only on scroll proximity / interaction
Tunnel effect → sense of continuous space-travel
9. Performance Rules
Adaptive particle count / shader detail per device
Frameloop = "demand"
Dispose off-screen objects
Max poly per object = 10k
Target FPS = 60 desktop / 30 mobile
Textures compressed (WebP/KTX2), instancing for repeated objects

✅ Outcome:

User feels like they’re arriving at a space docking station
Scroll → fly into the contact section, panels and social icons appear only on approach
Fully procedural, interactive, responsive, and immersive
Seamlessly continues the space-travel journey from Hero → Skills → Projects → Testimonials → Contact