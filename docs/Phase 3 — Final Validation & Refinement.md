# PHASE 3 — FINAL VALIDATION & REFINEMENT

## Objective

Perform the final forensic comparison between the implementation and the reference.

This phase is not a report-only audit.

**Find discrepancies → fix them → verify again.**

---

# 1. READ FIRST

Read:

1. `Docs/RULES_OF_RECONSTRUCTION.md`
2. Claude's architecture/specification
3. all Phase 1 reports
4. `Docs/PHASE_2_IMPLEMENTATION_REPORT.md`

---

# 2. COMPLETE ROUTE TEST

Test every route.

For each route verify:

- loads directly
- navigation works
- links work
- no broken assets
- no runtime errors
- no unexpected redirects

---

# 3. DESKTOP COMPARISON

Compare every page at representative desktop dimensions.

Check:

- composition
- typography
- spacing
- media
- colors
- positioning
- animations
- interactions
- footer
- navigation
- viewport behavior

---

# 4. TABLET COMPARISON

Repeat the complete comparison for tablet dimensions.

---

# 5. MOBILE COMPARISON

Repeat the complete comparison for mobile dimensions.

Pay special attention to:

- navigation
- text wrapping
- image crops
- section height
- spacing
- stacking
- hidden elements
- touch interactions
- animations

---

# 6. MEDIA AUDIT

Verify every significant reference media element.

Check:

- correct asset
- correct crop
- correct position
- correct aspect ratio
- correct loading behavior
- correct animation
- correct responsive behavior

---

# 7. TYPOGRAPHY AUDIT

Verify:

- font
- weight
- size
- line height
- letter spacing
- wrapping
- alignment
- responsive behavior

---

# 8. INTERACTION AUDIT

Test every observable interaction.

Verify:

- hover
- click
- cursor
- menus
- scrolling
- reveals
- sliders
- carousels
- transitions
- page navigation
- interactive media

---

# 9. ANIMATION AUDIT

Verify:

- trigger
- timing
- easing
- movement
- scale
- opacity
- sequencing
- looping
- scroll behavior
- responsiveness

---

# 10. DIFFERENCE LOG

For every meaningful discrepancy record:

```text
Page:
Section:
Reference behavior:
Current behavior:
Difference:
Severity:
Fix:
Status:
```

Severity:

- CRITICAL
- HIGH
- MEDIUM
- LOW

Fix all CRITICAL and HIGH discrepancies.

Fix MEDIUM and LOW discrepancies where practical.

---

# 11. INVENTION CHECK

Perform one final search for unsupported additions.

Remove:

- invented content
- invented sections
- invented media
- unrelated code
- unrelated project content
- unnecessary design systems
- unused components
- debug UI
- development placeholders that should have been resolved

---

# 12. CODEBASE CLEANUP

Check:

- unused dependencies
- unused imports
- dead components
- console logs
- debug code
- broken links
- missing keys
- obvious accessibility problems
- obvious responsive bugs
- build warnings

Do not perform unrelated refactors.

---

# 13. PERFORMANCE CHECK

Identify obvious:

- excessive rendering
- oversized assets
- unnecessary JavaScript
- unnecessary dependencies
- animation performance problems
- layout thrashing

Improve them without changing observable reference behavior.

---

# 14. FINAL BUILD

Run the production build.

Fix:

- compilation errors
- type errors
- route errors
- runtime errors
- asset errors

Do not declare completion while obvious errors remain.

---

# 15. FINAL REPORT

Create:

`Docs/PHASE_3_FINAL_VALIDATION_REPORT.md`

Include:

## Routes

Total reference routes:
Total implemented routes:
Missing:
Unexpected:

## Visual Fidelity

Critical issues:
High issues:
Medium issues:
Low issues:

## Interactions

Verified:
Missing:
Fixed:

## Animations

Verified:
Missing:
Fixed:

## Responsive

Desktop:
Tablet:
Mobile:

## Code Quality

Build:
Runtime:
Warnings:
Dead code:
Unused dependencies:

## Final Discrepancies

List anything that remains different from the reference and explain why.

## Final Status

`PASS` or `FAIL`

---

# FINAL PASS CONDITION

The project may be marked PASS only when:

- all reference routes work
- no significant reference section is missing
- no unsupported content exists
- major visual differences have been corrected
- major interactions work
- major animations work
- responsive behavior works
- media is correct or documented where technically impossible
- production build succeeds
- no obvious runtime errors remain

The objective is not perfection by subjective taste.

The objective is **faithful reconstruction of the reference website.**