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