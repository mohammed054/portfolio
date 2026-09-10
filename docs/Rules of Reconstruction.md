# RULES OF RECONSTRUCTION

## Purpose

This repository is being used to reconstruct an existing reference website.

The objective is **fidelity to the reference**, not creative website development.

You are an implementation agent, not a designer deciding what the website should be.

The reference website is the primary source of truth.

The Claude architecture/specification document is the secondary source of truth and a structured interpretation of the reference.

The target repository is the implementation environment.

---

# 1. CORE PRINCIPLE

## RECONSTRUCT — DO NOT DESIGN

You must reproduce what exists in the reference website.

You must NOT:

- redesign the website
- improve the design
- modernize the design
- simplify the design
- create your own interpretation
- create a generic portfolio
- add sections because they are common on portfolios
- add content because it seems appropriate
- rewrite copy
- invent copy
- invent images
- invent projects
- invent navigation
- invent buttons
- invent interactions
- invent animations
- invent branding
- invent layouts

If something exists in the reference, reproduce it.

If something does not exist in the reference, do not create it merely because it would make the website "better."

---

# 2. SOURCE OF TRUTH HIERARCHY

Use this hierarchy:

### 1. LIVE REFERENCE WEBSITE

The actual reference website is the highest authority.

Use it to verify:

- pages
- routes
- visible content
- layout
- positioning
- dimensions
- components
- media
- interactions
- animations
- responsive behavior
- navigation
- links
- typography
- visual behavior
- technical implementation where observable

### 2. CLAUDE ARCHITECTURE SPECIFICATION

Use Claude's Markdown specification as the structured architectural interpretation of the reference.

It provides:

- page inventory
- component inventory
- structural analysis
- visual placeholders
- observations
- inferred behavior
- unknowns
- architectural recommendations

If the specification conflicts with direct evidence from the live reference, investigate the reference and use the evidence.

Do not silently invent a compromise.

### 3. TARGET REPOSITORY

The repository tells you:

- what framework is already present
- what dependencies exist
- what configuration exists
- what implementation already exists
- what technical constraints exist

It does NOT determine what the reference website should look like.

---

# 3. OTHER FILES AND REPOSITORIES

You may inspect other files or repositories when necessary to understand the technical environment.

However:

**Other projects are NOT sources of design or content.**

Do not copy or import from other repositories:

- text
- branding
- images
- portfolio projects
- sections
- layouts
- components
- visual identity
- unrelated functionality

unless the current task explicitly requires it and it is supported by the reference.

Reading something does not make it authoritative.

---

# 4. OBSERVED / INFERRED / UNKNOWN

Always distinguish:

### OBSERVED

Directly visible or directly verifiable from the reference.

Example:

> The homepage contains a large centered heading.

### INFERRED

A reasonable technical conclusion derived from evidence.

Example:

> The repeated card structure is probably implemented as a reusable component.

### UNKNOWN

Something that cannot currently be established reliably.

Example:

> The large circular visual may be WebGL, Canvas, or a video; implementation is currently unknown.

Never convert UNKNOWN into an invented implementation.

Investigate first.

If it remains unknown, preserve the visual region using the required placeholder.

---

# 5. NO INVENTION RULE

Before adding any significant element, ask:

> "What evidence proves this exists in the reference?"

If there is no evidence:

**DO NOT ADD IT.**

This applies to:

- text
- headings
- paragraphs
- buttons
- links
- images
- cards
- sections
- navigation items
- animations
- decorative elements
- footer content
- social links
- forms
- portfolio items

---

# 6. CONTENT FIDELITY

Use the actual content from the reference.

Do not:

- paraphrase
- summarize
- improve grammar
- translate
- shorten
- expand
- replace text
- generate placeholder marketing copy

Do not use Lorem Ipsum.

If exact text cannot be obtained, investigate the reference.

If it still cannot be obtained, preserve the structural region without inventing meaningful copy.

---

# 7. VISUAL PLACEHOLDER RULE

A significant visual element must NEVER disappear simply because its implementation or asset is unknown.

Use the placeholder types defined by the architecture specification, including where applicable:

- `[HERO_IMAGE]`
- `[IMAGE]`
- `[VIDEO]`
- `[BACKGROUND_VIDEO]`
- `[ANIMATION]`
- `[INTERACTIVE_ANIMATION]`
- `[WEBGL]`
- `[CANVAS]`
- `[3D_OBJECT]`
- `[ILLUSTRATION]`
- `[SVG_GRAPHIC]`
- `[ICON]`
- `[LOGO]`
- `[CURSOR]`
- `[INTERACTIVE_MEDIA]`
- `[UNKNOWN_MEDIA]`
- `[DECORATIVE_GRAPHIC]`

A placeholder must preserve the approximate:

- position
- width
- height
- aspect ratio
- alignment
- layering
- spacing
- responsive behavior
- structural role

The placeholder is temporary.

Do not create a fake final asset merely to make the page look finished.

---

# 8. PHASE BOUNDARIES

Do not perform work belonging to a later phase prematurely.

Phase 1 establishes the structure.

Phase 2 establishes visual and interaction fidelity.

Phase 3 validates and corrects the completed reconstruction.

If a Phase 2 effect is not yet being implemented, preserve its spatial and structural requirements.

---

# 9. REPOSITORY SAFETY

Before modifying anything:

1. Inspect the repository.
2. Understand its framework.
3. Understand its package manager.
4. Inspect package.json.
5. Inspect configuration.
6. Inspect existing source files.
7. Identify the current entry points.
8. Identify existing routes.
9. Identify existing dependencies.

Do not destroy useful existing infrastructure without evidence that it must be replaced.

Do not create an entirely unrelated application inside the repository.

---

# 10. NO SILENT MAJOR DECISIONS

If you discover that the existing repository architecture conflicts with the reference reconstruction:

- investigate
- determine the smallest necessary change
- document the reason
- make the change only when justified

Do not replace the entire architecture simply because another architecture is easier.

---

# 11. COMPLETION STANDARD

You are not finished because the website:

- builds
- looks good
- resembles a portfolio
- has no obvious errors
- contains the expected number of pages

You are finished only when the implementation has been compared against the reference and the requirements of the current phase have been satisfied.

---

# 12. ABSOLUTE PRIORITY

When uncertain, follow this order:

**Evidence > Specification > Existing implementation > Assumption**

Never:

**Assumption > Evidence**

The goal is not to create the website you think the reference should be.

The goal is to reconstruct the website that actually exists.