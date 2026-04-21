# 17 — QA CHECKLIST & PRE-LAUNCH VERIFICATION
## Nothing Ships Without This Being Green

---

## HOW TO USE THIS DOCUMENT

This checklist must be completed by the QA lead before every staging deploy and fully signed off before production launch. Every item is a binary `[ ]` pass/fail. No item can be left unchecked. Any `FAIL` blocks the deploy.

Required testers: minimum 2 people, on different devices/browsers.
Sign-off required from: Lead Frontend Dev + Project Lead.

---

## SECTION 1: VISUAL PARITY

Compare every section against the original `shader.se` (or recorded reference video).

### Preloader
- [ ] Background color matches: Commodore-blue `#1a1aff`
- [ ] CRT barrel distortion is visible
- [ ] Scanlines are visible but not intrusive
- [ ] SHADER logo renders correctly (rainbow icon + wordmark)
- [ ] Logo is centered and proportionally correct
- [ ] Progress bar has chunky pixel segments (not a smooth gradient)
- [ ] Progress bar fills left-to-right correctly
- [ ] "Version 1.02" text is monospace and centered
- [ ] Copyright text at bottom is monospace
- [ ] CRT power-off exit animation plays correctly (vertical collapse → horizontal → white flash)
- [ ] Preloader blocks all scroll during loading (user cannot scroll to hero)
- [ ] After exit, hero is immediately visible (no blank frame)

### Hero
- [ ] Background is near-black with purple-gray fog/smoke
- [ ] Fog animates (drifts slowly)
- [ ] 3D SuperPET computer is visible and correctly positioned (right side)
- [ ] Computer has "SHADER" label visible
- [ ] Computer screen shows animated content (looping video textures)
- [ ] Computer screen glows / has bloom
- [ ] Headline text is Playfair Display, weight 900, 4 lines
- [ ] Headline has subtle chromatic aberration
- [ ] Sub-CTA "Scroll to Inspect Our Closed Deals" is visible and muted
- [ ] Scroll indicator icons are present and animating
- [ ] Navbar is visible and transparent-background

### Selected Work
- [ ] Background shifts to deep blue-purple on section enter
- [ ] Film strip structure is visible (top + bottom sprocket holes)
- [ ] Sprocket holes are actual cutouts (bg shows through)
- [ ] Film strip has 3D perspective warp (curves at edges)
- [ ] Active project card is centered and full-size
- [ ] Adjacent cards are visible and smaller
- [ ] Project name and category display above the strip
- [ ] "View project →" link is visible
- [ ] Left/right navigation arrows are visible and functional
- [ ] Dot pagination matches number of projects and updates on navigate
- [ ] Horizontal scroll is smooth (scrub feel, not snappy)
- [ ] Entering the section: strip scales from small to full

### About — Cubicle Hero
- [ ] Full-bleed office cubicle image fills viewport
- [ ] Image is desaturated / near-monochrome
- [ ] "About Us" text overlays the image
- [ ] "About Us" is very large (fills most of viewport width)
- [ ] Background parallax: image moves slower than page scroll
- [ ] CRT glitch / chromatic aberration visible on image
- [ ] Transition from dark hero to this section is smooth

### About — Copy
- [ ] Background is warm cream `#f0e8d8`
- [ ] Headline "Making Digital Storytelling..." is large, centered, dark
- [ ] Three-column body copy layout is correct
- [ ] All three columns contain the correct copy (verbatim match)
- [ ] Body font is EB Garamond (NOT a sans-serif)
- [ ] Vintage businessman cutout is positioned correctly (right side)
- [ ] Businessman image has correct vintage aesthetic
- [ ] Paper texture overlay is subtle but present

### About — Vintage Computers
- [ ] Full-bleed retro computer photograph fills viewport
- [ ] Rainbow stripe separator visible at top of section
- [ ] Rainbow stripes are the correct 6 colors in order
- [ ] Computer spread shows: 2 keyboards, printer, CRT monitor
- [ ] Monitor shows colored bar chart ("NET SALES BY DIVISION")
- [ ] Background parallax is working

### Shredder
- [ ] Section starts in cream (continuous from above)
- [ ] Shredder machine is visible and centered
- [ ] "SHREDDER" label on machine
- [ ] Businessman/shrug figure is positioned correctly (right of text)
- [ ] Headline "Had Enough Reading? Let's Shred This Thing." is correct
- [ ] Shredder idle animation is visible (subtle jiggle)
- [ ] On scroll: shred warp effect activates progressively
- [ ] The vertical strip distortion effect is convincing (looks like shredded paper)
- [ ] The businessman image also gets shredded at high scroll progress
- [ ] Background transitions from cream to dark navy at bottom
- [ ] After full shred, next section (Contact Tease) enters smoothly

### Contact Tease
- [ ] Background is deep navy-black
- [ ] "Still Not Convinced We're Serious About Business?" headline is large and centered
- [ ] Sub-text "We've got one last trick up our sleeve." is present and muted
- [ ] Gold stars are present and animating (floating/drifting)
- [ ] Stars rotate as they move
- [ ] Stars fade in and out (lifecycle animation)
- [ ] Stars are behind the text (not on top)

### Golden Tie
- [ ] Background is pure black
- [ ] Spotlight cone is visible (from above, illuminating center)
- [ ] 3D golden tie is present and centered
- [ ] Tie is gold metallic (not yellow plastic)
- [ ] Tie sways / deforms (cloth simulation or GSAP sine wave)
- [ ] Tie knot is at top, blade hangs down
- [ ] Applauding people are visible on left and right sides
- [ ] People have vintage/retro stock photo aesthetic
- [ ] People's clapping animation is looping
- [ ] Headline "Check Out This Golden Tie" is gold-colored
- [ ] Headline has shimmer effect

### Handshake
- [ ] Full-bleed handshake photograph fills viewport
- [ ] Photo is dark, cinematic, black background
- [ ] Dramatic side-lighting is visible on hands
- [ ] Diamond ring detail is visible on one hand
- [ ] Deep parallax effect works (image moves slower than scroll)
- [ ] Transition from Golden Tie to Handshake is smooth
- [ ] No text overlay (default state)

### Good Buy
- [ ] Background is near-black
- [ ] 3D phone arrangement is visible and centered
- [ ] Multiple phone units visible (minimum 3)
- [ ] Phones are cream/gray office aesthetic
- [ ] "SHADER" labels visible on phone faces
- [ ] "Good buy." text is massive, centered, below phones
- [ ] The period is present ("Good buy." not "Good buy")
- [ ] Camera orbit on scroll (phones rotate slightly as user scrolls)
- [ ] Spotlight/dramatic lighting on phones

### Footer
- [ ] Background is deep navy-black
- [ ] Three contact columns: General Enquiries | Visit us | Social
- [ ] All column headers are Playfair Display
- [ ] All contact info is correct (emails, address, socials)
- [ ] All links are functional (email opens mail client, socials open in new tab)
- [ ] "Book a call" links to correct Cal.com URL
- [ ] CEO card is visible with dashed border
- [ ] CEO photo is present in card
- [ ] "ceo@shader.se" is a working mailto link
- [ ] Globe icon + "Worldwide Business Certified Company" in footer bottom-left
- [ ] SHADER logo + tagline centered in footer bottom
- [ ] Laurel wreaths + "Read Our Accessibility Statement" in footer bottom-right
- [ ] Accessibility statement link is functional

---

## SECTION 2: INTERACTION & ANIMATION

- [ ] Lenis smooth scroll feels natural (not stuttery, not laggy)
- [ ] All GSAP scroll animations trigger at the correct scroll positions
- [ ] No animation plays before its section is in view
- [ ] Film strip scrub feel is correct (slightly sticky/inertia)
- [ ] Shredder warp is smooth (no frame drops below 30fps during shred)
- [ ] Tie swaying is continuous and smooth (no jitter or reset)
- [ ] All entrance animations complete correctly (nothing stuck at 0 opacity)
- [ ] All hover states work: nav links, project cards, footer links
- [ ] Back-and-forth scroll: animations reverse correctly where applicable
- [ ] No animation is running when out of viewport (performance)

---

## SECTION 3: COPY ACCURACY

Every text string must match exactly. Check these specifically:

- [ ] Hero headline: "A Creative Development Studio, Plugged into the Future"
- [ ] Hero sub-CTA: "Scroll to Inspect Our Closed Deals"
- [ ] Preloader: "Shader Development Studio, Website / Version 1.02"
- [ ] About headline: "Making Digital Storytelling More Playful, Powerful, and Alive"
- [ ] Shredder headline: "Had Enough Reading? Let's Shred This Thing."
- [ ] Shredder sub: "We've got one last trick up our sleeve."
- [ ] Contact tease: "Still Not Convinced We're Serious About Business?"
- [ ] Contact tease sub: "We've got one last trick up our sleeve."
- [ ] Golden Tie headline: "Check Out This Golden Tie"
- [ ] Golden Tie sub: "You made it this far. You deserve a tie-break."
- [ ] Good Buy: "Good buy." (with period, capital G, lowercase b)
- [ ] Footer email: "hello@shader.se"
- [ ] Footer CEO: "ceo@shader.se"
- [ ] Footer address: "Laxholmstorget 3, 602 21 Norrköping, Sweden"
- [ ] Footer tagline: "A High Tech Business Solutions Company"
- [ ] Copyright: "© Shader Sweden AB. All Rights Reserved."

---

## SECTION 4: TYPOGRAPHY

- [ ] ALL headlines are Playfair Display (zero exceptions)
- [ ] ALL body copy is EB Garamond (zero exceptions)
- [ ] Preloader text is Courier Prime (monospace)
- [ ] No Inter, Roboto, Arial, or system-ui appears anywhere in rendered output
- [ ] Fonts are loaded before page content reveals (no FOUC)
- [ ] Font weights are correct: 900 display, 700 secondary headlines, 400 body

---

## SECTION 5: RESPONSIVE / MOBILE

Test on: iPhone 14 (Safari), Samsung Galaxy S24 (Chrome), iPad (Safari)

- [ ] Preloader renders correctly on mobile
- [ ] Hero: text is readable, 3D computer is handled correctly (hidden or simplified)
- [ ] Film strip is usable via touch swipe (if swipe is implemented) or arrow buttons
- [ ] About sections layout correct in single column
- [ ] Shredder: CSS fallback effect shows (no GLSL on mobile)
- [ ] All sections stack correctly with no overflow
- [ ] No horizontal scroll anywhere on the page (except the film strip section)
- [ ] Touch targets (links, buttons) minimum 44×44px
- [ ] Text remains readable at all mobile viewport sizes

---

## SECTION 6: PERFORMANCE

Run Lighthouse (Chrome DevTools → Lighthouse, mobile preset) on the staging URL.

| Metric | Target | Result |
|--------|--------|--------|
| Performance | ≥ 70 | [ ] |
| Accessibility | ≥ 90 | [ ] |
| Best Practices | ≥ 90 | [ ] |
| SEO | ≥ 90 | [ ] |
| LCP | < 2.5s | [ ] |
| FCP | < 1.5s | [ ] |
| CLS | < 0.05 | [ ] |
| TBT | < 300ms | [ ] |

Additional:
- [ ] Total page weight < 12MB (including all 3D assets, images)
- [ ] All images are WebP or AVIF (no JPEG/PNG for photos)
- [ ] All GLBs are Draco-compressed
- [ ] No render-blocking resources
- [ ] Fonts are preloaded
- [ ] No console errors in production build

---

## SECTION 7: ACCESSIBILITY

- [ ] Skip-to-content link present and functional
- [ ] All `<canvas>` and 3D elements have `aria-hidden="true"`
- [ ] All images have descriptive `alt` text (or `alt=""` if purely decorative)
- [ ] All interactive elements are keyboard-navigable
- [ ] Focus order is logical (top to bottom, left to right)
- [ ] Focus rings are visible (gold outline per design)
- [ ] Color contrast ratio for body text ≥ 4.5:1
- [ ] Color contrast ratio for large text ≥ 3:1
- [ ] `prefers-reduced-motion` is respected: all scroll animations are disabled
- [ ] Screen reader: section headings are correctly structured (h1, h2, h3)
- [ ] No content is hidden from screen readers that is meaningful
- [ ] All links have descriptive text (no "click here" links)
- [ ] Accessibility statement page exists at `/accessibility-statement` and is linked from footer

---

## SECTION 8: CROSS-BROWSER

Test each browser on desktop:

| Browser | Version | Preloader | Hero 3D | Film Strip | Shredder | Pass? |
|---------|---------|-----------|---------|------------|----------|-------|
| Chrome  | latest  | [ ]       | [ ]     | [ ]        | [ ]      | [ ]   |
| Firefox | latest  | [ ]       | [ ]     | [ ]        | [ ]      | [ ]   |
| Safari  | 17+     | [ ]       | [ ]     | [ ]        | [ ]      | [ ]   |
| Edge    | latest  | [ ]       | [ ]     | [ ]        | [ ]      | [ ]   |

Safari-specific checks:
- [ ] Smooth scroll works in Safari (Lenis compatibility)
- [ ] WebGL renders correctly
- [ ] CSS backdrop-filter (if used) renders correctly
- [ ] No white flash / blank moments during section transitions

---

## SECTION 9: SEO & METADATA

- [ ] `<title>` tag: "Shader Development Studio"
- [ ] `<meta name="description">` is present and meaningful
- [ ] OG tags are correct (title, description, image)
- [ ] OG image is 1200×630px
- [ ] Twitter card meta is present
- [ ] No duplicate `<h1>` tags on the page
- [ ] Canonical URL is set
- [ ] `robots.txt` is present (allows all)
- [ ] `sitemap.xml` is present (optional for single-page site)

---

## SECTION 10: LINKS & INTEGRATIONS

- [ ] "Book a call" opens Cal.com correctly
- [ ] Cal.com booking flow works end-to-end (test booking)
- [ ] `hello@shader.se` mailto opens email client
- [ ] `ceo@shader.se` mailto opens email client
- [ ] LinkedIn link opens correctly (`linkedin.com/company/shadersweden/`)
- [ ] Instagram link opens correctly
- [ ] X/Twitter link opens correctly
- [ ] All external links open in `_blank` with `rel="noopener noreferrer"`
- [ ] Accessibility statement link works

---

## SIGN-OFF

```
QA Tester 1: ____________________  Date: __________
QA Tester 2: ____________________  Date: __________
Lead Dev:    ____________________  Date: __________
Project Lead: ___________________  Date: __________

Total items: 140
Items passed: ____
Items failed: ____

DEPLOY APPROVED: [ ] YES  [ ] NO
```

**Blockers** (any FAIL that must be resolved before launch):
```
1.
2.
3.
```

**Non-blockers** (FYI issues, can ship and fix in hotfix):
```
1.
2.
3.
```
