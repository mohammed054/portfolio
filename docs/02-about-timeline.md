01_Hero_Entrance.md — Procedural 3D Hero (Upgraded Flow)
1. Concept / Experience (Updated)
Visitor enters the procedural universe, not a static website.
Full journey-driven sequence:
Land in drifting starfield.
Zoom toward the black hole core.
“MH” 3D initials appear, interactive: rotation + tilt.

On click or scroll threshold, floating Hero text appears:

"Mohammed Hassoun – Software Engineer"
"I only design what’s necessary, not what’s flashy."

All elements are procedural + reactive (particles, stars, glow, black hole, initials).
No auto-appear: each stage requires user interaction or scroll.
2. Procedural Sequence / Flow
Stage	Trigger	Action
Starfield	Page load	Stars drift, cursor repulsion active
Black Hole	Scroll down	Camera zooms into black hole core
MH Initials	Scroll threshold / click	3D initials rotate ±2°, tilt ±8°
Hero Text	Click initials or reach next scroll point	Floating 3D text appears, fade + bloom
3. Procedural Hero Text Appearance
const [textVisible, setTextVisible] = useState(false);

const handleMHClick = () => {
  setTextVisible(true)
  gsap.to(camera.position, { z: 5, duration: 1.2, ease: "power2.inOut" })
};

<group position={[0,0,0]}>
  <Text3D
    font={syneFont}
    size={0.8}
    height={0.2}
    visible={textVisible}
    position={[0,-1.5,0]}
  >
    "Mohammed Hassoun – Software Engineer"
    <meshStandardMaterial
      color="#F4F7FF"
      emissive="#7A3CFF"
      metalness={0.8}
      roughness={0.2}
    />
  </Text3D>

  <Text3D
    font={dmSansFont}
    size={0.4}
    height={0.1}
    visible={textVisible}
    position={[0,-2.2,0]}
  >
    "I only design what’s necessary, not what’s flashy."
    <meshStandardMaterial
      color="#7A89A8"
      emissive="#00D0FF"
      metalness={0.2}
      roughness={0.5}
    />
  </Text3D>
</group>

Notes:

Visibility: starts hidden (visible=false) → triggers on MH click or scroll threshold.
Animation: fade-in + bloom using GSAP / shader intensity tween.
Positioning: floats below initials; small tilt or gentle Y oscillation for liveliness.
4. Camera & Scroll Mapping (Updated)
Initial: camera Z=20 → zoom to black hole
MH click / scroll threshold: camera Z=5 → positions text near initials
const startPos = new Vector3(0,0,20)
const mhPos    = new Vector3(0,0,0)
const textPos  = new Vector3(0,-1.5,5)

ScrollTrigger.create({
  trigger: "#hero",
  start: "top top",
  end: "+=600px",
  scrub: 1,
  onUpdate: (self) => {
    if (!textVisible && self.progress > 0.6) handleMHClick()
    const target = textVisible ? textPos : mhPos
    camera.position.lerpVectors(startPos, target, self.progress)
  }
})
5. Interaction Table (Updated)
Event	Effect
Idle	Stars drift, initials rotate
Cursor move	Initials tilt, particles repel
Scroll down	Camera zooms into black hole
Click MH	Hero text fades in below initials
Hover CTA	Particle burst, accent glow pulse
6. Shader / Glow Notes
Same as before: black hole lensing, accretion disk rotation, particle flicker
Floating Hero text uses emissive + bloom shader for subtle interstellar glow
Optional shader-based fade + vertical displacement when text appears
7. Procedural Rules / Philosophy
Everything fully procedural; no static models
Every transition requires user interaction (scroll or click)
Distances, glow, rotation, particle behavior controlled via 00_Design_System.md tokens
Sets tone for the portfolio → immersive, interactive, cinematic

✅ Outcome:

MH initials appear first
On click / scroll, Hero text appears below initials
Fully scroll-driven / interaction-based → feels like space traveling, not scrolling down