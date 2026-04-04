
# Source: 00-master-blueprint.md

# 00 — MASTER BLUEPRINT

**Project:** Mohammed Hassoun Portfolio
**Type:** Directed Computational Experience

---

# 1. CORE DEFINITION

This is not a website.

There are:

* no pages
* no sections
* no scrolling content

This is:

> A controlled traversal through the interior of a running computational system

The user does not browse.

The user is carried through execution.

---

# 2. FUNDAMENTAL MODEL

## Control System

* Scroll → global time progression
* Mouse → micro-influence (local perturbations)

---

## Primary Driver

> The camera is the only traversal mechanism.

Everything is defined by:

* camera position
* camera velocity
* camera focus
* camera constraints

No system element overrides the camera.

---

## Core Mapping

```js
progress ∈ [0, 1]
```

This drives:

* camera transformation
* system state
* visibility
* interaction intensity
* lighting
* sound

---

# 3. ENVIRONMENT DEFINITION

## What This Is NOT

* not space
* not a void
* not a gallery
* not abstract art

---

## What This IS

> The logical interior of a computational system

The environment behaves like:

* a substrate layer
* a routing surface
* a structural execution space

---

## Substrate Layer

The base environment is:

> a persistent computational plane

Characteristics:

* near-black base: #050507
* embedded rectangular grid: #0A0C12
* opacity: 2–3%
* spacing: uniform and exact

---

## Critical Rule

The grid is NOT decorative.

It is:

> the coordinate system of the environment

It must:

* anchor all objects
* define alignment
* react subtly to system activity

---

# 4. SYSTEM BEHAVIOR MODEL

The experience is governed by system states, not scenes.

---

## State Set

| State       | Range       | Description                     |
| ----------- | ----------- | ------------------------------- |
| Idle        | 0.00 – 0.05 | system present but inactive     |
| Activating  | 0.05 – 0.15 | structures initializing         |
| Identifying | 0.15 – 0.30 | system declares identity        |
| Routing     | 0.30 – 0.50 | topology and connections active |
| Executing   | 0.50 – 0.75 | work is being performed         |
| Processing  | 0.75 – 0.90 | deepest computational layer     |
| Resolved    | 0.90 – 1.00 | system returns to stable state  |

---

## Rule

At any moment:

> the system is in exactly one state

---

## What Each State Controls

* color usage
* motion intensity
* interaction level
* sound profile

---

# 5. VISUAL LANGUAGE

## Structural Primitives

All visuals derive from three types only:

---

### 1. Panels

* flat, rectangular
* hard edges
* dark surface: #0D0F1A
* white or dim edge definition

Used for:

* nodes
* system surfaces
* identity structures

---

### 2. Traces

* thin linear elements
* color: #0066FF (blue)
* directional
* animated with packets

Used for:

* connections
* data movement
* system activity

---

### 3. Volumes

* extruded rectangular forms
* pipelines / channels
* contain moving data

Used for:

* execution layers
* core systems

---

## Absolute Constraints

No:

* spheres
* organic forms
* soft geometry
* particle systems
* noise-based visuals

Everything must be:

> engineered, discrete, intentional

---

# 6. LIGHTING MODEL

Lighting is:

> state-driven and edge-defined

---

## Behavior

* darkness is default
* light appears only where function exists
* edges reveal structure

---

## Types

* Edge light → structure definition
* Trace glow → active data
* State highlight → system transitions

---

## Forbidden

* ambient glow
* soft lighting
* bloom as decoration

---

# 7. COLOR SYSTEM (STATE-BOUND)

## Core Palette

* Background: #050507
* Grid: #0A0C12
* Panel surface: #0D0F1A
* White: #FFFFFF
* Blue: #0066FF
* Amber: #FF6B00
* Green: #00E676

---

## Strict Usage Rules

### Blue

* ONLY for active data flow
* never static

### Amber

* ONLY for Identifying and Processing states
* never continuous

### Green

* ONLY for system status confirmation
* extremely rare

### White

* structure and typography only

---

## Rule

> Color represents system state, not style

---

# 8. MOTION MODEL

Motion is:

> the visible result of system logic

---

## Mechanics

* lerp-based interpolation
* inertia
* dampening
* snap-to-grid

---

## Motion Types

### Macro (Camera)

* drives traversal
* smooth, controlled
* no abrupt changes

### Micro (System Response)

* hover → snap / highlight
* activation → trace movement
* transitions → structural shifts

---

## Forbidden Motion

* random drift
* organic floating
* decorative animation

---

# 9. TYPOGRAPHY SYSTEM

Typography is:

> system output rendered as structure

---

## Behavior

* exists in 3D space
* intersects with environment
* never flat UI

---

## Characteristics

* large scale
* hard-edged
* white dominant
* slight depth offset
* never perfectly front-facing

---

## Role

* identity declaration
* system labeling
* structural reinforcement

---

# 10. SPATIAL RULES

## Negative Space

Empty space is:

> unallocated computational capacity

---

## Constraints

* one primary structure at a time
* large separation between system layers
* no visual clutter

---

## Alignment

All elements must:

* align to grid
* snap to invisible structure
* maintain spatial logic

---

# 11. INTERACTION MODEL

User interaction is:

> influence, not control

---

## Inputs

* scroll → global progression
* mouse → local interaction

---

## Behavior

* hover → precise feedback
* click → system action

---

## Rule

User never overrides:

* camera
* timeline
* system state

---

# 12. ANTI-TEMPLATE ENFORCEMENT

## Explicitly Rejected

* space aesthetics
* particle systems
* soft gradients
* UI cards
* gallery layouts
* decorative shaders
* organic motion

## Enforced

* system logic
* structural clarity
* precision
* functional visuals only

---

# 13. EXPERIENCE RULESET (NON-NEGOTIABLE)

1. Camera always leads
2. System state defines behavior
3. No UI-driven structure
4. No hard transitions
5. Every element has function
6. No organic motion
7. No decorative elements
8. Color reflects state
9. Grid is a system layer
10. Nothing exists unless it serves the system

---

# FINAL DEFINITION

This portfolio is:

> A deterministic, camera-driven traversal through the internal layers of a computational system — where identity, architecture, and execution are revealed as structured processes rather than presented as content.

It is not a design.

It is:

> a system, made visible.

# Source: 01-camera-system.md

# 01 — CAMERA SYSTEM

**Role:** Primary traversal mechanism
**Priority:** Critical (all systems depend on this)

---

# 1. CORE DEFINITION

The camera is the system.

Not a viewer.
Not a helper.

> The camera defines what exists.

If the camera does not reveal something:
→ it does not exist in the experience.

---

# 2. CONTROL ARCHITECTURE

## Dual-Layer Control System

### Layer A — Timeline Control (Primary)

* Input: Scroll
* Output: Global progress (0 → 1)

```js
progress ∈ [0, 1]
```

This drives:

* camera position
* camera target
* FOV
* state activation

---

### Layer B — Micro Interaction (Secondary)

* Input: Mouse
* Output: Subtle offsets

Affects:

* slight rotation
* parallax
* minor positional shift

---

## Control Rule

User influence is:

> additive, not authoritative

Camera path is NEVER overridden.

---

# 3. CAMERA MODEL

Camera is defined by 4 parameters:

---

## 1. Position

```js
camera.position = (x, y, z)
```

Defines:

* spatial location
* depth progression through system layers

---

## 2. Target (LookAt)

```js
camera.lookAt = (x, y, z)
```

Defines:

* what the system exposes at this moment
* structural emphasis

---

## 3. Field of View (FOV)

```js
camera.fov = value
```

Controls:

* perceived scale
* compression vs expansion

---

## 4. Damping (Lerp)

```js
current = lerp(current, target, alpha)
```

Controls:

* smoothness
* mechanical weight
* controlled feel

---

# 4. CAMERA PATH STRUCTURE

The entire experience is one continuous path.

---

## Global Path Concept

```text
Z-axis dominant movement
+ controlled X/Y shifts
```

Camera primarily:

* moves forward (Z) — traversing system depth
* adjusts laterally (X/Y) — for structural framing

---

## Path Segmentation (Logical, not visual)

| State       | Progress Range |
| ----------- | -------------- |
| Idle        | 0.00 – 0.05    |
| Activating  | 0.05 – 0.15    |
| Identifying | 0.15 – 0.30    |
| Routing     | 0.30 – 0.50    |
| Executing   | 0.50 – 0.75    |
| Processing  | 0.75 – 0.90    |
| Resolved    | 0.90 – 1.00    |

---

# 5. CAMERA BEHAVIOR PER STATE

---

## 1. IDLE (0.00 → 0.05)

### Movement

* very slow forward advance
* no rotation
* no system response yet

### Purpose

* establish substrate presence
* signal that something exists

### Parameters

* minimum speed
* maximum damping
* no mouse influence

---

## 2. ACTIVATING (0.05 → 0.15)

### Movement

* slow controlled advance
* minimal rotation

### Purpose

* system becomes aware of traversal
* structures begin to initialize

### Parameters

* low speed
* high damping
* mouse influence begins (minimal)

---

## 3. IDENTIFYING (0.15 → 0.30)

### Movement

* aggressive push forward into typography structure
* camera passes through the text geometry

### Purpose

* identity declaration
* scale impact

### Parameters

* increased speed
* reduced damping
* mouse influence suppressed
* minimal lateral movement

---

## 4. ROUTING (0.30 → 0.50)

### Movement

* controlled inspection movement between nodes
* subtle lateral and forward motion

### Purpose

* expose system topology
* demonstrate routing logic

### Parameters

* moderate speed
* controlled X/Y movement
* medium mouse influence

---

## 5. EXECUTING (0.50 → 0.75)

### Movement

* guided traversal through execution environments
* stop → inspect → advance per execution system

### Purpose

* traverse work being performed

### Parameters

* segmented motion
* temporary slowdowns on entry and exit
* focus locking per execution system

---

## 6. PROCESSING (0.75 → 0.90)

### Movement

* stable framing
* minimal camera movement

### Purpose

* reveal deepest system layer
* peak precision moment

### Parameters

* maximum damping
* mouse influence near zero
* FOV expands gradually

---

## 7. RESOLVED (0.90 → 1.00)

### Movement

* slight pullback
* relaxed constraints

### Purpose

* system returns control
* endpoints exposed

### Parameters

* increased mouse influence
* relaxed damping
* widest FOV

---

# 6. FOV SYSTEM

FOV is used to represent system depth and scale.

---

## Behavior

* Narrow FOV → compression, precision, focus
* Wide FOV → expansion, system returning to stable state

---

## Usage

| State       | FOV Behavior              |
| ----------- | ------------------------- |
| Idle        | neutral (45)              |
| Activating  | neutral (45)              |
| Identifying | slightly narrow (38–42)   |
| Routing     | dynamic (40–50)           |
| Executing   | stable (45)               |
| Processing  | gradual expansion (50–55) |
| Resolved    | widest (55)               |

---

# 7. MOUSE INFLUENCE MODEL

Mouse does NOT move camera freely.

It adds micro-disturbance:

---

## Rotation Offset

```js
camera.rotation.x += mouse.y * factor
camera.rotation.y += mouse.x * factor
```

---

## Position Offset

```js
camera.position.x += mouse.x * smallFactor
camera.position.y += mouse.y * smallFactor
```

---

## Constraint

* clamped values
* always returns to baseline
* influence varies by state (see INTERACTION_STATE in variables)

---

# 8. TRANSITION SYSTEM

No cuts. No jumps.

---

## Rule

> Every transition must be spatially continuous

---

## Methods

### 1. Depth Transition

* camera moves forward into next system layer

### 2. Structure Pass-Through

* camera moves through a panel or volume
* reveals the layer behind it

### 3. Scale Transition

* camera moves toward a structure
* structure fills frame and resolves as new environment

---

# 9. FOCUS SYSTEM

At any time:

> Only ONE focal structure exists

---

## Implementation

* camera.lookAt always points to:

  * active structure
  * typography anchor
  * interaction target

---

## Constraint

No competing focal points.

---

# 10. FAILURE CONDITIONS

If any of these occur, the system is broken:

---

### ❌ Camera feels user-controlled

→ loses traversal direction

### ❌ Movement is linear

→ feels like UI scroll

### ❌ Multiple focal points

→ structural confusion

### ❌ Sudden jumps

→ breaks spatial continuity

### ❌ No damping

→ feels mechanical in the wrong way — robotic, not precise

---

# 11. FINAL SYSTEM DEFINITION

The camera system is:

> A constrained, progress-driven, damped traversal mechanism where scroll defines advancement through system states, mouse adds micro-disturbance, and all movement is continuous, purposeful, and state-aligned.

It is NOT:

* free navigation
* a reactive animation system
* a UI transition layer

It is:

> the traversal engine of the system.

# Source: 02-experience-timeline.md

# 02 — EXPERIENCE TIMELINE

**Role:** Defines full system behavior across progress (0 → 1)
**Depends on:** 00-master-blueprint.md, 01-camera-system.md

---

# 1. CORE MODEL

The entire experience is driven by:

```js
progress ∈ [0, 1]
```

---

## Global Mapping

Progress directly controls:

* camera transformation
* system state
* object activation
* interaction intensity
* lighting behavior
* sound profile

---

## System Constraint

At any moment:

> The system exists in ONE state only

No overlaps. No blending ambiguity.

---

# 2. GLOBAL STATE MAP

| State       | Range       | Description                             |
| ----------- | ----------- | --------------------------------------- |
| Idle        | 0.00 – 0.05 | system present, inactive                |
| Activating  | 0.05 – 0.15 | structures initializing                 |
| Identifying | 0.15 – 0.30 | system declares identity                |
| Routing     | 0.30 – 0.50 | topology and connections active         |
| Executing   | 0.50 – 0.75 | systems performing work                 |
| Processing  | 0.75 – 0.90 | deepest computational layer             |
| Resolved    | 0.90 – 1.00 | system stabilizes and exposes endpoints |

---

# 3. STATE DEFINITIONS

---

## 0.00 — 0.05 → IDLE

### System Behavior

* no active processes
* no interaction
* no visible structures

### Environment

* substrate visible
* grid present at 2–3% opacity
* no glow, no motion

### Motion

* camera slowly advancing
* no system response

### Sound

* near silence
* very low baseline hum (barely perceptible)

### Purpose

> Establish presence of a system without revealing function

---

## 0.05 — 0.15 → ACTIVATING

### System Behavior

* structures begin initializing
* system acknowledges presence

### Objects

* panels emerge from substrate
* edge-first construction
* aligned strictly to grid

### Interaction

* hover enabled (low intensity)
* panels snap slightly toward cursor — mechanical, constrained

### Lighting

* faint edge illumination
* low-intensity blue (inactive state)

### Motion

* sequential activation — not simultaneous
* panels appear in controlled intervals

### Grid Behavior

* slight pulse on panel emergence
* confirms grid as active layer

### Sound

* subtle activation ticks
* low-frequency system ramp-up

### Purpose

> System transitions from passive to aware

---

## 0.15 — 0.30 → IDENTIFYING

### System Behavior

* system declares identity
* user influence minimized

### Event

* large-scale structural typography materializes

### Objects

```
MOHAMMED HASSOUN
FULL STACK ENGINEER
```

* rendered as architectural geometry in 3D space
* integrated with amber trace lines
* hard edges — never soft or glowing

### Lighting

* amber introduced — Identifying state only
* trace lines activate behind typography

### Motion

* camera pushes forward aggressively
* passes through typography structure

### Interaction

* near zero
* user influence suppressed

### Transition Behavior

* scan-line event on pass-through
* trace intensity spike as camera crosses text plane

### Sound

* sharper activation tone
* brief system lock-in sound

### Purpose

> Identity is declared as a system-level property, not UI content

---

## 0.30 — 0.50 → ROUTING

### System Behavior

* topology becomes active
* routing logic is visible

### Objects

Node infrastructure — panels, not orbs:

* large panel-based nodes
* labeled in monospace: FRONTEND / BACKEND / DATABASE / API / AUTH / QUEUE

Connections:

* blue traces
* directional
* animated packet flow

### Scale Rule

* nodes are architectural scale
* camera moves between nodes

### Interaction

* medium intensity
* hover → connection highlighting
* connected nodes respond

### Grid Behavior

* traces align strictly to grid
* occasional pulse along active routes

### Motion

* packet flow varies slightly in speed — controlled imperfection
* no full synchronization

### Camera

* controlled inspection movement
* subtle lateral and forward motion

### Sound

* rhythmic data ticks
* soft routing pulses

### Purpose

> System exposes how it routes and organizes logic

---

## 0.50 — 0.75 → EXECUTING

### System Behavior

* system performs real work
* multiple execution environments active sequentially

### Structure

Each project = one execution system

### Entry Mechanism

* selected node expands
* fills frame
* resolves into internal structure

### Execution System Types (fixed set)

#### 1. Pipeline System

* vertical stages
* packets move through sequential panels

#### 2. Component System

* branching structure
* nodes activate based on flow

#### 3. Data System

* table-like grid of panels
* queries travel between segments

### Objects

* panels, traces, and volumes combined
* no UI elements

### Interaction

* controlled
* focus-based highlighting
* no free exploration

### Motion

* continuous execution
* no idle states within the environment

### Exit

* system deconstructs — edges first
* next execution system initializes

### Sound

* layered operational sounds
* consistent activity tone

### Purpose

> Demonstrate real system capability through structure

---

## 0.75 — 0.90 → PROCESSING

### System Behavior

* single unified process
* highest precision moment
* no interaction

### Structure

Request → Process → Response system

### Flow

* request enters frame
* passes through labeled stages:

  * PARSE
  * VALIDATE
  * TRANSFORM
  * RESPOND

* exits as response

### Objects

* structured pipeline volumes
* internal packet movement visible

### Motion

* synchronized
* deterministic
* no variance

### Lighting

* amber dominant — Processing state
* minimal blue

### Camera

* stable framing
* minimal movement

### Sound

* deep steady hum
* subtle rhythmic processing

### Purpose

> Reveal deepest level of system understanding

---

## 0.90 — 1.00 → RESOLVED

### System Behavior

* processes complete
* system returns to stable state

### Environment

* substrate visible again
* reduced structure density

### Objects

Endpoint panels:

* `ENDPOINT: /contact`
* `ENDPOINT: /github`
* `ENDPOINT: /linkedin`

### Interaction

* medium
* hover → edge highlight
* click → triggers action

### Behavior

* panels anchored to grid
* slight constrained motion
* snap-back on release

### Lighting

* neutral — white and minimal blue
* no amber

### Sound

* system idle tone
* interaction clicks on hover and click

### Purpose

> System exposes outputs after execution completes

---

# 4. TRANSITION RULES

## Allowed

* camera traversal through structures
* panel expansion that fills frame and resolves as new layer
* continuous forward movement

## Forbidden

* fades
* cuts
* UI transitions
* opacity-based layer swaps

---

# 5. DENSITY CURVE

```text
low → medium → high → medium → low
```

Idle and Resolved are the lowest density states.
Routing and Executing are the highest.

---

# 6. INTERACTION CURVE

| State       | Interaction |
| ----------- | ----------- |
| Idle        | none        |
| Activating  | low         |
| Identifying | minimal     |
| Routing     | medium      |
| Executing   | controlled  |
| Processing  | none        |
| Resolved    | medium      |

---

# 7. FOCUS RULE

At all times:

> one primary structure controls attention

Enforced by:

* edge lighting
* camera framing
* depth separation

---

# 8. FINAL DEFINITION

This timeline is:

> A deterministic progression through system states — from idle substrate to active routing, execution, and deep processing — culminating in a resolved system exposing its outputs.

There are no scenes.

Only:

> system states evolving over time.

# Source: 03-tech-stack.md

# 03 — TECH STACK

**Role:** Implementation layer for the computational system experience
**Constraint:** Must NOT introduce UI-first thinking

---

# 1. CORE PRINCIPLE

The stack exists to serve:

> progress → state → camera → system layers

NOT:

* components
* pages
* UI architecture

---

# 2. STACK OVERVIEW

## Rendering Layer

* Three.js (via React Three Fiber)

## Timeline Layer

* GSAP + ScrollTrigger

## Scroll Layer

* Lenis (smooth scroll normalization)

## Shader Layer

* GLSL (via drei / custom materials)

## Interaction Layer

* Native pointer events (R3F)

## Audio Layer

* Web Audio API

---

# 3. WHY THIS STACK

### React Three Fiber

* declarative 3D scene structure
* integrates with React lifecycle
* enables composition without UI mindset

---

### GSAP + ScrollTrigger

* precise timeline control
* maps scroll → progress deterministically
* no secondary timing systems needed

---

### Lenis

* removes native scroll inconsistencies
* provides smooth, continuous progression value

---

### GLSL

* substrate grid fragment shader
* edge lighting on panels
* trace animation (UV offset)
* depth-of-field
* postprocessing

---

### Web Audio API

* system hum tied to state
* click sounds on interaction
* data ticks during Routing state

---

# 4. ROOT STRUCTURE

```text
<App>
  <ScrollController />
  <Experience />
  <OverlayUI />
</App>
```

## Responsibilities

### ScrollController

* normalizes scroll → progress (0 → 1)
* updates global state

### Experience (CORE)

* camera system
* state layer graph
* system reactions

### OverlayUI

* minimal HTML layer
* used ONLY for:
  * accessibility fallbacks
  * external links in Resolved state

---

# 5. STATE MODEL

Single source of truth:

```js
const system = {
  progress: 0,        // global timeline (0 → 1)
  state: 'IDLE',      // current system state
  mouse: { x: 0, y: 0 }
}
```

---

## Rule

NO scattered state.

Everything derives from:

> progress

---

# 6. STATE LAYER COMPOSITION

We do NOT create scenes.

We create:

> persistent state layers that react to progress

---

## Structure

```text
<Experience>
  <CameraRig />
  <IdleState />
  <ActivatingState />
  <IdentifyingState />
  <RoutingState />
  <ExecutingState />
  <ProcessingState />
  <ResolvedState />
</Experience>
```

---

## Rule

All state layers:

* exist at all times
* control their own visibility via progress
* do NOT mount/unmount aggressively

---

# 7. CAMERA IMPLEMENTATION

Camera is controlled centrally:

```js
useFrame(() => {
  camera.position.lerp(targetPosition, CAMERA_DAMPING.position)
  camera.lookAt(targetLookAt)
})
```

## Target Mapping

```js
targetPosition = getCameraPosition(progress)
targetLookAt   = getCameraTarget(progress)
```

## Rule

Camera NEVER depends on state layer components.

State layers respond to camera — not the opposite.

---

# 8. SCROLL → PROGRESS PIPELINE

## Lenis Setup

```js
lenis.on('scroll', ({ progress }) => {
  system.progress = progress
})
```

## Rule

Scroll is converted into:

> a normalized value (0 → 1)

This is the ONLY global input.

---

# 9. ANIMATION STRATEGY

We avoid:

* independent animations
* component-level motion
* time-based systems

We use:

> derived animation from progress

## Example

```js
panel.position.z = lerp(50, 0, progressRange(0.05, 0.15))
```

## Helper

```js
function progressRange(start, end) {
  return clamp((progress - start) / (end - start), 0, 1)
}
```

---

# 10. INTERACTION SYSTEM

## Mouse Tracking

```js
onPointerMove(e) {
  system.mouse.x = normalize(e.clientX)
  system.mouse.y = normalize(e.clientY)
}
```

## Camera Influence

```js
camera.position.x += system.mouse.x * CAMERA_MOUSE.strengthX
camera.position.y += system.mouse.y * CAMERA_MOUSE.strengthY
```

## Object Interaction

* raycasting via R3F
* hover → edge light boost
* snap behavior on interaction

## Rule

Interaction must:

* be immediate
* be precise (snap, not drift)
* never break traversal flow

---

# 11. SHADER RESPONSIBILITIES

## Substrate Grid

* GLSL fragment shader
* renders the base coordinate plane
* reacts to system activity via uniform

## Panel Edge Lighting

* custom material
* edge detection + state-driven intensity
* blue (Routing) / amber (Identifying / Processing)

## Trace Animation

* UV offset on line material
* packet dots: instanced mesh traveling along trace geometry

## Postprocessing

* bloom — threshold 0.9, very subtle
* depth of field — at key moments
* vignette — focus center
* no decorative effects

---

# 12. LAYERING SYSTEM

## 3 Layers

### 1. WebGL Layer

* full system experience
* all 3D structure

### 2. HTML Layer

* minimal
* Resolved state endpoint links only
* accessibility fallback

### 3. Postprocessing Layer

* bloom (edge-triggered only)
* depth of field
* vignette

---

# 13. WHAT WE AVOID

## DO NOT USE

* page routing
* component-driven animation logic
* CSS animation systems
* UI frameworks controlling flow
* particle systems
* independent timing systems

## WHY

They break:

> the progress → state → camera hierarchy

---

# 14. PERFORMANCE STRATEGY

## Targets

* 60 FPS
* no draw call spikes on state transitions

## Techniques

* instancing for repeated structures (panels, packets)
* geometry pooling
* frustum culling
* LOD on distant state layers

## Critical

Performance drops = traversal breaks

---

# 15. FINAL DEFINITION

This stack is:

> A single, persistent, WebGL-driven system where all motion, interaction, and rendering are derived from a unified progress value, controlled by scroll, and expressed through a central camera traversal mechanism.

It is NOT:

* a React app with 3D inside
* a UI with animations

It is:

> a real-time system simulation controlled by one value.

# Source: 04-variables.md

# 04 — VARIABLES

**Role:** Deterministic control layer for all system behavior
**Depends on:** 00-master-blueprint.md, 02-experience-timeline.md

---

# 1. CORE PRINCIPLE

This file defines:

> how the system behaves

---

## Rules

* No hardcoded values outside this file
* All variables must map to system logic
* If it affects motion, color, timing, or interaction → it is defined here

---

## Control Model

```js
progress ∈ [0, 1]
state = resolveState(progress)
```

Everything derives from:

> progress → state → variables → output

---

# 2. SYSTEM STATE RANGES

```js
export const STATES = {
  IDLE:        { start: 0.00, end: 0.05 },
  ACTIVATING:  { start: 0.05, end: 0.15 },
  IDENTIFYING: { start: 0.15, end: 0.30 },
  ROUTING:     { start: 0.30, end: 0.50 },
  EXECUTING:   { start: 0.50, end: 0.75 },
  PROCESSING:  { start: 0.75, end: 0.90 },
  RESOLVED:    { start: 0.90, end: 1.00 }
}
```

## Normalized State Value

```js
t = clamp((progress - state.start) / (state.end - state.start), 0, 1)
```

---

# 3. CAMERA SYSTEM

## Camera Path

```js
export const CAMERA_PATH = {
  zStart: 100,
  zEnd: 0
}
```

## Damping

```js
export const CAMERA_DAMPING = {
  position: 0.08,
  rotation: 0.06
}
```

## Mouse Influence

```js
export const CAMERA_MOUSE = {
  strengthX: 0.5,
  strengthY: 0.3,
  damping: 0.05
}
```

## Field of View

```js
export const CAMERA_FOV = {
  default: 45,
  inspect: 38,
  wide: 55
}
```

---

# 4. MOTION SYSTEM

## Global Lerp Speeds

```js
export const MOTION = {
  fast:   0.12,
  medium: 0.08,
  slow:   0.04
}
```

## Snap-to-Grid Behavior

```js
export const SNAP = {
  strength:  0.18,
  threshold: 0.0008,
  returnSpeed: 0.12
}
```

## Deterministic Variance (controlled imperfection)

```js
export const VARIANCE = {
  activationDelay:    0.06,
  packetSpeedVariance: 0.15
}
```

---

# 5. SUBSTRATE (GRID SYSTEM)

## Grid Properties

```js
export const GRID = {
  spacing: 40,
  opacity: 0.025,
  color:   '#0A0C12'
}
```

## Grid Reactivity

```js
export const GRID_REACTIVITY = {
  pulseIntensity:   0.12,
  pulseDuration:    0.35,
  activationRadius: 80
}
```

## Rule

> Grid reacts ONLY when system activity occurs

---

# 6. COLOR SYSTEM (STATE-DRIVEN)

## Base Colors

```js
export const COLORS = {
  background: '#050507',
  panel:      '#0D0F1A',
  structure:  '#FFFFFF',
  data:       '#0066FF',
  activation: '#FF6B00',
  status:     '#00E676'
}
```

## Color Roles (NON-NEGOTIABLE)

* `data` (blue) → moving information ONLY
* `activation` (amber) → Identifying and Processing states only
* `status` (green) → rare system confirmation only
* `structure` (white) → static geometry and typography

## State-Based Color Intensity

```js
export const COLOR_STATE = {
  IDLE:        { data: 0.0,  activation: 0.0  },
  ACTIVATING:  { data: 0.2,  activation: 0.0  },
  IDENTIFYING: { data: 0.0,  activation: 0.85 },
  ROUTING:     { data: 1.0,  activation: 0.2  },
  EXECUTING:   { data: 0.75, activation: 0.3  },
  PROCESSING:  { data: 0.2,  activation: 0.95 },
  RESOLVED:    { data: 0.3,  activation: 0.0  }
}
```

## Hard Limits

```js
export const COLOR_LIMITS = {
  maxData:       1.0,
  maxActivation: 0.95,
  idleMax:       0.05
}
```

## Critical Rules

* Blue NEVER appears without motion
* Amber NEVER dominates outside IDENTIFYING / PROCESSING
* Panels NEVER emit color when inactive

---

# 7. LIGHTING SYSTEM

```js
export const LIGHTING = {
  edgeBase:          0.4,
  edgeActiveBoost:   1.6,
  edgeIdleReduction: 0.25
}
```

## Behavior

* edges define structure
* surfaces remain dark
* light emerges only on activity

---

# 8. INTERACTION SYSTEM

## Global Strength

```js
export const INTERACTION = {
  hoverStrength: 0.45,
  snapStrength:  0.35,
  clickImpulse:  0.6
}
```

## State-Based Interaction Multiplier

```js
export const INTERACTION_STATE = {
  IDLE:        0.0,
  ACTIVATING:  0.2,
  IDENTIFYING: 0.05,
  ROUTING:     0.6,
  EXECUTING:   0.4,
  PROCESSING:  0.0,
  RESOLVED:    0.65
}
```

---

# 9. DATA FLOW SYSTEM

## Packet Behavior

```js
export const DATA_FLOW = {
  speedBase:     0.65,
  speedVariance: 0.2,
  size:          0.045,
  spacing:       0.25
}
```

## Pipeline Timing

```js
export const PIPELINE = {
  flowSpeed:  0.85,
  stageDelay: 0.1
}
```

## Rule

> Data must feel routed, not animated

---

# 10. TYPOGRAPHY

```js
export const TYPE = {
  nameScale:      12,
  roleScale:      5,
  depthOffset:    2.2,
  rotationOffset: 0.08
}
```

## Behavior

* never perfectly flat
* slightly embedded in space
* interacts with trace lines in Identifying state

---

# 11. DENSITY CONTROL

```js
export const DENSITY = {
  idle:        0.15,
  activating:  0.3,
  identifying: 0.35,
  routing:     0.7,
  executing:   0.9,
  processing:  0.5,
  resolved:    0.25
}
```

---

# 12. SOUND SYSTEM

```js
export const SOUND = {
  humIdle:       0.08,
  humActive:     0.25,
  humProcessing: 0.45,
  click:         0.3,
  tick:          0.05
}
```

---

# 13. FINAL RULE

This file is:

> the deterministic control layer of the system

## If something feels wrong:

You DO NOT:

* redesign visuals
* rewrite architecture

You:

> adjust variables until behavior matches system intent

---

# FINAL DEFINITION

This system operates as:

> a state-driven computational model where all motion, color, interaction, and structure emerge from a centralized variable set — ensuring consistency, precision, and control across the entire experience.

# Source: 05-experience-architecture.md

# 05 — EXPERIENCE ARCHITECTURE

**Role:** Defines how the codebase is structured
**Goal:** Maintain control, scalability, and clarity without breaking the system-first philosophy

---

# 1. CORE PRINCIPLE

We are NOT structuring a React app.

We are structuring:

> a real-time computational system simulation

---

## Architectural Hierarchy

```text
Input (scroll / mouse)
        ↓
Global State (progress)
        ↓
Camera System (traversal driver)
        ↓
State Layer System (reactive)
        ↓
Rendering (output)
```

---

# 2. FOLDER STRUCTURE

```text
/src
  /core
  /experience
  /states
  /systems
  /utils
  /config
  /components (minimal)
```

---

# 3. CORE LAYERS

## /core

### Purpose

Global engine logic

### Contains

```text
/core
  ExperienceProvider.js
  useExperience.js
  ScrollController.js
```

### Responsibilities

* store global state (progress, mouse, current system state)
* update via scroll and pointer
* expose via context or store

---

## /config

### Purpose

All variables

```text
/config
  variables.js
```

### Rule

NO magic numbers outside this folder

---

## /utils

### Purpose

Pure helper functions

```text
/utils
  math.js
  easing.js
  ranges.js
```

### Contains

* clamp
* lerp
* range mapping

---

# 4. EXPERIENCE LAYER

## /experience

### Purpose

Main 3D system

```text
/experience
  Experience.jsx
  CameraRig.jsx
  Lighting.jsx
```

### Responsibilities

#### Experience.jsx

* mounts canvas
* loads all state layers
* connects systems

#### CameraRig.jsx (CRITICAL)

* reads progress
* calculates:
  * position
  * lookAt
  * fov
* applies damping

#### Lighting.jsx

* controls global edge lighting
* reacts to system state

---

# 5. STATE LAYER SYSTEM

## /states

### Purpose

All spatial system content

```text
/states
  IdleState.jsx
  ActivatingState.jsx
  IdentifyingState.jsx
  RoutingState.jsx
  ExecutingState.jsx
  ProcessingState.jsx
  ResolvedState.jsx
```

---

## State Layer Rules

Each state layer:

* is ALWAYS mounted
* reacts to progress
* controls its own:
  * visibility
  * opacity
  * position
  * interaction

---

## Example Pattern

```js
const t = range(progress, STATES.ROUTING.start, STATES.ROUTING.end)

panel.position.z = lerp(20, 0, t)
panel.visible = t > 0
```

---

## Critical

State layers do NOT:

* control camera
* trigger global state changes
* depend on each other

They are:

> passive responders to progress

---

# 6. SYSTEMS LAYER

## /systems

### Purpose

Reusable behavior modules

```text
/systems
  useScroll.js
  useMouse.js
  useRaycast.js
  useSnap.js
```

### Responsibilities

#### useScroll

* syncs Lenis → progress

#### useMouse

* normalizes mouse values

#### useRaycast

* handles hover detection

#### useSnap

* applies snap-to-grid forces on interaction

---

# 7. COMPONENTS (STRICTLY LIMITED)

## /components

### Purpose

UI-only elements

```text
/components
  Overlay.jsx
  Loader.jsx
```

### Rule

Components must:

* NOT control 3D logic
* NOT contain animation logic
* only display static information

---

# 8. DATA FLOW (NON-NEGOTIABLE)

## Flow Direction

```text
Scroll → progress → camera → state layers → render
```

## Forbidden Flow

```text
state layer → camera    ❌
component → animation   ❌
state layer → state layer ❌
```

---

# 9. CAMERA ISOLATION

Camera logic lives ONLY in:

```text
/experience/CameraRig.jsx
```

### Rule

No other file:

* modifies camera directly
* reads camera state

---

# 10. STATE LAYER COMMUNICATION

State layers do NOT communicate with each other.

### Shared Logic via

* global progress value
* shared config (variables.js)
* reusable systems (/systems)

### Result

Loose coupling.
High control.
No dependency chains.

---

# 11. PERFORMANCE STRUCTURE

## Heavy State Layers

* Executing
* Processing

## Strategy

* lazy-load assets — not components
* reduce geometry complexity per layer
* use instancing for panels and packets

## Rule

Do NOT:

* mount/unmount state layers aggressively
* rely on React lifecycle for animation

---

# 12. DEBUG LAYER (RECOMMENDED)

```text
/debug
  DebugPanel.jsx
```

### Features

* display progress value
* display current system state name
* toggle state layer visibility
* tweak variables live

### Purpose

Speeds up system tuning significantly

---

# 13. BUILD ORDER (CRITICAL)

1. Setup core + scroll → progress
2. Build CameraRig — no state layers yet
3. Add IdleState only — validate substrate grid
4. Validate motion and damping
5. Add ActivatingState — validate panel emergence
6. Add next state layer
7. Repeat

### Rule

Never build multiple state layers simultaneously.

---

# 14. FAILURE CONDITIONS

### ❌ State layers control camera

→ system hierarchy breaks

### ❌ Multiple sources of truth

→ inconsistent behavior

### ❌ Components contain animation logic

→ turns into a UI app

### ❌ State layers mount/unmount aggressively

→ jitter and bugs

### ❌ State layers reference each other

→ dependency chain breaks determinism

---

# 15. FINAL DEFINITION

This architecture is:

> a modular, layered system where a single global progress value drives a central camera, and all state layers react independently within a persistent 3D environment.

It is NOT:

* a component tree
* a page structure
* a UI system

It is:

> a deterministic system simulation pipeline.

# Source: 06-implementation-plan.md

# 06 — IMPLEMENTATION PLAN

**Role:** Step-by-step execution roadmap
**Goal:** Build the system cleanly without breaking core architecture

---

# 1. CORE PRINCIPLE

You are NOT building features.

You are building:

> a controlled system, layer by layer

---

## Rule

At every step:

* validate motion
* validate camera
* validate system feel

Before adding complexity.

---

# 2. BUILD ORDER OVERVIEW

```text
Motion → Camera → Substrate → State Layers → Precision → Performance
```

NOT:

```text
UI → Features → Animation → Fix later ❌
```

---

# 3. PHASE 0 — PROJECT SETUP

### Goal

Clean foundation

### Tasks

* Initialize project (Vite or Next.js)
* Install:
  * React Three Fiber
  * drei
  * GSAP + ScrollTrigger
  * Lenis

### Folder Structure

```text
/src
  /core
  /experience
  /states
  /systems
  /config
  /utils
```

### Output

✔ Empty canvas renders
✔ No errors
✔ Clean structure

---

# 4. PHASE 1 — SCROLL → PROGRESS

### Goal

Create the timeline backbone

### Tasks

* Implement Lenis
* Normalize scroll → progress (0 → 1)
* Store in global state

### Debug

* display progress value on screen

### Output

✔ Smooth scroll
✔ Stable progress value (0 → 1)

### HARD RULE

Do NOT build state layers yet.

---

# 5. PHASE 2 — CAMERA SYSTEM (ISOLATED)

### Goal

Camera works perfectly before anything else

### Tasks

* Create CameraRig
* Hardcode test path:

```js
z: 100 → 0
```

* Apply:
  * lerp damping
  * mouse influence

### Test

* scroll → camera advances smoothly
* mouse → subtle micro-disturbance

### Output

✔ Controlled movement
✔ No jitter
✔ No snapping

### HARD RULE

No objects yet. Only camera.

---

# 6. PHASE 3 — IDLE + ACTIVATING STATES

### Goal

Validate the substrate and first structural initialization

### Tasks

* Build substrate grid shader
* Add IdleState — grid only, no panels
* Add ActivatingState — panel emergence sequence
* Panels emerge edge-first, aligned to grid
* Sequential activation — not simultaneous

### Focus

* grid opacity feels like texture, not decoration
* panels feel hard-edged, not soft
* snap behavior on interaction

### Output

✔ Substrate feels like a computational plane
✔ Panels initialize in correct sequence
✔ No organic motion

### HARD RULE

Do NOT add next state layer yet.

---

# 7. PHASE 4 — IDENTIFYING STATE

### Goal

Typography system and pass-through effect

### Tasks

* Add 3D text geometry — massive scale
* Position in depth on Z-axis
* Add amber trace lines integrated with typography
* Test camera pass-through behavior

### Validate

* text feels like infrastructure, not a headline
* amber appears ONLY in this state
* scan-line event fires on pass-through

### Output

✔ Strong identity impact
✔ Camera passes through text geometry cleanly
✔ Clean transition from Activating

---

# 8. PHASE 5 — CAMERA REFINEMENT

### Goal

Fix ALL camera issues before continuing

### Tasks

* Refine:
  * damping values
  * speed per state
  * FOV shifts
* Remove:
  * any stiffness
  * any jitter

### Output

✔ Precise feel — mechanical, not robotic
✔ Consistent motion across all states so far

### CRITICAL

Do this BEFORE building more state layers.

---

# 9. PHASE 6 — ROUTING STATE

### Goal

System topology visualization

### Tasks

* Build panel-based node infrastructure
* Add blue trace connections — directional
* Animate packet flow along traces
* Implement hover → connection highlight

### Validate

* nodes feel architectural, not decorative
* traces align to grid
* packets feel routed, not animated

### Output

✔ Clear system topology
✔ Interactive but controlled
✔ Blue appears only on active connections

---

# 10. PHASE 7 — EXECUTING STATE

### Goal

Build reusable execution environment logic

### Tasks

* Define execution system structure
* Build first execution system (Pipeline type)
* Validate node-expands-to-environment transition
* Validate camera inspection behavior
* Replicate for 2 additional execution system types

### Execution System Types

* Pipeline — vertical stages, packet flow
* Component — branching structure
* Data — table grid, query travel

### Validate

* node expansion fills frame cleanly
* environment resolves without cuts
* panels deconstruct on exit — edges first

### Output

✔ Each execution system reads as a running system
✔ No UI elements visible
✔ Transitions are spatially continuous

---

# 11. PHASE 8 — PROCESSING STATE

### Goal

Signature core moment

### Tasks

* Build Request → Process → Response pipeline
* Stages: PARSE / VALIDATE / TRANSFORM / RESPOND
* Synchronized, deterministic packet movement
* Amber lighting dominant

### Focus

* motion synchronization — everything moves together
* no variance in this state
* camera holds stable frame

### Output

✔ Feels operational, not designed
✔ Deepest layer of system understanding visible

---

# 12. PHASE 9 — RESOLVED STATE

### Goal

System returns to stable state and exposes endpoints

### Tasks

* Add endpoint panels: `/contact`, `/github`, `/linkedin`
* Panels anchored to grid
* Snap-back physics on mouse release
* Click → action (link, email)

### Validate

* panels feel anchored, not floating
* snap-back feels mechanical
* click feedback triggers system sound

### Output

✔ System feels completed
✔ Endpoints are accessible
✔ No decorative motion — controlled constrained drift only

---

# 13. PHASE 10 — PRECISION PASS

### Goal

Every variable tuned to system intent

### Tasks

* Adjust:
  * spacing between system layers
  * timing of state transitions
  * motion curves (smooth, not linear)
* Add:
  * sound system (hum, ticks, clicks)
  * postprocessing (subtle bloom on edges, vignette)

### Output

✔ Cohesive system feel
✔ No rough transitions
✔ Sound aligned to state changes

---

# 14. PHASE 11 — PERFORMANCE PASS

### Goal

Stable 60 FPS

### Tasks

* Reduce draw calls
* Optimize geometry
* Use instancing for panels and packets
* Frustum culling on inactive state layers

### Output

✔ Smooth on mid-range devices
✔ No frame drops on state transitions

---

# 15. DEVELOPMENT RULES

### Rule 1

One state layer at a time.

### Rule 2

Never stack incomplete systems.

### Rule 3

If something feels wrong:
→ fix it immediately before continuing

### Rule 4

Motion feel must be correct before visual detail is added.

---

# 16. COMMON FAILURE CONDITIONS

### ❌ Build all state layers first

→ chaos with no validated foundation

### ❌ Ignore camera before building layers

→ impossible to fix traversal later

### ❌ Use particles or organic objects

→ breaks system visual language entirely

### ❌ Add decorative motion

→ violates the deterministic model

### ❌ Overuse postprocessing

→ system looks like a screensaver, not an operational environment

---

# FINAL DEFINITION

This plan ensures:

* control is maintained at every step
* complexity grows from a validated foundation
* system integrity is never compromised

If followed correctly:

> the experience will feel operational, precise, and engineered — not like a collection of effects.

# Source: 08—AI-IMPLEMENTATION-PROTOCOL.md

# 08 — AI IMPLEMENTATION PROTOCOL

---

# ROLE

You are a strict deterministic implementation engine.

You do NOT design.
You do NOT architect.
You do NOT optimize creatively.

You ONLY execute exactly what is specified.

---

# CORE SYSTEM RULES

---

## 1. CAMERA IS THE PRIMARY SYSTEM

* Camera defines system perception
* All spatial behavior is relative to camera state
* Camera is controlled ONLY via `CameraRig`
* No state layer touches the camera

---

## 2. PROGRESS IS THE ONLY INPUT

Single input:

```text
progress ∈ [0, 1]
```

Every system behavior is derived from this value.

No secondary timing systems.
No independent animation clocks.

---

## 3. STATE LAYERS ARE PASSIVE

* State layers do NOT control flow
* State layers ONLY respond to progress
* No state layer can override global progression
* No state layer references another state layer

---

## 4. NO UI OR NAVIGATION LOGIC

* No buttons
* No routing system
* No DOM-based interaction structure
* No manual state switching

---

# FORBIDDEN OPERATIONS

You MUST NOT:

* introduce additional architectural layers
* create independent animation systems
* use time-based motion outside progress
* mount/unmount state layers dynamically
* implement feature-driven abstractions
* add decorative motion not tied to progress or camera
* use particle systems
* use organic or soft geometry

---

# OUTPUT REQUIREMENTS

For every request:

* Return ONLY complete code
* Full file implementation
* No explanation
* No commentary
* No partial snippets
* No omitted dependencies

---

# IMPLEMENTATION STYLE RULES

## MOTION

All motion must be:

* lerp-based
* deterministic
* progress-driven

---

## STRUCTURE

* prefer direct implementation over abstraction layers
* avoid unnecessary decomposition
* systems should remain flat unless functionally required

---

## REACT USAGE

* functional components only
* no class-based logic
* no side-effect chains unrelated to system state

---

## LOGIC MODEL

* math over animation systems
* state mapping over event systems
* continuous evaluation over discrete triggers
* snap over drift

---

# INPUT FORMAT YOU WILL RECEIVE

Each task will include:

* file name
* system role
* constraints
* required variables (from config)

---

# EXAMPLE TASK

### FILE

`CameraRig.jsx`

### PURPOSE

Map global progress to camera transformation.

### CONSTRAINTS

* z: 100 → 0
* damping required
* mouse adds micro-disturbance
* no state layer logic
* no UI logic

---

# OUTPUT FORMAT

Return ONLY:

```text
<full file implementation>
```

No comments.
No explanation.
No reasoning.

---

# FINAL PRINCIPLE

> You are not building an application.

You are implementing a deterministic system simulation layer, where every output is a direct consequence of progress-driven state evaluation.

# Source: ORCHESTRATION.md

# ORCHESTRATION — BUILD ORDER

## ROLE

This file defines the exact order you feed specs into AI systems.

You NEVER deviate from this order.

Each step must be:

* completed
* tested
* visually validated

before moving to the next.

---

# EXECUTION PIPELINE

---

## PHASE 0 — FOUNDATION (READ BEFORE ANY CODE)

Feed these files to the AI in this order:

1. `00-master-blueprint.md`
2. `01-camera-system.md`
3. `02-experience-timeline.md`
4. `03-tech-stack.md`
5. `04-variables.md`
6. `05-experience-architecture.md`

✔ Goal: complete system understanding before a single line of code

---

## PHASE 1 — CORE ENGINE

7. `core/ExperienceProvider`
8. `systems/useScroll` (progress pipeline)
9. `core/ScrollController`

✔ Goal: global progress (0 → 1) working and stable

---

## PHASE 2 — CAMERA SYSTEM (CRITICAL)

10. `experience/CameraRig`

✔ Must be PERFECT before any state layer is built

Validation required:

* smooth damping — no jitter
* scroll → camera advancement is stable
* mouse adds micro-disturbance, never overrides path

DO NOT PROCEED until all three pass.

---

## PHASE 3 — STATE LAYERS 1 + 2 (IDLE + ACTIVATING)

11. `states/IdleState`
12. `states/ActivatingState`

✔ First spatial validation of the substrate and panel system

Validation required:

* grid feels like texture at 2–3% opacity — not decoration
* panels emerge edge-first, aligned to grid
* snap behavior active — no drift

---

## PHASE 4 — STATE LAYER 3 (IDENTIFYING)

13. `states/IdentifyingState`

✔ Typography and camera pass-through validation

Validation required:

* text is architectural scale
* amber appears ONLY in this state
* camera passes through text geometry without cuts

---

## PHASE 5 — CAMERA REFINEMENT

14. Refine `experience/CameraRig`

✔ Fix all remaining camera issues before continuing

Validation required:

* motion feels precise and mechanical — not robotic
* FOV shifts are smooth
* state-to-state speed transitions are correct

DO NOT PROCEED if motion feels wrong.

---

## PHASE 6 — STATE LAYER 4 (ROUTING)

15. `states/RoutingState`

✔ System topology and interaction validation

Validation required:

* nodes are architectural panels — not orbs
* traces align to grid
* packets feel routed, not animated
* hover activates connection highlighting correctly

---

## PHASE 7 — STATE LAYER 5 (EXECUTING)

16. `states/ExecutingState`

✔ Execution environment logic validation

Build one execution system type first.
Validate entry transition and deconstruct exit.
Then add remaining types.

Validation required:

* node-to-environment expansion is seamless
* no UI elements visible
* execution systems feel operational

---

## PHASE 8 — STATE LAYER 6 (PROCESSING)

17. `states/ProcessingState`

✔ Core layer — highest precision moment

Validation required:

* Request → PARSE → VALIDATE → TRANSFORM → RESPOND → Response
* motion is fully synchronized
* amber is dominant
* camera holds stable frame

---

## PHASE 9 — STATE LAYER 7 (RESOLVED)

18. `states/ResolvedState`

✔ System completion and endpoint exposure

Validation required:

* endpoint panels anchored to grid
* snap-back physics active on release
* click triggers action
* no decorative motion — constrained drift only

---

## PHASE 10 — PRECISION PASS

19. Motion curve refinement
20. Spacing between system layers
21. Sound system (hum → ticks → clicks → idle)
22. Postprocessing (bloom on edges only, vignette, depth of field)

✔ System feels cohesive and operational

---

## PHASE 11 — PERFORMANCE PASS

23. Instancing for panels and packets
24. Frustum culling on inactive state layers
25. Draw call reduction
26. FPS validation across devices

✔ Stable 60 FPS with no state-transition drops

---

# RULES

* NEVER skip CameraRig validation
* NEVER build multiple state layers simultaneously
* ALWAYS test after each step
* DO NOT proceed if motion feels wrong
* DO NOT proceed if a state layer introduces drift or organic motion

---

# CORE PRINCIPLE

> Motion quality > visual complexity

If motion is wrong, everything is wrong.

---

# STATE LAYER BUILD SEQUENCE (QUICK REFERENCE)

```text
IdleState
ActivatingState
IdentifyingState
RoutingState
ExecutingState
ProcessingState
ResolvedState
```

This is the exact order.
Never reversed.
Never parallelized.

# Source: synthesis.md

# 🧠 THE SYSTEM CORE SYNTHESIS

---

# 🎭 1. CORE PHILOSOPHY — “THIS IS NOT A WEBSITE”

This is the foundation.

There are:

* no pages
* no sections
* no scrolling document

---

This is:

> A navigable computational system

---

The user is NOT browsing content.

The user is:

> Moving through the internal layers of a running system

---

## Spatial Model

Traditional web:

* X / Y layout
* stacked information

This system:

* X / Y / Z space
* depth = system layers
* camera = traversal mechanism

---

## Key Shift

Not:

> moving through space

But:

> traversing system depth

---

## Resulting Feel

* precise
* controlled
* engineered
* non-decorative

---

# 🎯 2. SYSTEM RESPONSE ENGINE (WHY IT FEELS POWERFUL)

The experience is not emotional-first.

It is:

> response-first

---

## Core Loop

Input → System Reaction → Feedback

---

## Perceived Experience

1. Recognition — system presence is clear
2. Response — system reacts to input
3. Understanding — structure becomes legible
4. Depth — system complexity is revealed
5. Resolution — system stabilizes

---

## Psychological Mechanisms

* Response loop → every input produces output
* Determinism → behavior feels intentional
* Scale shift → component → system → infrastructure
* Control illusion → user influences but does not control

---

## Important Constraint

No randomness.

Everything must feel:

> computed, not animated

---

# 🧱 3. STRUCTURE — STATE PROGRESSION (NOT STORY)

There is no narrative structure.

There is:

> system state progression

---

## System Flow

Idle → Activating → Identifying → Routing → Executing → Processing → Resolved

---

Each state:

* has defined behavior
* has defined visuals
* has defined interaction

---

## Scroll Model

Scroll does NOT move a page.

Scroll:

> advances system state

---

## Critical Rule

No:

* sections
* transitions
* UI breaks

Only:

> continuous progression through system layers

---

# 📐 4. SPATIAL LOGIC — SYSTEM LAYOUT

Space is not aesthetic.

It represents:

> system capacity and separation

---

## Principles

* large gaps = separation between system layers
* no clustering without purpose
* one active structure at a time

---

## Interpretation

Empty space is:

* unallocated memory
* unused bandwidth
* inactive system region

---

## Rule

Nothing exists without purpose.

---

# 🔤 5. TYPOGRAPHY — SYSTEM OUTPUT

Typography is not content.

It is:

> system-level declaration

---

## Behavior

* exists in 3D space
* integrated into system structure
* large-scale, architectural

---

## Role

Typography communicates:

* identity
* system ownership
* operational labels

---

## Constraint

Text is not UI.

Text is:

> part of the system itself

---

# ⚡ 6. MOTION SYSTEM — COMPUTATIONAL BEHAVIOR

Motion is not animation.

Motion is:

> the visible result of system logic

---

## Core Mechanics

* interpolation (lerp) → state transition
* damping → system inertia
* snapping → grid alignment
* constraint → controlled movement

---

## Motion Characteristics

* precise
* mechanical
* deterministic

---

## Forbidden Feel

* organic
* floaty
* decorative

---

## Required Feel

> controlled and intentional

---

# 🎬 Motion Types

* scroll-driven progression (global state)
* camera traversal (macro)
* interaction response (micro)

---

# 🌐 7. 3D & DEPTH — SYSTEM INFRASTRUCTURE

3D is not used for immersion.

It is used to represent:

> system layers

---

## Principles

* real 3D space
* real camera
* real depth relationships

---

## Meaning of Depth

* foreground → active computation
* midground → supporting structures
* background → system substrate

---

## Techniques

* Z-axis traversal
* depth-based focus
* layer transitions via movement

---

## Rule

Depth must always represent:

> hierarchy or function

---

# 🔊 8. SIGNAL LAYER (SOUND + FEEDBACK)

Sound is not decoration.

It is:

> system signal

---

## Types

* low-frequency hum → system state
* ticks → data movement
* clicks → interaction confirmation

---

## Rule

Every sound must:

> correspond to a system event

---

# 🧩 9. ANTI-TEMPLATE SYSTEM

This system avoids:

* predefined layouts
* repeated UI patterns
* predictable structure
* decorative elements

---

## It enforces:

* functional design
* unique structure per state
* continuous flow
* system-first logic

---

## Core Principle

> Nothing exists unless it serves the system

---

# 🧪 10. TECHNICAL FOUNDATION

This experience requires:

* WebGL rendering (3D engine)
* real-time state control
* scroll-driven timeline
* shader-based visuals
* physics-based interaction

---

## Required Capabilities

* camera control
* object-level interaction
* layered rendering (HTML + WebGL)
* deterministic animation

---

## Complexity Level

> high precision system — not template-level implementation

---

# 🧭 11. CORE MECHANISM (THE REAL SECRET)

The primary system is:

> camera-driven state traversal

---

## Not controlled by:

* UI
* components
* navigation

---

## Controlled by:

* camera path
* system states
* progress value

---

## Everything depends on:

* where the camera is
* what state is active
* what layer is visible

---

# 💥 FINAL DISTILLED TRUTH

If you remember only this:

---

## 1.

> It’s not UI — it’s a system made visible

---

## 2.

> It’s not animation — it’s state-driven behavior

---

## 3.

> It’s not a story — it’s system progression

---

## 4.

> The user is not navigating

> The user is being processed through the system

---

# ⚡ IMPLEMENTATION MINDSET

Stop thinking:

* pages
* sections
* components

Start thinking:

* states
* transitions
* system layers
* camera path

---

## Build Order

1. Define system states
2. Define camera path
3. Map progress → state
4. Implement structure
5. Add interaction
6. Add signal layer

---

# FINAL DEFINITION

This experience is:

> A deterministic, camera-driven traversal through the internal layers of a computational system — where structure, motion, and interaction are governed by system logic, and the user progresses through states that reveal identity, architecture, execution, and processing.

It is not:

* a website
* a cinematic space
* an animated UI

It is:

> a running system, made observable.

