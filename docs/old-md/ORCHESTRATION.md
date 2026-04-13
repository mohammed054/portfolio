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