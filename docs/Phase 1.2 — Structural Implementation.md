# PHASE 1.2 — STRUCTURAL IMPLEMENTATION

## Objective

Implement the reference website's **structural skeleton** using the evidence collected during Phase 1.

This is not visual polishing.

This is not creative web design.

The result must represent the actual reference website geometrically and structurally before advanced visual fidelity is applied.

---

# 1. READ FIRST

Read completely:

1. `Docs/RULES_OF_RECONSTRUCTION.md`
2. Claude's architecture/specification
3. `Docs/PHASE_1_RECONNAISSANCE_REPORT.md`

The reconnaissance report is mandatory.

Do not begin implementation until you understand it.

---

# 2. INSPECT THE REPOSITORY AGAIN

Before editing:

- inspect current files
- inspect changes since reconnaissance
- inspect package.json
- inspect routes
- inspect existing components
- inspect configuration
- inspect assets

Do not assume the repository state.

---

# 3. IMPLEMENT ONLY WHAT IS VERIFIED

Implement the pages, routes, sections, components, and content identified during reconnaissance.

Do not invent anything.

Every significant implementation element must have evidence from:

- the live reference
- Claude's specification
- or the reconnaissance report

---

# 4. ROUTES

Implement every verified discoverable route.

Verify:

- URL
- navigation
- internal links
- page availability
- direct navigation

Do not create fictional routes.

---

# 5. COMPONENT STRUCTURE

Create a clean component hierarchy representing the reference.

Use reusable components when structure genuinely repeats.

Do not:

- create giant monolithic pages
- duplicate identical structures unnecessarily
- create an elaborate design system that the reference does not require
- over-abstract simple page-specific structures

---

# 6. CONTENT

Use exact observed content.

Do not:

- rewrite
- paraphrase
- summarize
- generate
- substitute
- invent

No Lorem Ipsum.

No AI-generated marketing copy.

---

# 7. STRUCTURAL STYLING

Implement enough styling to establish:

- page dimensions
- containers
- widths
- heights
- margins
- padding
- grid
- flex
- gaps
- positioning
- stacking
- alignment
- overflow
- basic responsive behavior

The goal is to reproduce the **geometry** of the reference.

---

# 8. DO NOT POLISH YET

Do not spend time implementing advanced:

- shadows
- gradients
- elaborate borders
- complex image treatments
- cinematic typography
- advanced visual effects
- custom cursor effects
- WebGL
- shaders
- complex Canvas
- sophisticated animation
- magnetic interactions
- advanced hover transitions
- page-transition systems

These belong to later phases.

However, their structural requirements must be preserved.

---

# 9. MEDIA

Where the actual reference asset is reliably available and appropriate, use it.

If the asset/implementation is not available:

**use the specified placeholder.**

Never remove the region.

Never collapse the surrounding layout.

Never substitute a random image.

---

# 10. PLACEHOLDER IMPLEMENTATION

Every required placeholder from the specification/reconnaissance must physically exist in the implementation.

The placeholder must preserve:

- position
- approximate dimensions
- aspect ratio
- alignment
- layering
- spacing
- responsive behavior

Make placeholders visibly identifiable during development.

Example:

```text
[HERO IMAGE]
Large editorial portrait
```

or:

```text
[WEBGL / INTERACTIVE VISUAL]
Large circular interactive visual
```

These labels are development-only.

Do not mistake placeholders for final visual implementations.

---

# 11. RESPONSIVE STRUCTURE

Implement verified responsive structural behavior.

Test at multiple viewport sizes.

Do not assume:

> desktop = stacked mobile

Determine the actual behavior from the reference.

---

# 12. GLOBAL ELEMENTS

Implement verified:

- navigation
- header
- footer
- fixed elements
- sticky elements
- global wrappers
- global links
- page shell

Do not add conventional elements that aren't present.

---

# 13. INTERACTIONS

Implement only simple structural interactions where required to make the site functional.

Examples:

- navigation links
- menu open/close if necessary for structural testing
- basic routing
- basic controls

Advanced interaction fidelity belongs to Phase 2.

Document deferred behavior.

---

# 14. ANIMATIONS

Do not attempt to fake complex animations.

For every deferred animation:

- preserve its spatial region
- preserve its dimensions
- preserve surrounding layout
- record it for Phase 2

Do not replace a complex animation with a random CSS animation.

---

# 15. NO CREATIVE SUBSTITUTION

If you encounter:

> "I don't know how to implement this."

Do NOT respond by designing something else.

Instead:

1. investigate
2. determine whether it is structurally required
3. preserve the region
4. use a placeholder if necessary
5. document it for Phase 2

---

# 16. VALIDATION WHILE IMPLEMENTING

After implementing each major page:

1. run the application
2. open the corresponding reference page
3. compare structure
4. compare section ordering
5. compare geometry
6. compare content
7. compare media regions
8. compare responsive behavior
9. fix discrepancies

Do not wait until the end to discover that the page structure is wrong.

---

# 17. REQUIRED IMPLEMENTATION QUALITY

Code must be:

- maintainable
- typed where appropriate
- semantic
- reasonably modular
- responsive
- free of obvious duplication
- free of debug artifacts
- free of dead code
- buildable

Do not sacrifice fidelity for abstraction.

---

# 18. OUTPUT

After implementation, update:

`Docs/PHASE_1_2_IMPLEMENTATION_REPORT.md`

Include:

- routes implemented
- pages implemented
- components created
- content implemented
- media implemented
- placeholders implemented
- deferred animations
- deferred interactions
- architecture changes
- known discrepancies
- unresolved issues

---

# COMPLETION CRITERIA

Phase 1.2 passes only when:

- every verified route is implemented
- every verified page exists
- every verified section exists
- section ordering matches
- exact content is present
- structural geometry is represented
- responsive structure exists
- media regions exist
- required placeholders exist
- navigation works
- no invented content has been introduced
- no unrelated project content has been introduced
- the application builds and runs

Then stop.

Do not begin Phase 2 automatically.