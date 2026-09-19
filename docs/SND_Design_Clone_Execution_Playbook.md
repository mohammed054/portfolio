# SND Design — Full Clone Execution Playbook (A → Z)
### How to get from the current skeleton to a 1:1 clone — every task, assigned to either the AI agent or the human

**Companion documents (already delivered, this playbook assumes both exist):**
- `SND_Design_Website_Reconstruction_Spec.md` — the structural/content spec (Sections 0–11)
- `snd-design-skeleton.zip` — the working Vite+React skeleton built from that spec

This playbook is the bridge between "skeleton with placeholders" and "100% clone." It does not repeat content
already in the spec doc — it tells you, task by task, **who does it and exactly how.**

---

## 0. HOW TO USE THIS DOCUMENT

Every task below is tagged:

- **🧑 HUMAN** — requires live browser access, judgment, subjective quality calls, credentials, or licensing decisions. The AI agent cannot do these no matter how it's prompted — it doesn't have eyes on the live site or hands on a mouse over time.
- **🤖 AI AGENT** — mechanical, fully-specified, no judgment required. Give the agent this exact task with the exact values the human already filled in; it should not need to make a single creative decision.
- **🤖+🧑** — the AI agent does the mechanical work, but only after the human has filled in a value it's currently missing (marked `TBD` in the tables below).

**Golden rule for the AI agent (read this before assigning it anything from this file):** if a value in a task is written as `TBD`, `UNKNOWN`, or `[ask human]`, the agent must **stop and ask**, not invent a plausible-looking value. Every bug found in Round 1 (Section 11 of the spec) was the agent filling a gap with something that looked reasonable instead of leaving it as a visible placeholder. That failure mode is the #1 thing this playbook is designed to prevent.

**Golden rule for the human:** don't hand the agent a screenshot and say "make it look like this." Fill in the literal value tables in Phases 1–4 first. An agent with low coding capability cannot reverse-engineer a hex code, a font name, or an easing curve from a picture — it needs the number.

---

## 1. ROLE SPLIT AT A GLANCE

| Category of work | Who | Why |
|---|---|---|
| Opening the live site, using devtools, extracting real assets | 🧑 Human | Requires a real browser session over time; no agent tool in this pipeline browses live sites interactively frame-by-frame |
| Sampling exact colors, fonts, spacing from computed styles | 🧑 Human | Needs devtools/eyedropper access to the real page |
| Watching and timing animations (duration, easing, trigger) | 🧑 Human | Requires watching motion happen in real time; a static screenshot can't show this |
| Deciding whether an ambiguous element is "close enough" to ship | 🧑 Human | Subjective quality judgment |
| Licensing checks (stock photos, illustrations, fonts, icon packs) | 🧑 Human | Legal/commercial decision, not a coding task |
| Signing up for/configuring 3rd-party services (chat widget, analytics) | 🧑 Human | Requires an account and credentials |
| Writing component code from a fully-specified table of values | 🤖 AI agent | Mechanical transcription |
| Replacing a `PlaceholderBox` with a real `<img>`/`<video>` once the human supplies the file path | 🤖 AI agent | Mechanical swap |
| Implementing an animation once the human has filled in trigger/duration/easing/from/to | 🤖 AI agent | Mechanical, given the exact recipe |
| Running builds, installing packages, fixing syntax errors | 🤖 AI agent | Mechanical |
| Writing the Playwright visual-regression scaffold | 🤖 AI agent | Mechanical, given the URLs and viewport sizes |
| Deciding if a visual regression diff is acceptable or a real bug | 🧑 Human | Subjective threshold judgment |

---

## 2. PHASE 0 — Environment & Tooling Setup (🧑 HUMAN)

Before any re-investigation, set up:

1. **Browser devtools fluency.** Chrome or Firefox devtools, specifically: Elements panel (computed styles), Network panel (filter by `Img`, `Media`, `Font`, `JS`), Sources panel.
2. **An eyedropper/color-picker extension** (e.g., ColorZilla, or Chrome's built-in `Inspect > Styles > color swatch > eyedropper`) — for Phase 3.
3. **A font-identifier extension** (e.g., "WhatFont" or "Fonts Ninja") — for Phase 3.
4. **A screen recorder** (QuickTime screen recording, OBS, or even a phone camera pointed at the screen as a last resort) — for Phase 1's animation re-investigation. You will record short clips and describe what you see in writing; the agent cannot watch video.
5. **A stopwatch or the browser's own devtools "Performance" recording** (timestamps in the recorded trace) — for timing animations precisely in Phase 4.
6. **Network throttling set up in devtools** (Network panel → "Fast 3G" or "Slow 4G") — needed in Phase 1.9 to observe loading states, which are invisible on a fast connection.
7. **A clean project folder** on your machine, unzip `snd-design-skeleton.zip` into it. This is where extracted assets will land in Phase 2.

---

## 3. PHASE 1 — Full Live Re-Audit of the Reference Site (🧑 HUMAN)

This is the single most important phase. Everything the AI agent will build in Phases 5–7 depends on the human filling in the blanks below with real observed values, not guesses. Go through every item in order. For each, the instructions tell you **exactly what to do, where to look, and what to write down.**

> If you don't have live access to the actual reference site, do this against whatever you have — a downloaded HTML export, a client-provided Figma file, or a fuller set of screenshots/recordings than the 11 originally supplied. The method is the same regardless of source.

### 3.1 Global — Custom Cursor Dot (`GLOBAL-DOT-MARKER`)

1. Load the homepage. Move your mouse slowly in a circle over a **white** section, then over the **blue About-hero** section, then over a **dark photo** section (e.g., the CTA countdown area).
2. Write down: Does a small dot visibly follow the cursor? Y/N.
3. If yes: does its color change depending on what's under it (e.g., appears black on white, white on dark, without you seeing an explicit color switch)? That confirms `mix-blend-mode: difference` (already the skeleton's assumption).
4. Note the dot's approximate size in px (compare to a known UI element, e.g., "roughly the size of the small dot in the countdown timer's colon separator").
5. Hover over a clickable link or button. Does the dot grow, change shape, or otherwise react? Write down exactly what happens.
6. Fill in this table and hand it to the agent:

| Field | Value |
|---|---|
| Confirmed to exist? | TBD (Y/N) |
| Follows cursor? | TBD |
| Color-adaptive (blend mode)? | TBD |
| Approx. diameter (px) | TBD |
| Hover-over-link behavior | TBD (describe exactly) |
| Hidden on touch/mobile? | TBD (test on a phone or devtools device-mode) |

### 3.2 About Hero — Rotating Badge (`ABOUT-HERO-BADGE`)

1. Load the About page. Watch the circular "ABOUT US" text badge for at least 10 seconds without touching anything.
2. Does it rotate continuously? Clockwise or counter-clockwise?
3. Roughly how long does one full rotation take? (Count seconds with a stopwatch, or use screen-record + scrub through the clip counting frames.)
4. Does the center arrow rotate with the ring, or stay fixed while only the text ring spins?
5. Fill in:

| Field | Value |
|---|---|
| Rotates? | TBD |
| Direction | TBD |
| Seconds per full rotation | TBD |
| Arrow behavior | TBD (rotates with ring / stays fixed / bounces independently) |

### 3.3 Hero Decorative Graphics — Parallax Check (`HOME-HERO-DECOR-*`)

1. On the homepage hero, slowly scroll down 200–300px, then back up. Watch the blue ring, red ring, dot grid, and dot cluster around the portrait.
2. Do any of them move at a different speed than the portrait/photo itself (i.e., parallax)? Or do they scroll together as one flat image?
3. Now (without scrolling) move your mouse around the hero area. Does anything shift position in response to the mouse (a "tilt"/parallax-on-mouse-move effect, common in this template style)?
4. Fill in:

| Field | Value |
|---|---|
| Scroll parallax present? | TBD |
| Mouse-move parallax present? | TBD |
| If yes to either, describe the effect in one sentence | TBD |

### 3.4 Testimonial Carousel — Full Behavior (`ABOUT-TESTIMONIAL-*`)

1. On the About page's testimonial block, click the "next" arrow repeatedly until you've seen every slide. **Write down every testimonial's full text, author name, role, and star rating** — only 2 of these were visible in the original screenshots.
2. Wait 10+ seconds without clicking anything — does it auto-advance on its own? If yes, roughly how many seconds per slide?
3. Note the transition style when you click next: does the new card slide in from the right? Fade in? Snap instantly?
4. Fill in a full testimonial table:

| # | Author | Role | Avatar/logo source | Quote (verbatim) | Stars |
|---|---|---|---|---|---|
| 1 | ginabuckney | Project Manager | (already captured) | (already captured) | 5 |
| 2 | bollybeatz | Project Manager | (already captured, partial quote) | TBD — get full quote | 5 |
| 3 | TBD | TBD | TBD | TBD | TBD |
| ... | | | | | |

Plus: `Auto-advance: TBD (Y/N, interval in seconds)`, `Transition style: TBD`.

### 3.5 Services Strip — 3 vs. 4 Panels (`ABOUT-SERVICES-STRIP-*`)

1. On the About page's services strip section, resize your browser window wider (if you were on a laptop, try an external monitor or just maximize) — confirm whether a 4th "SEO" zone exists off-screen or if it's genuinely only 3 panels here.
2. Hover over each of the 3 (or 4) zones. Does the background image change per zone, or is it one static image the whole time with only the text label differing?
3. Fill in:

| Field | Value |
|---|---|
| Panel count | TBD (3 or 4) |
| Is it one shared image or per-panel images? | TBD |
| Hover-swap behavior (if any) | TBD |

### 3.6 CTA Countdown — Real Target & End State (`ABOUT-CTA-COUNTDOWN`)

1. View page source or the Network/Sources panel, search for anything resembling a date string, a Unix timestamp, or a countdown-related script/plugin name.
2. If you can't find it in source, just watch the numbers for a minute and extrapolate the target roughly (not exact, but gives the agent a sane placeholder instead of "7 days from now").
3. Reload the page after the counter would have hit zero (or fast-forward your system clock temporarily, if you're comfortable doing that in a test environment) — what happens at zero? Resets? Shows a message? Hides the section?
4. Fill in:

| Field | Value |
|---|---|
| Real target date/time (if found) | TBD |
| Behavior at zero | TBD |

### 3.7 CTA Background — Static Image or Video? (`ABOUT-CTA-BGPHOTO`)

1. Stare at this section for 15+ seconds without scrolling. Does anything move at all (even subtly — a cinemagraph-style loop, e.g. just the hands moving)?
2. Right-click the image area — does a "Save Video As" option appear (confirms video) vs. only "Save Image As" (confirms static)?
3. Fill in: `Static image / Video: TBD`. If video, note whether it loops seamlessly or has a visible restart cut.

### 3.8 "WATCH INTRO" Video (`HOME-HERO-WATCHINTRO-ICON`)

1. Click the play button on the homepage hero.
2. Note: does a modal/lightbox open, or does it navigate to a new page/external site (YouTube/Vimeo)?
3. If a modal: is the video embedded (YouTube/Vimeo iframe — check the URL bar or right-click for "Copy video URL") or self-hosted (an `.mp4` file — check Network panel for a `.mp4` request)?
4. Fill in:

| Field | Value |
|---|---|
| Opens modal or navigates? | TBD |
| Video host | TBD (YouTube / Vimeo / self-hosted / other) |
| Video URL/embed code | TBD |

### 3.9 Chat Widget Provider (`GLOBAL-CHAT-WIDGET`)

1. Open devtools → Network panel → reload the page → filter by `JS`. Look for a script from a domain like `embed.tawk.to`, `client.crisp.chat`, `widget.freshchat.com`, `web.whatsapp.com`, or similar.
2. Click the chat button on the live site and observe what actually opens.
3. Fill in: `Provider: TBD`, `Script URL: TBD`.

### 3.10 Header Grid Icon — What Does It Open? (`GLOBAL-NAV-ICONS`)

1. Click the 3×3 grid icon in the header.
2. Write down exactly what appears: an off-canvas menu? A language switcher? An app-launcher-style panel? Nothing (dead link)?
3. Also click the search icon and describe what happens.
4. Fill in: `Grid icon behavior: TBD`, `Search icon behavior: TBD`.

### 3.11 Sidebar & Footer Social Links — Real Destinations (`GLOBAL-SIDEBAR-SOCIAL`, `GLOBAL-FOOTER`)

1. Hover over (don't click) each of the 4 sidebar icons and each of the 4 footer icons. Read the destination URL shown in the browser's status bar (bottom-left), or right-click → "Copy link address."
2. Fill in:

| Channel | Real destination |
|---|---|
| Email | TBD (`mailto:...`) |
| Phone | TBD (`tel:...`) |
| Whatsapp | TBD (`https://wa.me/...`) |
| Facebook | TBD (`https://facebook.com/...`) |

### 3.12 Team Photos — Names, Roles, Full Roster (`ABOUT-TEAM-PHOTO-*`)

1. On the About page's team section, check if there's a caption under each photo (may only appear on hover, or may require a wider viewport than what was screenshotted).
2. Scroll/resize to check if more than 2 team members exist in a row that extends off-screen, or a "view more team" link.
3. Fill in:

| Photo | Name | Role | Any social links shown? |
|---|---|---|---|
| 1 | TBD | TBD | TBD |
| 2 | TBD | TBD | TBD |
| ... | | | |

### 3.13 Page Load / First-Paint Sequence (not previously captured at all)

1. Open devtools → Network panel → set throttling to "Slow 4G" → hard-reload the page (Cmd/Ctrl+Shift+R).
2. Watch the first 3–5 seconds closely. Is there a splash screen, a loading spinner, a "curtain" wipe transition, or does content just pop in normally?
3. Do images fade in as they load (lazy-load fade-in), or appear instantly/with layout jump?
4. Fill in: `Preloader present? TBD`, `Description: TBD`, `Image lazy-load fade-in? TBD`.

### 3.14 Page Transition — Home ↔ About Navigation

1. Click "About Us" in the nav from the homepage. Watch closely: does the old page instantly disappear and the new one snap in? Does anything fade/wipe/slide during the transition?
2. Fill in: `Transition style between routes: TBD`.

### 3.15 Hover/Focus/Active States — Full Sweep

Go through **every** interactive element on both pages and hover over it, noting any visible change (color shift, underline, scale, shadow, cursor change). This was only spot-checked in the original 11 screenshots (which are static, mid-scroll captures with no hover state visible at all).

Checklist — hover and record for each:
- [ ] Nav links (Home/About Us/Our Portfolio/Contact Us)
- [ ] "Discover More" link
- [ ] "WATCH INTRO" button
- [ ] "Why Choose Us" cards (all 3)
- [ ] "About Us" pill buttons (appear twice — Home and About page)
- [ ] Platform/partner logo cards (Fiverr/Upwork/Freelancer/SND)
- [ ] Portfolio grid images
- [ ] "All Portfolios" button
- [ ] Services gallery panels (Home 4-panel + About 3-panel)
- [ ] Testimonial prev/next arrows
- [ ] "Contact Us" pill buttons
- [ ] Team photos
- [ ] Footer social icons
- [ ] Sidebar social icons
- [ ] Chat widget button
- [ ] Go-to-top button

For each, write one line: *"[Element] — on hover: [describe]."* Hand this whole list to the agent as the source for every `hover:` Tailwind class it writes — do not let it invent hover states.

### 3.16 Sound / Audio Check

1. Unmute your system and the browser tab. Click every button, hover over cards, and scroll through both pages.
2. Note whether **any** UI sound effects play (some agency-style templates add subtle clicks/whooshes).
3. Fill in: `Any audio present? TBD`.

### 3.17 Background Noise/Grain Texture Check

1. Open devtools → Elements panel → click on the `<body>` tag and each major section, check the "Computed" styles panel for a `background-image` that isn't one of the known photos — often a small repeating SVG/PNG data-URI used for a subtle grain/noise texture overlay across the whole site.
2. Zoom into a plain white area of a screenshot (200%+) and look for very faint speckled texture, compared to a genuinely flat white.
3. Fill in: `Noise/grain texture present? TBD`, `If yes, computed background-image value: TBD` (copy-paste the exact CSS value — the agent can drop this straight into a CSS rule).

### 3.18 Responsive / Mobile Layouts

1. Open devtools → toggle device toolbar (mobile emulation) → test at 375px (mobile), 768px (tablet), 1024px (small laptop) widths for both Home and About.
2. For each breakpoint, note: does the nav collapse into a hamburger menu? Does the fixed left sidebar disappear/move? Do multi-column grids stack to 1 column? Does the hero image reflow above or below the text?
3. Screenshot each breakpoint (these screenshots become the new reference material for a later "Phase 8 — Responsive Pass").

### 3.19 Portfolio & Contact Pages (entirely uncaptured)

1. Navigate to "Our Portfolio" and "Contact Us" from the live nav.
2. Take a full scroll-capture screenshot set of both, exactly like the original 11 (one screenshot per ~900px of scroll, desktop viewport).
3. These become new input material — once captured, they should be run through the **same process** that produced the original reconstruction spec (structural breakdown, placeholder registry, etc.) before the agent builds them.

---

## 4. PHASE 2 — Asset Extraction & Manifest (🧑 HUMAN)

For every `[IMAGE]`, `[ILLUSTRATION]`, `[LOGO]`, `[HERO_IMAGE]`, and `[VIDEO]` placeholder in the spec's Section 7 registry:

1. Right-click the real element on the live site → "Save Image As" (or use the Network panel to find the exact request and copy its URL, then download it directly for full resolution/no re-compression).
2. For SVG logos (Fiverr/Upwork/Freelancer/etc.), prefer pulling the **official brand-kit SVG** from each company's press/brand page over saving the reference site's copy, for cleanest quality and correct licensing.
3. Save every file using **the placeholder ID as the filename**, so the mapping to the agent's next task is unambiguous:

```
src/assets/
  images/
    HOME-HERO-PORTRAIT.jpg
    HOME-ABOUTPREVIEW-ILLUSTRATION.svg
    HOME-SERVICES-PANEL-01.jpg
    HOME-SERVICES-PANEL-02.jpg
    HOME-SERVICES-PANEL-03.jpg
    HOME-SERVICES-PANEL-04.jpg
    HOME-PORTFOLIO-IMG-1.jpg
    HOME-PORTFOLIO-IMG-2.jpg
    HOME-PORTFOLIO-IMG-3.jpg
    ABOUT-HERO-DESKPHOTO.jpg
    ABOUT-SERVICES-STRIP-GraphicDesigns.jpg   (or one shared image — see 3.5)
    ABOUT-SERVICES-STRIP-WebDevelopment.jpg
    ABOUT-SERVICES-STRIP-CreativeVideo.jpg
    ABOUT-TESTIMONIAL-AVATAR-1.jpg
    ABOUT-TESTIMONIAL-LOGO-2.svg
    ABOUT-TEAM-PHOTO-1.jpg
    ABOUT-TEAM-PHOTO-2.jpg
    ABOUT-CTA-BGPHOTO.jpg  (or .mp4 if Phase 1.7 confirmed video)
  logos/
    GLOBAL-LOGO.svg
    HOME-ABOUTPREVIEW-LOGOSTRIP-Fiverr.svg
    HOME-ABOUTPREVIEW-LOGOSTRIP-Upwork.svg
    HOME-ABOUTPREVIEW-LOGOSTRIP-Freelancer.svg
    HOME-ABOUTPREVIEW-LOGOSTRIP-SNDDesign.svg
    ABOUT-PLATFORM-Fiverr.svg   (can symlink/reuse the same file as above)
    ABOUT-PLATFORM-Upwork.svg
    ABOUT-PLATFORM-Freelancer.svg
  video/
    HOME-HERO-INTRO.mp4   (only if Phase 1.8 confirmed self-hosted)
```

4. Record final licensing status for anything not owned outright by the client (stock photos, illustrations, fonts, icon packs) in a simple table — approved / needs-license / needs-replacement.
5. Hand the whole `src/assets/` folder plus this manifest table to the agent for Phase 6.

---

## 5. PHASE 3 — Design Token Finalization (🧑 HUMAN extracts → 🤖 AI applies)

1. For every color, right-click the element → Inspect → in the Styles panel find the relevant `color`/`background-color` rule → click its color swatch → use the eyedropper to confirm, or just copy the computed hex shown.
2. For fonts: select some heading text → Inspect → Computed panel → search "font" → note `font-family`, `font-weight`, `font-size`, `line-height`.
3. Fill in this table exactly (replace every `TBD`):

| Token | Current skeleton value | Real value (fill in) |
|---|---|---|
| `primary` (blue) | `#3646E4` | TBD |
| `accent` (coral) | `#F85D40` | TBD |
| `ink` (dark text) | `#1B1F29` | TBD |
| `muted` (gray text) | `#6B7280` | TBD |
| `surface` (light gray bg) | `#F6F6F8` | TBD |
| `dark` (footer/CTA bg) | `#12131C` | TBD |
| Heading font-family | `Poppins` (guess) | TBD |
| Heading font-weight | `800` (guess) | TBD |
| Body font-family | same as heading (guess) | TBD |
| Body font-weight | `400` (guess) | TBD |
| H1 size (desktop) | `~64–72px` (estimate) | TBD |
| H2 size (desktop) | `~44–52px` (estimate) | TBD |
| Body size | `~16–18px` (estimate) | TBD |
| Section vertical padding | `~120–160px` (estimate) | TBD |

4. **🤖 AI agent task once this table is filled:** update `tailwind.config.js` colors and `fontFamily` to the real values, and if a webfont is needed, add the correct `<link>` tag to `index.html` (Google Fonts or otherwise, per whatever the human found). Do not change anything else in the file. Do not "improve" the values — paste them exactly as given.

---

## 6. PHASE 4 — Animation & Interaction Specification Sheet (🧑 HUMAN fills → 🤖 AI implements)

This is the literal translation layer between "I watched it move" and "code the agent can copy exactly." For each row, the human fills in every column using the observations from Phase 1. If a value can't be pinned down exactly, use a reasonable round number rather than leaving it blank — a working animation with an approximate duration beats no animation at all.

| Element (Placeholder ID) | Trigger | Property | From → To | Duration | Easing | Loop/repeat | Notes |
|---|---|---|---|---|---|---|---|
| `GLOBAL-DOT-MARKER` | mousemove | `transform: translate` | cursor position, ~80ms trailing delay | continuous | `ease-out` spring | continuous | Confirm existence first (3.1) |
| `GLOBAL-GOTOTOP` | scroll position | `opacity`, `transform: translateY` | `0, 10px` → `1, 0` | 250ms | `ease-out` | once per show/hide | Trigger threshold from 3.13/skeleton default (400px) |
| `ABOUT-HERO-BADGE` | on load (continuous) | `transform: rotate` | `0deg` → `360deg` | TBD (from 3.2) | `linear` | `infinite` | Direction from 3.2 |
| Section reveal (generic, all sections) | scroll into view (~20% visible) | `opacity`, `transform: translateY` | `0, 24px` → `1, 0` | 500ms | `ease-out` | once | Applies broadly unless a section's own row overrides it |
| `HOME-FUNFACTS-*` numbers | scroll into view | number count-up | `0` → final value | 1500–2000ms | `ease-out` | once | Use `react-countup` |
| `ABOUT-TESTIMONIAL-*` carousel | click next/prev (+ maybe autoplay, from 3.4) | slide `transform: translateX` | full slide width | 400ms | `ease-in-out` | per click / per interval | Autoplay interval from 3.4 |
| Card hover (Why Choose Us, platform logos, portfolio images) | `:hover` | `transform: scale`/`box-shadow` | `1` → `1.03`, add shadow | 200ms | `ease-out` | n/a | Confirm exact feel against 3.15 |
| Nav link active/hover | `:hover`/route active | `color`, underline | per 3.15 | 150ms | `ease` | n/a | |
| `HOME-HERO-DECOR-*` | scroll and/or mousemove, IF confirmed in 3.3 | `transform: translate` | small offset (~10–20px range) | continuous, tied to scroll/mouse position | linear tracking | continuous | Only build if 3.3 confirms it exists — otherwise leave static |
| Route transition (Home ↔ About) | route change | per 3.14 finding | per 3.14 finding | per 3.14 finding | per 3.14 finding | once per nav | Skip entirely if 3.14 found no transition |

**🤖 AI agent task once this table is filled:** implement each row using Framer Motion (`whileInView`, `animate`, `whileHover`, `AnimatePresence`) or plain CSS `@keyframes`/`transition` where simpler, exactly matching trigger/property/values/duration/easing given. Do not invent easing curves or durations for rows still marked TBD — leave those elements static and flag them back to the human instead of guessing.

---

## 7. PHASE 5 — Component Build Order (🤖 AI AGENT — do these in this exact order, one at a time)

**Rules for this phase:**
- Work through this list top to bottom. Do not skip ahead.
- After each numbered step, run `npm run build` and confirm it exits with no errors before moving to the next step.
- If a step references a file path that doesn't exist in the skeleton, **stop and report it** — don't create a new file with a similar name and guess it's the same thing.
- Do not rename any `id` prop on a `PlaceholderBox` you're replacing — keep it as a code comment (`{/* was: HOME-HERO-PORTRAIT */}`) so the mapping to the spec registry stays traceable.

1. Apply Phase 3's finalized tokens to `tailwind.config.js` and any font `<link>` in `index.html`.
2. Replace `HOME-HERO-PORTRAIT` placeholder in `src/components/home/Hero.jsx` with the real `<img>` pointing to `src/assets/images/HOME-HERO-PORTRAIT.jpg`, preserving the existing `aspect-[3/4]` sizing class.
3. Replace the two decorative ring `<div>`s in the same file with real styling **only if** Phase 1.3 confirmed a parallax effect — otherwise leave the existing static outline rings as-is (they're already correctly sized/positioned, they just need the parallax added if confirmed).
4. Replace `HOME-ABOUTPREVIEW-ILLUSTRATION` in `src/components/home/AboutPreview.jsx` with the real illustration file.
5. Replace the 4 `HOME-ABOUTPREVIEW-LOGOSTRIP-*` placeholders in the same file with real logo SVGs.
6. Replace the 4 `HOME-SERVICES-PANEL-*` placeholders in `src/components/home/ServicesGallery.jsx` with real images.
7. Replace the 3 `HOME-PORTFOLIO-IMG-*` placeholders in `src/components/home/PortfolioGrid.jsx` with real images.
8. In `src/components/about/AboutHero.jsx`: replace `ABOUT-HERO-DESKPHOTO` with the real photo. Replace the `ABOUT-HERO-BADGE` placeholder with a real rotating SVG badge per the Phase 4 spec row — only after Phase 1.2 confirms the rotation exists.
9. In `src/components/about/ServicesStrip.jsx`: rebuild as either 3 or 4 panels and either one-shared-image or per-panel images, exactly per Phase 1.5's finding — this may mean restructuring the component, not just swapping image files.
10. In `src/components/about/PlatformsAndTestimonials.jsx`: replace the 3 platform logo placeholders with real SVGs. Rebuild the testimonial block as a real carousel (Swiper or Embla, per spec Section 2.1) using the full testimonial table from Phase 1.4 — this replaces the current single static card.
11. In `src/components/about/TeamSection.jsx`: replace both team photo placeholders with real images, and add name/role captions per Phase 1.12's findings (currently there are none in the skeleton at all).
12. In `src/components/about/CTACountdown.jsx`: replace the placeholder `TARGET_DATE` with the real value from Phase 1.6, and implement the real "at zero" behavior found there.
13. Update `GLOBAL-LOGO` usages in `Header.jsx` and `Footer.jsx` with the real logo SVG.
14. Update all `href` values in `SidebarSocial.jsx` and `Footer.jsx` with the real destinations from Phase 1.11.
15. Wire the `Search` and grid-menu icon buttons in `Header.jsx` to their real behavior from Phase 1.10 (this may require building a new off-canvas menu component if that's what was found — don't just leave the buttons non-functional).
16. Implement the "WATCH INTRO" modal in `Hero.jsx` using the real video source/host from Phase 1.8.
17. Integrate the real chat widget script (from Phase 1.9) into `ChatWidget.jsx`, replacing the current stub `useState` toggle.
18. Add the noise/grain texture (if Phase 1.17 confirmed one exists) as a CSS class applied at the body or per-section level, using the exact `background-image` value the human copied.
19. Add sound effects (if Phase 1.16 confirmed any exist) using the Web Audio API or simple `<audio>` elements triggered on the relevant interaction — keep this last since it's the lowest-impact item if time-constrained.

---

## 8. PHASE 6 — Animation Implementation (🤖 AI AGENT, using Phase 4's table)

1. Install Framer Motion: `npm install framer-motion`.
2. Build a small shared `<Reveal>` wrapper component (`src/components/shared/Reveal.jsx`) implementing the generic "section reveal" row from Phase 4's table, and use it to wrap every major section component in both `Home.jsx` and `About.jsx`.
3. Implement `GLOBAL-DOT-MARKER` as its own component per Phase 4's row, mounted once in `PersistentLayout.jsx`, only if Phase 1.1 confirmed it exists. If Phase 1.1 says "no," delete any dot-marker code entirely rather than leaving a disabled stub.
4. Implement the `ABOUT-HERO-BADGE` rotation via CSS `@keyframes` (simplest for a continuous linear rotation) using the exact duration/direction from Phase 4.
5. Install and wire `react-countup`: `npm install react-countup`, apply to the 3 numbers in `FunFacts.jsx`, triggered by Framer Motion's `useInView`.
6. Install and wire the carousel library chosen in spec Section 2.1 (`npm install swiper` or `npm install embla-carousel-react`) for the testimonial block, using the full slide list from Phase 1.4 and the autoplay/transition settings from Phase 4.
7. Add `whileHover` (Framer Motion) or Tailwind `hover:` classes to every element listed in Phase 1.15's sweep, matching what was actually observed — not a generic "add a shadow to everything" pass.
8. If Phase 1.3 confirmed hero decoration parallax, implement it with Framer Motion's `useScroll`/`useTransform` (scroll-linked) or a `mousemove` listener updating a `useMotionValue` (mouse-linked) — whichever Phase 1.3 found.
9. If Phase 1.14 found a route transition, wrap the `<Outlet />` in `PersistentLayout.jsx` with Framer Motion's `AnimatePresence` and implement the exact described effect.
10. Run `npm run build` after every single item above, not just at the end — animation code is where syntax errors are easiest to introduce silently.

---

## 9. PHASE 7 — Responsive / Mobile Pass (🧑 HUMAN captured in 3.18 → 🤖 AI implements)

1. **🤖:** Using the breakpoint screenshots and notes from Phase 1.18, add Tailwind responsive variants (`sm:`, `md:`, `lg:`) to every component so layouts stack/collapse exactly as observed — the current skeleton already has some baseline responsive classes but has not been verified against real mobile screenshots.
2. **🤖:** Build a mobile nav (hamburger + off-canvas or dropdown, matching whatever Phase 1.18 found) since the skeleton currently only shows nav links at `md:` and above with nothing at all on mobile.
3. **🤖:** Confirm the fixed sidebar (`SidebarSocial.jsx`) either hides, collapses, or relocates on mobile per Phase 1.18 — right now it's hardcoded to `hidden` below `lg:`, which may or may not match the real site's actual mobile treatment (it might reappear as a bottom bar, for instance).
4. **🧑:** Test the live build on at least one real phone (not just devtools emulation) — touch targets, tap feedback, and scroll feel are impossible to fully verify in emulation.

---

## 10. PHASE 8 — Automated Visual Regression (🤖 builds it, 🧑 curates baseline & judges diffs)

1. **🤖:** `npm install -D @playwright/test`, initialize a `playwright.config.js` targeting `http://localhost:5173`, with projects for at least 3 viewport sizes (375px, 768px, 1440px).
2. **🧑:** Save the 11 original reference screenshots (plus the new Portfolio/Contact captures from Phase 1.19, plus the mobile captures from Phase 1.18) into a `tests/reference-screenshots/` folder, named to match each section (e.g., `home-hero.png`, `about-hero.png`).
3. **🤖:** Write a Playwright test per page/section that navigates, scrolls the section into view, and calls `expect(page).toHaveScreenshot()`, using Playwright's built-in pixel-diff assertion against the human-curated baseline.
4. **🤖:** Run `npx playwright test --update-snapshots` once to establish the build's current-state baseline, then commit both the reference screenshots and the generated diffs folder.
5. **🧑:** Every subsequent build run, review the diff report Playwright generates (`npx playwright show-report`) and make the actual "is this close enough" call per section — the tool flags pixel differences, it doesn't judge whether a 2px shift matters.

---

## 11. PHASE 9 — Final Sign-Off Checklist (🧑 HUMAN)

Go through this exactly once the above phases are complete. Do not sign off if any box is unchecked without a written reason.

- [ ] Every placeholder ID from the spec's Section 7 registry has been replaced with real media, or has a written reason why not (e.g., "licensing pending").
- [ ] Every color in the build matches Phase 3's real-value column, not the original estimate column.
- [ ] Every animation row in Phase 4 that was marked with real (non-TBD) values is implemented and feels right when you watch it — not just technically present.
- [ ] Every hover state from Phase 1.15's sweep is present and matches what was observed live.
- [ ] The testimonial carousel shows every real slide from Phase 1.4, with correct auto-advance behavior.
- [ ] The countdown timer uses the real target date (or a documented placeholder if it couldn't be found) and correct zero-state behavior.
- [ ] Mobile layout has been tested on a real device, not just devtools emulation.
- [ ] Portfolio and Contact pages have been captured (Phase 1.19), run through the same spec process as Home/About, and built — not left as stub routes.
- [ ] Sound effects (if any) and background noise texture (if any) are present per Phase 1.16/1.17.
- [ ] Page-load sequence (Phase 1.13) and route-transition behavior (Phase 1.14) match what was observed.
- [ ] Playwright visual regression is green across all 3 tested viewport sizes, or every red diff has been manually reviewed and accepted.
- [ ] A final side-by-side session: open the real reference site and the build in two windows, scroll both in sync, and watch for 5 full minutes for anything that still feels off — timing, spacing, color, motion. Trust your gut here; if something feels "almost right but not quite," it's worth one more look rather than shipping it.

---

## 12. APPENDIX A — Everything Flagged As Unknown, Consolidated

This is the full list of every open question raised across this playbook and the original spec, in one place, so nothing gets lost:

1. Real hex values for all 6 color tokens (Phase 3)
2. Real font family/weights/sizes (Phase 3)
3. Real spacing scale (Phase 3)
4. Whether the custom cursor dot exists at all, and its exact behavior (3.1)
5. Rotating badge speed/direction (3.2)
6. Hero decoration parallax, scroll- or mouse-linked (3.3)
7. Full testimonial slide list beyond the 2 captured, plus autoplay behavior (3.4)
8. Services strip 3-vs-4 panels and static-vs-hover-swap (3.5)
9. Countdown real target date and zero-state behavior (3.6)
10. CTA background static-vs-video (3.7)
11. "Watch Intro" video host/source (3.8)
12. Chat widget provider (3.9)
13. Header grid/search icon behavior (3.10)
14. Real social link destinations, sidebar and footer (3.11)
15. Team member names/roles and full roster size (3.12)
16. Page-load/preloader sequence (3.13)
17. Route-transition animation (3.14)
18. Full hover/focus/active state sweep across every interactive element (3.15)
19. Any UI sound effects (3.16)
20. Any background noise/grain texture (3.17)
21. Full responsive/mobile behavior at 3 breakpoints (3.18)
22. Entire Portfolio and Contact page content — never captured at all (3.19)
23. Logo's exact vector asset (Phase 2)
24. Licensing status of every stock/illustration/font asset used (Phase 2)

## 13. APPENDIX B — Guardrails Specific to a Low-Capability AI Agent

These are generalized from the exact bugs found in Round 1 (spec Section 11). Give this list to the agent directly, verbatim, before it starts any phase above:

- Never fill a `TBD` value with something that "looks about right." Stop and ask instead.
- Never add content, sections, or fields that aren't explicitly listed in the spec or this playbook — two things were invented in Round 1 (a hero stats row, a footer newsletter field) that never existed in the reference and had to be deleted.
- Never let a decorative or placeholder element visually cover real content (like a face) — always check z-index and size against the stated approximate dimensions before considering a step done.
- Never apply a background or text color from memory/assumption — only from the exact token names in `tailwind.config.js`, which only the human updates (Phase 3).
- Never mark a task as done without running `npm run build` first and confirming zero errors.
- If a referenced file or component doesn't exist where expected, stop and report it — don't create a similarly-named new one and guess it's equivalent.
- If unsure whether two sections are "the same component reused" or "two different components that happen to share a heading," treat them as different unless a human explicitly says otherwise (this exact ambiguity was flagged for the "We develop & create digital future." heading, which appears on both Home and About with different backgrounds/media).
