# PHASE 1 — RECONNAISSANCE

## Objective

Before writing or modifying implementation code, perform a forensic reconstruction of the reference website.

This phase is **analysis only**.

Do not build the website during this phase.

Do not redesign anything.

Do not make creative decisions.

The goal is to establish an evidence-backed understanding of exactly what must be reconstructed.

---

# 1. READ THE DOCUMENTATION FIRST

Read completely:

1. `Docs/RULES_OF_RECONSTRUCTION.md`
2. Claude's architecture/specification Markdown
3. Any other documentation explicitly relevant to this reconstruction

Do not skim the specification.

Understand every page, section, component, placeholder, observation, inference, and unknown.

---

# 2. INSPECT THE TARGET REPOSITORY

Before making any changes, inspect:

- directory structure
- package.json
- lockfile
- framework
- build system
- configuration files
- source files
- routes
- components
- styling system
- asset directories
- existing dependencies
- environment configuration where relevant

Do not assume the repository is empty.

Do not assume the architecture from the Claude document is already implemented.

Do not replace the repository.

---

# 3. INSPECT THE LIVE REFERENCE

Use browser/live-site inspection wherever available.

Inspect the reference at the highest level of detail possible.

You must investigate:

### Pages

Discover every reachable page and route.

Inspect:

- homepage
- navigation destinations
- footer destinations
- internal links
- project pages
- about pages
- contact pages
- archive/index pages
- legal pages
- other discoverable routes

Do not stop after inspecting the homepage.

---

# 4. ROUTE INVENTORY

Create a complete route inventory.

For every route record:

- URL
- page title where observable
- page purpose
- navigation entry point
- whether it is global/page-specific
- important sections
- important media
- responsive behavior
- unknowns

Do not invent routes.

---

# 5. PAGE STRUCTURE

For every page, reconstruct the hierarchy:

```text
Page
├── Global shell
├── Section
│   ├── Component
│   ├── Component
│   └── Media
├── Section
└── Footer
```

Identify:

- section ordering
- parent/child relationships
- repeated structures
- page-specific structures
- containers
- columns
- grids
- flex layouts
- stacking
- fixed elements
- sticky elements
- overlays
- absolute-positioned elements

---

# 6. EXACT CONTENT

Record visible text from the reference.

Do not rewrite it.

Record:

- headings
- paragraphs
- labels
- buttons
- navigation text
- links
- project names
- metadata
- captions
- footer text

If text is dynamic or changes depending on state, document the observed states.

---

# 7. LAYOUT RECONSTRUCTION

For each important region determine, where observable:

- width
- height
- max-width
- margins
- padding
- alignment
- positioning
- grid/flex behavior
- gaps
- stacking
- overflow
- viewport relationship
- aspect ratio

Focus on **geometry**, not visual polish.

---

# 8. RESPONSIVE RECONSTRUCTION

Inspect multiple viewport sizes.

Determine:

- what moves
- what disappears
- what changes size
- what changes order
- what becomes stacked
- what remains fixed
- how navigation changes
- how media changes
- how spacing changes
- how typography changes structurally

Do not assume conventional responsive behavior.

Use evidence.

---

# 9. MEDIA INVESTIGATION

Identify every significant visual asset.

For each one determine:

- type
- source
- location
- dimensions
- aspect ratio
- purpose
- page
- section
- whether it can be directly reused
- whether it requires reconstruction
- whether its implementation is unknown

Investigate:

- images
- SVGs
- videos
- background videos
- GIFs
- canvas
- WebGL
- 3D
- animated graphics
- embedded media
- iframes
- icons
- logos

---

# 10. PLACEHOLDER VERIFICATION

Compare all visual regions against Claude's placeholder inventory.

For every placeholder determine:

- does the reference actually contain it?
- where is it?
- what are its approximate dimensions?
- what surrounds it?
- how does it behave responsively?
- can its implementation now be identified?

Do not remove a placeholder merely because the implementation is difficult.

---

# 11. INTERACTION INVESTIGATION

Identify observable:

- hover states
- clicks
- navigation behavior
- scrolling behavior
- cursor effects
- magnetic interactions
- image movement
- reveals
- transitions
- menus
- accordions
- sliders
- carousels
- filters
- loading states
- page transitions

Record what is actually observable.

Do not invent behavior.

---

# 12. ANIMATION INVESTIGATION

For every significant animation determine:

- trigger
- target
- movement
- duration
- timing
- direction
- looping
- scroll dependency
- hover dependency
- page-load dependency
- interaction dependency
- whether it appears to be CSS, JS, WebGL, Canvas, video, etc.

If implementation cannot be established:

**mark it UNKNOWN.**

Do not fabricate technical details.

---

# 13. FONT INVESTIGATION

Where possible identify:

- font family
- font source
- font files
- weight
- style
- variable-font behavior

Do not substitute a random font merely because it looks similar.

---

# 14. ARCHITECTURAL MAPPING

Map the reference into:

- global components
- shared components
- page-specific components
- layout components
- media components
- interaction systems
- data/content structures

Do not over-abstract.

A component should be shared only when there is evidence of repeated structure or behavior.

---

# 15. EVIDENCE CLASSIFICATION

Every significant conclusion must be classified:

`OBSERVED`

`INFERRED`

`UNKNOWN`

If UNKNOWN, document what would be required to resolve it.

---

# 16. OUTPUT

Create a detailed reconstruction report in:

`Docs/PHASE_1_RECONNAISSANCE_REPORT.md`

The report must contain:

1. Repository findings
2. Complete route inventory
3. Page-by-page structure
4. Component inventory
5. Exact content inventory
6. Layout/geometry findings
7. Responsive findings
8. Media inventory
9. Placeholder inventory
10. Interaction inventory
11. Animation inventory
12. Font findings
13. Technical findings
14. Conflicts between Claude specification and live reference
15. Unknowns requiring later investigation
16. Recommended implementation order

---

# 17. CRITICAL RESTRICTION

**DO NOT IMPLEMENT THE WEBSITE.**

Do not create the Phase 1 skeleton.

Do not create components merely for the purpose of completing the analysis.

Do not write the final styling.

Do not modify the architecture simply to begin implementation.

This phase exists to make implementation deterministic.

---

# COMPLETION CRITERIA

Phase 1 Reconnaissance passes only when:

- the reference has been comprehensively inspected
- routes are inventoried
- pages are mapped
- content is recorded
- components are mapped
- media is inventoried
- placeholders are verified
- responsive behavior is investigated
- interactions are investigated
- animations are investigated
- unknowns are explicitly documented
- the target repository is understood
- the report has been written

Then stop.

Do not proceed automatically to Phase 1.2.