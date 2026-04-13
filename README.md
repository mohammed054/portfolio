# Mohammed Hassoun — Portfolio

> A deterministic, camera-driven traversal through the internal layers of a computational system.

**Stack:** Next.js 15 · React 19 · TypeScript 5 · Three.js 0.170 · React Three Fiber · GSAP · Zustand · Tone.js

---

## Quick Start

```bash
# 1. Install dependencies
npm install

# 2. Add real font files (see FONTS.md)

# 3. Start dev server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). You should see a black screen — the canvas mounts on scroll.

---

## ⚠️ Before First Run: Fonts

The project requires two typeface families. Placeholder `.woff2` files exist in `public/fonts/` but **must be replaced** with real font files before the type will render correctly.

See **[FONTS.md](./FONTS.md)** for full instructions.

---

## Project Structure

```
src/
├── app/                    # Next.js App Router
│   ├── layout.tsx          # Root layout, font loading, metadata
│   ├── page.tsx            # Single page — mounts <Experience />
│   ├── globals.css         # Design tokens (CSS custom properties)
│   └── not-found.tsx       # Minimal 404
│
├── components/
│   ├── core/               # Root architecture
│   │   ├── Experience.tsx  # Canvas + HTML overlay + scroll rig
│   │   ├── ScrollRig.tsx   # GSAP ScrollTrigger → progress [0,1]
│   │   ├── SystemCamera.tsx# Camera path interpolation + mouse influence
│   │   └── SystemState.tsx # State observer, reduced-motion detection
│   │
│   ├── environment/        # Always-visible scene elements
│   │   ├── Substrate.tsx   # Base grid plane (200×200 units)
│   │   ├── GridMaterial.tsx# Custom ShaderMaterial for the grid
│   │   └── AmbientSystem.tsx
│   │
│   ├── states/             # 7 system states (progress-driven)
│   │   ├── IdleState.tsx         # 0.00–0.05
│   │   ├── ActivatingState.tsx   # 0.05–0.15
│   │   ├── IdentifyingState.tsx  # 0.15–0.30
│   │   ├── RoutingState.tsx      # 0.30–0.50
│   │   ├── ExecutingState.tsx    # 0.50–0.75
│   │   ├── ProcessingState.tsx   # 0.75–0.90
│   │   └── ResolvedState.tsx     # 0.90–1.00
│   │
│   ├── primitives/         # Reusable 3D building blocks
│   │   ├── Panel.tsx       # Flat panel with edge lighting
│   │   ├── Trace.tsx       # Animated data-flow line
│   │   ├── DataPacket.tsx  # Moving element on traces
│   │   ├── Volume.tsx      # Extruded rectangular form
│   │   └── SystemText.tsx  # 3D text in scene space
│   │
│   ├── interactive/        # Dragon canvas section
│   │   ├── DragonSpine.ts  # Spine physics (pure JS class)
│   │   ├── DragonRenderer.ts # Canvas draw calls
│   │   ├── TextParticles.ts  # Text→particles + displacement
│   │   └── DragonCanvas.tsx  # Component, activates at 0.55–0.70
│   │
│   ├── ui/                 # HTML UI layer
│   │   ├── Navigation.tsx  # Floating nav — logotype + state label
│   │   ├── StatusBar.tsx   # Bottom progress bar
│   │   ├── Cursor.tsx      # Custom cursor
│   │   ├── Loader.tsx      # Initial loading screen
│   │   ├── SystemOverlay.tsx # HTML overlays on canvas
│   │   └── ProjectModal.tsx  # Project detail slide-up
│   │
│   └── postprocessing/
│       └── Effects.tsx     # Bloom · DepthOfField · Vignette
│
├── hooks/
│   ├── useScrollProgress.ts
│   ├── useSystemProgress.ts
│   ├── useSystemState.ts
│   ├── useCursorPosition.ts
│   └── useAudio.ts
│
├── store/
│   ├── systemStore.ts      # Zustand: progress, state, cursor, audio
│   └── projectStore.ts     # Zustand: active project, modal
│
├── lib/
│   ├── systemStates.ts     # State enum, ranges, resolver
│   ├── cameraPath.ts       # Camera keyframes + interpolation
│   ├── colorSystem.ts      # Color constants + state→color mapping
│   ├── motionConfig.ts     # All animation constants
│   ├── projectData.ts      # Project content ← EDIT THIS
│   └── audioEngine.ts      # Tone.js engine
│
├── shaders/
│   ├── grid.vert / grid.frag
│   ├── trace.vert / trace.frag
│   └── panel.vert / panel.frag
│
└── types/
    ├── system.ts           # SystemState enum, CameraKeyframe
    ├── project.ts          # Project type
    └── global.d.ts         # GLSL module declarations
```

---

## Content Editing

### Your Projects — `src/lib/projectData.ts`

Replace the 4 placeholder projects with real ones. Rules (from blueprint):

```ts
title:       "What it IS, not what it does"
client:      "Real client name or 'Personal'"
year:        2025
category:    ['DESIGN', 'WEB']   // Only: DESIGN / WEB / MOTION / 3D / AI / SYSTEMS
description: "ONE sentence. What it does technically."
             // BAD:  "A beautiful dashboard for a fintech startup"
             // GOOD: "A real-time trading interface that renders 40k events/sec."
tech:        ['Next.js', 'GSAP', 'Figma']  // max 5
```

### Your Identity — `src/components/states/IdentifyingState.tsx`

```tsx
// Line ~50 — change surname
<SystemText text="HASSOUN" ... />

// Line ~60 — change subtitle
<SystemText text="COMPUTATIONAL DESIGNER & DEVELOPER" ... />
```

### Contact — `src/components/states/ResolvedState.tsx`

```tsx
// Replace email, links
<SystemText text="hello@hassoun.work" ... />
<SystemText text="Open to full-time and selected freelance work." ... />
<SystemText text="github.com/hassoun  ·  linkedin.com/in/hassoun" ... />
```

### Project Images — `public/projects/`

Replace placeholder `.jpg` files with real project images:
- Recommended: 800×500px, WebP format (rename to `.jpg` or update `projectData.ts`)
- Max 120kb each per performance budget

---

## Build Phases

This project is structured for incremental AI-assisted implementation. The current state is **Phase 0 (Scaffold)** — all types, stores, configs, and component stubs are in place. The canvas renders but states have minimal visual output.

| Phase | What Gets Built |
|-------|----------------|
| ✅ 0  | Project scaffold — all files, types, stores, configs |
| 1     | CSS tokens, font loading, zero-error `npm run dev` |
| 2     | ScrollRig live — scrolling updates progress |
| 3     | R3F Canvas + camera path interpolation |
| 4     | Grid substrate shader |
| 5     | All primitive components |
| 6     | All 7 state layers with full visuals |
| 7     | Navigation, StatusBar, custom Cursor |
| 8     | Loader + Project Modal + raycasting |
| 9     | Dragon canvas system |
| 10    | Audio engine (Tone.js) |
| 11    | Post-processing effects |
| 12    | Performance pass (draw calls < 100) |
| 13    | Accessibility + reduced motion |
| 14    | Polish pass |
| 15    | Vercel deployment |

---

## Design Rules (Anti-Template Checklist)

| Rule | Value |
|------|-------|
| Background | `#050507` — never `#000000` or `#111111` |
| Nav | No background panel, shadow, or border |
| Blue accent | ONLY on active data traces |
| Amber accent | ONLY in Identifying + Processing states |
| Green accent | Appears ONCE as flash in Resolved state |
| No particles | Only data packets on traces |
| No organic motion | Everything lerped/constrained |
| No spheres | No organic geometry in 3D |
| Audio | Off by default — toggle required |
| Camera | Path NEVER overridden by user |

---

## Environment Variables

Copy `.env.example` → `.env.local`:

```bash
NEXT_PUBLIC_DEV_MODE=true        # enables leva, stats.js, console.logs
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

For production (`vercel.json` or Vercel dashboard):
```
NEXT_PUBLIC_DEV_MODE=false
NEXT_PUBLIC_SITE_URL=https://hassoun.work
```

---

## Performance Budgets

```
Initial JS bundle (gzipped):  < 350kb
Three.js + R3F:               ~160kb
Application code:             < 80kb
GSAP + ScrollTrigger:         ~70kb
Framer Motion (UI only):      < 40kb

Project images:               < 120kb each (WebP)
Font files:                   < 50kb total
3D draw calls:                < 100 per frame
Dragon particles:             ≤ 12,000
Target FPS:                   60 on M1 / mid-range laptop
                              30 minimum on iPhone 12+
```

---

## Commands

```bash
npm run dev        # Development server
npm run build      # Production build
npm run start      # Serve production build
npm run lint       # ESLint
npm run type-check # TypeScript (no emit)
```
