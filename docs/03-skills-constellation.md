03_Skills_Constellation.md — Procedural Skills Constellation (Space-Traveler Flow)
1. Concept / Experience
Visitor flies through clusters of skill nodes, not a flat grid or list.
Each domain forms a “constellation”: nodes are connected by subtle lines.
Nodes only appear when camera enters proximity, hover reveals details.
Cursor and scroll affect particle movement, cluster rotation, and camera orbit.
Immersive → user feels like navigating a 3D galaxy of skills.
2. Layout / Camera Path
Full viewport canvas: 100vw × 100vh
Camera follows a smooth 3D spline path, weaving between constellations
Scroll drives camera along the path; user can orbit via cursor
Optional faint particle “nebula” background for depth
const skillCurve = new CatmullRomCurve3([
  new Vector3(0,0,0),
  new Vector3(3,1,-3),
  new Vector3(-2,2,-6),
  new Vector3(0,-1,-9),
  new Vector3(2,0,-12),
]);

<CurveCamera path={skillCurve} scrollTriggerId="#skills" />
Camera lerp smooth → feels like flying, not scrolling
3. Skill Domains & Nodes
Component	Style / Behavior
Domain Cluster	Group of nodes, color-coded by domain
Node Geometry	IcosahedronGeometry, radius 0.4–0.8 units
Node Material	emissive, color = domain accent (#7A3CFF, #00D0FF, etc.)
Node Idle Motion	slight rotation ±2°, bob ±0.2 units
Node Hover	scale 1.3, glow pulse, lines connect dynamically
Node Click	Floating skill panel opens, orbit camera subtly

Domain Clusters Example:

const domains = [
  {name:"Engineering", color:"#7A3CFF", skills:["React","Node","Python"]},
  {name:"AI / ML", color:"#00D0FF", skills:["TensorFlow","PyTorch"]},
  {name:"Design / UX", color:"#FFB74D", skills:["Figma","CSS"]},
  {name:"Leadership / Soft", color:"#FF5C5C", skills:["Mentorship","Team Management"]}
];
4. Procedural Node Behavior
Nodes spawn only when camera is within a proximity threshold
Lines connecting nodes appear staggered, react to cursor proximity
Hover → node emits subtle glow, connected lines pulse
timelineNodes.forEach(node=>{
  if(camera.position.distanceTo(node.position) < 3) node.show()
  node.onHover = () => node.glow(1.5)
});
5. Floating Skill Panels
Click node → panel floats near node
Panel orientation → always faces camera
Panel structure:
┌─────────────────────────┐
│ Skill: React            │
│ Level: 8/10             │
│ Experience: 4 yrs       │
│ Tools: Next.js, Redux   │
└─────────────────────────┘
Animation: spring + fade, subtle Z offset
Close panel → camera returns to original orbit path
6. Scroll / Interaction Behavior
Scroll progress → camera moves along spline path
Nodes spawn staggered, only visible when camera is close
Hover → node rotation + glow
Click → floating panel appears, camera orbits around cluster
Cursor affects small cluster rotation & particle drift
ScrollTrigger.create({
  trigger:"#skills",
  start:"top top",
  end:"+=600px",
  scrub:1.5,
  onUpdate:(self)=>{
    const camPos = skillCurve.getPoint(self.progress)
    camera.position.lerp(camPos, 0.1)
    domainClusters.forEach(cluster=>{
      cluster.nodes.forEach(node=>{
        if(camPos.distanceTo(node.position)<3) node.show()
      })
    })
  }
})
7. Procedural Particles & Nebula
Background particle field (starfield / nebula)
Particle density: 500–800 points
Drift slowly, subtle flicker
Cursor → particles repel or flow toward cluster edges
const particles = new InstancedMesh(sphereGeo, particleMat, particleCount)
particles.position.set(rand(-10,10), rand(-5,5), rand(-20,0))
Adds depth & tunnel-like feeling
8. Procedural / Code-Driven Rules
Everything generated procedurally in code, no Blender / static meshes
Distances, glow, rotation, node spawn behavior → controlled via 00_Design_System.md tokens
Scroll-driven → user feels motion through space, not simple scrolling
Floating panels → triggered only on click
Nodes & clusters → appear only within camera proximity

✅ Outcome:

User flies through skill constellations, immersive “space-travel” feeling
No auto-appear → all scroll or click-driven
Camera, node, and particle behavior → fully procedural, responsive, interactive
Panel info → reveals only when user engages, keeping immersion intact