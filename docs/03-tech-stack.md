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