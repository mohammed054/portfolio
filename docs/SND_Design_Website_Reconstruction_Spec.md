# SND Design (Saber Nasr Digital Agency) — Website Reconstruction Specification
### Phase 1: Structural & Visual Architecture Document
**Source material:** 11 full-page scroll screenshots (desktop viewport, ~1920px wide)
**Apparent live domain:** `sabernasr.com` (revealed by a hover-tooltip captured in screenshot 3: `https://sabernasr.com/about/`)
**Brand name shown in UI:** "SNDESIGN" (logo mark) / "Saber" (referred to in hero copy: *"Saber is a digital agency..."*)

---

## 0. HOW TO USE THIS DOCUMENT (read this first)

This document is written for an implementing agent (AI or human) who did **not** see the original screenshots and has **no access to the live site**. It must be treated as the single source of truth for Phase 1 (structural skeleton) work.

**Hard rules for the implementing agent:**

1. **Never invent real content.** Where a placeholder is specified below, build a placeholder — not a real photo, not a stock-photo lookalike, not fabricated brand colors. Use flat neutral fills + a visible dev-label as described in each placeholder block.
2. **Never collapse or omit a placeholder's footprint.** If a spec says a region is ~45% of viewport width, build a box that size — even empty. Layout geometry must survive Phase 1 even though real media does not.
3. **Every section below must be built in the order given.** Section order = scroll order, verified directly from the screenshots.
4. **Where a color, font, or spacing value is marked "ESTIMATE" or "UNKNOWN — verify live," do not treat it as final.** Use it as a working value only.
5. **Do not merge sections that look similar.** For example, the "We develop & create digital future." heading appears twice (once on Home, once on About) with different supporting copy, different background color, and different supporting media. They are two separate components — build them separately.
6. **This document does not contain any code.** It is a structural/content/visual spec only. Phase 2 (implementation) is a separate pass.
7. **This is not a static-HTML site.** The source material shows scroll-triggered reveals, a color-adaptive custom cursor, a rotating badge, a carousel, a live countdown, animated counters, and shared persistent chrome across routed pages. A flat HTML/CSS/jQuery build will not reproduce this faithfully. Build with the framework/library stack defined in **Section 2** — do not substitute your own stack choice without a documented reason.

---

## 1. SITE MAP (as reconstructed from scroll order)

| Page | Evidence | Screenshots (in scroll order) |
|---|---|---|
| **Home** (`/`) | Nav item "Home" is underlined/active in screenshot 1 | 1, 2, 3, 4, 5, 6 |
| **About Us** (`/about/`) | Confirmed by URL tooltip in screenshot 3; distinct hero treatment (blue bg) in screenshot 7 | 7, 8, 9, 10, 11 |

Primary nav (visible in header, screenshot 1): **Home / About Us / Our Portfolio / Contact Us**
→ "Our Portfolio" and "Contact Us" pages were **not captured** in this screenshot set. Their existence is confirmed by the nav only. Flag as `[UNKNOWN_PAGE]` — do not fabricate their content; leave as empty routes/stubs in Phase 1.

---

## 2. TECH STACK & ANIMATION ARCHITECTURE (mandatory — read before building anything)

### 2.0 Why this can't be static HTML

The source screenshots show more than static layout: a color-adaptive element that tracks the cursor across every screenshot (`GLOBAL-DOT-MARKER`), a circular rotating-text badge (`ABOUT-HERO-BADGE`), a testimonial carousel with a partially-visible "next" card (`ABOUT-TESTIMONIAL...`), a live countdown timer (`ABOUT-CTA-COUNTDOWN`), animated stat counters (`HOME-FUNFACTS-*`), a scroll-triggered "Go to Top" control, and two routed pages (Home, About) that share identical fixed-position global chrome (header, sidebar, chat widget, footer) without remounting. This combination — shared persistent layout + client-side routing + stateful, scroll- and pointer-driven animation — needs a component framework with real state and lifecycle, not hand-written HTML pages stitched together with jQuery snippets. **Build this as a React application.**

### 2.1 Core Stack

| Layer | Recommendation | Why |
|---|---|---|
| **Framework** | **React 18+**, bootstrapped with **Vite** (not Create React App — faster dev server, better for an animation-heavy component tree) | Component state + lifecycle needed for cursor tracking, carousel state, countdown ticking, scroll-in-view triggers |
| **Routing** | **React Router v6** (`createBrowserRouter`) with a shared root layout route wrapping an `<Outlet />` | Home (`/`) and About (`/about/`) must render inside one persistent `Layout` so `GLOBAL-*` components (header, sidebar, chat widget, go-to-top, cursor dot, footer) mount **once** and never flicker/remount on navigation — this matches their identical fixed-position appearance across every screenshot regardless of page |
| **Styling** | **Tailwind CSS**, with the Section 3 design tokens mapped into `tailwind.config.js` theme (`colors`, `fontFamily`, `spacing`) as the single source of truth | Utility-first speeds up matching the observed pill-buttons, generous section padding, and edge-to-edge image panels; keeps all "ESTIMATE" values centralized so Phase 2 color corrections are a one-file change. CSS Modules or styled-components are acceptable substitutes if the team prefers — but pick one and use it consistently. |
| **Primary animation engine** | **Framer Motion** (`whileInView`, `useInView`, `AnimatePresence`, `useMotionValue`/`useSpring`) | Declarative, integrates with React state naturally — recommended for section fade/slide-ins, card hover states, the count-up trigger, and the cursor-dot's smooth trailing motion |
| **Scroll-linked/parallax animation (supplementary, only if confirmed live)** | **GSAP + ScrollTrigger** | Use *only* for effects Framer Motion can't cleanly express — e.g., if live investigation (Section 9) confirms `HOME-HERO-DECOR-DOTGRID`/`-BLUERING`/`-REDRING` actually parallax on scroll or mouse-move. Don't run two animation engines for the same effect. |
| **Carousel** | **Swiper.js** (`swiper/react`) or **Embla Carousel** (`embla-carousel-react`) | Both natively support the observed "next slide peeking in from the edge" layout via `slidesPerView: 'auto'` / partial-view config — needed for `ABOUT-TESTIMONIAL...` |
| **Countdown timer** | Small custom `useCountdown(targetDate)` hook (`setInterval`, cleaned up on unmount) | Lightweight, no need for a dependency; target date is a TODO pending live investigation (Section 9, item 13) |
| **Animated counters** | **react-countup**, fired by Framer Motion's `useInView` (or `react-intersection-observer`) | Matches the very common "count up once scrolled into view" pattern `HOME-FUNFACTS-*` resembles |
| **Icons** | **lucide-react** | Clean line-icon set, closest visual match to the observed blue/gray outline icons (Why Choose Us cards, Fun Facts, nav, sidebar) — use as the default source for every `[ICON]` placeholder until exact original SVGs are sourced live |
| **Video modal (for "WATCH INTRO")** | Lightweight custom `AnimatePresence` modal, or `react-modal-video` if live investigation confirms a YouTube/Vimeo source | Exact video host is unknown — see Section 9, item 9 |
| **Chat widget** | Integrate the **actual third-party embed** once identified (Section 9, item 5) — do not build a custom chat UI/backend | This is almost certainly a drop-in script (e.g., Tawk.to/Crisp/WhatsApp widget), not something to reimplement |
| **Custom cursor** | Standalone component in the root layout; `mousemove` listener (or Framer Motion `useMotionValue` + `useSpring` for smooth trailing), `mix-blend-mode: difference` for the observed color-adaptive look; disable on `(pointer: coarse)` (touch) devices | Matches `GLOBAL-DOT-MARKER`'s behavior across all 11 screenshots |
| **State management** | React Context only where needed (e.g., countdown target date, mobile-menu open/close) | This site does not need Redux/Zustand — no complex shared app state observed |
| **Package manager / build** | npm or pnpm + Vite (`npm run dev`, `npm run build`) | Standard |

### 2.2 Recommended Project/Component Structure

```
/src
  /layout
    PersistentLayout.jsx     — renders Header, SidebarSocial, ChatWidget, CursorDot, GoToTop, Footer + <Outlet/>
  /pages
    Home.jsx
    About.jsx
    Portfolio.jsx            — stub, content not captured (see Section 1)
    Contact.jsx              — stub, content not captured (see Section 1)
  /components
    HeroSection.jsx           WhyChooseUs.jsx          AboutPreview.jsx
    ServicesGallery.jsx       FunFacts.jsx              PortfolioGrid.jsx
    AboutHero.jsx             ServicesStrip.jsx         PlatformsAndTestimonials.jsx
    TeamSection.jsx           CTACountdown.jsx
  /components/shared
    Button.jsx  EyebrowLabel.jsx  SectionHeading.jsx
    PlaceholderBox.jsx        — dev-only component, see 2.3 below
  /hooks
    useCountdown.js  useCursorDot.js  useInViewOnce.js (or use react-intersection-observer directly)
  /assets                     — currently empty; destination for sourced media (see Section 7 registry)
```

**Routing/persistence rule (ties back to Section 4):** because every `GLOBAL-*` component was confirmed — by its identical fixed position across every single screenshot on both pages — to be page-independent, it **must** live inside `PersistentLayout.jsx`, never duplicated inside `Home.jsx` or `About.jsx`.

### 2.3 `PlaceholderBox` — required dev component

Build **one** reusable placeholder component and use it for every entry in the Section 7 registry, rather than one-off markup per placeholder:

```jsx
<PlaceholderBox
  id="HOME-HERO-PORTRAIT"
  type="[HERO_IMAGE]"
  width="820px"
  height="900px"
  label="HERO PORTRAIT — man in navy vest, professional headshot-style photo"
/>
```

It should render a neutral, dashed-border, flat-fill box at the exact given size, with the `id`, `type`, and `label` printed visibly inside — so any reviewer can see instantly what's real content vs. what's still pending sourcing, without opening this spec side-by-side.

### 2.4 Animation/interaction → placeholder cross-reference

| Observed behavior | Placeholder ID(s) | Recommended tool (Section 2.1) |
|---|---|---|
| Cursor-tracking, color-adaptive dot | `GLOBAL-DOT-MARKER` | Custom component + Framer Motion `useMotionValue`/`useSpring` + `mix-blend-mode` |
| Scroll-triggered "Go to Top" visibility | `GLOBAL-GOTOTOP` | Framer Motion `useScroll`/`useInView` or a scroll-position listener |
| Rotating circular text badge | `ABOUT-HERO-BADGE` | Inline SVG `<textPath>` + CSS `@keyframes` infinite rotate (or `react-circular-text`) |
| Testimonial carousel w/ partial next-slide | `ABOUT-TESTIMONIAL-*` | Swiper.js or Embla Carousel |
| Live countdown | `ABOUT-CTA-COUNTDOWN` | Custom `useCountdown` hook |
| Animated stat count-up | `HOME-FUNFACTS-ICON-1/2/3` | react-countup + `useInView` |
| "WATCH INTRO" video trigger | `HOME-HERO-WATCHINTRO-ICON` | Framer Motion modal / `react-modal-video` |
| Persistent chat widget | `GLOBAL-CHAT-WIDGET` | Real third-party embed (not custom-built) |
| Possible hero decorative parallax | `HOME-HERO-DECOR-DOTGRID`, `-BLUERING`, `-REDRING` | GSAP ScrollTrigger — **only if** live investigation confirms motion (see Section 9) |
| Possible tabbed/hover image-swap | `ABOUT-SERVICES-STRIP-IMAGE` | TBD — confirm live before choosing a library (see Section 9, item 11) |

---

## 3. GLOBAL DESIGN TOKENS (all values are ESTIMATES from visual inspection — verify against live site before finalizing)

### 3.1 Color Palette

| Token | Approx. Hex | Where observed | Confidence |
|---|---|---|---|
| `--color-primary-blue` | `#3646E4` (royal/indigo blue) | About page hero background, ring outline decoration on Home hero, icon strokes | Medium — sample from live site |
| `--color-accent-coral` | `#F85D40` (coral/tomato red-orange) | All CTA buttons ("Discover More" underline, "About Us", "Contact Us", "All Portfolios"), star ratings, eyebrow dash accents | Medium |
| `--color-text-dark` | `#1B1F29` (near-black navy) | All headings, body copy on white/gray sections | Medium |
| `--color-text-muted` | `#6B7280` (mid gray) | Paragraph copy, eyebrow labels | Low-Medium |
| `--color-bg-white` | `#FFFFFF` | Default section background | High |
| `--color-bg-light-gray` | `#F6F6F8` | Alternating section background (e.g., "Why Choose Us" lower half, "We develop & create" section) | Medium |
| `--color-bg-dark-navy` | `#12131C` (footer) | Footer background | Medium |
| `--color-chat-bubble` | `#8B5CF6` (purple/violet) | Floating chat widget button | Low |
| `--color-icon-stroke-blue` | same as primary blue | Outline icons in "Why Choose Us" cards | Medium |

**Required live investigation:** sample exact hex values via browser devtools/eyedropper on the live site; do not ship estimates to production.

### 3.2 Typography

| Token | Observation | Confidence |
|---|---|---|
| `--font-heading` | Rounded/geometric sans-serif, bold–extrabold weight, friendly rounded terminals (visible on "g," "j," "a"). Best visual match candidates: **Poppins (Bold/SemiBold)**, **Quicksand (Bold)**, or **Baloo 2**. | UNKNOWN — verify via live site font inspection |
| `--font-body` | Same family, regular weight, gray color | UNKNOWN — same family assumed |
| `--font-eyebrow` | Same family, small size (~13–14px), uppercase or as-typed, letter-spaced (~1–2px tracking), gray or coral | UNKNOWN |
| Heading scale (H1 hero) | ~64–72px, tight line-height (~1.05), two-line wrap | Estimate from screenshot proportions |
| Heading scale (H2 section) | ~44–52px | Estimate |
| Body copy | ~16–18px, line-height ~1.6 | Estimate |

### 3.3 Spacing / Layout

- Max content width appears to be the full viewport (~1920px) with internal padding roughly **80–100px** on left/right for text-container sections.
- Section vertical padding is generous: roughly **120–160px** top and bottom per major section.
- Grid sections (3-col cards, 4-col logos, 3–4 col image panels) use **equal-width columns**, small (~24–32px) or zero gutters depending on section (image panels are edge-to-edge with **no gutter**; card/logo grids have visible gutters).
- Buttons are **pill-shaped** (fully rounded corners), coral fill, white text, medium padding (~16px vertical / 32px horizontal).

---

## 4. GLOBAL PERSISTENT COMPONENTS
*(Appear identically — or near-identically — across both pages and most/all sections. Build these once as shared components inside `PersistentLayout.jsx` — see Section 2.2.)*

### 4.1 Header / Primary Navigation

**Placeholder ID:** `GLOBAL-HEADER`
**Type:** `[NAVIGATION]` (structural, not a placeholder for missing media — content is fully known)

- **Position:** Fixed/sticky top, full width, transparent-on-hero → likely solidifies on scroll (UNKNOWN, verify — only captured at top-of-page state).
- **Left:** Logo mark (see `GLOBAL-LOGO` below).
- **Center-left:** Nav links — `Home` · `About Us` · `Our Portfolio` · `Contact Us`. Active page indicated by an underline beneath the current item (seen under "Home" in screenshot 1).
- **Right:** Two icon buttons — search (magnifying glass) and a 3×3 dot grid icon (likely an off-canvas menu / mega-menu toggle).

**Placeholder ID:** `GLOBAL-LOGO`
**Type:** `[LOGO]`
**Visual description:** A small angular/geometric multicolor mark (reads roughly as a stylized "S"/paper-airplane/flag shape in red and blue) immediately followed by the wordmark "DESIGN" in bold black, combining to read as "SNDESIGN" or "SND DESIGN." Appears in the header (screenshot 1) and again in the footer (screenshot 11), same mark both times.
**Approximate size:** ~140–160px wide × ~40px tall.
**Known:** Multicolor angular mark + bold wordmark; used identically in header and footer.
**Unknown:** Exact vector/SVG shape, exact color values, exact font of wordmark, whether it's an image, inline SVG, or icon font.
**Required live investigation:** Pull the actual logo asset (SVG/PNG) from the live site's source.
**Phase 1 instruction:** Render a placeholder box (~150×40px) with dev-label text "LOGO — SNDESIGN mark" in the same position, no fabricated graphic.

**Placeholder ID:** `GLOBAL-NAV-ICONS`
**Type:** `[ICON]` ×2
**Visual description:** (1) magnifying-glass search icon, (2) 3×3 dot grid ("apps"/menu) icon. Simple black line icons, top-right of header.
**Known:** Icon shapes and rough meaning (search, menu-toggle).
**Unknown:** Click behavior / what the grid icon opens (off-canvas menu? language switch? app launcher?).
**Required live investigation:** Click both on the live site and document behavior.

### 4.2 Floating Social Sidebar (left edge, fixed position)

**Placeholder ID:** `GLOBAL-SIDEBAR-SOCIAL`
**Type:** `[ICON]` group (4 items) + structural nav
**Visual description:** A vertical stack fixed to the far-left edge of the viewport, present identically in **every single screenshot** regardless of page or scroll position — confirms it is `position: fixed`. From top to bottom: **Email** (envelope icon), **Phone** (small icon, possibly a call/link glyph), **Whatsapp** (small circular icon), **Facebook** (Facebook "f" icon). Each label is rotated 90° (vertical text reading bottom-to-top), with its icon positioned below/beside the rotated text.
**Approximate position:** Left edge, x ≈ 40–70px from viewport left, vertically spanning roughly the middle 60% of viewport height (y ≈ 260px to y ≈ 690px in an ~912px-tall viewport).
**Approximate size:** ~30px wide column, ~430px tall total span, with 4 evenly-spaced items.
**Known:** 4 fixed vertical labels with icons: Email, Phone, Whatsapp, Facebook, each almost certainly a clickable link (`mailto:`, `tel:`, `wa.me/`, and a Facebook page URL respectively).
**Unknown:** Exact destination URLs/phone numbers/handles, exact icon SVGs, hover states.
**Required live investigation:** Extract `href` values from the live site.
**Phase 1 instruction:** Build the fixed vertical stack structure with placeholder icons and rotated text labels; leave `href="#"` until real values are sourced.

### 4.3 Floating Chat Widget

**Placeholder ID:** `GLOBAL-CHAT-WIDGET`
**Type:** `[INTERACTIVE_MEDIA]` (likely 3rd-party embed)
**Visual description:** A circular purple/violet button, bottom-left corner of viewport, with a chat-bubble/message icon, and an adjacent white pill-shaped tooltip reading **"Contact us."** Present in every screenshot at a fixed position (bottom-left), confirming `position: fixed`.
**Approximate position:** x ≈ 20–200px, y ≈ bottom of viewport minus ~60–100px.
**Approximate size:** Circle ~50–60px diameter; tooltip pill ~130×40px.
**Known:** Persistent live-chat-style widget with the label "Contact us."
**Unknown:** Underlying provider (could be Tawk.to, Crisp, WhatsApp Business widget, Facebook Messenger plugin, or a custom in-house widget) and what opens on click (chat panel vs. WhatsApp deep link).
**Required live investigation:** Inspect the live page's injected `<script>` tags / network requests to identify the actual chat provider, then integrate the correct official embed (do not simulate a chat UI with a fake vendor).
**Phase 1 instruction:** Render the fixed circular button + tooltip exactly as described; wire click handler as a TODO stub. See Section 2.1/2.4 — integrate the real third-party embed, do not hand-build a chat backend.

### 4.4 "Go to Top" Control

**Placeholder ID:** `GLOBAL-GOTOTOP`
**Type:** `[ICON]` + label (structural — content known)
**Visual description:** Vertical rotated text reading "Go to Top" with an upward arrow icon above it, fixed to the bottom-right edge of the viewport. **Absent in screenshot 1** (top of page) but **present in screenshots 2 through 11** — confirms this element only appears after the user has scrolled down (a "back to top" affordance with scroll-triggered visibility).
**Approximate position:** Fixed, x ≈ viewport width − 90px, y ≈ vertically centered to bottom third of viewport.
**Known:** Text, arrow icon, scroll-triggered show/hide behavior, likely scrolls to top of page on click.
**Unknown:** Exact show threshold (how many px scrolled before it appears), transition/animation style.
**Required live investigation:** Verify scroll trigger threshold and animation on the live site.
**Recommended implementation:** Framer Motion `useScroll`/`useInView`, or a plain scroll-position listener toggling visibility — see Section 2.4.

### 4.5 Recurring Single "Dot" Indicator

**Placeholder ID:** `GLOBAL-DOT-MARKER`
**Type:** `[UNKNOWN_MEDIA]` / `[INTERACTIVE_ANIMATION]`
**Visual description:** A small solid circular dot that appears **once per screenshot**, roughly centered in the main content column but at a **different vertical position in nearly every screenshot** (e.g., mid-hero in screenshot 1; centered under "Why Choose Us" heading in screenshot 2; centered under the 4-panel service gallery in screenshot 4; bottom-left of the portfolio grid in screenshot 6; centered in the blue About hero in screenshot 7, colored **yellow/lime** there instead of black; white in the dark CTA section in screenshot 10). The dot's **color adapts to the background** it sits on (black on light backgrounds, yellow on the blue About-hero background, white on dark photo backgrounds).
**Purpose (best guess, unconfirmed):** Most likely a **custom cursor replacement** (a small circular dot that follows the mouse pointer, common in creative-agency template designs, often using `mix-blend-mode: difference` to auto-invert against any background — which would explain the color shifts). Less likely alternative: a decorative per-section scroll/slide indicator.
**Known:** A single dot, color-adaptive, appears at a plausible "cursor position" each time, present across both pages.
**Unknown:** Confirmed implementation (custom cursor vs. decorative marker vs. slide indicator), exact size, animation/trailing behavior, whether it reacts to hover states (e.g., grows over links/buttons — a common pattern for custom cursors).
**Required live investigation:** Move the mouse around the live site and observe directly whether this dot tracks the cursor. If confirmed as a custom cursor, implement as a `position: fixed`, `mix-blend-mode: difference` circle bound to `mousemove`, hidden on touch devices.
**Phase 1 instruction:** Do not build this as fixed decorative content in every section. Build it once, globally, as a candidate custom-cursor component, disabled/hidden until confirmed live. See Section 2.1/2.4 for the recommended `mix-blend-mode` + Framer Motion approach.

### 4.6 Footer

**Placeholder ID:** `GLOBAL-FOOTER`
**Type:** structural (content known) + `[LOGO]` (shared with `GLOBAL-LOGO`)
**Visual description:** Full-width dark navy/near-black band. Three-column layout:
- **Left:** "© 2026 All Rights Reserved to Template" (plain gray/white text)
- **Center:** SND Design logo mark (same as header — reuse `GLOBAL-LOGO`)
- **Right:** Four circular outlined icon buttons in a row: Facebook, Whatsapp, Phone, Email (same 4 channels as the sidebar, redundant/secondary placement)
**Approximate height:** ~120–150px.
**Known:** Exact copy text, 3-column structure, 4 icon buttons matching the sidebar's 4 channels.
**Unknown:** Exact icon SVGs/hrefs (same as sidebar — likely identical destinations).
**Required live investigation:** Confirm footer icon links match sidebar links.

---

## 5. PAGE A — HOME (`/`)

Scroll order: **Hero → Why Choose Us → About Preview ("We develop & create") → Services (4-panel gallery) → Fun Facts (stats) → Portfolio Preview grid**

### 5.1 Section: Hero
*(Screenshot 1)*

**Layout:** Two-column hero, ~55% left (text) / ~45% right (image), light gray-white background.

**Copy (verbatim):**
- H1: **"Build Innovative Digital Projects"**
- Body paragraph: *"Saber is a digital agency consists of strategists, creative minds, technologists, designers, marketers, storytellers, and inventors."* — followed by a 🤘 (horns/rock-on) emoji
- Link: **"Discover More"** (underlined text-link style, not a button)
- Secondary CTA: circular play-button icon + label **"WATCH INTRO"** (letter-spaced caps)

**Placeholder ID:** `HOME-HERO-PORTRAIT`
**Type:** `[HERO_IMAGE]`
**Visual description:** Large portrait photograph of a smiling man with short dark hair and beard, wearing a navy waistcoat/vest, white shirt, and a mustard-orange tie, carrying a matching navy suit jacket draped over one arm, looking directly at camera. Occupies the right portion of the hero and extends past the bottom edge of the viewport (crops off).
**Approximate position:** Right ~45% of hero section, vertically filling/exceeding the hero's height.
**Approximate width:** ~750–850px.
**Aspect ratio:** Roughly 3:4 to 2:3 (portrait), tall.
**Known:** Real photographic portrait, business/professional styling, warm friendly expression, direct eye contact.
**Unknown:** Exact source file, resolution, whether this is a stock photo or the actual founder ("Saber" — plausible given the "About Us" business-owner framing later in the site), crop treatment, any responsive alternate crops.
**Required live investigation:** Pull actual image asset + check `alt` text for identity confirmation.
**Phase 1 instruction:** Render a placeholder image box at the specified size/position/aspect ratio with dev-label "HERO PORTRAIT — man in navy vest, professional headshot-style photo."

**Placeholder ID:** `HOME-HERO-DECOR-DOTGRID`
**Type:** `[DECORATIVE_GRAPHIC]`
**Visual description:** A grid/matrix of small light-gray dots (roughly 10 columns × 8 rows) positioned above and slightly behind the hero portrait, upper-right quadrant of the hero.
**Approximate position:** x ≈ 1015–1150px, y ≈ 145–270px.
**Approximate size:** ~140×130px.
**Known:** Static decorative dot-grid pattern (likely SVG or repeating background).
**Unknown:** Exact dot count/spacing, whether it animates (e.g., subtle parallax on scroll/mouse-move — common in this style of template).
**Required live investigation:** Check for scroll/mouse parallax behavior.

**Placeholder ID:** `HOME-HERO-DECOR-BLUERING`
**Type:** `[DECORATIVE_GRAPHIC]`
**Visual description:** A large outline-only circle (ring), royal blue stroke, no fill, positioned overlapping the top-right area of the hero portrait (partially behind the subject's head/shoulder).
**Approximate size:** ~230px diameter.
**Known:** Blue ring shape, brand-color accent.
**Unknown:** Stroke width, whether animated (rotating, pulsing) — plausible given "creative agency" template conventions.
**Required live investigation:** Observe live for animation.

**Placeholder ID:** `HOME-HERO-DECOR-REDRING`
**Type:** `[DECORATIVE_GRAPHIC]`
**Visual description:** A large outline-only circle (ring), coral/red-orange stroke, no fill, positioned lower-left of the hero portrait, partially cropped off the bottom of the viewport.
**Approximate size:** ~230–250px diameter, ~60–70% visible (bottom cropped by viewport).
**Known:** Red/coral ring shape, mirrors the blue ring as a paired decorative motif.
**Unknown:** Full extent below the fold, animation behavior.
**Required live investigation:** Scroll/inspect to see full shape and any animation.

**Placeholder ID:** `HOME-HERO-DECOR-XMARKS`
**Type:** `[DECORATIVE_GRAPHIC]`
**Visual description:** Two white "X" (cross/plus-rotated) marks overlaid directly on the hero photo, positioned over the subject's chest/vest area, mid-left and mid-right of the photo.
**Approximate size:** Each ~50×50px.
**Known:** Two bold white X-shapes, likely a recurring brand graphic motif (worth checking if reused elsewhere on the site).
**Unknown:** Exact SVG shape, whether they're purely decorative or have interactive/hover behavior.

**Placeholder ID:** `HOME-HERO-DECOR-DOTCLUSTER`
**Type:** `[DECORATIVE_GRAPHIC]`
**Visual description:** A cluster/grid of white dots overlaid on the lower-right portion of the hero photo (over the subject's arm/jacket area), arranged in an irregular blocky grid pattern (~8×8 dots in an L-shaped or blocky arrangement).
**Approximate position:** Lower right of hero photo, roughly x ≈ 1360–1510px, y ≈ 760–900px.
**Approximate size:** ~150×150px.
**Known:** White dot-grid overlay, decorative.
**Unknown:** Exact pattern/shape logic, animation.

**Placeholder ID:** `HOME-HERO-WATCHINTRO-ICON`
**Type:** `[ICON]`
**Visual description:** A circular button with a blue outline/border and a right-pointing play-triangle icon inside, positioned to the left of the "WATCH INTRO" text label, lower-left of the hero content.
**Approximate size:** ~50×50px circle.
**Known:** Play-button affordance, implies a video exists.
**Unknown:** What the video actually is (`[VIDEO]` target — likely opens a modal/lightbox video player), video source/host (YouTube/Vimeo/self-hosted), video content/thumbnail.
**Required live investigation:** Click "WATCH INTRO" on the live site and document the resulting video modal, source, and thumbnail.
**Phase 1 instruction:** Wire the button to open an empty/placeholder modal labeled "INTRO VIDEO — source unknown," built with the modal approach in Section 2.1/2.4.

### 5.2 Section: Why Choose Us
*(Screenshot 2, top half)*

**Layout:** Centered header, 3-column equal-width bordered card row below, white background.

**Copy (verbatim):**
- Eyebrow: **"CREATIVE VISION"**
- H2: **"Why Choose Us!"**
- Card 1: **"High Quality"**
- Card 2: **"Fast Support"**
- Card 3: **"100% Satisfaction"**

**Placeholder ID:** `HOME-WHYUS-ICON-1`, `HOME-WHYUS-ICON-2`, `HOME-WHYUS-ICON-3`
**Type:** `[ICON]` ×3
**Visual description:**
- Icon 1 (High Quality): a pen-tool/vector-anchor-point icon (outline, blue stroke) — evokes design/precision.
- Icon 2 (Fast Support): a browser-window icon with a loading/spinner symbol inside (outline, blue stroke) — evokes speed/live support.
- Icon 3 (100% Satisfaction): a stack of layered diamond/rhombus shapes (outline, blue stroke) — evokes quality/layers of service.
**Approximate size:** Each ~70×70px, centered at the top of its card.
**Known:** Simple blue-stroke line-icon style, consistent stroke weight across all three.
**Unknown:** Exact SVG paths — these should be sourced from an icon library (possibly Feather Icons, Untitled UI, or a custom set) or redrawn to match.
**Required live investigation:** Inspect live SVG markup for exact icon shapes.
**Phase 1 instruction:** Use closest-matching icons from a standard open icon set (e.g., a pen/vector-node icon, a browser-loading icon, a stacked-layers icon) as a stand-in, clearly labeled as provisional.

**Card styling note:** Each card is a bordered rectangle (thin light-gray 1px border, no fill/shadow), generous internal padding, icon centered above bold heading text, no body copy inside the card.

### 5.3 Section: About Preview — "We develop & create digital future."
*(Screenshots 2 bottom → 3)*

**Layout:** Two-column, ~50/50, light gray section background. Left = text + button + logo strip below; right = illustration.

**Copy (verbatim):**
- Eyebrow: **"MORE EFFECTIVE"**
- H2: **"We develop & create digital future."**
- Body: *"We appreciate your trust greatly. Our clients choose us and our products because they know we are the best."*
- Button: **"About Us"** (coral pill button, with a small teal dot accent near/on the button — decorative, purpose unclear)

**Placeholder ID:** `HOME-ABOUTPREVIEW-ILLUSTRATION`
**Type:** `[ILLUSTRATION]`
**Visual description:** A flat-design vector illustration of a person (teal/dark clothing, simplified geometric style) standing and holding an oversized pencil topped with a paintbrush, "painting" a large abstract multicolor splash/blob (rainbow gradient — greens, blues, oranges, pinks) onto a framed canvas/whiteboard. A light gray dot-grid pattern sits behind the upper-left of the illustration, and a small blue ring peeks out from behind the lower-left.
**Approximate position:** Right ~50% of section.
**Approximate size:** ~530×450px illustration frame.
**Aspect ratio:** Roughly 5:4.
**Known:** Flat vector illustration style, consistent with a "creative/digital agency" visual theme; reuses the same dot-grid and ring motifs from the hero.
**Unknown:** Exact source (likely a licensed stock illustration — e.g., from unDraw, Storyset, or similar flat-illustration libraries — needs identification to source a matching or licensed-equivalent asset), exact colors of the paint splash.
**Required live investigation:** Identify exact illustration asset/library and license.
**Phase 1 instruction:** Placeholder box, same size/position, dev-label "ILLUSTRATION — person painting colorful abstract splash, flat vector style."

**Placeholder ID:** `HOME-ABOUTPREVIEW-LOGOSTRIP`
**Type:** `[LOGO]` ×4 (structural row, content partially known)
**Visual description:** A row of 4 equal-width bordered white boxes, each containing a grayscale-ish brand logo: **Fiverr**, **Upwork**, **Freelancer**, and **SND Design** (the site's own logo again, styled the same as the header/footer mark).
**Approximate size:** Each box ~330×110px.
**Known:** These are the platform logos where the agency operates/has profiles (Fiverr, Upwork, Freelancer) plus a repeat of the own-brand logo.
**Unknown:** Whether these are clickable links to the agency's actual profiles on those platforms.
**Required live investigation:** Confirm link destinations; source official up-to-date logo assets for Fiverr/Upwork/Freelancer (do not redraw from memory — use official brand assets).
**Phase 1 instruction:** Use placeholder boxes labeled "Fiverr logo," "Upwork logo," "Freelancer logo," "SND Design logo" respectively until official assets are sourced.

### 5.4 Section: Services — 4-Panel Gallery
*(Screenshot 4, top)*

**Layout:** Full-bleed, edge-to-edge, 4 equal-width columns, no gutters, each column a full-bleed photographic background image with a dark gradient overlay (bottom-weighted, for text legibility) and text pinned to the bottom-left.

**Copy (verbatim, per panel):**
1. "01." / **"Graphic Designs"**
2. "02." / **"Web Development"**
3. "03." / **"Creative Video"**
4. "04." / **"SEO"**

**Placeholder ID:** `HOME-SERVICES-PANEL-1` (Graphic Designs)
**Type:** `[IMAGE]`
**Visual description:** Desk-top flat-lay photo: an iMac monitor edge, a bright pink/magenta storage box, and a keyboard, all lit warmly.
**Approximate size:** ~480×550px (quarter of a ~1920×550 strip).
**Known:** Warm-toned desk/workspace photography.
**Unknown:** Exact source (stock photo), licensing.

**Placeholder ID:** `HOME-SERVICES-PANEL-2` (Web Development)
**Type:** `[IMAGE]`
**Visual description:** Close-up of a dark-mode code editor on screen, showing Svelte component code (visible strings like `sidebarComponent.svelte`, `import sidebarController`, template markup with `{#each}` loop) — this is a **real, legible code screenshot**, not abstract.
**Approximate size:** ~480×550px.
**Known:** Actual dark-theme code editor screenshot with legible Svelte syntax.
**Unknown:** Whether this is a generic "web dev" stock screenshot or an actual project of the agency's.

**Placeholder ID:** `HOME-SERVICES-PANEL-3` (Creative Video)
**Type:** `[IMAGE]`
**Visual description:** Video-editing software interface showing audio waveforms (teal/green) across a timeline — resembles Adobe Premiere Pro / Audition editing view.
**Approximate size:** ~480×550px.
**Known:** Real screenshot of NLE/audio-editing software mid-project.
**Unknown:** Exact software, whether it's the agency's real work or stock.

**Placeholder ID:** `HOME-SERVICES-PANEL-4` (SEO)
**Type:** `[IMAGE]`
**Visual description:** A MacBook-style laptop displaying an analytics dashboard (pie chart, bar chart, sidebar nav in French — visible text like "Copie de Toutes les données du site Web"), with a hand typing on the keyboard, partial second monitor visible.
**Approximate size:** ~480×550px.
**Known:** Real analytics-dashboard screenshot with a French-language interface.
**Unknown:** Exact tool (could be Google Analytics/Looker Studio derivative), source/licensing.

**Phase 1 instruction for all 4 panels:** Render 4 edge-to-edge placeholder image blocks of equal width, each with its number + title overlaid at bottom-left over a dark gradient scrim, exactly as described, using neutral placeholder fills (not fabricated photography).

### 5.5 Section: Fun Facts (Stats)
*(Screenshot 4 bottom → 5)*

**Layout:** Centered header, 3-column stat row below, white background.

**Copy (verbatim):**
- Eyebrow: **"FUN FACTS"**
- H2: **"An original team of creators designers & dreamers."**
- Stat 1: **"2000+"** / "Total Clients"
- Stat 2: **"3000+"** / "Total Projects"
- Stat 3: **"1000+"** / "Total Reviews"

**Placeholder ID:** `HOME-FUNFACTS-ICON-1/2/3`
**Type:** `[ICON]` ×3
**Visual description:** Thin gray outline icons above each stat: (1) a person/user silhouette icon, (2) a target/dartboard-with-arrow icon, (3) a trophy-in-a-frame icon.
**Approximate size:** Each ~90×90px.
**Known:** Consistent thin-line icon style, light gray stroke color (distinct from the blue icons used earlier).
**Unknown:** Exact SVG source.
**Note:** These numbers are very likely **animated count-up counters** on scroll-into-view (a standard pattern for "stats" sections in agency templates) — flag as `[INTERACTIVE_ANIMATION]` in addition to the static icon placeholders.
**Required live investigation:** Confirm count-up animation behavior and trigger (scroll-into-view vs. page-load).
**Recommended implementation:** `react-countup` fired by `useInView` — see Section 2.1/2.4.

### 5.6 Section: Portfolio Preview Grid
*(Screenshots 5 bottom → 6)*

**Layout:** Asymmetric 2-column image grid: one large image occupies the full left column height; the right column stacks two smaller images. Below the grid, a centered coral pill button.

**Copy (verbatim):**
- Button: **"All Portfolios →"** (with a right-arrow icon)

**Placeholder ID:** `HOME-PORTFOLIO-IMG-1` (large, left)
**Type:** `[IMAGE]`
**Visual description:** A laptop mockup on a wooden desk (bookshelf/plants blurred background) displaying a bilingual (Arabic/English) e-commerce-style website for "MUSTADEEM" — appears to sell natural oils/herbal skincare products (product photography of bottles/herbs visible on-screen).
**Approximate size:** ~630×690px.
**Aspect ratio:** ~11:12 (near square, tall).
**Known:** Real client-site mockup, brand name "Mustadeem" clearly legible, Arabic RTL layout visible in the mockup.
**Unknown:** Whether this is a live/current client project — verify before reusing branding.

**Placeholder ID:** `HOME-PORTFOLIO-IMG-2` (top right)
**Type:** `[IMAGE]`
**Visual description:** A laptop on a desk (coffee cup, headphones visible) displaying an Arabic-language food-delivery promotional site/app screen, with visible branding fragments "Merrychef," pricing figures ("33,145 / 30,844"), and a "24" badge.
**Approximate size:** ~630×330px.
**Known:** Real client-site mockup, Arabic RTL food-delivery interface.
**Unknown:** Full client/brand name (partially obscured), whether current.

**Placeholder ID:** `HOME-PORTFOLIO-IMG-3` (bottom right)
**Type:** `[IMAGE]`
**Visual description:** A dark flat-lay desk photo (coffee cup, pen, small plant) featuring a product brochure/book mockup with cover branding **"HELIX — Innovate your life"** on a purple/magenta neon gradient background.
**Approximate size:** ~630×330px.
**Known:** Real branding/print-design mockup for a project called "Helix."
**Unknown:** Whether current client work.

**Phase 1 instruction:** Build the asymmetric 2-col/1-large + 2-stacked grid structure with placeholder boxes at the specified sizes; label each with its client name as noted.

---

## 6. PAGE B — ABOUT US (`/about/`)

Scroll order: **Hero (blue) → Services strip (blue, single wide image w/ 3 labels) → Our Platforms + Testimonials → Meet Our Team → CTA / Countdown → Footer**

### 6.1 Section: About Hero
*(Screenshot 7)*

**Layout:** Full-width royal-blue background section. Small scroll-cue arrow at top-center. Below: 2-column — left = framed photo with a circular rotating badge overlapping its top-right corner; right = text block.

**Copy (verbatim):**
- Eyebrow: **"CREATIVE APPROACH"** (white text)
- H2: **"We develop & create digital future."** (white text — note: identical heading text to the Home "About Preview" section, but different supporting copy/media/background — build as a separate component, see rule in Section 0)
- Body: *"For those who love videos, animation and motion graphics, we have come up with a new cool project!"* (white text)

**Placeholder ID:** `ABOUT-HERO-DESKPHOTO`
**Type:** `[IMAGE]`
**Visual description:** A photo of a home-office desk setup: two monitors displaying code/design software, a MacBook, a desk lamp, a coffee mug, and a speaker/headphone stand, shot in bright natural light against a white wall/window.
**Approximate position:** Left portion of the hero section.
**Approximate size:** ~520×320px.
**Aspect ratio:** ~13:8 (wide landscape).
**Known:** Real workspace photography, bright/airy lighting.
**Unknown:** Exact source/license.

**Placeholder ID:** `ABOUT-HERO-BADGE`
**Type:** `[ANIMATION]` / `[SVG_GRAPHIC]`
**Visual description:** A circular badge composed of the repeated text "ABOUT US · ABOUT US ·" arranged along a circular path (curved text), with a downward-pointing arrow icon in the center. Positioned overlapping the top-right corner of the desk photo.
**Approximate size:** ~130×130px.
**Known:** Circular curved-text badge with center arrow — a very common "spinning badge" UI pattern in modern agency sites.
**Unknown:** Whether it **rotates continuously** (strongly suspected given the pattern's ubiquity in this exact use-case, but not visually confirmable from a static screenshot), rotation speed/direction, and whether the arrow is animated separately (e.g., bouncing) from the rotating text ring.
**Required live investigation:** Observe live for rotation animation; this is a near-certain CSS `@keyframes` rotating-text badge — confirm and reproduce the rotation speed/direction.
**Phase 1 instruction:** Build as a static circular badge in Phase 1 (correct position/size/text), flagged for animation in Phase 2. Recommended implementation: inline SVG `<textPath>` + CSS `@keyframes` rotate — see Section 2.1/2.4.

**Placeholder ID:** `ABOUT-HERO-SCROLLCUE`
**Type:** `[ICON]`
**Visual description:** A small downward-pointing arrow/chevron icon, white, centered at the very top of the hero section.
**Known:** Likely a "scroll down" affordance.
**Unknown:** Whether animated (bouncing), whether clickable (smooth-scrolls to next section).

### 6.2 Section: Services Strip (blue background)
*(Screenshot 8)*

**Layout:** Full-bleed single wide photo spanning the section width, with **3 vertical text labels overlaid at the bottom**, separated by thin vertical divider lines.

**Copy (verbatim):**
- **"Graphic Designs"** | **"Web Development"** | **"Creative Video"**

⚠️ **Structural discrepancy flag:** On the Home page (Section 5.4), this same conceptual content ("Graphic Designs / Web Development / Creative Video / SEO") is built as **4 separate full-bleed photographs**, each numbered, each with its own dark-gradient text overlay. Here on the About page, it appears instead as **ONE continuous flat-lay photograph** (not 4 stitched images) with only **3 text labels** overlaid via thin divider lines, and **no visible "SEO" fourth label and no numbering**. This could mean: (a) the About page genuinely uses a different, simplified 3-item version of this component, or (b) a 4th panel/label exists just outside the captured frame. **Do not assume these are the same component reused** — build them as documented, and flag for live verification.

**Placeholder ID:** `ABOUT-SERVICES-STRIP-IMAGE`
**Type:** `[IMAGE]`
**Visual description:** A single wide flat-lay photograph of a creative workspace: a potted plant (top-left), a bright pink/red hard-shell accessory case, an iPad or tablet displaying a 2×3 grid of Adobe application icons (Photoshop, Illustrator, After Effects, Audition, Premiere Pro, InDesign — visible as colored app-icon tiles labeled "Pr / Ae / Au / Ai / St" etc.), a notebook with hand-lettered cover text reading "GRAPHIC DESIGN PLAYBOOK," a wireless keyboard, and the edge of an Apple monitor/iMac — all shot from a similar high overhead/45° angle in moody, dim lighting.
**Approximate size:** Full section width (~1920px) × ~500px tall.
**Known:** Real flat-lay creative-workspace photography featuring visible Adobe branding.
**Unknown:** Exact source/license; whether Adobe app icons are the official current icon set (if rebuilding, use current official Adobe Creative Cloud icon assets rather than redrawing from the screenshot).
**Required live investigation:** Confirm whether this is 3 or 4 labeled zones on the live site, and whether it's one image or a horizontal filmstrip/carousel of images (given the vertical divider lines could also indicate a hover-triggered image-swap per label — a common "tabbed image reveal" interaction).
**Phase 1 instruction:** Build as a single full-bleed image with 3 evenly-spaced bottom-aligned text labels divided by thin vertical rules, exactly as observed; leave a commented note about the possible 4th "SEO" zone/interaction to verify.

### 6.3 Section: Our Platforms + Testimonials
*(Screenshot 9)*

**Layout:** Top half — 2-column: left = heading, right = 3 logo cards in a row. Bottom half (light gray background) — 2-column: left = heading + prev/next arrow controls, right = large testimonial quote card with a second card peeking in from the right edge (carousel).

**Copy (verbatim):**
- Eyebrow: **"HUGE HONOR"**
- H2: **"Our Platforms"**
- Logo cards: **Fiverr**, **Upwork**, **Freelancer** (same logos as `HOME-ABOUTPREVIEW-LOGOSTRIP`, reuse those assets — but note only 3 shown here, not the 4th own-brand logo)
- Eyebrow: **"TESTIMONIALS"**
- H2: **"Suggestions & Feedback"**
- Testimonial 1 (fully visible): *"Saber is a great person to work with, very professional and goes above and beyond to ensure the customer is happy. He is very quick to respond to any request and provides advice to make the site better. He is very patient waiting for information and provides great support. I would definitely recommend him for a job and work with him again"* — Author: **ginabuckney**, **Project Manager**, 5-star rating.
- Testimonial 2 (partially visible/cropped at right edge, next in carousel): *"Best WordPress develope[r] available and very quick i[n] development."* — Author: **bollybeatz**, **Project Manager**, 5-star rating.

**Placeholder ID:** `ABOUT-TESTIMONIAL-AVATAR-1`
**Type:** `[IMAGE]`
**Visual description:** Small circular profile photo of a person (appears to be a woman with dark hair, warm-toned photo), next to the name "ginabuckney."
**Approximate size:** ~60×60px circle.
**Known:** Real (or stock) profile photo.
**Unknown:** Source — likely pulled from a freelance-platform review (Fiverr/Upwork), given context.

**Placeholder ID:** `ABOUT-TESTIMONIAL-LOGO-2`
**Type:** `[LOGO]`
**Visual description:** Small square logo mark for "bollybeatz" — a blue/teal abstract icon mark next to the wordmark "bollybeatz," used in place of a personal photo for this testimonial.
**Approximate size:** ~50×50px.
**Known:** Client/brand logo, not a personal headshot.
**Unknown:** Exact source asset.

**Interactive note:** The prev/next circular arrow buttons on the left confirm this testimonial block is a **carousel/slider**, not a static grid — `[INTERACTIVE_MEDIA]`. Only 2 of presumably several testimonial slides were captured. Flag remaining slides as `[UNKNOWN_MEDIA]` — content not captured, do not fabricate additional testimonials. **Recommended implementation:** Swiper.js or Embla Carousel with `slidesPerView: 'auto'` to reproduce the partially-visible next card — see Section 2.1/2.4.

### 6.4 Section: Meet Our Team
*(Screenshot 10, top)*

**Layout:** 2-column: left = heading + 2 CTAs; right = 2 team photos side by side.

**Copy (verbatim):**
- Eyebrow: **"OUR TEAM"**
- H2: **"Meet Our Team"**
- Button: **"About Us"** (coral pill)
- Secondary link: play-circle icon + **"Contact Us"**

**Placeholder ID:** `ABOUT-TEAM-PHOTO-1`
**Type:** `[IMAGE]`
**Visual description:** Outdoor portrait (garden/greenery background) of the same man featured in the Home hero (`HOME-HERO-PORTRAIT`) — navy waistcoat, white shirt, mustard tie, jacket draped over arm, smiling at camera. **This appears to be the same person/photo set as the Home hero image**, likely the agency founder "Saber."
**Approximate size:** ~300×250px.
**Known:** Same subject as hero photo; likely same photoshoot.
**Unknown:** Whether it's the exact same source file cropped differently, or a different frame from the same shoot.

**Placeholder ID:** `ABOUT-TEAM-PHOTO-2`
**Type:** `[IMAGE]`
**Visual description:** Outdoor portrait (same garden setting) of a second man — dark curly hair, glasses, navy blazer, white shirt, mustard tie, hand adjusting lapel, smiling at camera.
**Approximate size:** ~300×250px.
**Known:** Second team member, same photoshoot/setting as Photo 1.
**Unknown:** Name/role (not labeled in the captured crop — a name/title caption may exist below each photo but was not visible in this screenshot's frame).
**Required live investigation:** Check for name/role captions beneath each team photo, and whether more team members exist in a scrollable/grid row beyond these 2.

### 6.5 Section: CTA — Countdown / Limited Discount
*(Screenshots 10 bottom → 11 top)*

**Layout:** Full-bleed section with a dark-overlaid background photo, centered content.

**Copy (verbatim):**
- Eyebrow: **"GET THE OFFER"**
- H2: **"Ask Us About Limited Discount"**
- Countdown timer: **"00 : 00 : 00 : 00"** labeled **Days / Hours / Minutes / Seconds**
- Button: **"Contact Us"** (coral pill)

**Placeholder ID:** `ABOUT-CTA-BGPHOTO`
**Type:** `[BACKGROUND_VIDEO]` or `[IMAGE]` (ambiguous — see below)
**Visual description:** Close-up photo of two hands interacting with a tablet/device displaying a fashion/mood-board style app interface (colorful clothing thumbnails, a "STONE" brand label visible), dark semi-transparent overlay applied on top for text contrast.
**Approximate size:** Full section width × ~700px tall.
**Known:** Real photography, warm/dim lighting, heavy dark overlay (~50–60% black).
**Unknown:** **Whether this is a static image or a looping background video** — the identical framing appears across both captured screenshots (10 and 11) with only the foreground content scrolled, which is consistent with either a static background-attachment image OR a subtle looping video/cinemagraph (common in this CTA-banner pattern). Cannot be determined from static screenshots alone.
**Required live investigation:** Load the live page and watch this section for several seconds to determine if there is any motion (video/cinemagraph) versus a fully static image.
**Phase 1 instruction:** Build as a static background-image placeholder first; add a `[BACKGROUND_VIDEO]` TODO comment for Phase 2 verification.

**Placeholder ID:** `ABOUT-CTA-COUNTDOWN`
**Type:** `[INTERACTIVE_MEDIA]` (JS-driven countdown widget)
**Visual description:** 4 large numeric blocks reading "00" each, separated by colons, with thin underlines and labels (Days/Hours/Minutes/Seconds) beneath each block.
**Known:** Structural layout of a countdown timer widget; captured state shows all zeros (timer may be expired, not yet initialized in this capture, or perpetually reset).
**Unknown:** The actual target date/time the countdown counts down to, and what happens at zero (does it reset? redirect? show a different message?).
**Required live investigation:** Inspect live JS to find the target timestamp and end-state behavior. Do not hardcode "00:00:00:00" as permanent content — this is very likely a live/dynamic value.
**Recommended implementation:** custom `useCountdown(targetDate)` hook — see Section 2.1/2.4.

### 6.6 Section: Footer
*(Screenshot 11, bottom)*
→ Covered by `GLOBAL-FOOTER` in Section 4.6. No page-specific differences observed.

---

## 7. MASTER PLACEHOLDER REGISTRY

Quick-reference index of every placeholder defined in this document, for the implementing agent to check off during Phase 1 build.

| Placeholder ID | Type | Page | Section |
|---|---|---|---|
| `GLOBAL-HEADER` | Navigation (structural) | Both | Header |
| `GLOBAL-LOGO` | `[LOGO]` | Both | Header + Footer |
| `GLOBAL-NAV-ICONS` | `[ICON]` ×2 | Both | Header |
| `GLOBAL-SIDEBAR-SOCIAL` | `[ICON]` ×4 + nav | Both | Fixed left sidebar |
| `GLOBAL-CHAT-WIDGET` | `[INTERACTIVE_MEDIA]` | Both | Fixed bottom-left |
| `GLOBAL-GOTOTOP` | `[ICON]` + structural | Both | Fixed bottom-right (scroll-triggered) |
| `GLOBAL-DOT-MARKER` | `[UNKNOWN_MEDIA]` / `[INTERACTIVE_ANIMATION]` | Both | Likely global custom cursor |
| `GLOBAL-FOOTER` | Structural + `[LOGO]` | Both | Footer |
| `HOME-HERO-PORTRAIT` | `[HERO_IMAGE]` | Home | Hero |
| `HOME-HERO-DECOR-DOTGRID` | `[DECORATIVE_GRAPHIC]` | Home | Hero |
| `HOME-HERO-DECOR-BLUERING` | `[DECORATIVE_GRAPHIC]` | Home | Hero |
| `HOME-HERO-DECOR-REDRING` | `[DECORATIVE_GRAPHIC]` | Home | Hero |
| `HOME-HERO-DECOR-XMARKS` | `[DECORATIVE_GRAPHIC]` | Home | Hero |
| `HOME-HERO-DECOR-DOTCLUSTER` | `[DECORATIVE_GRAPHIC]` | Home | Hero |
| `HOME-HERO-WATCHINTRO-ICON` | `[ICON]` → `[VIDEO]` modal | Home | Hero |
| `HOME-WHYUS-ICON-1/2/3` | `[ICON]` ×3 | Home | Why Choose Us |
| `HOME-ABOUTPREVIEW-ILLUSTRATION` | `[ILLUSTRATION]` | Home | About Preview |
| `HOME-ABOUTPREVIEW-LOGOSTRIP` | `[LOGO]` ×4 | Home | About Preview |
| `HOME-SERVICES-PANEL-1..4` | `[IMAGE]` ×4 | Home | Services gallery |
| `HOME-FUNFACTS-ICON-1/2/3` | `[ICON]` ×3 + `[INTERACTIVE_ANIMATION]` (counters) | Home | Fun Facts |
| `HOME-PORTFOLIO-IMG-1/2/3` | `[IMAGE]` ×3 | Home | Portfolio grid |
| `ABOUT-HERO-DESKPHOTO` | `[IMAGE]` | About | Hero |
| `ABOUT-HERO-BADGE` | `[ANIMATION]` / `[SVG_GRAPHIC]` | About | Hero |
| `ABOUT-HERO-SCROLLCUE` | `[ICON]` | About | Hero |
| `ABOUT-SERVICES-STRIP-IMAGE` | `[IMAGE]` (+ possible `[INTERACTIVE_MEDIA]`) | About | Services strip |
| `ABOUT-TESTIMONIAL-AVATAR-1` | `[IMAGE]` | About | Testimonials |
| `ABOUT-TESTIMONIAL-LOGO-2` | `[LOGO]` | About | Testimonials |
| `ABOUT-TEAM-PHOTO-1` | `[IMAGE]` | About | Meet the Team |
| `ABOUT-TEAM-PHOTO-2` | `[IMAGE]` | About | Meet the Team |
| `ABOUT-CTA-BGPHOTO` | `[IMAGE]` or `[BACKGROUND_VIDEO]` | About | CTA/Countdown |
| `ABOUT-CTA-COUNTDOWN` | `[INTERACTIVE_MEDIA]` | About | CTA/Countdown |

**Total placeholders defined: 30** (8 global + 15 Home-specific + 10 About-specific, with 3 shared/reused assets cross-referenced rather than duplicated: hero portrait ↔ team photo 1, and the Fiverr/Upwork/Freelancer logo trio reused between Home and About).

---

## 8. VISUAL COMPLETENESS AUDIT

Per the mandatory audit rule: *"If all real media were removed, would every significant occupied visual region still have a placeholder?"*

Walking each screenshot region-by-region against the registry above: **yes** — every hero image, decorative graphic, icon set, illustration, logo, service-panel photo, portfolio image, badge, and background photo/video identified during visual inspection has a corresponding placeholder with preserved position/size/aspect-ratio. The two areas of genuine ambiguity (the recurring dot marker's true nature, and whether the About-page services strip is 3 or 4 zones / static or interactive) are explicitly flagged rather than silently resolved one way or the other.

**Not covered (out of scope for this document, explicitly flagged, not fabricated):**
- "Our Portfolio" page content (nav item exists, page not captured)
- "Contact Us" page content (nav item exists, page not captured)
- Any content below the footer or beyond what was captured in these 11 scroll-frames
- Mobile/tablet responsive layouts (all analysis is desktop-viewport only)
- Hover/focus/active states for any interactive element (buttons, cards, nav links) — none were captured mid-interaction

---

## 9. CONSOLIDATED "REQUIRED LIVE INVESTIGATION" CHECKLIST

For the team/agent with access to the live site (`sabernasr.com`), before Phase 2 implementation:

1. Sample exact hex colors for the full palette (primary blue, coral, text colors, backgrounds).
2. Identify exact heading/body font family, weights, and sizes via devtools.
3. Extract the real `GLOBAL-LOGO` SVG/image asset.
4. Extract real `href` values for all 4 sidebar/footer social icons (email, phone, WhatsApp, Facebook).
5. Identify the chat-widget provider (`GLOBAL-CHAT-WIDGET`) and integrate the official embed.
6. Confirm whether `GLOBAL-DOT-MARKER` is a custom cursor (move mouse and observe) or something else.
7. Confirm `GLOBAL-GOTOTOP` scroll-trigger threshold.
8. Source the real hero portrait, service-panel photos, portfolio images, illustration, and team photos (or their licensed equivalents) — do not substitute unrelated stock photography.
9. Click "WATCH INTRO" and document the resulting video (source, host, thumbnail).
10. Observe `ABOUT-HERO-BADGE` for rotation animation and capture its speed/direction.
11. Determine whether `ABOUT-SERVICES-STRIP-IMAGE` is really 3 zones or 4, and whether it's a static image or an interactive tab/hover-swap component.
12. Watch `ABOUT-CTA-BGPHOTO` for several seconds to determine static image vs. background video.
13. Inspect the countdown timer's real target timestamp and expiry behavior.
14. Scroll through the full testimonial carousel to capture all slides beyond the 2 documented here.
15. Check for name/role captions under the two team photos, and whether additional team members exist.
16. Capture the "Our Portfolio" and "Contact Us" pages, entirely uncaptured in this set.
17. Capture hover/active states for nav links, buttons, and cards.
18. Capture the responsive/mobile breakpoint layouts.
19. Confirm each animation/library choice in Section 2.4 against actual live behavior (e.g., if the dot marker turns out *not* to be a custom cursor, or the badge doesn't rotate, update the tool choice accordingly rather than building the guessed behavior anyway).

---

## 10. IMPLEMENTATION GUARDRAILS (for the Phase 1 building agent)

**Structure & content:**
- ✅ DO preserve every placeholder's approximate width, height, aspect ratio, and position exactly as specified.
- ✅ DO label every placeholder visibly in the Phase 1 build (e.g., a dev-mode caption or border label) so reviewers can instantly see what's real vs. pending — use the `PlaceholderBox` component from Section 2.3 consistently.
- ✅ DO build all copy text (headings, body, button labels) exactly as transcribed — this content is fully known and should not be treated as placeholder.
- ❌ DO NOT fabricate real photography, illustrations, or logos to "fill in" a placeholder — use neutral flat-fill boxes with labels instead.
- ❌ DO NOT merge the two "We develop & create digital future." components (Home vs. About) into one — they have different backgrounds, supporting copy, and supporting media.
- ❌ DO NOT assume the About-page services strip is identical to the Home 4-panel gallery — build it exactly as separately documented, flagged for verification.
- ❌ DO NOT hardcode the countdown timer's "00:00:00:00" as permanent — this is very likely dynamic/live content.
- ❌ DO NOT silently drop the flagged ambiguities (dot marker, services-strip structure, CTA background image-vs-video) — carry the open questions forward into Phase 2 planning documents.

**Framework & architecture (see Section 2 in full):**
- ✅ DO build this as a **React + Vite** application with **React Router**'s shared-layout pattern — not static multi-page HTML.
- ✅ DO mount the global fixed components (header, sidebar, chat widget, go-to-top, cursor dot, footer) exactly **once**, inside the persistent root layout — never re-implemented per page or per section.
- ✅ DO implement each animated/interactive element with the specific library named in Section 2.4 (Framer Motion, GSAP+ScrollTrigger, Swiper/Embla, react-countup, etc.) rather than approximating it with CSS-only tricks, wherever true JS-driven behavior was identified.
- ❌ DO NOT ship this as flat static HTML pages with no component framework — the observed persistent-chrome + routing + stateful-animation combination cannot be faithfully reproduced that way.
- ❌ DO NOT introduce a second animation engine for an effect one library already handles (e.g., don't add GSAP for something Framer Motion's `whileInView` already covers cleanly) — see Section 2.1 for which tool owns which effect.
