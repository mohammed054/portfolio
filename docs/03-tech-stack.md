# 03 — TECH STACK

**Role:** Implementation layer for the directed 3D experience
**Constraint:** Must NOT introduce UI-first thinking

---

# 1. CORE PRINCIPLE

The stack exists to serve:

> timeline → camera → scene

NOT:

* components
* pages
* UI architecture

---

# 2. STACK OVERVIEW

## Rendering Layer

* Three.js (via React Three Fiber)

## Animation Layer

* GSAP + ScrollTrigger

## Scroll System

* Lenis (smooth scrolling)

## Interaction Layer

* Native pointer events (R3F)

## Shader Layer

* GLSL (via drei / custom materials)

---

## Why this stack

### React Three Fiber

* declarative scene graph
* integrates with React lifecycle
* allows composition WITHOUT UI mindset

---

### GSAP

* precise timeline control
* scroll → progress mapping
* deterministic animation (critical)

---

### Lenis

* removes native scroll inconsistencies
* provides smooth, continuous progression

---

### GLSL

* enables:

  * depth effects
  * custom lighting
  * distortion
  * high-end visuals

---

# 3. ARCHITECTURE (CRITICAL)

We do NOT build:

* pages
* sections

We build:

> a single persistent 3D experience

---

## Root Structure

```id="n5a4c1"
<App>
  <ScrollController />
  <Experience />
  <OverlayUI />
</App>
```

---

## Responsibilities

### ScrollController

* maps scroll → progress (0 → 1)
* updates global state

---

### Experience (CORE)

* contains:

  * camera system
  * scene graph
  * timeline reactions

---

### OverlayUI

* minimal HTML layer
* used ONLY for:

  * text overlays (if needed)
  * links
  * accessibility

---

# 4. STATE MODEL

Single source of truth:

```js id="q2z8lx"
const experience = {
  progress: 0,      // global timeline
  mouse: { x: 0, y: 0 },
}
```

---

## Rule

NO scattered state.

Everything derives from:

> progress

---

# 5. SCENE COMPOSITION

We do NOT create “sections”.

We create:

> persistent scene objects that react to progress

---

## Example Structure

```id="z7m1pt"
<Experience>
  <CameraRig />
  <Scene_Entry />
  <Scene_Authority />
  <Scene_System />
  <Scene_Projects />
  <Scene_Climax />
  <Scene_Outro />
</Experience>
```

---

## Important

All scenes:

* exist at all times
* control visibility via progress
* do NOT mount/unmount aggressively

---

# 6. CAMERA IMPLEMENTATION

Camera is controlled centrally:

```js id="h4k2ds"
useFrame(() => {
  camera.position.lerp(targetPosition, 0.08)
  camera.lookAt(targetTarget)
})
```

---

## Target Mapping

```js id="9s2mva"
targetPosition = getCameraPosition(progress)
targetTarget   = getCameraTarget(progress)
```

---

## Rule

Camera NEVER depends on scene components.

Scenes respond to camera—not the opposite.

---

# 7. SCROLL → PROGRESS PIPELINE

---

## Lenis Setup

```js id="l3d9fw"
lenis.on('scroll', ({ progress }) => {
  experience.progress = progress
})
```

---

## Alternative (GSAP-controlled)

```js id="t8f1bx"
ScrollTrigger.create({
  onUpdate: (self) => {
    experience.progress = self.progress
  }
})
```

---

## Rule

Scroll is converted into:

> a normalized timeline value

---

# 8. ANIMATION STRATEGY

We avoid:

* independent animations
* component-level motion

---

We use:

> derived animation from progress

---

## Example

```js id="b6x8wd"
mesh.position.z = lerp(50, 0, progressRange(0.3, 0.5))
```

---

## Helper

```js id="g5c3kv"
function progressRange(start, end) {
  return clamp((progress - start) / (end - start), 0, 1)
}
```

---

# 9. INTERACTION SYSTEM

---

## Mouse Tracking

```js id="w1v7rx"
onPointerMove(e) {
  mouse.x = normalize(e.clientX)
  mouse.y = normalize(e.clientY)
}
```

---

## Camera Influence

```js id="c9m2jq"
camera.position.x += mouse.x * 0.5
camera.position.y += mouse.y * 0.3
```

---

## Object Interaction

* raycasting via R3F
* hover states
* subtle scaling / glow

---

## Rule

Interaction must:

* be immediate
* be subtle
* never break flow

---

# 10. PERFORMANCE STRATEGY

---

## Constraints

* target 60 FPS
* avoid heavy geometry
* limit draw calls

---

## Techniques

* instancing for repeated objects
* texture compression
* LOD (level of detail)
* frustum culling

---

## Critical

Performance drops = immersion breaks

---

# 11. LAYERING SYSTEM

---

## 3 Layers

### 1. WebGL Layer

* main experience
* all 3D

---

### 2. HTML Layer

* minimal text
* UI fallback

---

### 3. Postprocessing Layer

* bloom
* depth of field
* color grading

---

# 12. AUDIO (OPTIONAL BUT POWERFUL)

---

## Implementation

* Web Audio API
* triggered by:

  * hover
  * transitions
  * scene changes

---

## Rule

Audio must be:

* subtle
* synchronized
* never intrusive

---

# 13. WHAT WE AVOID

---

## DO NOT USE

* page routing
* component-driven animation logic
* CSS animation systems
* UI frameworks controlling flow

---

## WHY

They break:

> the timeline → camera → scene hierarchy

---

# 14. FINAL TECH DEFINITION

This system is:

> A single, persistent, WebGL-driven environment where all motion, interaction, and rendering are derived from a unified timeline, controlled by scroll, and expressed through a central camera system.

It is NOT:

* a React app with 3D inside
* a UI with animations

It is:

> a real-time simulation controlled by time.
