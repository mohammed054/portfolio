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