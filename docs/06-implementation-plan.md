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