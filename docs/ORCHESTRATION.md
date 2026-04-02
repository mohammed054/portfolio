# 07 — BUILD ORCHESTRATION (MASTER ORDER)

## ROLE

This file defines the **exact order** you feed specs into AI systems.

You NEVER deviate from this order.

Each step must be:

* completed
* tested
* visually validated
  before moving to the next.

---

# 🧭 EXECUTION PIPELINE

## PHASE 0 — FOUNDATION

1. `00-masterblueprint.md`
2. `02-tech-stack.md`
3. `03-variables.md`
4. `05-experience-architecture.md`

✔ Goal: full system understanding before code

---

## PHASE 1 — CORE ENGINE

5. `core/ExperienceProvider`
6. `systems/useScroll (progress system)`
7. `core/ScrollController`

✔ Goal: global progress (0 → 1) working

---

## PHASE 2 — CAMERA SYSTEM (CRITICAL)

8. `experience/CameraRig`

✔ Must be PERFECT before anything else

Validation:

* smooth damping
* no jitter
* scroll → camera mapping stable

---

## PHASE 3 — SCENE 1 (ENTRY)

9. `scenes/EntryScene`

✔ First spatial validation of system

---

## PHASE 4 — SCENE 2 (AUTHORITY)

10. `scenes/AuthorityScene`

✔ Typography + depth test

---

## PHASE 5 — SCENE 3 (CAPABILITY)

11. `scenes/CapabilityScene`

✔ Systems + interaction test

---

## PHASE 6 — SCENE 4 (PROJECTS CORE)

12. `scenes/ProjectsScene`

✔ Reusable world logic test

---

## PHASE 7 — SCENE 5 (CLIMAX)

13. `scenes/ClimaxScene`

✔ High-end cinematic peak

---

## PHASE 8 — SCENE 6 (OUTRO)

14. `scenes/OutroScene`

✔ Release + interaction loosened

---

## PHASE 9 — POLISH LAYER

15. postprocessing
16. lighting refinement
17. motion tuning
18. audio (optional)

---

# ⚠️ RULES

* NEVER skip CameraRig validation
* NEVER build multiple scenes at once
* ALWAYS test after each step
* DO NOT proceed if motion feels wrong

---

# 🧠 CORE PRINCIPLE

> Motion quality > visual complexity

If motion is bad, everything is bad.
