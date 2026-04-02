# 05 — EXPERIENCE ARCHITECTURE

**Role:** Defines how the codebase is structured
**Goal:** Maintain control, scalability, and clarity without breaking the 3D-first philosophy

---

# 1. CORE PRINCIPLE

We are NOT structuring a React app.

We are structuring:

> a real-time simulation system

---

## Architectural Hierarchy

```text id="q3v7hx"
Input (scroll/mouse)
        ↓
Global State (progress)
        ↓
Camera System (driver)
        ↓
Scene System (reactive)
        ↓
Rendering (output)
```

---

# 2. FOLDER STRUCTURE

---

## Root

```text id="b9x2mn"
/src
  /core
  /experience
  /scenes
  /systems
  /utils
  /config
  /components (minimal)
```

---

# 3. CORE LAYERS

---

## /core

### Purpose:

Global engine logic

### Contains:

```text id="n2k5df"
/core
  ExperienceProvider.js
  useExperience.js
  ScrollController.js
```

---

### Responsibilities:

* store global state (progress, mouse)
* update via scroll + pointer
* expose via context or store

---

## /config

### Purpose:

All variables

```text id="k7d4qz"
/config
  variables.js
```

---

### Rule:

NO magic numbers outside this folder

---

## /utils

### Purpose:

Pure helper functions

```text id="c1p8wr"
/utils
  math.js
  easing.js
  ranges.js
```

---

### Example:

* clamp
* lerp
* range mapping

---

# 4. EXPERIENCE LAYER

---

## /experience

### Purpose:

Main 3D world

```text id="x6t9la"
/experience
  Experience.jsx
  CameraRig.jsx
  Lighting.jsx
```

---

### Responsibilities:

#### Experience.jsx

* mounts canvas
* loads all scenes
* connects systems

---

#### CameraRig.jsx (CRITICAL)

* reads progress
* calculates:

  * position
  * lookAt
  * fov
* applies damping

---

#### Lighting.jsx

* controls global lighting
* reacts to timeline

---

# 5. SCENE SYSTEM

---

## /scenes

### Purpose:

All spatial content

```text id="y4m2sx"
/scenes
  EntryScene.jsx
  AuthorityScene.jsx
  CapabilityScene.jsx
  ProjectsScene.jsx
  ClimaxScene.jsx
  OutroScene.jsx
```

---

## Scene Rules

Each scene:

* ALWAYS mounted
* reacts to progress
* controls:

  * visibility
  * opacity
  * position
  * interaction

---

## Example Pattern

```js id="z9h3kw"
const t = range(progress, 0.3, 0.5)

mesh.position.z = lerp(20, 0, t)
mesh.visible = t > 0
```

---

## Critical

Scenes do NOT:

* control camera
* trigger global state
* depend on each other

They are:

> passive responders

---

# 6. SYSTEMS LAYER

---

## /systems

### Purpose:

Reusable behavior modules

```text id="m8v6ty"
/systems
  useScroll.js
  useMouse.js
  useRaycast.js
  useMagnetism.js
```

---

### Examples:

#### useScroll

* syncs Lenis → progress

#### useMouse

* normalizes mouse values

#### useRaycast

* handles hover detection

#### useMagnetism

* applies attraction forces

---

# 7. COMPONENTS (STRICTLY LIMITED)

---

## /components

### Purpose:

UI-only elements

```text id="f5r2bn"
/components
  Overlay.jsx
  Loader.jsx
```

---

## Rule

Components must:

* NOT control 3D logic
* NOT contain animation logic
* only display information

---

# 8. DATA FLOW (VERY IMPORTANT)

---

## Flow Direction

```text id="g2l9cq"
Scroll → progress → camera → scenes → render
```

---

## Forbidden Flow

```text id="d7s4kx"
scene → camera ❌
component → animation ❌
```

---

# 9. CAMERA ISOLATION

---

Camera logic lives ONLY in:

```text id="r8p3vn"
/experience/CameraRig.jsx
```

---

## Rule

No other file:

* modifies camera directly
* accesses camera state

---

# 10. SCENE COMMUNICATION

---

Scenes do NOT talk to each other.

---

## Shared Logic via:

* global progress
* shared config
* reusable systems

---

## Result

Loose coupling
High control
No spaghetti

---

# 11. PERFORMANCE STRUCTURE

---

## Optimization Zones

### Heavy scenes:

* Projects
* Climax

---

## Strategy

* lazy-load assets (not components)
* reduce geometry complexity
* use instancing

---

## Important

Do NOT:

* mount/unmount scenes aggressively
* rely on React lifecycle for animation

---

# 12. DEBUG LAYER (RECOMMENDED)

---

Add:

```text id="q6t1mz"
/debug
  DebugPanel.jsx
```

---

## Features

* display progress value
* toggle scene visibility
* tweak variables live

---

## Purpose

Speeds up tuning massively

---

# 13. BUILD ORDER (CRITICAL)

---

## Step-by-step

1. Setup core + scroll → progress
2. Build CameraRig (no scenes yet)
3. Add EntryScene only
4. Validate motion + damping
5. Add next scene
6. Repeat

---

## Rule

Never build everything at once.

---

# 14. FAILURE CONDITIONS

---

### ❌ Scenes control camera

→ system breaks

### ❌ Multiple sources of truth

→ inconsistent behavior

### ❌ Components contain logic

→ turns into UI app

### ❌ Mount/unmount animations

→ jitter + bugs

---

# 15. FINAL DEFINITION

This architecture is:

> a modular, layered system where a single global timeline drives a central camera, and all scenes react independently within a persistent 3D environment.

It is NOT:

* a component tree
* a page structure
* a UI system

It is:

> an engineered simulation pipeline.
