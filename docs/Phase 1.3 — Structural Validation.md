# PHASE 1.3 — STRUCTURAL VALIDATION

## Objective

Determine whether the Phase 1 implementation is actually a faithful structural reconstruction of the reference.

This is an **audit and correction phase**.

Do not treat the existing implementation as correct merely because it builds.

---

# 1. READ FIRST

Read:

1. `Docs/RULES_OF_RECONSTRUCTION.md`
2. Claude's architecture/specification
3. `Docs/PHASE_1_RECONNAISSANCE_REPORT.md`
4. `Docs/PHASE_1_2_IMPLEMENTATION_REPORT.md`

---

# 2. RUN THE WEBSITE

Start the target application.

Verify:

- build
- startup
- routing
- page loading
- console errors
- runtime errors

---

# 3. PAGE-BY-PAGE COMPARISON

For every reference page:

1. open the reference
2. open the implementation
3. use equivalent viewport dimensions
4. compare them directly

Do not judge whether the implementation "looks good."

Judge whether it matches the reference structure.

---

# 4. ROUTE AUDIT

Verify:

- every reference route exists
- every implemented route corresponds to a reference route
- navigation targets are correct
- no fictional routes exist

---

# 5. CONTENT AUDIT

Check every major text element.

Verify:

- exact wording
- headings
- paragraphs
- labels
- buttons
- links
- project names
- metadata
- footer content

Any invented content is a failure.

Remove it.

---

# 6. SECTION AUDIT

For every page compare:

- section count
- ordering
- hierarchy
- presence
- absence
- approximate size
- spacing
- alignment

If a reference section is missing:

**implement it.**

If an implementation section does not exist in the reference:

**remove it unless explicitly justified by the specification.**

---

# 7. GEOMETRY AUDIT

Compare:

- container width
- section height
- element positions
- spacing
- padding
- margins
- grids
- columns
- stacking
- image regions
- text regions
- alignment
- overflow

The goal is spatial fidelity.

---

# 8. RESPONSIVE AUDIT

Test representative:

- desktop
- tablet
- mobile

Compare the structural behavior.

Look specifically for:

- incorrect stacking
- missing elements
- elements that should disappear but don't
- incorrect order
- incorrect widths
- incorrect positioning
- broken overflow
- collapsed media regions

---

# 9. PLACEHOLDER AUDIT

Verify every significant reference visual.

If it is not implemented yet:

- the correct placeholder must exist
- the region must have the correct approximate geometry
- the placeholder must not collapse the layout

No significant visual may simply disappear.

---

# 10. INVENTION AUDIT

Search the implementation for anything that has no evidence.

Look for:

- invented text
- invented sections
- invented projects
- invented cards
- invented images
- invented navigation
- invented buttons
- unrelated components
- content imported from unrelated repositories

Remove anything unsupported.

---

# 11. ARCHITECTURE AUDIT

Verify that the implementation:

- uses the intended framework
- maintains a coherent structure
- doesn't contain unnecessary duplicated pages
- doesn't contain unrelated application code
- doesn't incorporate unrelated project systems

---

# 12. CORRECTION

When discrepancies are found:

**FIX THEM.**

Do not merely list them in the report.

The purpose of this phase is to leave the repository in a corrected state.

---

# 13. FINAL REPORT

Create:

`Docs/PHASE_1_3_VALIDATION_REPORT.md`

Include:

```text
ROUTES
Reference routes:
Implemented routes:
Missing:
Unexpected:

PAGES
Reference pages:
Implemented pages:
Missing:

SECTIONS
Missing:
Unexpected:

CONTENT
Missing:
Incorrect:
Invented:

MEDIA
Missing:
Placeholders:
Unexpected:

RESPONSIVE
Issues found:
Issues fixed:

ARCHITECTURE
Issues found:
Issues fixed:

FINAL STATUS
PASS / FAIL
```

---

# PASS REQUIREMENT

Phase 1.3 is PASS only when:

- no reference page is missing
- no required section is missing
- no unsupported section remains
- no invented content remains
- no significant visual region is missing
- all required placeholders exist
- structural geometry is reasonably faithful
- responsive structure is represented
- routes work
- the application runs without obvious errors

Only after this phase passes may Phase 2 begin.