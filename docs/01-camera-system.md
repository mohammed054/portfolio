# 01 — CAMERA SYSTEM

**Role:** Primary narrative driver
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
* scene activation

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
* depth progression

---

## 2. Target (LookAt)

```js
camera.lookAt = (x, y, z)
```

Defines:

* what user focuses on
* narrative emphasis

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
* weight
* realism

---

# 4. CAMERA PATH STRUCTURE

The entire experience is one continuous path.

---

## Global Path Concept

```text
Z-axis dominant movement
+ subtle X/Y shifts
```

Camera primarily:

* moves forward (Z)
* adjusts laterally (X/Y) for composition

---

## Path Segmentation (Logical, not visual)

| Phase      | Progress Range |
| ---------- | -------------- |
| Entry      | 0.00 – 0.15    |
| Authority  | 0.15 – 0.30    |
| Capability | 0.30 – 0.50    |
| Proof      | 0.50 – 0.75    |
| Climax     | 0.75 – 0.90    |
| Outro      | 0.90 – 1.00    |

---

# 5. CAMERA BEHAVIOR PER PHASE

---

## 1. ENTRY (0.00 → 0.15)

### Movement

* slow forward drift
* minimal rotation

### Purpose

* establish space
* build curiosity

### Parameters

* low speed
* high damping
* small mouse influence

---

## 2. AUTHORITY (0.15 → 0.30)

### Movement

* aggressive push forward
* slight downward angle

### Purpose

* create impact
* introduce identity

### Parameters

* increased speed
* reduced damping
* minimal lateral movement

---

## 3. CAPABILITY (0.30 → 0.50)

### Movement

* orbital motion around center
* controlled rotation

### Purpose

* demonstrate system thinking

### Parameters

* moderate speed
* controlled X/Y movement
* increased mouse interaction

---

## 4. PROOF (0.50 → 0.75)

### Movement

* guided zooms into targets
* stop → inspect → move

### Purpose

* highlight projects

### Parameters

* segmented motion
* temporary slowdowns
* focus locking

---

## 5. CLIMAX (0.75 → 0.90)

### Movement

* slow cinematic push
* minimal interaction

### Purpose

* maximize immersion
* deliver peak moment

### Parameters

* very high damping
* reduced user influence
* smooth FOV shifts

---

## 6. OUTRO (0.90 → 1.00)

### Movement

* slight pullback
* loosened motion

### Purpose

* release tension
* allow exploration

### Parameters

* increased mouse influence
* relaxed constraints

---

# 6. FOV SYSTEM (CRITICAL FOR SCALE)

FOV is used to manipulate perception.

---

## Behavior

* Narrow FOV → compression, seriousness
* Wide FOV → expansion, openness

---

## Usage

| Phase      | FOV Behavior      |
| ---------- | ----------------- |
| Entry      | neutral           |
| Authority  | slightly narrow   |
| Capability | dynamic           |
| Proof      | stable            |
| Climax     | gradual expansion |
| Outro      | widest            |

---

# 7. MOUSE INFLUENCE MODEL

Mouse does NOT move camera freely.

It offsets:

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

---

# 8. TRANSITION SYSTEM

No cuts. No jumps.

---

## Rule

> Every transition must be spatially continuous

---

## Methods

### 1. Depth Transition

* move forward into next scene

### 2. Occlusion

* object passes in front → reveals next

### 3. Scale Transition

* zoom into object → becomes environment

---

# 9. FOCUS SYSTEM

At any time:

> Only ONE focal target exists

---

## Implementation

* camera.lookAt always points to:

  * object of importance
  * text anchor
  * interaction point

---

## Constraint

No competing focal points.

---

# 10. FAILURE CONDITIONS

If any of these happen, system is broken:

---

### ❌ Camera feels user-controlled

→ loses direction

### ❌ Movement is linear

→ feels like UI scroll

### ❌ Multiple focal points

→ confusion

### ❌ Sudden jumps

→ breaks immersion

### ❌ No damping

→ feels robotic

---

# 11. FINAL SYSTEM DEFINITION

The camera system is:

> A constrained, timeline-driven, physically-smoothed navigation system where scroll defines progression, mouse adds subtle influence, and all movement is continuous, purposeful, and narrative-driven.

It is NOT:

* free navigation
* reactive animation system
* UI transition layer

It is:

> the engine of the experience.
