🧠 Skills / Expertise Constellation

Concept: Show your domains of expertise as interactive 3D constellations. Professional, clear, not gimmicky, with subtle physics-based animations.

1. Domains
Domain	Color	Nodes
Engineering / Dev	Accent 1 (#4F8EF7)	React, Express, MongoDB
3D / Animations	Violet (#8B5CF6)	Three.js, GSAP, Framer Motion
AI / Logic	Teal (#00C1A7)	AI algorithms, problem solving
Design / UX	Soft Warm (#FFB86C)	Layout, UI/UX principles, accessibility
2. 3D Layout

Center: Large sphere for each domain

Orbiting nodes: Smaller spheres representing individual skills

Connections: Thin lines between related skills, color-coded

Interaction:

Hover → show skill name, years, small description

Click → expand info card (frosted glass panel)

3. Scroll & Entry Animations

Entry: Nodes spawn from center outward using spring physics

Scroll: Camera slowly orbits around constellation (smooth, cinematic)

Hover: Highlight domain cluster, dim others

Click domain: Focus camera, bring cluster front-center

4. Skill Card Example
┌─────────────────────────┐
│  ⬡  React               │
│     8 years             │
│     ████████░░  85%     │
│     Next.js · Redux     │
│     Zustand · RTK       │
└─────────────────────────┘

Frosted glass, 240px width, spring animated entry

Inline stack info & proficiency visualized with bars

5. Mobile & Performance

Mobile (<768px): No full 3D — use 2D interactive grid or Lottie animation

Tablet (768–1024px): Reduced node count, lighter physics

Desktop (>1024px): Full 3D with ~20–25 nodes max, smooth camera orbit

Performance tips:

Canvas frameloop="demand" → render only when interacting

Dispose off-screen assets

Limit 3D geometries, merge static meshes

6. Accessibility

Text labels always readable (contrast AA+)

Tooltip accessible via keyboard (Tab + Enter)

Prefers-reduced-motion → disable orbit, spring animations

7. Interaction Summary
Action	Effect
Hover node	Show skill tooltip, subtle glow
Click node	Expand info card, freeze camera on cluster
Scroll	Rotate camera slowly around constellation
Click domain	Focus cluster, dim others