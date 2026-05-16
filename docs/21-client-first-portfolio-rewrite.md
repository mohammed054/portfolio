# 21 - Client-First Portfolio Rewrite

## Status

This document supersedes the Shader-style rebuild docs (`00` through `20`) for the next implementation phase.

The current site proves that Mohamed can build an ambitious interactive experience. The next version must prove something more useful to clients: Mohamed understands real operational problems, can turn them into working software, and is easy to contact for a practical build.

## Direction

Primary audience: clients.

Visual tone: minimal clean.

Portfolio model: services-first, with projects used as proof snippets.

Primary CTA: email Mohamed.

Secondary proof CTA: GitHub.

No pricing section for this version.

Keep the app as React/Vite unless a later technical decision explicitly changes the stack.

## Rewrite Goal

Transform the portfolio from a theatrical engineering showcase into a direct, client-readable portfolio that answers four questions within the first screen and the next two sections:

1. What does Mohamed build?
2. What business or workflow problems does he solve?
3. What proof exists?
4. How do I contact him?

Success means a non-technical client can scan the page in under two minutes and understand:

- Mohamed builds automation tools, AI/OCR workflows, full-stack web apps, browser extensions, and mobile utilities.
- His work is practical, not just experimental.
- The projects are real and backed by GitHub repositories.
- The right next action is sending an email.

## Current Diagnosis

The current site is technically impressive, but it asks the wrong audience to do too much interpretation.

Keep:

- The fact that Mohamed can build polished frontend experiences.
- The existing project inventory from the local GitHub workspace.
- The high standard for responsive layout, accessibility, and performance.
- The ability to link to GitHub for proof.

Reduce or remove:

- Blocking preloader and boot sequence.
- 3D-heavy filmstrip carousel as the main proof surface.
- Shredder, golden tie, handshake, phone monument, and other theatrical set pieces.
- Copy that sounds like a studio brand instead of an individual client-facing developer.
- Long scroll acts that delay services, proof, or contact.

## Target Site Structure

The homepage should be a single clean page with simple hash navigation.

### 1. Hero

Purpose: communicate the offer immediately.

Content:

- Eyebrow: `Mohamed Hassoun - Freelance Software Developer`
- H1: `I build practical software for messy workflows.`
- Short supporting copy: `Automation tools, AI/OCR pipelines, full-stack web apps, browser extensions, and mobile utilities for clients who need working systems, not decorative prototypes.`
- Primary CTA: `Email Mohamed` linking to `mailto:mohammed.hassoun054@gmail.com?subject=Project%20inquiry`
- Secondary CTA: `View GitHub` linking to `https://github.com/mohammed054`
- Proof line: `React / Next.js / Node / Python / MongoDB / Chrome Extensions / Android`

Behavior:

- No blocking preloader.
- No boot transition.
- No required scroll animation before the offer is readable.
- Optional subtle background texture or static code-style visual, but no full 3D scene in v1.

### 2. Services

Purpose: make the portfolio services-first.

Layout:

- Four service panels in a responsive grid.
- Each panel explains the client problem, what Mohamed builds, and which projects prove it.

Services:

1. Automation and Internal Tools
   - Client problem: repetitive checks, scattered data, manual reporting, admin workflows.
   - Offer: scripts, dashboards, CLIs, data pipelines, import/export tooling.
   - Proof projects: Scrapling CLI, WA Checker, BD organizer, PRO71 content ops.

2. AI and OCR Workflows
   - Client problem: unstructured documents, images, quizzes, forms, or text that need clean output.
   - Offer: OCR extraction, structured JSON/Excel output, AI-assisted parsing, guarded LLM workflows.
   - Proof projects: Quiz Extractor, OCR to Structured Excel, Bashify, Dirham Mirror AI, document intelligence pipeline.

3. Full-Stack Web Apps
   - Client problem: a product, CMS, portal, or public website needs frontend and backend ownership.
   - Offer: React/Next.js frontends, Express APIs, MongoDB/Mongoose, auth, roles, uploads, admin flows.
   - Proof projects: Edu Bridge, School CMS, PRO71 Web, Hassoun.ae, Cooperative.

4. Browser and Mobile Utilities
   - Client problem: users need small focused tools that live where the workflow already happens.
   - Offer: Chrome extensions, Android apps, React Native prototypes, reminders, route optimizers, performance helpers.
   - Proof projects: LeanGPT, Pill Reminder, SmartRoute, Browser-Based OS, QuestionAnswer.

### 3. Proof By Service

Purpose: connect services to real work without forcing clients through a cinematic carousel.

Layout:

- A compact proof section grouped by service.
- Each group shows two or three project snippets.
- Each snippet includes problem, build, outcome, stack, and GitHub link.

Project snippet format:

- Project name
- One-line problem
- One-line build
- One-line outcome or proof
- Tech tags
- GitHub link

Example:

```text
Scrapling CLI
Problem: YouTube channel research is slow and transcript coverage is inconsistent.
Build: Python CLI for channel fetches, transcript recovery, scoring, reports, CSV, and Markdown exports.
Proof: Retry/cooldown logic, tests, and deterministic outputs for repeated analysis.
Stack: Python, Scrapling, yt-dlp, OpenAI API, pytest.
```

### 4. Selected Work Grid

Purpose: provide a broader scan of projects after the service proof.

Layout:

- Card grid, not a carousel.
- 6 to 10 cards visible quickly.
- Cards can be filtered by service tag only if the implementation stays simple.

Card fields:

- Name
- Type/service tag
- Short client-readable description
- Stack tags
- GitHub link
- Optional demo link only when real and working

Default projects for v1:

- Edu Bridge
- School CMS
- Scrapling CLI
- Bashify
- Quiz Extractor
- LeanGPT
- WA Checker
- Pill Reminder
- SmartRoute
- Browser-Based OS

### 5. Process

Purpose: help clients imagine working with Mohamed.

Steps:

1. Diagnose
   - Understand the current workflow, data, users, and desired output.
2. Prototype
   - Build the smallest useful path and test the risky parts first.
3. Ship
   - Turn the prototype into a usable interface, API, extension, script, or app.
4. Handoff
   - Provide repo, setup notes, environment requirements, and next-step recommendations.

Tone:

- Practical and plain.
- No agency-style hype.
- Emphasize clarity, iteration, and usable deliverables.

### 6. About and Stack

Purpose: provide trust without becoming a resume wall.

About copy:

- Mohamed is a freelance software developer focused on practical automation, full-stack web systems, AI-assisted tools, browser extensions, and mobile apps.
- He is strongest where workflows are messy and software can save time.
- His work spans Python, Node/Express, MongoDB, React/Next.js/Vite, Chrome MV3, Android Kotlin, OCR, and LLM integrations.

Stack layout:

- Simple categorized list:
  - Frontend: React, Next.js, Vite, TypeScript, Tailwind/CSS, Framer Motion.
  - Backend: Node.js, Express, MongoDB, Mongoose, REST APIs, auth/RBAC.
  - Automation: Python, Scrapling, yt-dlp, Puppeteer, CSV/Markdown/Excel outputs.
  - AI/OCR: OpenAI-compatible APIs, Hugging Face, Tesseract.js, PaddleOCR-style workflows.
  - Extensions/Mobile: Chrome MV3, Android Kotlin, Room, WorkManager, React Native/Expo.
  - Quality: pytest, Vitest, React Testing Library, supertest, typed models.

### 7. Contact

Purpose: make the next step obvious.

Content:

- Heading: `Have a workflow worth turning into software?`
- Copy: `Send the problem, the current process, and what a useful result would look like.`
- Primary CTA: `Email Mohamed`
- Secondary CTA: `GitHub`
- Contact email visible as text.

Behavior:

- Mailto CTA only.
- No contact form in v1.
- No Calendly requirement in v1.

## Content Architecture

Move portfolio content out of generic `COPY` and `PROJECTS` constants into a typed content module focused on services and proof.

Recommended module:

- `src/content/portfolio.ts`

Recommended exported content:

- `PROFILE`
- `SERVICES`
- `PROJECTS`
- `PROCESS_STEPS`
- `STACK_GROUPS`
- `CONTACT`

Minimum TypeScript shapes:

```ts
export type ServiceId =
  | 'automation'
  | 'ai-ocr'
  | 'full-stack'
  | 'browser-mobile';

export interface PortfolioService {
  id: ServiceId;
  title: string;
  clientProblem: string;
  buildSummary: string;
  proofProjectIds: string[];
}

export interface PortfolioProject {
  id: string;
  name: string;
  serviceIds: ServiceId[];
  problem: string;
  build: string;
  outcome: string;
  tech: string[];
  repoUrl: string;
  demoUrl?: string;
  featured?: boolean;
}

export interface ProcessStep {
  title: string;
  description: string;
}

export interface StackGroup {
  title: string;
  items: string[];
}
```

Rules:

- Every featured project must have at least one service tag.
- Every project shown publicly must have a real repo URL or an explicit reason to omit it.
- Use demo links only when they are live and representative.
- Avoid invented clients, employers, metrics, or outcomes.
- If there is no measurable result, describe the concrete capability instead.

## Visual Direction

Design target:

- Minimal, clean, fast, and credible.
- The page should feel like a serious freelance developer portfolio, not an agency clone.

Layout rules:

- Use standard vertical sections with clear headings and compact content.
- Prefer grids, lists, callouts, and readable cards over pinned scroll scenes.
- Keep card border radius at `8px` or less.
- Avoid nested cards.
- Avoid decorative orbs, bokeh, heavy gradients, or purely atmospheric backgrounds.
- Text must fit on mobile and desktop without overlap.

Typography:

- Use a clean sans-serif as the primary UI/body font.
- Use a restrained display treatment only for the hero headline.
- Do not use giant serif type inside compact sections.
- Do not scale font size directly with viewport width.

Color:

- Base background: near-white or very light neutral.
- Text: near-black.
- Accent: one practical accent color, used for CTAs, focus states, and small highlights.
- Dark sections are optional and should be used sparingly.

Motion:

- Motion should support comprehension, not delay content.
- No blocking preloader.
- No long pinned story sequence.
- Use subtle reveal transitions only if they do not affect readability.
- Respect reduced motion.

Assets:

- Use real screenshots or simple generated project placeholders only when available.
- Do not use fake product screenshots.
- If screenshots are missing, use text-first cards instead of decorative imagery.

## Implementation Plan

### Phase 1 - Structural Simplification

- Replace the current long theatrical page flow with the target sections:
  - Hero
  - Services
  - Proof By Service
  - Selected Work Grid
  - Process
  - About / Stack
  - Contact
- Remove or disable page sections that do not support client persuasion:
  - BootTransition
  - AboutHero cinematic interlude
  - Shredder
  - ContactTease
  - GoldenTie
  - Handshake
  - GoodBuy
- Disable the blocking preloader by default.
- Keep the navbar, smooth scrolling, and section anchors only if they remain simple and reliable.

### Phase 2 - Content Model

- Create the typed portfolio content module.
- Move contact, services, projects, process, and stack data into that module.
- Convert existing project descriptions into service-oriented proof snippets.
- Ensure every project has client-readable `problem`, `build`, and `outcome` fields.

### Phase 3 - Core Components

- Build or replace components for:
  - Hero section with primary/secondary CTAs.
  - Services grid.
  - Proof snippets grouped by service.
  - Selected work grid.
  - Process steps.
  - Stack groups.
  - Contact CTA.
- Components should be plain React/TypeScript with CSS Modules.
- Avoid adding new dependencies.

### Phase 4 - Visual System

- Replace the current theatrical palette with a restrained portfolio palette.
- Replace oversized theatrical typography with clean, readable hierarchy.
- Remove 3D/canvas dependencies from the primary reading path.
- Keep performance-friendly visual detail only where it reinforces credibility.

### Phase 5 - QA and Polish

- Verify desktop and mobile layouts.
- Verify all links.
- Verify email CTA.
- Verify GitHub links.
- Verify keyboard focus and skip link.
- Verify reduced-motion behavior.
- Run lint and production build.

## Acceptance Criteria

The rewrite is ready when:

- The homepage communicates Mohamed's offer in the first viewport.
- Services appear before deep project browsing.
- Projects are grouped as proof for services.
- A client can identify what to hire Mohamed for without reading GitHub.
- All visible claims are backed by real local projects or GitHub repositories.
- The site has no blocking preloader.
- The main page no longer depends on theatrical sections to make sense.
- The site is usable on mobile without overlapping text or controls.
- `npm run lint` passes.
- `npm run build` passes.

## Suggested Navigation

Use these links:

- `Home` -> `#home`
- `Services` -> `#services`
- `Work` -> `#work`
- `Process` -> `#process`
- `Contact` -> `#contact`

Remove separate navigation items for theatrical story sections.

## Project Proof Inventory

Use this as the first implementation pass. Copy can be refined during implementation, but do not invent claims.

### Automation and Internal Tools

- Scrapling CLI: YouTube channel analysis, transcripts, scoring, CSV/Markdown reports.
- WA Checker: WhatsApp number validation CLI with QR auth, throttling, CSV outputs.
- BD Organizer: guest/item claiming and split calculation workflow.
- PRO71 Content Ops: file-backed content operations knowledge server.

### AI and OCR Workflows

- Quiz Extractor: browser extension for quiz extraction, image OCR, ZIP export.
- OCR to Structured Excel: PDF/image extraction into structured spreadsheet output.
- Bashify: natural-language to Bash command translator with guarded backend.
- Dirham Mirror AI: Arabic-first personal finance habit mirror with optional AI.
- Document Intelligence Pipeline: document processing and structured output workflow.

### Full-Stack Web Apps

- Edu Bridge: school operations platform with frontend/backend, auth, roles, analytics, AI-assisted workflows.
- School CMS: public school website and admin CMS with draft/publish and uploads.
- Hassoun.ae: personal brand/course site built with Next.js.
- PRO71 Web: Next.js public website frontend.
- Cooperative: animated React landing site.

### Browser and Mobile Utilities

- LeanGPT: Chrome extension for reducing heavy DOM performance issues.
- Pill Reminder: Android Kotlin app with Room and WorkManager reminders.
- SmartRoute: React Native route optimizer prototype.
- Browser-Based OS: interactive desktop-style portfolio system.
- QuestionAnswer: Chrome quiz extraction extension.

## Implementation Notes

- Keep implementation incremental; the first code rewrite should prioritize structure and copy over animation.
- Do not delete old components until the new page flow is working and committed.
- If old components are unused after the rewrite, remove them in a cleanup commit.
- Keep query helpers like `?solo=` only if they still help QA.
- Preserve accessibility basics: landmarks, headings in order, focus states, link names, and reduced motion.
- Keep GitHub and email URLs centralized.

## Assumptions

- Mohamed wants clients more than recruiters for this version.
- Minimal clean is preferred over hybrid visual spectacle.
- Services-first is preferred over case-study-first.
- No pricing section is needed yet.
- No contact form is needed yet.
- Email is the primary conversion action.
- GitHub is the secondary proof action.
- The implementation stays in the current React/Vite app.
