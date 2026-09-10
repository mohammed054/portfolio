# PHASE 2 — VISUAL & INTERACTION RECONSTRUCTION

## Objective

Transform the validated Phase 1 structural skeleton into a high-fidelity reconstruction of the reference website.

Phase 1 established **what exists and where it exists**.

Phase 2 establishes **how it looks, moves, behaves, and feels**.

The reference remains the source of truth.

---

# 1. READ FIRST

Read completely:

1. `Docs/RULES_OF_RECONSTRUCTION.md`
2. Claude's architecture/specification
3. `Docs/PHASE_1_RECONNAISSANCE_REPORT.md`
4. `Docs/PHASE_1_2_IMPLEMENTATION_REPORT.md`
5. `Docs/PHASE_1_3_VALIDATION_REPORT.md`

Do not begin if Phase 1.3 has not passed.

---

# 2. VISUAL FIDELITY

Reconstruct the reference's actual:

- colors
- typography
- font weights
- font sizes
- line heights
- letter spacing
- borders
- radii
- shadows
- gradients
- backgrounds
- image treatments
- overlays
- opacity
- layering
- spacing
- proportions

Do not create a new visual style.

---

# 3. TYPOGRAPHY

Investigate the actual reference typography.

Match:

- font family
- font weight
- size
- line height
- letter spacing
- casing
- wrapping
- alignment
- responsive changes

Typography is part of the reconstruction, not decoration.

---

# 4. MEDIA

Replace placeholders with actual media wherever reliably possible.

Investigate:

- image assets
- image crops
- image positioning
- videos
- background videos
- SVGs
- animated assets
- canvas
- WebGL
- 3D
- embedded media

Do not use random substitutes when the reference asset can be identified.

---

# 5. ANIMATIONS

Reconstruct observed animations.

For each animation determine:

- trigger
- duration
- delay
- easing
- direction
- movement
- scale
- opacity
- rotation
- looping
- scroll relationship
- hover relationship
- page-load relationship

Do not create arbitrary animations simply because the page would benefit from motion.

---

# 6. INTERACTIONS

Reconstruct observed interactions such as:

- hover
- cursor
- magnetic buttons
- image movement
- scrolling
- reveals
- menus
- sliders
- carousels
- filters
- page transitions
- interactive media

Match behavior rather than merely adding an approximate effect.

---

# 7. COMPLEX MEDIA

For:

- WebGL
- Canvas
- shaders
- 3D
- particle systems
- interactive visualizations
- complex distortion
- custom cursor systems

first investigate how the reference behaves.

Do not fake a sophisticated visual with an unrelated animation.

If the exact implementation is impossible, reproduce the observable behavior as faithfully as technically possible and document the deviation.

---

# 8. RESPONSIVE VISUAL FIDELITY

Repeat the visual reconstruction across:

- desktop
- tablet
- mobile

Do not make desktop correct and assume mobile will follow automatically.

Match responsive:

- typography
- spacing
- media
- proportions
- positioning
- visibility
- interactions
- animation behavior

---

# 9. SCROLL BEHAVIOR

Investigate and reproduce observed:

- smooth scrolling
- parallax
- scroll reveals
- pinned sections
- horizontal scrolling
- scroll-linked animation
- progress indicators
- sticky elements

Do not add scroll effects that are not present.

---

# 10. HOVER / CURSOR FIDELITY

If the reference has custom pointer behavior, investigate:

- cursor size
- cursor movement
- hover states
- magnetic distance
- easing
- labels
- blend modes
- transitions
- interaction targets

Do not create a generic custom cursor if the reference uses a different behavior.

---

# 11. VISUAL COMPARISON LOOP

For every major page/section:

1. render the implementation
2. capture a screenshot
3. compare against the reference
4. identify discrepancies
5. fix discrepancies
6. render again
7. repeat

Do not rely exclusively on memory.

---

# 12. PRIORITY ORDER

When correcting visual differences, prioritize:

1. overall composition
2. section geometry
3. typography
4. major media
5. spacing
6. colors
7. visual treatments
8. interactions
9. animations
10. micro-details

---

# 13. NO CREATIVE IMPROVEMENT

Do not:

- make it prettier
- make it more modern
- add effects
- add gradients
- add glassmorphism
- add unnecessary animations
- change typography because you prefer another font
- redesign mobile
- add sections

The target is fidelity.

---

# 14. PERFORMANCE

Implement effects responsibly.

Avoid unnecessary:

- rendering loops
- huge assets
- expensive effects
- excessive DOM nodes
- unnecessary libraries

However:

**Do not remove a reference effect solely because it is technically inconvenient.**

Find an appropriate implementation first.

---

# 15. CODE QUALITY

Keep the implementation:

- maintainable
- modular
- typed where appropriate
- free of debug artifacts
- free of dead code
- free of unrelated code
- consistent with the existing architecture

Do not rewrite unrelated systems.

---

# 16. FINAL PHASE 2 REPORT

Create:

`Docs/PHASE_2_IMPLEMENTATION_REPORT.md`

Include:

- visual systems implemented
- typography
- media
- animations
- interactions
- responsive behavior
- complex effects
- remaining discrepancies
- known technical deviations
- performance considerations

Do not claim exact fidelity if a deviation remains.

---

# COMPLETION

Phase 2 is complete only when:

- visual styling has been reconstructed
- media has been reconstructed
- major interactions have been reconstructed
- major animations have been reconstructed
- responsive visuals have been reconstructed
- placeholders have been resolved where possible
- remaining unknowns are documented
- the implementation has been repeatedly compared against the reference

Then proceed to Phase 3.