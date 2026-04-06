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