/blueprints
  ├─ 00-design-system.md      # colors, type, spacing, motion tokens
  ├─ 01-hero.md               # hero text, 3D scene specs, CTA, interactions
  ├─ 02-about.md              # timeline, panels, scroll interactions
  ├─ 03-skills.md             # domains, skill nodes, scroll/hover behavior
  ├─ 04-projects.md           # curated case studies, overlay design, tech stack
  ├─ 05-testimonials.md       # Wall of trust, layout, subtle 3D effects
  ├─ 06-contact.md            # form UX, social links, availability badge
  ├─ 07-scroll-architecture.md# ScrollTrigger patterns, pinning, camera paths
  ├─ 08-performance.md        # loading strategy, adaptive quality, canvas rules
  ├─ 09-accessibility.md      # focus, aria, reduced-motion, color contrast
  └─ 10-checklist.md          # build + launch checklist
  Here's the fully upgraded blueprint — covering design system, UX flow, performance architecture, and technical implementation guidance.

 UPGRADED PORTFOLIO BLUEPRINT
UI/UX · 3D · Performance · Accessibility

🎨 0. Design System (Global Foundation)
Define this before building anything. Everything inherits from here.
Color Palette
Background:   #080B14  (deep navy-black)
Surface:      #0E1220  (card/panel base)
Border:       #1A2035  (subtle separators)

Accent 1:     #4F8EF7  (electric blue — primary)
Accent 2:     #8B5CF6  (violet — secondary)
Accent Glow:  rgba(79,142,247,0.15)

Text Primary:   #F0F4FF
Text Secondary: #7A89A8
Text Muted:     #3D4A66
Typography Scale
Display:  "Syne" — headings, hero text (weight 700–800)
Body:     "DM Sans" — readable, professional (weight 400–500)
Mono:     "JetBrains Mono" — code snippets, stats

Scale: 12 / 14 / 16 / 20 / 24 / 32 / 48 / 64 / 96px
Line heights: tight (1.1) for display, relaxed (1.6) for body
Spacing System
Base unit: 4px
Scale: 4 / 8 / 12 / 16 / 24 / 32 / 48 / 64 / 96 / 128px
Section padding: 96–128px vertical
Motion Design Tokens
Duration:  fast=150ms / base=300ms / slow=600ms / cinematic=1200ms
Easing:    enter = cubic-bezier(0.22, 1, 0.36, 1)    (spring-feel)
           exit  = cubic-bezier(0.55, 0, 1, 0.45)
           standard = cubic-bezier(0.4, 0, 0.2, 1)
Scale:     hover = 1.03–1.05 (never more)

🏗️ 1. Technical Stack (Recommended)
LayerToolWhyFrameworkNext.js 14 (App Router)SSR, image optimization, routing3D EngineThree.js + R3F (React Three Fiber)Declarative 3D in React3D ExtrasDreiCameras, controls, helpersScrollGSAP + ScrollTriggerIndustry-standard scroll controlAnimationFramer MotionUI animations, layout transitionsPhysics@react-spring/threeSpring-based 3D micro-interactionsStylingTailwind CSS + CSS VariablesFast, consistentShadersGLSL (custom)Unique visual signaturePerformance@react-three/offscreenWeb Worker rendering

📱 2. Responsive Strategy (Mobile-First)

Critical mistake most 3D portfolios make: they're desktop-only experiences. Fix this upfront.

Mobile  (<768px):   Replace 3D with CSS 3D transforms + Lottie animations
Tablet  (768–1024): Reduced 3D complexity, simplified scenes
Desktop (>1024px):  Full 3D experience
Reduced Motion:     Respect prefers-reduced-motion — fade only, no 3D
Implementation:
jsconst isMobile = useMediaQuery('(max-width: 768px)')
const prefersReducedMotion = useReducedMotion()

// Swap heavy 3D canvas for lightweight fallback
return isMobile ? <StaticHero /> : <ThreeHero />
```

---

## ⚡ 3. Performance Architecture

### Loading Strategy
```
Critical path (< 3s):
  → HTML shell
  → Fonts (preloaded, subset)
  → Above-fold CSS
  → Hero 3D scene (compressed)

Deferred:
  → Below-fold 3D sections (IntersectionObserver)
  → Project screenshots (lazy)
  → Video content (on-demand)

Never block:
  → Analytics
  → Third-party scripts
  → Social embeds
```

### 3D Asset Optimization
```
Geometry:     Max 10k polys per object (portfolio doesn't need more)
Textures:     WebP, max 1024×1024, compressed with KTX2
GLTF models:  Draco-compressed, instanced where repeated
Draw calls:   Merge static meshes, use instancing for particles
Shadows:      Baked textures only — no real-time shadows on mobile
```

### Target Metrics
```
LCP:  < 2.5s     (Largest Contentful Paint)
FID:  < 100ms    (First Input Delay)
CLS:  < 0.1      (Cumulative Layout Shift)
FPS:  60fps desktop / 30fps acceptable mobile
Bundle: < 200kb JS initial, 3D chunks code-split
Canvas Performance Rules
javascript// Always implement adaptive quality
const { gl } = useThree()
gl.setPixelRatio(Math.min(window.devicePixelRatio, 2)) // Cap at 2x
gl.setSize(width, height)

// Use frame invalidation — don't render when nothing changes
<Canvas frameloop="demand"> // Only render on state change

// Dispose assets when sections leave viewport
useEffect(() => {
  return () => {
    geometry.dispose()
    material.dispose()
    texture.dispose()
  }
}, [])
```

---

## 🎬 4. Loading / Intro Screen (New Section)

> **Why:** With this much 3D, users will see 2–4s of blank screen without this. Turn it into brand-building.

**Experience:**
1. Page loads → branded loader appears instantly (pure CSS, no JS dependency)
2. Shows animated initials or wordmark
3. Loading bar fills as 3D assets load (tied to `useProgress` from Drei)
4. At 100% → elegant wipe/morph transition into hero
5. Never shows again for the session (sessionStorage flag)

**Visual:**
```
Background: #080B14
Center: Initials in Syne font, stroke-animated
Below: Thin progress line, accent blue
Transition: Vertical split wipe → reveals hero underneath
```

---

## 🌌 5. Hero / Entrance Scene (Upgraded)

**Concept:** You're not just entering a website — you're entering a *space*.

### Layout
```
Full viewport canvas (100vw × 100vh)
Centered text overlay (z-index above canvas)
Scroll indicator bottom-center (animated chevron)
```

### 3D Scene
```
Background: Custom GLSL shader — slow-moving nebula/aurora effect
            (not a skybox — a living, breathing gradient)

Foreground: 3D mesh of your initials (extruded font geometry)
            - Metallic material with environment reflection
            - Subtle rotation on idle
            - Responds to cursor: slight tilt toward mouse position

Particles:  ~800 points in constellation pattern
            - Connected with thin lines when close (< threshold)
            - Drift slowly, react to cursor proximity (repel gently)
```

### Text Hierarchy
```
Eyebrow:   "Full Stack Engineer · AI Specialist"  (12px, letter-spacing 0.2em, muted)
Headline:  "Your Name"  (96px, Syne 800, white)
Subline:   "I build things that matter."  (24px, DM Sans 400, secondary)
CTA:       [Explore My Universe →]  (button, outlined, glows on hover)
```

### Interactions
```
Idle:         Slow particle drift, initials rotate 0.2°/s
Cursor move:  Canvas responds within 80ms, max tilt ±8°
Hover CTA:    Button border animates, faint particle burst
Click CTA:    GSAP camera dolly forward → scene fades into About section
Scroll down:  Same camera effect, particles disperse outward
```

---

## 👤 6. About Me / Timeline (Upgraded)

**Key fix from v1:** Horizontal timeline kills mobile. Use a **hybrid approach** instead.

### Layout
```
Desktop: Diagonal / angled timeline — more dynamic than straight horizontal
Mobile:  Vertical stacked cards (clean, readable)
```

### 3D Elements
```
Timeline path: Glowing line (tube geometry) that draws itself on scroll
Nodes:         Icosahedron spheres at each milestone
               - Small by default
               - Hover: scale 1.4, color shift to accent, info tooltip
               - Click: panel animates open (spring physics, not linear)

Panels:        Frosted glass effect (backdrop-filter + semi-transparent)
               - Content: Date, role, company, 1-2 line summary
               - Optional: company logo, small photo
```

### Scroll Behavior
```
ScrollTrigger pin: Section pins while camera tracks along timeline
Progress indicator: Thin vertical bar on left shows timeline progress
Each node:          Triggers at 20% from bottom of viewport
Camera:             Follows cubic bezier path through scene (not linear)
```

### Content Structure Per Milestone
```
Year + Month
Role / Title  (Syne, 20px)
Company       (accent color, link)
Summary       (DM Sans, 14px, 2 lines max)
Tags:         [React] [Python] [Team Lead]  (small chips)
```

---

## 🧠 7. Skills / Expertise (Upgraded)

**Key fix from v1:** "Holographic cubes" can look gimmicky. Replace with **contextual skill constellations**.

### Concept
Instead of generic panels, group skills into **domains** with visual hierarchy:
```
Domain 1: Engineering       (blue cluster)
Domain 2: AI / ML           (purple cluster)  
Domain 3: Design / UX       (teal cluster)
Domain 4: Leadership / Soft (warm cluster)
```

### 3D Implementation
```
Each domain:   Cluster of connected nodes (graph structure)
Domain node:   Large sphere, labeled
Skill nodes:   Smaller spheres orbiting, connected by lines
               - Size = proficiency level
               - Color = domain color
               - Hover: show skill name + years + tools used
```

### Scroll Behavior
```
Entry:    Nodes spawn from center outward (staggered, spring physics)
Scroll:   Camera rotates slowly around the constellation
Filter:   Clicking domain highlights that cluster, dims others
          (smooth transition, 400ms)
```

### Skill Card (on hover/click)
```
┌─────────────────────────┐
│  ⬡  React               │
│     8 years             │
│     ████████░░  85%     │
│     Next.js · Redux     │
│     Zustand · RTK       │
└─────────────────────────┘
Frosted glass, 240px wide, spring-animated entry
```

---

## 💼 8. Projects / Portfolio Gallery (Upgraded)

**Key fix from v1:** "Mini 3D models of apps" is high effort, low payoff. Focus on **presentation quality**.

### Layout: Cinematic Case Study Flow
```
Not a grid — a curated sequence.
Each project gets a "scene" (full or half-screen)
Alternates: left-image/right-text ↔ right-image/left-text
```

### 3D Elements
```
Project card:   Slightly tilted floating plane (like a poster in space)
                - Displays project screenshot as texture
                - Hover: tilt corrects to face-on, subtle glow
                - Click: expands to case study overlay

Background:     Each project section has unique ambient color
                (subtle — just enough to signal a new "scene")

Transition:     Between projects, geometry morphs/shifts (GSAP)
```

### Project Card Content
```
Tag:        [Web App] [AI Tool] [Open Source]
Title:      Project Name  (Syne, 32px)
Summary:    One punchy line  (DM Sans, 16px)
Stack:      [React] [Python] [Postgres]
Links:      [↗ Live Demo]  [⌥ GitHub]
```

### Case Study Overlay (on click)
```
Full-screen overlay slides up (spring, 600ms)
Contains:
  - Hero screenshot / demo GIF
  - Problem statement
  - Solution approach
  - Key technical decisions
  - Results / metrics ("Reduced load time by 60%")
  - Screenshot gallery (swipeable)
  - Close button (top right, X)
```

---

## 🌟 9. Testimonials (Upgraded)

**Key fix from v1:** Drop the "orbiting cards" — it undermines credibility. Use **editorial treatment** instead.

### Concept: "The Wall of Trust"
```
Layout: Large featured quote (center), supporting quotes flanking
Not animated chaos — calm, confident, like a NYT review page
```

### 3D Elements (Subtle)
```
Background: Very slow-moving depth layers (parallax only, no gimmicks)
Quote marks: Large, 3D extruded typography (decorative, not interactive)
Cards:       Flat panels, slight floating on scroll (5–10px Y-offset only)
```

### Card Structure
```
┌──────────────────────────────────┐
│  "Quote text. Max 2–3 sentences. │
│   Make it specific and metric-   │
│   driven, not generic praise."   │
│                                  │
│  ● Name · Role · Company         │
│    [LinkedIn →]                  │
└──────────────────────────────────┘
```

### Animation
```
Entry:   Cards stagger in from bottom (80px offset, 300ms, eased)
Hover:   Subtle 2px Y lift, border brightens slightly
No:      Orbiting, rotating, floating aggressively
```

---

## 📬 10. Contact / CTA (Upgraded)

### Layout
```
Split screen:
  Left:  "Let's build something." + social links + availability status
  Right: Clean contact form
```

### Availability Badge (Nice touch)
```
● Available for freelance / full-time  (green dot, animated pulse)
  or
● Currently not taking new projects    (amber dot)

Updates manually — but signals you're human and thoughtful
```

### 3D Background
```
Minimal: Slow undulating mesh plane (low poly, wireframe)
Color:   Accent gradient, very subtle
Behavior: Reacts to cursor — gentle wave follows mouse
```

### Form UX
```
Fields:     Name / Email / Message
Validation: Real-time, inline (not on submit)
Submit:     
  → Loading: button morphs, shows spinner
  → Success: particle burst, button text → "Sent ✓", field reset
  → Error:   gentle shake, error message inline

Backend: Resend API or Formspree (simple, reliable)
```

### Social Links
```
GitHub · LinkedIn · Twitter/X · Dribbble (if applicable)
Icons: Custom SVG, consistent 24px, hover = accent color + scale 1.1
```

---

## 🔁 11. Scroll Architecture (Upgraded)
```
[Loader / Intro]
    ↓ Assets ready → wipe transition
[Hero]
    ↓ CTA click OR scroll → camera dolly forward
[About / Timeline]
    ↓ Section pins, camera tracks timeline on scroll
[Skills Constellation]
    ↓ Nodes spawn in, camera orbits slowly
[Projects]
    ↓ Cinematic sequence, each project = one scroll beat
[Testimonials]
    ↓ Editorial reveal, staggered cards
[Contact]
    ↓ Section pins, focus on form
[Footer — minimal]
GSAP ScrollTrigger pattern:
javascript// Pin + scrub per section
ScrollTrigger.create({
  trigger: "#about",
  start: "top top",
  end: "+=200%",
  pin: true,
  scrub: 1.5,  // Slightly lagged = cinematic feel
  onUpdate: (self) => {
    camera.position.lerpVectors(startPos, endPos, self.progress)
  }
})
```

---

## ♿ 12. Accessibility (Non-Negotiable)
```
Focus management:  All interactive elements keyboard-navigable
                   Custom focus ring (accent color, 2px, offset 2px)

Screen readers:    aria-label on all icon buttons
                   Alt text on all project screenshots
                   Role and aria-live on form feedback

3D:                All 3D is decorative — never the only content path
                   Text always readable on top of canvas

Color contrast:    Minimum AA (4.5:1) for body text
                   AAA target for critical UI

Motion:            prefers-reduced-motion → disable all 3D/scroll effects
                   Fade transitions only as fallback
```

---

## 📋 13. Build Checklist
```
Design System
  □ Tokens defined (color, type, spacing, motion)
  □ Component library started (Button, Card, Badge)

Performance
  □ Adaptive quality detection (GPU tier via detect-gpu)
  □ Mobile fallback implemented
  □ prefers-reduced-motion respected
  □ Asset loading strategy defined (critical vs deferred)
  □ Canvas frameloop="demand" where possible

Sections
  □ Loader / Intro
  □ Hero (shader + particles + text)
  □ About (timeline + panels)
  □ Skills (constellation)
  □ Projects (case studies)
  □ Testimonials (editorial)
  □ Contact (form + social)

UX
  □ Keyboard navigation works end-to-end
  □ All CTAs have hover + focus + active states
  □ Error states designed (form, 404)
  □ Scroll progress indicator (optional but elegant)

Launch
  □ OG image (for LinkedIn / Twitter shares)
  □ Favicon (high-res)
  □ Analytics (Plausible or Fathom — privacy-first)
  □ robots.txt + sitemap
  □ Lighthouse score ≥ 90 (Performance, Accessibility, SEO)
