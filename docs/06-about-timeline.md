👤 About Me / Timeline

Concept: Highlight your journey, skills, and your standout project with a hybrid timeline — professional, dynamic, and mobile-friendly.

1. Layout
Device	Layout Style
Desktop	Angled / diagonal timeline → adds motion and depth
Mobile	Vertical stacked cards → clean, readable

Timeline pins on scroll via GSAP ScrollTrigger

Thin progress indicator on left shows scroll position

2. 3D / Visual Elements
Element	Style / Behavior
Timeline path	Glowing tube geometry that draws itself as user scrolls
Nodes	Icosahedron spheres marking milestones (education, skills, project)
Node hover	Scale 1.4, color shift to Accent 1 (#4F8EF7), tooltip with info
Node click	Expands a frosted glass panel with content (spring physics, not linear)
Panels	Frosted glass effect, semi-transparent, backdrop-filter blur, subtle shadows
Camera	Moves along cubic bezier path, smooth cinematic feel
3. Timeline Structure

Even with one major project, we can fill the timeline with:

Year	Milestone	Details
2023	Education	High school, UAE – focus on CS & AI
2024	Skills	React, Express, Mongo, Three.js, GSAP, Framer Motion
2025	Signature Project	Edu Bridge Platform – full-stack school operations platform, React + Express + MongoDB, 3D dashboards & analytics
2025+	Growth	Future projects, contributions, open source / AI tools
4. Panel / Node Content
┌─────────────────────────────┐
│  Year / Month               │
│  Title / Milestone          │
│  Description (1–2 lines)   │
│  Skills / Tech Tags         │
│  [Optional: Logo or image] │
└─────────────────────────────┘

Example:

Year: 2025
Title: Edu Bridge Platform
Description: Built a full-stack school operations platform with React, Express & Mongo. Integrated 3D dashboards and AI-driven analytics.
Tags: [React] [Express] [MongoDB] [Three.js] [GSAP] [AI]
5. Scroll Behavior

Section pinning: Timeline pins while camera moves along nodes

Trigger nodes: Appear when 20% from bottom of viewport

Camera: Smooth cubic bezier movement, slight rotation for depth

Node animations: Staggered entry with spring physics, hover highlights

6. Interactions

Hover node: Highlight + tooltip with brief info

Click node: Expand frosted glass panel with more details

Scroll: Node and panel animations tied to scroll progress

7. Responsive Strategy

Mobile (<768px): Vertical cards, no diagonal animation

Tablet (768–1024px): Reduced complexity, fewer particle effects, minimal 3D geometry

Desktop (>1024px): Full diagonal timeline, glowing tube, interactive 3D nodes

8. Accessibility

Text always readable over 3D

Prefers-reduced-motion disables tube draw animation & node spin

Keyboard navigation: Tab through nodes, Enter expands panel

Focus ring = Accent 1, 2px offset

9. Key Takeaways

Even with one major project, timeline shows growth & professionalism

3D elements = subtle, enhance focus, never distract

Mobile-first design ensures timeline is readable everywhere

Scroll-triggered cinematic camera adds personality without gimmicks