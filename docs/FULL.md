# MOHAMMED HASSOUN — COMPLETE IMPLEMENTATION BLUEPRINT
## A to Z Build Guide · Camera-Driven Computational System Experience
### Version 2.0 · April 2026

---

> **HOW TO USE THIS DOCUMENT**
> This file is designed to be given to an AI agent phase by phase.
> Each phase is self-contained. The AI only needs this file + the phase number.
> Command format: *"Read this document. Implement everything in PHASE [N] exactly as specified.
> Do not proceed beyond this phase. Stop and report when done."*

---

# PART 0 — PROJECT IDENTITY

## What This Is
**Name:** Mohammed Hassoun Portfolio
**Domain:** `hassoun.work` (or equivalent)
**Concept:** A deterministic, camera-driven traversal through the internal layers
of a computational system. The user does not browse. The user is processed through
system states that reveal identity, architecture, execution, and resolution.

## What This Is NOT
- Not a website with pages
- Not a scrollable document with sections
- Not an animated landing page
- Not a template with a dark color scheme applied

## Single-Sentence Definition
> A running computational system made observable through camera traversal.

## The Invisible Rule
Every element in this experience must answer: *"What is this element's function
within the system?"* If it has no answer, it does not exist.

---

# PART 1 — COMPLETE TECH STACK

## Core Framework
```
Next.js          15.x        App Router, React Server Components
React            19.x        UI layer
TypeScript       5.x         Full type coverage — no `any` types
```

## 3D / WebGL
```
Three.js         0.170.x     Core 3D engine
@react-three/fiber  8.x      React bindings for Three.js
@react-three/drei   9.x      Helpers: shaders, camera controls, text
@react-three/postprocessing  Bloom, DepthOfField, Vignette
leva             0.9.x       Dev-only GUI for tuning values (removed in prod)
```

## Animation & Scroll
```
gsap             3.12.x      ScrollTrigger for scroll→progress mapping
                             (NOT for scene animations — those are Three.js)
framer-motion    11.x        UI-layer micro-interactions only (nav, overlays)
```

## Styling
```
tailwindcss      3.4.x       Layout and utility classes
CSS custom properties        Design tokens (see Part 3)
```

## Audio (Signal Layer)
```
tone             14.x        Procedural audio synthesis
                             (NOT pre-recorded samples)
```

## Utilities
```
zustand          4.x         Global state store (system state, progress)
@types/three                 TypeScript types for Three.js
sharp                        Image optimization (project thumbnails)
next-themes                  (NOT used — no theme toggle in this system)
```

## Dev Tools
```
leva             0.9.x       Real-time value tweaking (build only)
stats.js         0.17.x      FPS monitor (build only)
eslint + prettier            Code quality
```

## Complete Install Command
```bash
npx create-next-app@latest hassoun-portfolio --typescript --tailwind --app --src-dir

cd hassoun-portfolio

npm install three @react-three/fiber @react-three/drei @react-three/postprocessing
npm install gsap framer-motion zustand tone
npm install @types/three

npm install -D leva stats.js
```

---

# PART 2 — COMPLETE FILE & FOLDER STRUCTURE

Every file that will exist in the final project. Create this structure in Phase 1.

```
hassoun-portfolio/
├── public/
│   ├── fonts/
│   │   ├── SuisseIntl-Regular.woff2
│   │   ├── SuisseIntl-Medium.woff2
│   │   ├── SuisseIntl-Bold.woff2
│   │   └── JetBrainsMono-Regular.woff2
│   ├── textures/
│   │   ├── noise-256.png          ← tileable blue-noise (download from web)
│   │   └── grid-normal.png        ← normal map for substrate (generate in Phase 4)
│   ├── projects/
│   │   ├── project-01.jpg
│   │   ├── project-02.jpg
│   │   ├── project-03.jpg
│   │   └── project-04.jpg
│   └── favicon.ico
│
├── src/
│   ├── app/
│   │   ├── layout.tsx             ← Root layout, font loading, metadata
│   │   ├── page.tsx               ← Single page: mounts <Experience />
│   │   ├── globals.css            ← CSS reset + design tokens + base styles
│   │   └── not-found.tsx          ← Minimal 404
│   │
│   ├── components/
│   │   │
│   │   ├── core/
│   │   │   ├── Experience.tsx     ← Root: Canvas + HTML overlay + scroll rig
│   │   │   ├── ScrollRig.tsx      ← Maps scroll → progress [0,1] via GSAP
│   │   │   ├── SystemCamera.tsx   ← Three.js camera + mouse micro-influence
│   │   │   └── SystemState.tsx    ← Reads progress, outputs current state enum
│   │   │
│   │   ├── environment/
│   │   │   ├── Substrate.tsx      ← Base grid plane (always visible)
│   │   │   ├── GridMaterial.tsx   ← Custom ShaderMaterial for grid
│   │   │   └── AmbientSystem.tsx  ← Background structures, depth fog
│   │   │
│   │   ├── states/
│   │   │   ├── IdleState.tsx      ← progress 0.00–0.05
│   │   │   ├── ActivatingState.tsx← progress 0.05–0.15
│   │   │   ├── IdentifyingState.tsx ← progress 0.15–0.30
│   │   │   ├── RoutingState.tsx   ← progress 0.30–0.50
│   │   │   ├── ExecutingState.tsx ← progress 0.50–0.75
│   │   │   ├── ProcessingState.tsx← progress 0.75–0.90
│   │   │   └── ResolvedState.tsx  ← progress 0.90–1.00
│   │   │
│   │   ├── primitives/
│   │   │   ├── Panel.tsx          ← Flat rectangular system panel
│   │   │   ├── Trace.tsx          ← Animated data trace line
│   │   │   ├── DataPacket.tsx     ← Small moving element on traces
│   │   │   ├── Volume.tsx         ← Extruded rectangular form
│   │   │   └── SystemText.tsx     ← 3D text integrated into environment
│   │   │
│   │   ├── interactive/
│   │   │   ├── DragonCanvas.tsx   ← Dragon cursor system (full-viewport canvas)
│   │   │   ├── DragonSpine.ts     ← Spine physics engine (pure JS class)
│   │   │   ├── DragonRenderer.ts  ← Canvas draw calls
│   │   │   └── TextParticles.ts   ← Text-to-particles + displacement
│   │   │
│   │   ├── ui/
│   │   │   ├── Navigation.tsx     ← Floating nav (logotype + status)
│   │   │   ├── SystemOverlay.tsx  ← HTML layer over canvas
│   │   │   ├── StatusBar.tsx      ← Bottom system status bar
│   │   │   ├── Cursor.tsx         ← Custom cursor component
│   │   │   ├── Loader.tsx         ← Initial loading screen
│   │   │   └── ProjectModal.tsx   ← Project detail overlay
│   │   │
│   │   └── postprocessing/
│   │       └── Effects.tsx        ← Bloom (edges only), DoF, Vignette
│   │
│   ├── hooks/
│   │   ├── useSystemProgress.ts   ← Subscribe to global progress value
│   │   ├── useSystemState.ts      ← Subscribe to current state enum
│   │   ├── useCursorPosition.ts   ← Normalized mouse [-1,1] with smoothing
│   │   ├── useScrollProgress.ts   ← Raw scroll → normalized progress
│   │   └── useAudio.ts            ← Tone.js audio engine interface
│   │
│   ├── store/
│   │   ├── systemStore.ts         ← Zustand: progress, state, cursor, audio
│   │   └── projectStore.ts        ← Zustand: active project, modal open/close
│   │
│   ├── lib/
│   │   ├── systemStates.ts        ← State enum + range definitions
│   │   ├── cameraPath.ts          ← Keyframe positions for camera at each state
│   │   ├── colorSystem.ts         ← Color values by state + interpolation helpers
│   │   ├── motionConfig.ts        ← Shared easing, duration, lerp constants
│   │   ├── projectData.ts         ← Static project content
│   │   └── audioEngine.ts         ← Tone.js setup and trigger functions
│   │
│   ├── shaders/
│   │   ├── grid.vert              ← Grid vertex shader
│   │   ├── grid.frag              ← Grid fragment shader
│   │   ├── trace.vert             ← Trace line vertex shader
│   │   ├── trace.frag             ← Trace line fragment shader
│   │   ├── panel.vert             ← Panel edge-light vertex shader
│   │   └── panel.frag             ← Panel edge-light fragment shader
│   │
│   └── types/
│       ├── system.ts              ← SystemState enum, CameraKeyframe type
│       ├── project.ts             ← Project type definition
│       └── global.d.ts            ← Module declarations for shaders
│
├── .env.local                     ← Environment variables
├── .env.example                   ← Committed example env file
├── next.config.ts                 ← Webpack shader loader, image domains
├── tailwind.config.ts             ← Minimal config (no default colors needed)
├── tsconfig.json                  ← Strict TypeScript config
├── .eslintrc.json
└── package.json
```

---

# PART 3 — DESIGN TOKENS

## CSS Custom Properties — `globals.css`
These are the single source of truth. All components reference variables, never raw values.

```css
:root {
  /* ── SURFACES ── */
  --bg:              #050507;    /* substrate base — never changes */
  --bg-grid:         #0A0C12;    /* grid line color */
  --panel:           #0D0F1A;    /* system panel surface */
  --panel-edge:      #1A1D2E;    /* panel border highlight */
  --panel-active:    #141826;    /* panel when system is active */

  /* ── TYPE ── */
  --white:           #FFFFFF;
  --white-dim:       rgba(255,255,255,0.55);
  --white-ghost:     rgba(255,255,255,0.08);
  --mono-label:      rgba(255,255,255,0.35);

  /* ── SYSTEM ACCENTS (state-bound — never use freely) ── */
  --blue:            #0066FF;    /* active data flow only */
  --blue-glow:       rgba(0,102,255,0.25);
  --blue-dim:        rgba(0,102,255,0.12);
  --amber:           #FF6B00;    /* Identifying + Processing states only */
  --amber-glow:      rgba(255,107,0,0.20);
  --green:           #00E676;    /* system status confirmation — extremely rare */
  --green-glow:      rgba(0,230,118,0.15);

  /* ── DRAGON SECTION ── */
  --dragon-bg:       #04040A;
  --dragon-accent:   #00FF94;    /* bioluminescent spine glow */
  --dragon-body:     #1A1040;    /* segment fill */

  /* ── TYPOGRAPHY SCALE ── */
  --text-display:    clamp(72px, 10vw, 140px);
  --text-h1:         clamp(48px, 6vw, 96px);
  --text-h2:         clamp(32px, 4vw, 56px);
  --text-h3:         clamp(20px, 2.5vw, 32px);
  --text-body:       clamp(15px, 1.2vw, 17px);
  --text-label:      clamp(10px, 0.9vw, 12px);
  --text-mono:       clamp(11px, 0.9vw, 13px);

  /* ── SPACING ── */
  --margin-outer:    clamp(24px, 5vw, 80px);
  --gap-section:     clamp(80px, 12vw, 200px);
  --gap-element:     clamp(16px, 2vw, 32px);

  /* ── MOTION ── */
  --ease-out:        cubic-bezier(0.16, 1, 0.3, 1);
  --ease-in-out:     cubic-bezier(0.87, 0, 0.13, 1);
  --ease-spring:     cubic-bezier(0.34, 1.56, 0.64, 1);
  --duration-fast:   0.25s;
  --duration-mid:    0.6s;
  --duration-slow:   1.2s;

  /* ── Z-INDEX STACK ── */
  --z-canvas:        1;
  --z-html-world:    10;
  --z-overlay:       100;
  --z-nav:           500;
  --z-cursor:        9000;
  --z-loader:        9999;
}
```

## TypeScript Design Token Mirror — `lib/colorSystem.ts`
```typescript
export const COLORS = {
  bg:         0x050507,
  bgGrid:     0x0A0C12,
  panel:      0x0D0F1A,
  panelEdge:  0x1A1D2E,
  white:      0xFFFFFF,
  blue:       0x0066FF,
  amber:      0xFF6B00,
  green:      0x00E676,
} as const;

// Convert hex to Three.js Color
export const toThreeColor = (hex: number) => new THREE.Color(hex);

// Get color for current system state
export const getStateColor = (state: SystemState): number => {
  switch (state) {
    case SystemState.Activating:   return COLORS.blue;
    case SystemState.Identifying:  return COLORS.amber;
    case SystemState.Routing:      return COLORS.blue;
    case SystemState.Executing:    return COLORS.blue;
    case SystemState.Processing:   return COLORS.amber;
    case SystemState.Resolved:     return COLORS.green;
    default: return COLORS.white;
  }
};
```

---

# PART 4 — TYPOGRAPHY SYSTEM

## Font Loading — `app/layout.tsx`
```typescript
// Self-hosted fonts via next/font/local
import localFont from 'next/font/local';

const suisse = localFont({
  src: [
    { path: '../public/fonts/SuisseIntl-Regular.woff2',  weight: '400' },
    { path: '../public/fonts/SuisseIntl-Medium.woff2',   weight: '500' },
    { path: '../public/fonts/SuisseIntl-Bold.woff2',     weight: '700' },
  ],
  variable: '--font-suisse',
  display: 'swap',
  preload: true,
});

const jetbrains = localFont({
  src: [{ path: '../public/fonts/JetBrainsMono-Regular.woff2', weight: '400' }],
  variable: '--font-mono',
  display: 'swap',
  preload: false, // Not above the fold
});
```

**Font Alternative if Suisse Int'l is unavailable:**
Use `Neue Haas Grotesk Display` via Adobe Fonts, or `DM Sans` from Google Fonts
as a free alternative. The x-height must be high and the letterforms must be
geometric, not humanist.

## Type Usage Rules
```
Display (--text-display):   System identity text in 3D space
                            e.g. "HASSOUN" at the Identifying state
                            Font: SuisseIntl Bold (700)
                            Letter-spacing: -0.04em
                            Color: --white, never colored

H1 (--text-h1):             Section-level system declarations
                            Font: SuisseIntl Bold (700)
                            Letter-spacing: -0.03em

H2 (--text-h2):             Subsystem labels, panel headers
                            Font: SuisseIntl Medium (500)
                            Letter-spacing: -0.01em

Label (--text-label):       Category tags, system labels
                            Font: SuisseIntl Regular (400)
                            Letter-spacing: +0.15em
                            Transform: uppercase
                            Color: --mono-label

Mono (--text-mono):         Status readouts, coordinates, counters
                            Font: JetBrains Mono (400)
                            Letter-spacing: 0
                            Color: --mono-label
```

## 3D Text (via @react-three/drei `<Text>`)
```typescript
// All 3D text uses these shared props
const TEXT_3D_BASE = {
  font: '/fonts/SuisseIntl-Bold.woff2',
  color: '#FFFFFF',
  anchorX: 'center',
  anchorY: 'middle',
  letterSpacing: -0.04,
  // Text exists slightly in front of panel surfaces
  position: [x, y, panelZ + 0.05],
};
```

---

# PART 5 — SYSTEM STATE MODEL

## Type Definition — `types/system.ts`
```typescript
export enum SystemState {
  Idle        = 'IDLE',
  Activating  = 'ACTIVATING',
  Identifying = 'IDENTIFYING',
  Routing     = 'ROUTING',
  Executing   = 'EXECUTING',
  Processing  = 'PROCESSING',
  Resolved    = 'RESOLVED',
}

export interface StateRange {
  state: SystemState;
  start: number;  // progress value [0,1]
  end:   number;
}

export interface SystemStatus {
  state:    SystemState;
  progress: number;        // global [0,1]
  local:    number;        // progress within current state [0,1]
  previous: SystemState;
}
```

## State Ranges — `lib/systemStates.ts`
```typescript
export const STATE_RANGES: StateRange[] = [
  { state: SystemState.Idle,        start: 0.00, end: 0.05 },
  { state: SystemState.Activating,  start: 0.05, end: 0.15 },
  { state: SystemState.Identifying, start: 0.15, end: 0.30 },
  { state: SystemState.Routing,     start: 0.30, end: 0.50 },
  { state: SystemState.Executing,   start: 0.50, end: 0.75 },
  { state: SystemState.Processing,  start: 0.75, end: 0.90 },
  { state: SystemState.Resolved,    start: 0.90, end: 1.00 },
];

// Given global progress [0,1], return current state + local progress
export const resolveSystemState = (progress: number): SystemStatus => {
  const range = STATE_RANGES.find(r => progress >= r.start && progress <= r.end)
    ?? STATE_RANGES[STATE_RANGES.length - 1];

  const local = (progress - range.start) / (range.end - range.start);

  return {
    state:    range.state,
    progress: progress,
    local:    Math.max(0, Math.min(1, local)),
    previous: /* derived from prev frame */ SystemState.Idle,
  };
};
```

## What Each State Renders

| State | Camera Z | Primary Visible | Accent Color | Audio |
|---|---|---|---|---|
| Idle | 45 | Substrate grid only | none | 20Hz hum |
| Activating | 35 | Grid + first panels initializing | blue dim | 60Hz hum rising |
| Identifying | 20 | Name display + identity panels | amber | tick rhythm 2Hz |
| Routing | 8 | Full topology, active traces | blue | rapid ticks |
| Executing | 0 | Execution layer + data packets | blue bright | dense clicks |
| Processing | -8 | Deep processing, amber state | amber | low resonance |
| Resolved | -5 | System stabilized, contact + projects | green brief | silence + chime |

---

# PART 6 — CAMERA SYSTEM

## Camera Path — `lib/cameraPath.ts`

The camera moves along a predefined Z-axis path with subtle X/Y drift.
Mouse adds a maximum ±2 unit offset — never overrides the path.

```typescript
export interface CameraKeyframe {
  progress: number;
  position: [number, number, number];  // [x, y, z]
  target:   [number, number, number];  // look-at point
  fov:      number;
}

export const CAMERA_PATH: CameraKeyframe[] = [
  // State: Idle — camera far back, looking at distant substrate
  { progress: 0.00, position: [0,  2, 45], target: [0, 0, 0],  fov: 60 },
  { progress: 0.05, position: [0,  2, 45], target: [0, 0, 0],  fov: 60 },

  // State: Activating — camera begins descending toward system
  { progress: 0.10, position: [0,  1, 30], target: [0, 0, 0],  fov: 58 },
  { progress: 0.15, position: [0,  0, 20], target: [0, 0, 0],  fov: 55 },

  // State: Identifying — camera slows, system declares identity
  { progress: 0.20, position: [-1, 0, 14], target: [0, 0, 0],  fov: 52 },
  { progress: 0.30, position: [0,  0,  8], target: [0, 0, 0],  fov: 50 },

  // State: Routing — camera at working distance, topology visible
  { progress: 0.40, position: [2, -1,  4], target: [0,-1, 0],  fov: 52 },
  { progress: 0.50, position: [0,  0,  0], target: [0, 0,-5],  fov: 55 },

  // State: Executing — camera inside the system
  { progress: 0.60, position: [-2, 1, -4], target: [0, 0,-10], fov: 58 },
  { progress: 0.75, position: [0,  0, -8], target: [0, 0,-15], fov: 60 },

  // State: Processing — deepest layer
  { progress: 0.82, position: [1, -1,-12], target: [0, 0,-18], fov: 55 },
  { progress: 0.90, position: [0,  0,-10], target: [0, 0,-5],  fov: 52 },

  // State: Resolved — camera pulls back to rest, system complete
  { progress: 1.00, position: [0,  2, -5], target: [0, 0, 0],  fov: 50 },
];
```

## Camera Interpolation — `components/core/SystemCamera.tsx`
```typescript
// Every frame:
// 1. Get current progress from store
// 2. Find surrounding keyframes
// 3. Lerp between them
// 4. Add mouse offset (ADDITIVE ONLY)
// 5. Apply to camera

const interpolateCameraState = (progress: number): CameraKeyframe => {
  const frames = CAMERA_PATH;
  let a = frames[0], b = frames[1];
  for (let i = 0; i < frames.length - 1; i++) {
    if (progress >= frames[i].progress && progress <= frames[i+1].progress) {
      a = frames[i]; b = frames[i+1];
      break;
    }
  }
  const t = (progress - a.progress) / (b.progress - a.progress);
  const smooth = easeInOut(t); // smoothstep
  return {
    progress,
    position: lerpVec3(a.position, b.position, smooth),
    target:   lerpVec3(a.target,   b.target,   smooth),
    fov:      lerp(a.fov, b.fov, smooth),
  };
};

// Mouse micro-influence: max ±2 units
const MOUSE_INFLUENCE = { x: 2.0, y: 1.2 };
```

---

# PART 7 — ZUSTAND STORE

## System Store — `store/systemStore.ts`
```typescript
import { create } from 'zustand';
import { SystemState, SystemStatus } from '@/types/system';
import { resolveSystemState } from '@/lib/systemStates';

interface SystemStore {
  // Core state
  progress:     number;
  status:       SystemStatus;
  cursor:       { x: number; y: number };  // normalized -1 to 1
  isLoaded:     boolean;
  audioEnabled: boolean;

  // Actions
  setProgress:     (p: number) => void;
  setCursor:       (x: number, y: number) => void;
  setLoaded:       (v: boolean) => void;
  toggleAudio:     () => void;
}

export const useSystemStore = create<SystemStore>((set, get) => ({
  progress:     0,
  status:       resolveSystemState(0),
  cursor:       { x: 0, y: 0 },
  isLoaded:     false,
  audioEnabled: false,

  setProgress: (p) => set({
    progress: p,
    status: resolveSystemState(p),
  }),
  setCursor: (x, y) => set({ cursor: { x, y } }),
  setLoaded: (v) => set({ isLoaded: v }),
  toggleAudio: () => set((s) => ({ audioEnabled: !s.audioEnabled })),
}));
```

## Project Store — `store/projectStore.ts`
```typescript
import { create } from 'zustand';
import { Project } from '@/types/project';

interface ProjectStore {
  projects:      Project[];
  activeProject: Project | null;
  modalOpen:     boolean;
  openProject:   (p: Project) => void;
  closeProject:  () => void;
}

export const useProjectStore = create<ProjectStore>((set) => ({
  projects:      [],
  activeProject: null,
  modalOpen:     false,
  openProject:   (p) => set({ activeProject: p, modalOpen: true }),
  closeProject:  () => set({ modalOpen: false }),
}));
```

---

# PART 8 — PRIMITIVE COMPONENTS SPEC

## Panel — `components/primitives/Panel.tsx`
```typescript
// A flat rectangular system panel with edge lighting
interface PanelProps {
  width:    number;
  height:   number;
  depth?:   number;   // default: 0.04 (very shallow)
  position: [number, number, number];
  rotation?: [number, number, number];
  edgeIntensity?: number;  // 0–1, default 0.3
  active?: boolean;        // brightens edge when system is active
}

// Material: MeshStandardMaterial
// Surface: COLORS.panel (#0D0F1A)
// Edge: achieved via EdgesGeometry + LineSegments with colored material
// Active edge color: lerp(dim-white, state-color, active ? 1 : 0)
```

## Trace — `components/primitives/Trace.tsx`
```typescript
// An animated data flow line between two points
interface TraceProps {
  start:   [number, number, number];
  end:     [number, number, number];
  color?:  number;    // default: COLORS.blue
  speed?:  number;    // packet travel speed, default 1.0
  active?: boolean;   // if false, line is dim and no packets animate
  width?:  number;    // line width, default 1
}

// Implementation:
// 1. Static Line from start to end — color: blue-dim
// 2. 3–5 DataPacket instances that travel along the line
// 3. Each packet is a tiny box mesh (0.06 × 0.06 × 0.06)
// 4. Packets loop: when reaching end, teleport to start with random delay
// 5. Packet glow: PointLight at packet position, intensity 0.3, distance 1
```

## DataPacket — `components/primitives/DataPacket.tsx`
```typescript
// Moves along a path from t=0 to t=1
// t driven by useRef + delta time, speed configurable
// Geometry: BoxGeometry(0.06, 0.06, 0.06)
// Material: MeshBasicMaterial color blue
// Light: PointLight at position
// Loop: t reaches 1 → reset to random t between -0.3 and 0 (stagger restart)
```

## Volume — `components/primitives/Volume.tsx`
```typescript
// An extruded rectangular form — pipeline/channel
interface VolumeProps {
  width:   number;
  height:  number;
  depth:   number;   // significant depth, unlike Panel
  position: [number, number, number];
  axis?:   'x' | 'y' | 'z';  // which axis it "runs" along
}
// Material: semi-transparent dark fill + edge definition
// Inside visible: the volume should feel hollow — use wireframe edges
// or a custom shader that shows inner geometry
```

## SystemText — `components/primitives/SystemText.tsx`
```typescript
// 3D text that exists in the environment
// Uses @react-three/drei <Text> with SuisseIntl-Bold font
// Animates in: starts at opacity 0, scale 0.95 → full
// Never flat-facing — always has slight Y rotation (0.02 to 0.05 rad)
// Position: always has Z offset from nearest panel (+ 0.05 to + 0.2)
```

---

# PART 9 — SCROLL RIG

## `components/core/ScrollRig.tsx`
```typescript
'use client';

// Creates a tall scroll container that maps scroll position → progress [0,1]
// SCROLL_HEIGHT: 600vh (adjustable)
// Uses GSAP ScrollTrigger internally
// Updates systemStore.setProgress() every scroll frame

const SCROLL_HEIGHT_VH = 600;

export const ScrollRig = ({ children }: { children: React.ReactNode }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const setProgress = useSystemStore(s => s.setProgress);

  useEffect(() => {
    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: containerRef.current,
        start:   'top top',
        end:     'bottom bottom',
        scrub:   true,
        onUpdate: (self) => {
          setProgress(self.progress);
        },
      });
    });
    return () => ctx.revert();
  }, []);

  return (
    <div ref={containerRef} style={{ height: `${SCROLL_HEIGHT_VH}vh` }}>
      {/* Canvas is fixed — scroll container only drives progress */}
      <div style={{ position: 'fixed', inset: 0 }}>
        {children}
      </div>
    </div>
  );
};
```

---

# PART 10 — ENVIRONMENT: SUBSTRATE

## `components/environment/Substrate.tsx`
The always-visible computational plane. The coordinate system of the experience.

```typescript
// A large PlaneGeometry (200 × 200 units) rotated to XZ plane
// Custom ShaderMaterial — see shaders/grid.frag
// Always at y = -0.5 (slightly below all objects)
// Reacts subtly to system activity: grid line opacity increases with progress

// ShaderMaterial uniforms:
// uProgress: float [0,1] — system progress
// uState: float (0-6 mapped from state enum)
// uTime: float — elapsed seconds (for animated packets on grid)
// uGridColor: vec3 — COLORS.bgGrid
// uBgColor: vec3 — COLORS.bg
```

## Grid Shader — `shaders/grid.frag`
```glsl
uniform float uProgress;
uniform float uTime;
uniform vec3  uGridColor;
uniform vec3  uBgColor;

varying vec2 vUv;

float grid(vec2 uv, float size) {
  vec2 lines = abs(fract(uv * size) - 0.5);
  float d = min(lines.x, lines.y);
  return 1.0 - smoothstep(0.0, 0.02, d);
}

void main() {
  // Major grid: every 1 unit
  float major = grid(vUv, 10.0) * 0.035;
  // Minor grid: every 0.25 unit (emerges with system activity)
  float minor = grid(vUv, 40.0) * 0.015 * uProgress;

  float gridStrength = major + minor;
  // Subtle pulse wave from center based on uTime
  float dist = length(vUv - 0.5);
  float pulse = sin(dist * 20.0 - uTime * 1.5) * 0.008 * uProgress;

  vec3 col = mix(uBgColor, uGridColor, gridStrength + pulse);
  gl_FragColor = vec4(col, 1.0);
}
```

---

# PART 11 — EACH STATE: VISUAL SPEC

## State: Idle (0.00–0.05)
**Camera:** far back (z=45), looking at substrate
**Visible:** substrate grid only, very dim
**Panels:** none
**Traces:** none
**Text:** none
**Atmosphere:** near total darkness. Only the grid lines hint at structure.
**Transition out:** camera begins moving forward, grid brightens slightly

## State: Activating (0.05–0.15)
**Camera:** moving from z=45 toward z=20
**Visible:** substrate + 4–6 panels appearing (opacity lerps 0→1 as camera approaches)
**Panel behavior:** panels initialize sequentially, not simultaneously.
  Each panel's `active` prop enables at a different local progress threshold.
  `panel[0]` at local=0.1, `panel[1]` at local=0.2, etc.
**Traces:** dim blue traces appear between panels, no packets yet
**Text:** system label in mono: `SYSTEM INIT` at top-left of viewport (HTML layer)
  Character-by-character reveal using `stagger: 0.04s`

## State: Identifying (0.15–0.30)
**Camera:** slows, arrives at z=8, slight left drift
**DOMINANT EVENT:** Identity declaration — "HASSOUN" appears as 3D text
  - Size: `--text-display` equivalent in 3D units (~8–10 units tall)
  - Position: center of scene, z=0, y=1
  - Reveal: scale from 0.85→1.0 + opacity 0→1 over 0.4s local progress
  - Subtitle below: `COMPUTATIONAL DESIGNER & DEVELOPER` in label style
**Panels:** identity panels flank the text (structural context)
**Accent:** amber (#FF6B00) — edge lights on panels warm
**Audio:** tick rhythm begins at 2Hz

## State: Routing (0.30–0.50)
**Camera:** moves to z=4, slight right drift
**DOMINANT EVENT:** topology reveals — routing structure becomes visible
  - Network of 8–12 panels connected by active blue traces with data packets
  - Traces animate on with stroke-draw effect (dashOffset from 1→0)
  - Each trace activates at different local progress intervals
**Text:** project category labels appear as panel headers:
  `DESIGN SYSTEMS`, `WEB EXPERIENCES`, `MOTION`, `3D`
**Packets:** data packets travel all active traces at full speed
**Accent:** blue (#0066FF) — all traces and packet glows

## State: Executing (0.50–0.75)
**Camera:** passes through z=0 into negative Z space
**DOMINANT EVENT:** project work is displayed
  - 4 project panels arranged in the environment (not a grid — spatial arrangement)
  - Each panel holds a project thumbnail as a texture
  - Panels have depth (Volume, not flat Panel)
  - Hover: panel edge brightens, a 3D label slides out
**The Dragon Interlude:** at progress ~0.62, the camera is in deep system space.
  This is when the DragonCanvas HTML overlay activates (see Part 12).
  Canvas covers full viewport. Dragon exists in the system space metaphorically.
**Traces:** densest here — the system is at maximum activity

## State: Processing (0.75–0.90)
**Camera:** z=-8 to z=-12 — deepest layer
**DOMINANT EVENT:** abstract deep processing
  - Volume objects — large extruded channel forms
  - Amber light washes — the system is in a different mode
  - Processing readouts in mono text: scrolling system data (can be fake)
    `> COMPILING DEPENDENCIES...`, `> OPTIMIZING RENDER PIPELINE...`
  - Amber accent: panel edges, volume interiors
**Motion:** data packets move faster, traces pulse
**Feel:** most intense, most abstract. User feels inside the machine.

## State: Resolved (0.90–1.00)
**Camera:** pulls back to z=-5, elevates slightly
**DOMINANT EVENT:** system returns to stable state
  - Green flash on all panel edges (single 300ms pulse, then white)
  - Contact information appears as a centered 3D display:
    `GET IN TOUCH` at h2 scale, email below at body scale
  - All traces dim to idle state
  - Packets stop and disappear
**Text:** `SYSTEM RESOLVED` in mono, bottom-left
**Audio:** silence, then single clean chime tone
**Interaction:** email address is clickable (raycasting on the 3D text mesh)

---

# PART 12 — DRAGON SECTION FULL SPEC

## Concept
During the Executing state (progress ~0.55–0.70), a full-viewport HTML canvas
activates over the Three.js scene. A dragon entity inhabits this space.
It follows the cursor via spring physics. Its body displaces typography (the
identity text rendered as particles). As the user scrolls past this range,
the canvas fades out and the Three.js scene resumes full visibility.

## Activation Logic — `components/interactive/DragonCanvas.tsx`
```typescript
// Listen to systemStore.progress
// When progress enters [0.55, 0.70]: fade canvas IN (opacity 0→1, 0.8s)
// When progress exits this range: fade canvas OUT (opacity 1→0, 0.8s)
// Canvas pointer-events: 'all' when active, 'none' when inactive
```

## Dragon Physics — `components/interactive/DragonSpine.ts`
```typescript
class DragonSpine {
  private readonly SEGMENTS = 30;
  private readonly SEGMENT_LENGTH = 16;  // px
  private readonly HEAD_STIFFNESS = 0.10;  // how fast head chases cursor
  private readonly HEAD_DAMPING   = 0.80;  // velocity retention per frame

  private segments: Array<{ x: number; y: number }> = [];
  private velocities: Array<{ vx: number; vy: number }> = [];
  private targetX = 0;
  private targetY = 0;

  constructor(startX: number, startY: number) {
    for (let i = 0; i < this.SEGMENTS; i++) {
      this.segments.push({ x: startX, y: startY + i * this.SEGMENT_LENGTH });
      this.velocities.push({ vx: 0, vy: 0 });
    }
  }

  setTarget(x: number, y: number) {
    this.targetX = x;
    this.targetY = y;
  }

  update() {
    // Step 1: Move head toward target with spring
    const head = this.segments[0];
    const vel  = this.velocities[0];
    vel.vx += (this.targetX - head.x) * this.HEAD_STIFFNESS;
    vel.vy += (this.targetY - head.y) * this.HEAD_STIFFNESS;
    vel.vx *= this.HEAD_DAMPING;
    vel.vy *= this.HEAD_DAMPING;
    head.x += vel.vx;
    head.y += vel.vy;

    // Step 2: Constrain each segment to follow the one before it
    for (let i = 1; i < this.SEGMENTS; i++) {
      const prev = this.segments[i - 1];
      const curr = this.segments[i];
      const dx = curr.x - prev.x;
      const dy = curr.y - prev.y;
      const dist = Math.sqrt(dx * dx + dy * dy) || 0.001;
      // Push curr to be exactly SEGMENT_LENGTH away from prev
      const ratio = (dist - this.SEGMENT_LENGTH) / dist;
      curr.x -= dx * ratio * 0.5;
      curr.y -= dy * ratio * 0.5;
    }

    // Step 3: Tail sway — sinusoidal lateral force on last 8 segments
    const speed = Math.sqrt(vel.vx ** 2 + vel.vy ** 2);
    const swayTime = Date.now() / 1000;
    for (let i = this.SEGMENTS - 8; i < this.SEGMENTS; i++) {
      const t = (i - (this.SEGMENTS - 8)) / 8;
      const swayAmp = speed * 0.4 * t;
      this.segments[i].x += Math.sin(swayTime * 2.5 + i * 0.4) * swayAmp;
    }
  }

  getSegments() { return this.segments; }
  getHeadSpeed() {
    const v = this.velocities[0];
    return Math.sqrt(v.vx ** 2 + v.vy ** 2);
  }
}
```

## Dragon Renderer — `components/interactive/DragonRenderer.ts`
```typescript
class DragonRenderer {
  // Draws the dragon each frame onto a 2D canvas context

  drawDragon(ctx: CanvasRenderingContext2D, spine: DragonSpine) {
    const segments = spine.getSegments();
    const speed = spine.getHeadSpeed();

    // ── Spine glow line ──
    ctx.beginPath();
    ctx.moveTo(segments[0].x, segments[0].y);
    for (let i = 1; i < segments.length; i++) {
      // Smooth curve through segments via midpoints
      const mx = (segments[i].x + segments[i-1].x) / 2;
      const my = (segments[i].y + segments[i-1].y) / 2;
      ctx.quadraticCurveTo(segments[i-1].x, segments[i-1].y, mx, my);
    }
    ctx.strokeStyle = `rgba(0, 255, 148, ${0.15 + speed * 0.05})`; // --dragon-accent
    ctx.lineWidth = 2;
    ctx.shadowColor  = '#00FF94';
    ctx.shadowBlur   = 12 + speed * 2;
    ctx.stroke();
    ctx.shadowBlur = 0;

    // ── Body segments ──
    for (let i = segments.length - 1; i >= 0; i--) {
      const t = i / segments.length;
      // Taper: widest at segment 6 (shoulders), taper toward head and tail
      const shoulderCurve = Math.exp(-Math.pow((i - 6) / 8, 2));
      const w = 4 + shoulderCurve * 14;

      const prev = segments[i > 0 ? i - 1 : 0];
      const angle = Math.atan2(segments[i].y - prev.y, segments[i].x - prev.x);

      ctx.save();
      ctx.translate(segments[i].x, segments[i].y);
      ctx.rotate(angle + Math.PI / 2);

      // Segment body
      ctx.beginPath();
      ctx.ellipse(0, 0, w * 0.5, w, 0, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(26, 16, 64, ${0.6 + shoulderCurve * 0.3})`; // --dragon-body
      ctx.fill();

      // Rim light — bioluminescent green, intensity by speed
      ctx.strokeStyle = `rgba(0, 255, 148, ${0.1 + speed * 0.03})`;
      ctx.lineWidth = 0.8;
      ctx.stroke();

      ctx.restore();
    }

    // ── Eyes ──
    const head = segments[0];
    const neck = segments[1];
    const angle = Math.atan2(head.y - neck.y, head.x - neck.x);
    const eyeOffset = 5;
    for (const side of [-1, 1]) {
      const ex = head.x + Math.cos(angle + side * 1.4) * eyeOffset;
      const ey = head.y + Math.sin(angle + side * 1.4) * eyeOffset;
      // White of eye
      ctx.beginPath();
      ctx.arc(ex, ey, 2.5, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(255,255,255,0.9)';
      ctx.fill();
      // Pupil (looks toward cursor/target)
      ctx.beginPath();
      ctx.arc(
        ex + Math.cos(angle) * 0.8,
        ey + Math.sin(angle) * 0.8,
        1.2, 0, Math.PI * 2
      );
      ctx.fillStyle = '#04040A';
      ctx.fill();
    }

    // ── Wing fins (segments 4–8) ──
    for (const wingIdx of [4, 6]) {
      const s = segments[wingIdx];
      const p = segments[wingIdx - 1];
      const bodyAngle = Math.atan2(s.y - p.y, s.x - p.x);

      for (const side of [-1, 1]) {
        ctx.save();
        ctx.translate(s.x, s.y);
        ctx.rotate(bodyAngle + side * 1.1);

        // Fin as bezier
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.bezierCurveTo(
          side * 20, -15,
          side * 35, -5,
          side * 28, 10
        );
        ctx.bezierCurveTo(side * 20, 20, side * 8, 8, 0, 0);
        ctx.fillStyle   = 'rgba(26, 16, 64, 0.5)';
        ctx.strokeStyle = `rgba(0, 255, 148, 0.15)`;
        ctx.lineWidth   = 0.8;
        ctx.fill();
        ctx.stroke();
        ctx.restore();
      }
    }
  }
}
```

## Text Particle System — `components/interactive/TextParticles.ts`
```typescript
interface Particle {
  x:       number;
  y:       number;
  originX: number;
  originY: number;
  vx:      number;
  vy:      number;
}

class TextParticles {
  private particles: Particle[] = [];
  private readonly INFLUENCE_RADIUS = 100;  // px
  private readonly PUSH_STRENGTH    = 180;
  private readonly RETURN_SPRING    = 0.07;
  private readonly DAMPING          = 0.86;

  // Call once on init: rasterizes text onto offscreen canvas
  // then samples non-transparent pixels as particle origins
  init(text: string, fontSize: number, canvasW: number, canvasH: number) {
    const offscreen = new OffscreenCanvas(canvasW, canvasH);
    const ctx = offscreen.getContext('2d')!;
    ctx.fillStyle = '#FFFFFF';
    ctx.font = `700 ${fontSize}px "SuisseIntl", sans-serif`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(text, canvasW / 2, canvasH / 2);

    const data = ctx.getImageData(0, 0, canvasW, canvasH).data;
    const SAMPLE_STEP = 3;  // sample every 3px

    for (let y = 0; y < canvasH; y += SAMPLE_STEP) {
      for (let x = 0; x < canvasW; x += SAMPLE_STEP) {
        const i = (y * canvasW + x) * 4;
        if (data[i + 3] > 128) {  // non-transparent pixel
          this.particles.push({
            x: x, y: y,
            originX: x, originY: y,
            vx: 0, vy: 0,
          });
        }
      }
    }
  }

  update(dragonHeadX: number, dragonHeadY: number) {
    for (const p of this.particles) {
      const dx = p.x - dragonHeadX;
      const dy = p.y - dragonHeadY;
      const dist = Math.sqrt(dx * dx + dy * dy) || 0.001;

      if (dist < this.INFLUENCE_RADIUS) {
        const force = Math.pow(1 - dist / this.INFLUENCE_RADIUS, 2)
                    * this.PUSH_STRENGTH;
        p.vx += (dx / dist) * force * 0.016; // * deltaTime approx
        p.vy += (dy / dist) * force * 0.016;
      }

      // Spring back to origin
      p.vx += (p.originX - p.x) * this.RETURN_SPRING;
      p.vy += (p.originY - p.y) * this.RETURN_SPRING;

      // Damping
      p.vx *= this.DAMPING;
      p.vy *= this.DAMPING;

      p.x += p.vx;
      p.y += p.vy;
    }
  }

  draw(ctx: CanvasRenderingContext2D) {
    ctx.fillStyle = 'rgba(255, 255, 255, 0.85)';
    for (const p of this.particles) {
      ctx.fillRect(p.x, p.y, 1.5, 1.5);
    }
  }

  getParticleCount() { return this.particles.length; }
}
```

## Dragon Canvas Component — `components/interactive/DragonCanvas.tsx`
```typescript
'use client';

export const DragonCanvas = () => {
  const canvasRef    = useRef<HTMLCanvasElement>(null);
  const spineRef     = useRef<DragonSpine | null>(null);
  const rendererRef  = useRef<DragonRenderer | null>(null);
  const particlesRef = useRef<TextParticles | null>(null);
  const rafRef       = useRef<number>(0);
  const progress     = useSystemStore(s => s.progress);

  const isActive = progress >= 0.55 && progress <= 0.70;

  useEffect(() => {
    const canvas = canvasRef.current!;
    const W = window.innerWidth;
    const H = window.innerHeight;
    canvas.width  = W * window.devicePixelRatio;
    canvas.height = H * window.devicePixelRatio;
    canvas.style.width  = `${W}px`;
    canvas.style.height = `${H}px`;

    const ctx = canvas.getContext('2d')!;
    ctx.scale(window.devicePixelRatio, window.devicePixelRatio);

    spineRef.current    = new DragonSpine(W / 2, H / 2);
    rendererRef.current = new DragonRenderer();
    particlesRef.current = new TextParticles();
    particlesRef.current.init('HASSOUN', Math.min(W * 0.12, 140), W, H);

    const handleMouseMove = (e: MouseEvent) => {
      spineRef.current?.setTarget(e.clientX, e.clientY);
    };
    window.addEventListener('mousemove', handleMouseMove);

    const loop = () => {
      ctx.clearRect(0, 0, W, H);
      ctx.fillStyle = 'rgba(4, 4, 10, 0.18)'; // slight trail
      ctx.fillRect(0, 0, W, H);

      spineRef.current!.update();
      const head = spineRef.current!.getSegments()[0];
      particlesRef.current!.update(head.x, head.y);
      particlesRef.current!.draw(ctx);
      rendererRef.current!.drawDragon(ctx, spineRef.current!);

      rafRef.current = requestAnimationFrame(loop);
    };
    rafRef.current = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(rafRef.current);
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position:      'fixed',
        inset:          0,
        zIndex:         'var(--z-html-world)',
        opacity:        isActive ? 1 : 0,
        pointerEvents:  isActive ? 'all' : 'none',
        transition:    'opacity 0.8s cubic-bezier(0.16, 1, 0.3, 1)',
        background:    'var(--dragon-bg)',
      }}
    />
  );
};
```

---

# PART 13 — UI COMPONENTS SPEC

## Navigation — `components/ui/Navigation.tsx`
```typescript
// Always floating — no background panel, no border
// Position: fixed, top-0, full width, z-index: --z-nav
// Left: "MH" logotype in SuisseIntl Bold 14px, tracking 0.1em
// Right: system state label in JetBrains Mono 11px, color --mono-label
//   e.g. "> ROUTING" — updates as state changes
// Audio toggle: minimal — a single dot, filled/outlined
// No menu button — single-page experience has no navigation items
// Color: white always — contrast maintained by the near-black base

// State label format:
const STATE_LABELS: Record<SystemState, string> = {
  [SystemState.Idle]:        '> STANDBY',
  [SystemState.Activating]:  '> INIT',
  [SystemState.Identifying]: '> IDENTIFY',
  [SystemState.Routing]:     '> ROUTING',
  [SystemState.Executing]:   '> EXECUTING',
  [SystemState.Processing]:  '> PROCESSING',
  [SystemState.Resolved]:    '> RESOLVED',
};
```

## Status Bar — `components/ui/StatusBar.tsx`
```typescript
// Fixed bottom bar, full width, height 32px
// Background: none (transparent)
// Left: system progress readout in mono: "000.000 / 1.000"
//   Updates every frame — shows exact progress value
// Center: horizontal rule (1px, rgba(255,255,255,0.08))... no, actually:
//   Center: nothing. The emptiness is intentional.
// Right: "SCROLL" label in mono when progress < 0.05
//        "↑↓"    label in mono when progress 0.05–0.95
//        "RESOLVED" in green mono when progress > 0.95
// Corner marks: "+" at bottom-left and bottom-right
//   These are not interactive. Pure grid reference marks.
```

## Cursor — `components/ui/Cursor.tsx`
```typescript
// Custom cursor replaces default OS cursor
// Default state: 8px circle, white, 1px border, fill transparent
// On hoverable element: expands to 24px circle, fill rgba(255,255,255,0.1)
// On active/clicking: scale to 0.6
// Speed: cursor dot at 1:1 (no lag)
//        circle follower: lerp factor 0.12 (slight lag)
// Context states:
//   'default':  small dot
//   'hover':    expanded ring
//   'drag':     filled square
//   'view':     ring + text "VIEW" at 9px inside
// Apply cursor: 'none' globally, render the custom cursor instead
```

## Loader — `components/ui/Loader.tsx`
```typescript
// Full screen, z-index: --z-loader
// Background: #050507
// Center: "MH" logotype
// Below logotype: progress bar — 1px line, 200px wide, fills left to right
// Progress driven by Three.js LoadingManager onProgress callback
// On complete: fade out (opacity 1→0) over 0.6s, then unmount
// NO spinner. NO percentage counter. NO loading text.
```

## Project Modal — `components/ui/ProjectModal.tsx`
```typescript
// Triggered by clicking a project panel in ExecutingState
// Overlay: dark panel slides up from bottom (translateY 100%→0)
// Content: full project details, images, tech stack, link
// Close: ESC or X button, panel slides back down
// Background: stays visible but dimmed (Three.js canvas continues)
// This is the only component with significant copy content
```

---

# PART 14 — PROJECT DATA

## Type — `types/project.ts`
```typescript
export interface Project {
  id:          string;
  title:       string;
  client:      string;       // real client name if applicable
  year:        number;
  category:    string[];     // e.g. ['DESIGN', 'WEB', '3D']
  description: string;       // 1 sentence only
  thumbnail:   string;       // path to /public/projects/
  url?:        string;
  tech:        string[];     // e.g. ['Next.js', 'Three.js', 'GSAP']
}
```

## Data — `lib/projectData.ts`
```typescript
export const PROJECTS: Project[] = [
  {
    id:          'project-01',
    title:       'PROJECT TITLE ONE',      // ← replace with real title
    client:      'CLIENT NAME',
    year:         2025,
    category:    ['DESIGN', 'WEB'],
    description: 'One sentence. What it does, not what it is.',
    thumbnail:   '/projects/project-01.jpg',
    url:          'https://example.com',
    tech:        ['Next.js', 'GSAP', 'Figma'],
  },
  // ... add 3 more projects following exact same structure
];
```

---

# PART 15 — AUDIO ENGINE

## `lib/audioEngine.ts`
```typescript
import * as Tone from 'tone';

// System hum — continuous low frequency, intensity maps to progress
let hum: Tone.Oscillator | null = null;
let filter: Tone.Filter | null = null;

export const initAudio = async () => {
  await Tone.start();  // requires user gesture (audio toggle button)

  filter = new Tone.Filter({ frequency: 200, type: 'lowpass' }).toDestination();
  hum    = new Tone.Oscillator({ frequency: 40, type: 'sawtooth' }).connect(filter);
  hum.start();
};

// Call every frame with current progress value
export const updateAudio = (progress: number, state: SystemState) => {
  if (!hum || !filter) return;

  // Hum frequency: 40Hz → 120Hz as system activates
  hum.frequency.rampTo(40 + progress * 80, 0.5);

  // Filter cutoff: opens with system activity
  filter.frequency.rampTo(100 + progress * 800, 0.3);

  // Volume: near silence at idle, rises with progress
  Tone.getDestination().volume.rampTo(-30 + progress * 20, 0.2);
};

// One-shot events
export const playTick = () => {
  const synth = new Tone.MetalSynth({
    frequency: 800, envelope: { attack: 0, decay: 0.02, release: 0.01 }
  }).toDestination();
  synth.triggerAttackRelease('32n');
};

export const playResolveChime = () => {
  const synth = new Tone.Synth({
    oscillator: { type: 'triangle' },
    envelope: { attack: 0.01, decay: 0.4, sustain: 0.2, release: 1.5 }
  }).toDestination();
  synth.triggerAttackRelease('C5', '2n');
};
```

---

# PART 16 — POST-PROCESSING

## `components/postprocessing/Effects.tsx`
```typescript
import { EffectComposer, Bloom, DepthOfField, Vignette } from '@react-three/postprocessing';
import { BlendFunction } from 'postprocessing';

export const Effects = () => {
  const progress = useSystemStore(s => s.progress);

  return (
    <EffectComposer>
      {/* Bloom: ONLY on edge geometry and trace lines
          Not global bloom — use selection layer if possible,
          or keep luminanceThreshold HIGH so only bright edges bloom */}
      <Bloom
        intensity={0.4 + progress * 0.3}
        luminanceThreshold={0.85}     // only very bright elements bloom
        luminanceSmoothing={0.2}
        mipmapBlur
      />

      {/* Depth of Field: subtle, activates in Processing state */}
      <DepthOfField
        focusDistance={0.02}
        focalLength={0.015}
        bokehScale={progress > 0.75 ? 1.5 : 0}
      />

      {/* Vignette: always present, subtle */}
      <Vignette
        offset={0.3}
        darkness={0.5}
        blendFunction={BlendFunction.NORMAL}
      />
    </EffectComposer>
  );
};
```

---

# PART 17 — NEXT.JS CONFIG

## `next.config.ts`
```typescript
import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  // Webpack config to import GLSL shaders as strings
  webpack: (config) => {
    config.module.rules.push({
      test: /\.(glsl|vert|frag)$/,
      type: 'asset/source',
    });
    return config;
  },

  // Experimental: enable Web Workers for particle system
  experimental: {
    workerThreads: false, // Vercel compatible
  },
};

export default nextConfig;
```

## `types/global.d.ts`
```typescript
// Allow importing GLSL files
declare module '*.vert' { const src: string; export default src; }
declare module '*.frag' { const src: string; export default src; }
declare module '*.glsl' { const src: string; export default src; }
```

---

# PART 18 — MOTION CONSTANTS

## `lib/motionConfig.ts`
```typescript
// All animation values live here — never hardcode in components

export const MOTION = {
  // Easing functions
  easeOut:     [0.16, 1, 0.3, 1] as const,
  easeInOut:   [0.87, 0, 0.13, 1] as const,
  easeSpring:  [0.34, 1.56, 0.64, 1] as const,

  // Durations (seconds)
  fast:   0.25,
  mid:    0.60,
  slow:   1.20,
  loader: 0.60,

  // Three.js lerp factors (per frame, at 60fps)
  cameraLerp:  0.05,    // camera position smoothing
  mouseLerp:   0.08,    // mouse offset smoothing
  colorLerp:   0.03,    // color transition speed

  // GSAP ScrollTrigger scrub
  scrollScrub: true,    // true = smooth scrub

  // Stagger delays
  charStagger:  0.04,   // character-by-character text reveals
  lineStagger:  0.18,   // line-by-line reveals
  panelStagger: 0.12,   // panel activation sequence

  // Dragon
  dragonHeadStiffness: 0.10,
  dragonDamping:       0.80,
  particleReturnSpring: 0.07,
  particleDamping:     0.86,
  particleInfluenceRadius: 100,
  particlePushStrength: 180,
};
```

---

# PART 19 — PHASE-BY-PHASE BUILD PLAN

Each phase is atomic. Give the AI this document + phase number. Do not mix phases.

---

## ▶ PHASE 1 — Project Scaffold & Design Foundation

**Duration estimate:** 2–3 hours
**What gets built:**
- Next.js project initialized with exact dependencies from Part 1
- Complete folder structure from Part 2 (all files as empty stubs)
- CSS design tokens from Part 3 in `globals.css`
- Typography system: font files loaded, CSS variables set
- `tsconfig.json` with strict mode
- `next.config.ts` with shader loader
- All type definitions from `types/` folder
- All store files (zustand) with full implementation
- `lib/systemStates.ts` — state enum and resolver
- `lib/motionConfig.ts` — all constants
- `lib/colorSystem.ts` — color constants
- `lib/cameraPath.ts` — full keyframe array
- `lib/projectData.ts` — 4 placeholder projects

**Acceptance criteria:**
- `npm run dev` starts with no TypeScript errors
- Browser shows a black screen (no canvas yet — expected)
- All imports resolve correctly
- All design tokens visible in browser DevTools as CSS variables

**AI Prompt:**
> "Read the attached blueprint document. Implement PHASE 1 exactly.
> Create the Next.js project with all dependencies, folder structure,
> type definitions, zustand stores, and lib files as specified.
> Create empty stub files for all components (just exports, no implementation).
> Apply all CSS tokens to globals.css. Stop when Phase 1 acceptance criteria pass."

---

## ▶ PHASE 2 — Scroll Rig + Core Architecture

**Duration estimate:** 2–3 hours
**What gets built:**
- `ScrollRig.tsx` — full implementation from Part 9
- `SystemState.tsx` — reads progress, outputs state enum
- Main `page.tsx` — mounts the scroll rig structure
- `app/layout.tsx` — fonts, metadata, html/body setup
- `globals.css` — CSS reset, cursor:none on body, base typography styles
- `hooks/useScrollProgress.ts`
- `hooks/useSystemProgress.ts`
- `hooks/useSystemState.ts`
- `hooks/useCursorPosition.ts`

**At end of phase:** browser shows a tall scrollable page.
Scrolling updates the progress value (verify via console.log).
State enum updates at correct thresholds.

**AI Prompt:**
> "Read the attached blueprint document. Implement PHASE 2.
> Build the ScrollRig, system state resolver, and all hooks.
> The page should be scrollable and the progress value [0,1]
> should update correctly on scroll. Log state changes to console for verification.
> No visual output yet — only the data layer."

---

## ▶ PHASE 3 — Three.js Canvas + Camera System

**Duration estimate:** 3–4 hours
**What gets built:**
- `Experience.tsx` — R3F Canvas setup with correct renderer settings
  - `gl={{ antialias: true, alpha: false, powerPreference: 'high-performance' }}`
  - `camera={{ fov: 60, near: 0.1, far: 200 }}`
  - `dpr={[1, 2]}`
- `SystemCamera.tsx` — full implementation from Part 6
  - Camera path interpolation
  - Mouse micro-influence
  - Reads from zustand on every frame
- `Substrate.tsx` — grid plane, no shader yet (use solid dark color)
- `AmbientSystem.tsx` — placeholder only
- First render: black background, grid plane visible, camera moves with scroll
- `Cursor.tsx` — custom cursor HTML overlay (simple version first)

**At end of phase:** scrolling moves the camera through 3D space. Grid visible.
Camera path follows the keyframes from `lib/cameraPath.ts`.

**AI Prompt:**
> "Read the attached blueprint document. Implement PHASE 3.
> Set up the React Three Fiber canvas and implement the full camera system.
> Camera must interpolate through the keyframe path from cameraPath.ts as
> the user scrolls. Add mouse micro-influence. Mount a placeholder Substrate
> (just a dark plane for now). Show a custom cursor HTML overlay.
> Verify: scrolling moves camera, mouse slightly tilts the view."

---

## ▶ PHASE 4 — Environment: Substrate Shader + Grid

**Duration estimate:** 2–3 hours
**What gets built:**
- `shaders/grid.vert` and `shaders/grid.frag` — full shader from Part 10
- `GridMaterial.tsx` — ShaderMaterial with all uniforms
- `Substrate.tsx` — updated to use GridMaterial
- Shader uniforms connected to zustand progress
- uTime driven by `useFrame` clock

**At end of phase:** grid plane shows the custom grid shader.
Grid subtly reacts to scroll progress (minor grid lines fade in with activity).

**AI Prompt:**
> "Read the attached blueprint document. Implement PHASE 4.
> Write the GLSL grid shaders and apply them to the Substrate plane.
> Connect all uniforms to zustand progress and Three.js clock.
> The grid should be subtle — barely visible at rest, slightly more active
> with scroll progress."

---

## ▶ PHASE 5 — Primitive Components

**Duration estimate:** 3–4 hours
**What gets built:**
- `Panel.tsx` — full implementation from Part 8
- `Trace.tsx` — full implementation from Part 8
- `DataPacket.tsx` — full implementation from Part 8
- `Volume.tsx` — full implementation from Part 8
- `SystemText.tsx` — full implementation from Part 8
- `shaders/panel.vert + panel.frag` — edge lighting shader
- `shaders/trace.vert + trace.frag` — animated trace shader

**At end of phase:** individual primitive components work in isolation.
Create a temporary test scene with 2 panels, 1 trace, some text to verify visuals.

**AI Prompt:**
> "Read the attached blueprint document. Implement PHASE 5.
> Build all primitive 3D components: Panel, Trace, DataPacket, Volume, SystemText.
> Write the GLSL shaders for panel edge lighting and animated traces.
> Create a temporary test scene in Experience.tsx that shows one of each primitive.
> Verify each component renders correctly before proceeding."

---

## ▶ PHASE 6 — System State Layers (All 7 States)

**Duration estimate:** 5–7 hours
**What gets built:**
- All 7 state components from `components/states/`
- Each state assembled from primitives (Panel, Trace, Volume, SystemText)
- State components mount/unmount based on progress range
- Fade in/out transitions between states
- State-specific accent colors applied to relevant primitives

**Ordering:** Build in this exact sequence:
1. IdleState (simplest — grid only)
2. ActivatingState (panels appearing)
3. IdentifyingState (the identity reveal — most important visually)
4. RoutingState (topology and traces)
5. ExecutingState (project panels — add texture loading)
6. ProcessingState (volume objects, amber)
7. ResolvedState (contact panel, green flash)

**At end of phase:** scrolling from 0→1 traverses all states with correct visuals.

**AI Prompt:**
> "Read the attached blueprint document. Implement PHASE 6.
> Build all 7 state components in the exact order specified.
> Each state must: (1) only be active in its progress range,
> (2) use state-specific colors from colorSystem.ts,
> (3) fade in/out correctly,
> (4) use only Panel, Trace, Volume, and SystemText primitives.
> Build one state at a time and test each before moving to the next."

---

## ▶ PHASE 7 — UI Layer: Nav, Status Bar, Cursor

**Duration estimate:** 2–3 hours
**What gets built:**
- `Navigation.tsx` — full implementation from Part 13
- `StatusBar.tsx` — full implementation from Part 13
- `Cursor.tsx` — full implementation with all states from Part 13
- `SystemOverlay.tsx` — HTML container for all UI elements
- Progress counter that reads from zustand
- State label that updates from zustand

**At end of phase:** floating nav with state label, bottom status bar with
progress readout, custom cursor tracking mouse position.

**AI Prompt:**
> "Read the attached blueprint document. Implement PHASE 7.
> Build the floating navigation, status bar, and custom cursor.
> The state label in the nav must update as scroll changes system state.
> The progress readout must show the exact [0,1] value in mono font.
> Cursor must replace the OS cursor globally."

---

## ▶ PHASE 8 — Loader + Project Modal

**Duration estimate:** 2–3 hours
**What gets built:**
- `Loader.tsx` — full implementation from Part 13
- Loading manager connected to Three.js asset loading
- `ProjectModal.tsx` — slide-up overlay for project details
- Raycasting on project panels to trigger modal
- `projectStore.ts` connected to modal state

**At end of phase:** project panels are clickable, modal opens/closes,
initial loader fades out after assets loaded.

**AI Prompt:**
> "Read the attached blueprint document. Implement PHASE 8.
> Build the initial loader screen (fades out after Three.js assets load)
> and the project modal (slides up when a project panel is clicked).
> Use raycasting from @react-three/drei's onClick for panel interaction."

---

## ▶ PHASE 9 — Dragon Canvas Section

**Duration estimate:** 4–5 hours
**What gets built:**
- `DragonSpine.ts` — full spine physics from Part 12
- `DragonRenderer.ts` — full canvas drawing from Part 12
- `TextParticles.ts` — full particle system from Part 12
- `DragonCanvas.tsx` — component with activation logic from Part 12
- Mobile fallback: autonomous figure-8 path at reduced frame rate

**At end of phase:** at ~55–70% scroll progress, the dragon canvas activates
over the 3D scene. Dragon follows mouse. "HASSOUN" text displaces under dragon.

**AI Prompt:**
> "Read the attached blueprint document. Implement PHASE 9.
> Build the complete dragon canvas system including spine physics,
> canvas renderer, and text particle displacement.
> The canvas must activate at progress 0.55–0.70 with fade transitions.
> Mobile fallback: dragon follows an autonomous figure-8 path.
> Test: dragon spine must lag realistically behind cursor,
> text particles must scatter and return smoothly."

---

## ▶ PHASE 10 — Audio Engine

**Duration estimate:** 2–3 hours
**What gets built:**
- `lib/audioEngine.ts` — full Tone.js implementation from Part 15
- `hooks/useAudio.ts`
- Audio toggle button in Navigation
- `updateAudio()` called from main useFrame loop
- State-specific audio events (tick on panel activation, chime on Resolved)

**At end of phase:** scrolling changes the audio character.
Audio requires user gesture to start (audio toggle button click).

**AI Prompt:**
> "Read the attached blueprint document. Implement PHASE 10.
> Build the Tone.js audio engine. System hum frequency and filter
> must map to scroll progress. Add tick sounds on state transitions.
> Add chime on Resolved state. Audio starts only after user toggles it.
> No audio autoplays."

---

## ▶ PHASE 11 — Post-Processing Effects

**Duration estimate:** 1–2 hours
**What gets built:**
- `Effects.tsx` — full implementation from Part 16
- Bloom (edges only — high luminanceThreshold)
- Depth of field (Processing state only)
- Vignette (always on, subtle)

**AI Prompt:**
> "Read the attached blueprint document. Implement PHASE 11.
> Add the post-processing stack from Part 16 using @react-three/postprocessing.
> Bloom luminanceThreshold must be 0.85 — only very bright elements bloom.
> DoF activates only in Processing state. Vignette is always subtle."

---

## ▶ PHASE 12 — Performance Pass

**Duration estimate:** 3–4 hours
**What gets built:**
- `IntersectionObserver` for state components (only render when in progress range)
- Three.js `InstancedMesh` for DataPackets (currently individual meshes)
- Frustum culling verification — non-visible objects not drawn
- Draw call audit — target: `< 100 draw calls` at any point
- FPS validation: must hold `60fps` on mid-range hardware
- `React.memo` on state components that don't change often
- `useRef` for all animation values (avoid re-renders)

**AI Prompt:**
> "Read the attached blueprint document. Implement PHASE 12.
> Audit and optimize the experience for performance.
> Replace individual DataPacket meshes with InstancedMesh.
> Ensure state components only render within their progress range.
> Run the Three.js renderer stats panel and verify draw calls are under 100.
> Target: stable 60fps on a mid-range laptop."

---

## ▶ PHASE 13 — Accessibility + Reduced Motion

**Duration estimate:** 1–2 hours
**What gets built:**
- `prefers-reduced-motion` media query handling
  - When active: camera stays still (no scroll-driven camera movement)
  - When active: state changes are instant (no easing transitions)
  - When active: dragon is disabled entirely
  - When active: audio engine does not start
- All canvas sections: `aria-hidden="true"` `role="presentation"`
- Dragon canvas: `aria-label="Interactive decoration"`
- Project modal: focus trap when open
- All clickable 3D elements: keyboard accessible alternative (skip links)
- Color contrast: all HTML text verified at WCAG AA

**AI Prompt:**
> "Read the attached blueprint document. Implement PHASE 13.
> Add prefers-reduced-motion support: when active, disable camera traversal,
> dragon canvas, and audio. All canvas elements get aria-hidden.
> Add keyboard skip navigation for the project cards.
> Verify all HTML text meets WCAG AA contrast."

---

## ▶ PHASE 14 — Polish Pass

**Duration estimate:** 3–4 hours
**What gets built:**
- Motion curve review: every transition re-evaluated for feel
- Type size review at multiple viewport widths
- Color intensity review in dark context (check on dim laptop screen)
- All `console.log` debug statements removed
- `leva` dev panel removed
- `stats.js` FPS monitor removed from production
- Environment variable: `NEXT_PUBLIC_DEV_MODE=false`
- Browser QA: Chrome, Firefox, Safari
- Mobile layout: canvas scales correctly, UI readable
- Scroll behavior on iOS Safari (lenis or native scroll fix)

**AI Prompt:**
> "Read the attached blueprint document. Implement PHASE 14.
> Remove all debug tooling (leva, stats.js, console.logs).
> Verify all motion curves feel right by re-checking motionConfig.ts values.
> Fix any Safari-specific WebGL issues. Ensure mobile layout is correct.
> This is the final polish pass — nothing should look wrong."

---

## ▶ PHASE 15 — Deployment

**Duration estimate:** 1–2 hours
**What gets built:**
- Vercel project setup and first deployment
- Environment variables configured in Vercel dashboard
- `next.config.ts` — production image optimization
- `robots.txt` and `sitemap.xml`
- Open Graph meta tags for social sharing
- Google Analytics or Plausible analytics integration
- Domain configuration

**`app/layout.tsx` metadata:**
```typescript
export const metadata: Metadata = {
  title:       'Mohammed Hassoun — Computational Designer & Developer',
  description: 'A camera-driven traversal through the internal layers of a computational system.',
  openGraph: {
    title:       'Mohammed Hassoun',
    description: 'Computational Designer & Developer',
    url:          'https://hassoun.work',
    images: [{ url: '/og-image.jpg', width: 1200, height: 630 }],
  },
  twitter: {
    card:  'summary_large_image',
    title: 'Mohammed Hassoun',
  },
};
```

**AI Prompt:**
> "Read the attached blueprint document. Implement PHASE 15.
> Configure for Vercel deployment: add metadata, Open Graph tags,
> robots.txt, sitemap.xml. Remove any localhost-specific configs.
> Ensure `npm run build` completes with zero errors and zero warnings."

---

# PART 20 — ANTI-TEMPLATE FINAL CHECKLIST

Before shipping, every item must be verified:

| # | Rule | Check |
|---|---|---|
| 1 | Background is `#050507` — never `#000000` or `#111111` | |
| 2 | No white backgrounds appear anywhere | |
| 3 | Nav has no background panel, shadow, or border | |
| 4 | No `backdrop-filter` / frosted glass anywhere in UI | |
| 5 | No particle systems anywhere (only data packets on traces — not particles) | |
| 6 | No organic motion (everything has lerp/constraint — no sine drifts except tail sway) | |
| 7 | No spheres or organic geometry in 3D scene | |
| 8 | Blue accent ONLY appears on active data traces | |
| 9 | Amber accent ONLY in Identifying and Processing states | |
| 10 | Green accent appears ONCE as a flash in Resolved state | |
| 11 | No service lists, bullet points, or icon grids anywhere | |
| 12 | No testimonials, client logos, or star ratings | |
| 13 | No social media icon strip anywhere | |
| 14 | No soft gradients used as decoration | |
| 15 | Camera path NEVER overridden by user interaction | |
| 16 | All 3D text exists in scene space, not as HTML overlay on canvas | |
| 17 | Dragon canvas only active in its progress range | |
| 18 | Audio off by default, toggle required | |
| 19 | Loader uses only logotype + minimal progress line | |
| 20 | `npm run build` passes with zero TypeScript errors | |

---

# PART 21 — CONTENT GUIDE

## What Goes in `lib/projectData.ts`

**Fill in 4 projects. For each, write:**

```
title:        The name of the project (what it IS, not what it does)
client:       Real client name if applicable. "Personal" if not.
year:         Actual year built
category:     Array of 1–3 tags. Only: DESIGN / WEB / MOTION / 3D / AI / SYSTEMS
description:  ONE sentence. State what it does technically.
              BAD: "A beautiful dashboard for a fintech startup"
              GOOD: "A real-time trading interface that renders 40k events/sec without frame drops."
tech:         Actual technologies used. Max 5.
```

## Navigation Copy
```
Logotype: "MH" — initials only. Never full name in nav.
State label: use exact strings from STATE_LABELS in Navigation.tsx
```

## Contact Copy (Resolved State)
```
Primary: email address at h1 scale — it IS the headline
Secondary: one line — "Open to full-time and selected freelance work."
Third: optionally, a link to GitHub or LinkedIn (text only, no icon)
```

## Identity Display (Identifying State)
```
3D text: "HASSOUN" — surname only, uppercase, at maximum scale
Below:  "COMPUTATIONAL DESIGNER & DEVELOPER"
        Adjust title to match your actual practice
```

---

# PART 22 — KNOWN IMPLEMENTATION RISKS

| Risk | Mitigation |
|---|---|
| Dragon canvas at 60fps on low-end hardware | Spatial hash for proximity, particle count cap at 12,000 |
| Three.js + postprocessing draw call count | Instanced meshes, frustum culling, draw call audit in Phase 12 |
| iOS Safari WebGL context loss | `canvas.addEventListener('webglcontextlost')` handler, restore on resume |
| GSAP ScrollTrigger + iOS rubber-band scroll | Wrap in `lenis` smooth scroll library or disable native rubber-band |
| Tone.js autoplay policy | Never init audio without user gesture — the toggle button is required |
| `prefers-reduced-motion` breaking the experience | Full fallback in Phase 13 — static panels, no camera movement |
| Type fonts missing in production | Use `next/font/local`, verify build output includes woff2 files |
| Large texture assets slowing initial load | All textures through Next.js Image Optimization, lazy-load project thumbnails |

---

# PART 23 — FILE SIZE & PERFORMANCE BUDGETS

```
Initial JS bundle (gzipped):    < 350kb
Three.js + R3F:                 ~160kb (unavoidable)
Application code:               < 80kb
GSAP + ScrollTrigger:           ~70kb
Framer Motion (UI only):        < 40kb

Project images:                 < 120kb each (WebP, optimized)
Font files (display weight):    < 50kb total
Total initial load:             < 500kb (excluding Three.js — lazy)

3D scene draw calls:            < 100 per frame
Dragon particles:               ≤ 12,000
Target FPS:                     60 stable on M1 / mid-range Windows laptop
                                30 minimum on iPhone 12+
```

---

*End of document.*
*This is the complete build contract. Every phase depends on the previous.*
*Do not skip phases. Do not mix implementations from different phases.*
*The experience is the sum of every decision made in this document.*