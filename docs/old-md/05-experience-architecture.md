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