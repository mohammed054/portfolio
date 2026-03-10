08-projects-gallery.md
💼 Projects / Portfolio Gallery

Concept: Each project is a scene. Not a boring grid — we curate a cinematic journey. Focus on presentation quality, not quantity.

1. Layout

Full viewport sections (100vh) for each project

Alternating content: Left image → right text ↔ right image → left text

Background: Subtle ambient color changes per project to indicate a new “scene”

Scroll transition: GSAP morph / camera dolly → cinematic flow

2. Project Card (3D / Interactive)

Slightly tilted floating plane as card

Displays project screenshot as texture

Hover → tilt corrects to face-on, subtle glow

Click → expands full-screen case study overlay

Example Project Card:

Tag:        [Web App] [Full Stack]
Title:      Edu Bridge
Summary:    Smart school platform enhancing admin & teaching workflow.
Stack:      [React] [Express] [MongoDB] [Three.js]
Links:      [↗ Live Demo] [⌥ GitHub]
3. Case Study Overlay

Behavior:

Full-screen overlay slides up (spring, 600ms)

Content:

Hero screenshot / demo GIF

Problem statement: “Traditional school management was slow, fragmented, and data-poor.”

Solution approach: “Built a unified smart platform with AI-assisted workflows & 3D dashboards.”

Key technical decisions: Express backend, React frontend, MongoDB, GSAP scroll interactions

Results / metrics: “Reduced manual data entry by 60%, improved admin efficiency by 45%”

Screenshot gallery (swipeable)

Close button top-right (X)

4. Interactions
Action	Effect
Hover card	Glow + tilt to face user
Click card	Slide up overlay, freeze background
Scroll	Cinematic camera transitions between projects
Navigation	Next/prev overlay → smooth morph & ambient color change
5. 3D & Performance

Limit polys for floating planes → < 10k per object

Textures compressed as WebP / KTX2

Merge static meshes where possible

Canvas: frameloop="demand", dispose off-screen assets

Mobile / Tablet:

<768px → Use 2D card stack + swipe animation

768–1024px → Reduced 3D complexity

6. Accessibility

Project titles always text-based (not only in 3D)

ALT text for screenshots

Tooltip info accessible via keyboard