# PHASE 1 — RECONNAISSANCE REPORT

*Generated: 2026-09-11*
*Source: Live site inspection (sabernasr.com) + Claude specification + repository inspection*
*Status: Phase 1 Reconnaissance Complete*

---

## 1. Repository Findings

| Property | Value |
|---|---|
| **Path** | `Z:\moham\Desktop\github\pages\portfolio` |
| **Git repo** | Yes |
| **Framework** | None (empty repository) |
| **Package manager** | None (no package.json) |
| **Source files** | None |
| **Configuration** | None |
| **Existing dependencies** | None |
| **Entry points** | None |
| **Existing routes** | None |

The repository contains only a `docs/` folder with specification documents and a `.git/` directory. There is no existing implementation, no framework, no build system, and no dependencies. This is a greenfield implementation.

---

## 2. Complete Route Inventory

### Primary Navigation Routes

| URL | Page Title | Purpose | Nav Entry | Status |
|---|---|---|---|---|
| `/` | Saber Nasr — Graphic designer and web developer | Homepage | "Home" | OBSERVED |
| `/about/` | About Us — Saber Nasr | Company info, skills, portfolio | "About Us" | OBSERVED |
| `/our-portfolio/` | Our Portfolio — Saber Nasr | Full portfolio grid | "Our Portfolio" | OBSERVED |
| `/our-portfolio/web/` | Web — Saber Nasr | Filtered: Web projects | Dropdown sub-item | OBSERVED |
| `/our-portfolio/logo/` | Logo — Saber Nasr | Filtered: Logo projects | Dropdown sub-item | OBSERVED |
| `/our-portfolio/social-media/` | Social Media — Saber Nasr | Filtered: Social Media | Dropdown sub-item | OBSERVED |
| `/our-portfolio/pdfs/` | PDFs — Saber Nasr | Filtered: PDFs | Dropdown sub-item | OBSERVED |
| `/our-portfolio/video/` | Video — Saber Nasr | Filtered: Video projects | Dropdown sub-item | OBSERVED |
| `/contact-us/` | Contact Us — Saber Nasr | Contact form | "Contact Us" | OBSERVED |

### Additional Discovered Routes

| URL | Evidence | Status |
|---|---|---|
| `/about-personal/` | Mobile panel link "Send Brief" | 404 — does not resolve |
| `/shop/` | Mobile panel link "Go to Shop" | 404 — does not resolve |

### Social/External Links

| Platform | URL | Confidence |
|---|---|---|
| Facebook | `https://www.facebook.com/Saber.Nasr.Elbendary/` | OBSERVED |
| WhatsApp | `https://wa.me/201055544244` | OBSERVED |
| Phone | `tel:+201055544244` | OBSERVED |
| Email | `mailto:info@sabernasr.com` | OBSERVED |
| Fiverr | `https://www.fiverr.com/saber_nasr` | OBSERVED |
| Upwork | `https://www.upwork.com/freelancers/saber` | OBSERVED |
| Freelancer | `https://www.freelancer.com/u/SaberElbendary` | OBSERVED |

---

## 3. Page-by-Page Structure

### 3.1 Homepage (`/`)

```
Page
├── Global Header (Elementor template 6817)
│   ├── Logo: main-logo.png (300×74, max-height: 40px)
│   ├── Primary Nav: Home | About Us | Our Portfolio (dropdown) | Contact Us
│   ├── Search Icon (overlay)
│   └── 3×3 Grid Icon (opens side panel #popup-1)
├── Hero Slider (Slider Revolution 6.6.20)
│   ├── Slide 1: "Build Innovative Digital Projects"
│   │   ├── H1 heading (sofia-pro font)
│   │   ├── Body paragraph + 🤘 emoji
│   │   ├── "Discover More" link → /about/
│   │   ├── "Watch intro" play button (blue icon, #2F39D3)
│   │   ├── Portrait image: Saber.png (555×1000)
│   │   └── Decorative: dot grid, rings, X marks, dot cluster
│   ├── Slide 2: (slider-image-2, 555×1156)
│   └── Slide 3: (slider-image-6, 507×1014)
├── "Why Choose Us" Section
│   ├── Eyebrow: "CREATIVE VISION"
│   ├── H2: "Why Choose Us!"
│   └── 3-column bordered cards
│       ├── High Quality (pen-tool icon, blue)
│       ├── Fast Support (browser-loading icon, blue)
│       └── 100% Satisfaction (layers icon, blue)
├── "We develop & create digital future" Section (About Preview)
│   ├── Eyebrow: "MORE EFFECTIVE"
│   ├── H2: "We develop & create digital future."
│   ├── Body text
│   ├── "About Us" button (coral pill)
│   ├── Illustration: home-drawing.png (210×280)
│   ├── Designer photo: Saber-Designer.jpg
│   └── Decorative: img-animation-5-white.png (130×130), img-ellipse.png (87×87)
├── Platform Logos Strip (4-column)
│   ├── Fiverr logo (550×234) → fiverr.com/saber_nasr
│   ├── Upwork logo (550×234) → upwork.com/freelancers/saber
│   ├── Freelancer logo (550×234) → freelancer.com/u/SaberElbendary
│   └── Saber Nasr logo (550×234) → sabernasr.com
├── Services Gallery (4-panel, full-bleed, dark overlay)
│   ├── 01. Graphic Designs (graphic-design-scaled.jpg)
│   ├── 02. Web Development (Web-Development-scaled.jpg)
│   ├── 03. Creative Video (Creative-Video-scaled.jpg)
│   └── 04. SEO (seo-840x560.jpg)
├── "Fun Facts" / Stats Section
│   ├── Eyebrow: "FUN FACTS"
│   ├── H2: "An original team of creators, designers & dreamers."
│   └── 3 stats (animated counters)
│       ├── 2000+ / Total Clients (user icon)
│       ├── 3000+ / Total Projects (target icon)
│       └── 1000+ / Total Reviews (trophy icon)
├── Portfolio Preview Grid (asymmetric 2-column)
│   ├── Large left: Mustadeem Store
│   ├── Top right: Mkayn Store
│   ├── Bottom right: HELIX CATALOG
│   └── "All Portfolios" button → /our-portfolio/
├── "Creative Approach" Section (dark background)
│   ├── Rotating "ABOUT US" badge: about-us-white.svg (148×148)
│   ├── Digital agency workspace image: digital-agency-scaled.jpg
│   ├── Eyebrow: "CREATIVE APPROACH"
│   ├── H2: "We develop & create digital future."
│   └── Body text
├── Services Panel (3-column, dark, with hover image swap)
│   ├── Graphic Design (graphic-design-890x664.jpg)
│   ├── Web Development (Web-Development-890x664.jpg)
│   └── Creative Video (Creative-Video-890x664.jpg)
├── "Our Platforms" Section (Swiper slider)
│   ├── Eyebrow: "HUGE HONOR"
│   ├── H2: "Our Platforms"
│   └── 4 logo cards (Fiverr, Upwork, Freelancer, Saber Nasr)
├── "Suggestions & Feedback" Testimonials (Swiper carousel, 7 slides)
│   ├── banmas - Project Manager (5 stars)
│   ├── ginabuckney - Project Manager (5 stars)
│   ├── bollybeatz - Project Manager (5 stars)
│   ├── chrismoran - Project Manager (5 stars)
│   ├── huiyin - Project Manager (5 stars)
│   ├── mohamednawar - Project Manager (5 stars)
│   └── torecompany - Project Manager (5 stars)
├── "Meet Our Team" Section
│   ├── H2: "Meet Our Team"
│   ├── Team Photo 1: Saber Nasr (Saber-Nasr.jpg) — "Project Manager"
│   ├── Team Photo 2: Mohamed Maksoud (Mohamed-Maksoud.jpg) — "Graphic Designer"
│   ├── "About Us" button → /about/
│   └── "Contact Us" link with play icon → /contact-us/
├── "Ask Us About Limited Discount" CTA (dark, countdown)
│   ├── Eyebrow: "GET THE OFFER"
│   ├── H2: "Ask Us About Limited Discount"
│   ├── Countdown timer (target: 2026-03-21)
│   │   ├── Days
│   │   ├── Hours
│   │   ├── Minutes
│   │   └── Seconds
│   └── "Contact Us" button → /contact-us/
└── Global Footer (Elementor template 4105)
    ├── Copyright: "© 2026 All Rights Reserved to Saber Nasr."
    ├── Logo: Saber-Nasr-Logo-Light.png (300×74)
    └── Social icons: Facebook, WhatsApp, Phone, Email
```

### 3.2 About Us (`/about/`)

```
Page
├── Global Header
├── Hero Section (white background, 3-column layout)
│   ├── Left column (31.5%):
│   │   ├── Main image: graphic-design-scaled.jpg (with smudge effect)
│   │   ├── Floating dot grid: img-animation-5.png (parallax)
│   │   └── Profile swap: Fiverr-Profile.png ↔ Upwork-Profile.png
│   ├── Center column (17.8%): Spacer
│   └── Right column (50%):
│       ├── Eyebrow: "Get to Know Us"
│       ├── H1: "We build the future."
│       ├── Body text + 🤘 emoji
│       └── 3 icon features:
│           ├── Creative Design (molecular icon, #2F39D3)
│           ├── Web Design and Development (share icon, #2F39D3)
│           └── Video Production (target icon, #2F39D3)
├── "What makes us happy" Portfolio Slider (Swiper, 30 items)
│   ├── H2: "What makes us happy"
│   ├── 30 portfolio thumbnails (840×560 or 840×630 each)
│   ├── Slides per view: 3
│   ├── Autoplay enabled, loop enabled
│   └── Some items have hover video (Sealy, Saudi Founding Day)
├── "We develop & create digital future" Skills Section
│   ├── Eyebrow: "corporate service"
│   ├── H2: "We develop & create digital future"
│   ├── 4 progress bars (coral #FF5B4A fill, white track, 6px height, rounded)
│   │   ├── Graphic Design: 96%
│   │   ├── Web Development: 97%
│   │   ├── SEO: 88%
│   │   └── Video Editor: 86%
│   ├── "Contact Us" button
│   ├── 7 floating circular skill icons (parallax mouse-follow):
│   │   ├── illustrator.png (100px, left: 6%, top: 21%)
│   │   ├── wordpress.png (83px, left: 12.13%, top: 60.3%)
│   │   ├── photoshop.png (115px, left: 59.7%, top: 59%)
│   │   ├── coding.png (95px, left: 58.32%, top: 7.6%)
│   │   ├── premiere-pro.png (80px, left: 81.44%, top: 36.3%)
│   │   ├── after-effects.png (71px, left: 28.37%, top: 87.6%)
│   │   └── seo.png (84px, left: 50%, top: 50%)
│   └── Decorative: border-rad.png (626×626)
├── "Our Platforms" Logo Cards (4-column)
│   ├── Fiverr → fiverr.com/saber_nasr
│   ├── Upwork → upwork.com/freelancers/saber
│   ├── Freelancer → freelancer.com/u/SaberElbendary
│   └── Saber Nasr → sabernasr.com
└── Global Footer
```

### 3.3 Our Portfolio (`/our-portfolio/`)

```
Page
├── Global Header
├── Portfolio Grid (30+ items)
│   ├── Category filter tabs (from dropdown sub-items):
│   │   ├── All
│   │   ├── Web
│   │   ├── Logo
│   │   ├── Social Media
│   │   ├── PDFs
│   │   ├── Video
│   │   └── Translation (discovered on About page items)
│   └── Grid items (thumbnails with hover effects)
│       ├── Mustadeem Store (Web)
│       ├── Mkayn Store (Web)
│       ├── HELIX CATALOG (PDFs)
│       ├── Sealy Collection (PDFs, Translation)
│       ├── Sealy Products 2021 (PDFs, Translation)
│       ├── Sealy Middle East (Video)
│       ├── Saudi Holiday Travel (Web)
│       ├── Crypto Sense (Web)
│       ├── Maktabi (Web)
│       ├── Sealy March 2024 (Social Media)
│       ├── Saudi Founding Day (Social Media)
│       ├── Sealy Feb 2024 (Social Media)
│       ├── Sealy Mattress (Video)
│       ├── Saudi Founding Day (Video)
│       ├── Saudi Founding Day (Video)
│       ├── Valent Health Logo (Logo)
│       ├── Apachi Restaurant (Social Media)
│       ├── Zahi Company (Social Media)
│       ├── ALtahrir Koshary (Social Media)
│       ├── Tayebat Alsham (Social Media)
│       ├── Asaad (Web)
│       ├── Latelierdenaila (Web)
│       ├── Sealyme (Web)
│       ├── Sweet Diet (Web)
│       ├── Lean Community (Web)
│       ├── My It Guide (Web)
│       ├── Emoji Pizza (Web)
│       ├── Glassfitti (Web)
│       ├── Blue Print (Web)
│       ├── Blue Blog (Web)
│       ├── Lavanta Care (Web)
│       └── View Dubai (Web)
└── Global Footer
```

### 3.4 Contact Us (`/contact-us/`)

```
Page
├── Global Header
├── Contact Section
│   ├── H2: "Have a Cool Project? Get in touch!"
│   ├── Contact Form (WPForms)
│   │   ├── Name * (text input)
│   │   ├── Email * (email input)
│   │   ├── Subject (text input)
│   │   ├── Your Message (textarea)
│   │   └── Submit button
│   └── (No Google Maps embed observed in live fetch)
└── Global Footer
```

### 3.5 Global Components

#### Header (Elementor template 6817)
- Logo: `main-logo.png` (300×74, max-height: 40px)
- Nav: Home | About Us | Our Portfolio (with dropdown) | Contact Us
- Search icon (overlay) + 3×3 grid icon (side panel)
- White background, padding: 20px 50px (desktop), 10px 20px (tablet), 10px 0px (mobile)
- Responsive: mobile hamburger menu with fullscreen overlay

#### Side Panel (Elementor template 4445)
- Width: 388px, slides from left
- Contains: Logo, vertical nav, social links
- Social section border-top: 1px solid #DDDDDD
- Additional content: "Have a Project?" / "Want to Work with Me?" / "Want to Buy Illustrations?"

#### Mobile Fullscreen Menu
- Logo: `Saber-Nasr-Logo-Light.png` (light variant on dark bg)
- Same nav items, vertical layout
- Social icons: Facebook, WhatsApp, Phone, Email
- Additional widget area with project/shop links

#### Footer (Elementor template 4105)
- Background: `#171A21` (dark navy)
- 3-column layout: 40% | 19.332% | 40%
- Left: "© 2026 All Rights Reserved to Saber Nasr." (16px, #D2D3D5)
- Center: Logo (Saber-Nasr-Logo-Light.png)
- Right: Social icons (Facebook, WhatsApp, Phone, Email)
- Border-top: #DDDDDD
- Padding: 25px 0px (mobile)

#### Floating Social Sidebar (left edge, fixed)
- Email, Phone, WhatsApp, Facebook
- Fixed position, vertical text (rotated 90°)
- Part of TRX Addons mouse-helper system
- CONFIRMED: This is NOT a standalone sidebar — it is part of the TRX Addons mouse-helper component

#### Chat Widget
- Provider: Chaty (v3.5.31771985686)
- Color: `#A886CD` (purple)
- Position: bottom-left, spacing: 25px
- CTA text: "Contact us" (first_click display)
- Channels: Phone (+201055544244), WhatsApp (+201055544244), Facebook Messenger (m.me/Saber.Nasr.Elbendary), Email (info@sabernasr.com)

#### Go to Top Button
- Fixed bottom-right, appears on scroll
- Text: "Go to Top"
- Style: `scroll_to_top_style_modern`

#### Mouse Helper / Custom Cursor
- TRX Addons mouse-helper component
- Classes: `trx_addons_mouse_helper_permanent`, `trx_addons_mouse_helper_smooth`, `trx_addons_mouse_helper_centered`
- Disabled on screens ≤ 1025px
- This is the "dot marker" identified in Claude's spec

---

## 4. Component Inventory

### Global Components
| Component | Implementation | Status |
|---|---|---|
| Header/Nav | Elementor template 6817 | OBSERVED |
| Footer | Elementor template 4105 | OBSERVED |
| Side Panel | Elementor template 4445 | OBSERVED |
| Logo (dark) | main-logo.png (300×74) | OBSERVED |
| Logo (light) | Saber-Nasr-Logo-Light.png (300×74) | OBSERVED |
| Search Overlay | TRX Addons search widget | OBSERVED |
| Mobile Menu | Fullscreen overlay with social links | OBSERVED |
| Chat Widget | Chaty plugin (v3.5.31771985686) | OBSERVED |
| Go to Top | Scroll-triggered button | OBSERVED |
| Mouse Helper | TRX Addons mouse-helper | OBSERVED |
| Page Transitions | Elementor page transition (#FFBC7D) | OBSERVED |
| Floating Socials | Part of TRX Addons mouse-helper | OBSERVED |

### Homepage-Specific Components
| Component | Implementation | Status |
|---|---|---|
| Hero Slider | Slider Revolution 6.6.20 | OBSERVED |
| Why Choose Us Cards | 3-column bordered cards | OBSERVED |
| About Preview | Text + illustration + photo + logos | OBSERVED |
| Platform Logos Strip | 4-column linked images | OBSERVED |
| Services Gallery | 4-panel full-bleed with dark overlay | OBSERVED |
| Fun Facts/Stats | 3 animated counters | OBSERVED |
| Portfolio Grid | Asymmetric 2-column | OBSERVED |
| Creative Approach | Dark section with rotating badge | OBSERVED |
| Services Panel | 3-column dark with hover swap | OBSERVED |
| Our Platforms | Swiper slider with 4 logo cards | OBSERVED |
| Testimonials | Swiper carousel, 7 slides | OBSERVED |
| Team Photos | 2 photos with names/roles | OBSERVED |
| Countdown CTA | Dark section with timer | OBSERVED |

### About Page-Specific Components
| Component | Implementation | Status |
|---|---|---|
| About Hero | 3-column layout with profile swap | OBSERVED |
| Portfolio Slider | Swiper, 30 items, 3 per view | OBSERVED |
| Skills/Progress Bars | 4 animated progress bars | OBSERVED |
| Floating Skill Icons | 7 parallax mouse-follow icons | OBSERVED |
| Our Platforms | 4-column logo cards | OBSERVED |

---

## 5. Exact Content Inventory

### Homepage Content
| Element | Content | Evidence |
|---|---|---|
| H1 | "Build Innovative Digital Projects" | OBSERVED (hero slider) |
| Body | "Saber is a digital agency consists of strategists, creative minds, technologists, designers, marketers, storytellers, and inventors. 🤘" | OBSERVED |
| CTA Link | "Discover More" | OBSERVED |
| CTA Button | "Watch intro" (play icon) | OBSERVED |
| Eyebrow | "CREATIVE VISION" | OBSERVED |
| H2 | "Why Choose Us!" | OBSERVED |
| Card 1 | "High Quality" | OBSERVED |
| Card 2 | "Fast Support" | OBSERVED |
| Card 3 | "100% Satisfaction" | OBSERVED |
| Eyebrow | "MORE EFFECTIVE" | OBSERVED |
| H2 | "We develop & create digital future." | OBSERVED |
| Body | "We appreciate your trust greatly. Our clients choose us and our products because they know we are the best." | OBSERVED |
| Button | "About Us" | OBSERVED |
| Service 1 | "01. Graphic Designs" | OBSERVED |
| Service 2 | "02. Web Development" | OBSERVED |
| Service 3 | "03. Creative Video" | OBSERVED |
| Service 4 | "04. SEO" | OBSERVED |
| Eyebrow | "FUN FACTS" | OBSERVED |
| H2 | "An original team of creators, designers & dreamers." | OBSERVED |
| Stat 1 | "2000+" / "Total Clients" | OBSERVED |
| Stat 2 | "3000+" / "Total Projects" | OBSERVED |
| Stat 3 | "1000+" / "Total Reviews" | OBSERVED |
| Button | "All Portfolios" | OBSERVED |
| Eyebrow | "CREATIVE APPROACH" | OBSERVED |
| H2 | "We develop & create digital future." | OBSERVED |
| Body | "For those who love videos, animation and motion graphics, we have come up with a new cool project!" | OBSERVED |
| Eyebrow | "HUGE HONOR" | OBSERVED |
| H2 | "Our Platforms" | OBSERVED |
| Eyebrow | "TESTIMONIALS" | OBSERVED |
| H2 | "Suggestions & Feedback" | OBSERVED |
| H2 | "Meet Our Team" | OBSERVED |
| Team 1 | "Saber Nasr" / "Project Manager" | OBSERVED |
| Team 2 | "Mohamed Maksoud" / "Graphic Designer" | OBSERVED |
| Button | "About Us" | OBSERVED |
| Link | "Contact Us" | OBSERVED |
| Eyebrow | "GET THE OFFER" | OBSERVED |
| H2 | "Ask Us About Limited Discount" | OBSERVED |
| Timer | "Days : Hours : Minutes : Seconds" | OBSERVED |
| Button | "Contact Us" | OBSERVED |
| Copyright | "© 2026 All Rights Reserved to Saber Nasr." | OBSERVED |

### About Page Content
| Element | Content | Evidence |
|---|---|---|
| Eyebrow | "Get to Know Us" | OBSERVED |
| H1 | "We build the future." | OBSERVED |
| Body | "Saber is a digital agency consists of strategists, creative minds, technologists, designers, marketers, storytellers, and inventors. 🤘" | OBSERVED |
| Feature 1 | "Creative Design" / "Get the best animation and interactive services for your business." | OBSERVED |
| Feature 2 | "Web Design and Development" / "A brand's .com experience is its best opportunity to control its own message." | OBSERVED |
| Feature 3 | "Video Production" / "Visual effects in videos enhance the probability of sales conversion by a huge margin." | OBSERVED |
| H2 | "What makes us happy" | OBSERVED |
| Eyebrow | "corporate service" | OBSERVED |
| H2 | "We develop & create digital future" | OBSERVED |
| Skill 1 | "Graphic Design" / 96% | OBSERVED |
| Skill 2 | "Web Development" / 97% | OBSERVED |
| Skill 3 | "SEO" / 88% | OBSERVED |
| Skill 4 | "Video Editor" / 86% | OBSERVED |
| Button | "Contact Us" | OBSERVED |

### Contact Page Content
| Element | Content | Evidence |
|---|---|---|
| H2 | "Have a Cool Project? Get in touch!" | OBSERVED |
| Form Fields | Name *, Email *, Subject, Your Message | OBSERVED |
| Button | "Submit" | OBSERVED |

---

## 6. Layout/Geometry Findings

### Container Widths
| Context | Width | Source |
|---|---|---|
| Desktop (boxed) | 1320px | OBSERVED (Elementor CSS) |
| Tablet | 1024px | OBSERVED (media query at 1279px) |
| Mobile | 767px | OBSERVED (media query at 767px) |
| Content size | 840px | OBSERVED (WordPress global) |
| Wide size | 1290px | OBSERVED (WordPress global) |

### Header Layout
- Full-width, white background (#FFFFFF)
- Logo: left, max-height 40px, margin-right: 70px
- Nav: center-left
- Icons: right
- Padding: 20px 50px (desktop), 10px 20px (tablet), 10px 0px (mobile)

### Footer Layout
- Full-width, dark bg (#171A21)
- 3-column: 40% | 19.332% | 40%
- Padding: 25px 0px (mobile)

### Hero Slider
- Full-viewport height (fullscreen layout)
- Portrait image: 555×1000px (right side)
- Text content: left side
- Slider Revolution with 3D text intro animations

### Services Gallery
- Full-bleed, 4 equal columns
- No gutters (edge-to-edge)
- Dark gradient overlay on each panel
- Height: ~550px

### Portfolio Grid (Home)
- Asymmetric 2-column layout
- Large item: ~630×690px
- Small items: ~630×330px each

### About Hero
- 3-column: 31.5% | 17.8% | 50%
- White background
- Floating parallax images with absolute positioning

### Skills Section
- Left column: text + progress bars
- Right column: floating skill icons with parallax
- Progress bars: white track, coral (#FF5B4A) fill, 6px height, 20px border-radius

---

## 7. Responsive Findings

### Breakpoints
| Breakpoint | Max-width | Behavior |
|---|---|---|
| Desktop | > 1279px | Full layout, 1320px container |
| Tablet | 768px - 1279px | Adjusted spacing, 1024px container |
| Mobile | < 767px | Stacked layout, 767px container |

### Responsive Behaviors
| Element | Desktop | Tablet | Mobile |
|---|---|---|---|
| Header Nav | Horizontal inline | Hidden | Hamburger menu |
| Mobile Menu | Hidden | Hidden | Fullscreen overlay |
| Side Panel | Available via grid icon | Available | Available |
| Hero Slider | Full height | Adjusted | Stacked |
| Services | 4 columns | 2 columns | 1 column |
| Portfolio Grid | 2-column asymmetric | 2-column | 1 column |
| Footer | 3-column (40/19/40) | 3-column | Stacked |
| Floating Sidebar | Visible | Hidden | Hidden |
| Mouse Helper | Active | Disabled (≤1025px) | Disabled |
| Go to Top | Visible | Visible | Visible |
| About Hero | 3-column | Adjusted | Stacked |
| Floating Skill Icons | Visible with parallax | Adjusted | Smaller sizes |

---

## 8. Media Inventory

### Logo Assets
| Asset | Path | Dimensions | Usage |
|---|---|---|---|
| Main Logo (dark) | `/wp-content/uploads/2023/03/main-logo.png` | 300×74 | Header, search overlay, side panel |
| Light Logo | `/wp-content/uploads/2020/05/Saber-Nasr-Logo-Light.png` | 300×74 | Mobile menu, footer |
| Favicon | `/wp-content/uploads/2023/03/fav-icon.png` | 32×32, 192×192 | Browser tab |

### Hero Images
| Asset | Path | Dimensions | Usage |
|---|---|---|---|
| Saber Portrait | `/wp-content/uploads/2023/03/Saber.png` | 555×1000 | Hero slide 1 |
| Slider Image 2 | `/wp-content/uploads/revslider/main-slider/slider-image-2-min1.png` | 555×1156 | Hero slide 2 |
| Slider Image 6 | `/wp-content/uploads/revslider/main-slider/slider-image-6-min1.png` | 507×1014 | Hero slide 3 |
| Slider Image 3 | `/wp-content/uploads/revslider/main-slider/slider-image-3-min1.png` | 130×130 | Decorative |
| Slider Image 4 | `/wp-content/uploads/revslider/main-slider/slider-image-4-min1.png` | 222×97 | Decorative |
| Slider Image 5 | `/wp-content/uploads/revslider/main-slider/slider-image-5-min1.png` | 130×130 | Decorative |
| Slider Image 7 | `/wp-content/uploads/revslider/main-slider/slider-image-7-min1.png` | 177×177 (297×297 display) | Decorative |
| Slider Image 8 | `/wp-content/uploads/revslider/main-slider/slider-image-8-min1.png` | 297×297 (397×397 display) | Decorative |

### Decorative Assets
| Asset | Path | Dimensions | Usage |
|---|---|---|---|
| Drawing | `/wp-content/uploads/2023/03/home-drawing.png` | 210×280 | About preview illustration |
| White Dots | `/wp-content/uploads/2020/07/img-animation-5-white.png` | 130×130 | Home hero decorative |
| Animation Dots | `/wp-content/uploads/2020/05/img-animation-5.png` | 130×130 | About hero parallax |
| Ellipse | `/wp-content/uploads/2020/05/img-ellipse.png` | 87×87 | Home hero decorative |
| About Badge | `/wp-content/uploads/2020/07/about-us-white.svg` | 148×148 | Rotating badge (Home) |
| Border Rad | `/wp-content/uploads/2020/07/border-rad.png` | 626×626 | About skills decorative |

### Content Images
| Asset | Path | Dimensions | Usage |
|---|---|---|---|
| Designer Photo | `/wp-content/uploads/2023/03/Saber-Designer.jpg` | -- | About preview (Home) |
| Digital Agency | `/wp-content/uploads/2023/03/digital-agency-scaled.jpg` | 2560×1704 | Creative Approach (Home) |
| Graphic Design BG | `/wp-content/uploads/2020/04/graphic-design-scaled.jpg` | -- | About hero left column |
| Fiverr Profile | `/wp-content/uploads/2023/03/Fiverr-Profile.png` | 510×623 | About hero profile swap |
| Upwork Profile | `/wp-content/uploads/2023/03/Upwork-Profile.png` | -- | About hero profile swap |

### Platform Logos
| Asset | Path | Dimensions | Usage |
|---|---|---|---|
| Fiverr Logo | `/wp-content/uploads/2023/03/Fiverr-Company.png` | 550×234 | Platform logos strip/cards |
| Upwork Logo | `/wp-content/uploads/2023/03/Upwork.png` | 550×234 | Platform logos strip/cards |
| Freelancer Logo | `/wp-content/uploads/2023/03/Freelancer.png` | 550×234 | Platform logos strip/cards |
| SND Logo | `/wp-content/uploads/2023/03/Saber-Nasr-Company.png` | 550×234 | Platform logos strip/cards |

### Service Backgrounds
| Asset | Path | Usage |
|---|---|---|
| Graphic Design | `/wp-content/uploads/2020/04/graphic-design-scaled.jpg` | Service panel bg (Home) + About hero |
| Graphic Design 890 | `/wp-content/uploads/2020/04/graphic-design-890x664.jpg` | Services panel hover (Home) |
| Web Development | `/wp-content/uploads/2020/04/Web-Development-scaled.jpg` | Service panel bg (Home) |
| Web Development 890 | `/wp-content/uploads/2020/04/Web-Development-890x664.jpg` | Services panel hover (Home) |
| Creative Video | `/wp-content/uploads/2020/04/Creative-Video-scaled.jpg` | Service panel bg (Home) |
| Creative Video 890 | `/wp-content/uploads/2020/04/Creative-Video-890x664.jpg` | Services panel hover (Home) |
| SEO | `/wp-content/uploads/2020/04/seo-840x560.jpg` | Service panel bg (Home) |

### Portfolio Thumbnails
| Asset | Path | Dimensions |
|---|---|---|
| Mustadeem | `/wp-content/uploads/2026/02/Mustadeem.jpg` | 840×560 |
| Mkayn Store | `/wp-content/uploads/2026/02/Mkayn-Store-890x664.jpg` | 840×560 |
| HELIX CATALOG | `/wp-content/uploads/2024/03/HELIX-CATALOG-890x664.jpg` | 840×630 |
| Sealy Collection | `/wp-content/uploads/2024/03/Sealy-Collection-840x630.jpg` | 840×630 |
| Sealy Products | `/wp-content/uploads/2024/03/Sealy-Products-2021-arabic-840x630.jpg` | 840×630 |
| Sealy | `/wp-content/uploads/2024/03/Sealy-840x473.jpg` | 840×473 |
| Saudi Holidays | `/wp-content/uploads/2024/03/saudiholidays-840x562.jpg` | 840×562 |
| Cryptosense | `/wp-content/uploads/2024/03/cryptosense-840x562.jpg` | 840×562 |
| Maktabitech | `/wp-content/uploads/2024/03/maktabitech-840x562.jpg` | 840×562 |
| + 21 more items | (see full list in portfolio section) | Various |

### Team Photos
| Asset | Path | Usage |
|---|---|---|
| Saber Nasr | `/wp-content/uploads/2020/05/Saber-Nasr.jpg` | Team photo 1 |
| Mohamed Maksoud | `/wp-content/uploads/2020/05/Mohamed-Maksoud.jpg` | Team photo 2 |

### Testimonial Avatars
| Asset | Path | Dimensions |
|---|---|---|
| banmas | `/wp-content/uploads/2023/03/banmas.png` | 100×100 |
| ginabuckney | `/wp-content/uploads/2023/03/ginabuckney.jpeg` | 100×100 |
| bollybeatz | `/wp-content/uploads/2023/03/bollybeatz.png` | 100×100 |
| chrismoran | `/wp-content/uploads/2023/03/chrismoran.jpg` | 100×100 |
| huiyin | `/wp-content/uploads/2023/03/huiyin.jpg` | 100×100 |
| mohamednawar | `/wp-content/uploads/2023/03/mohamednawar.jpg` | 100×100 |
| torecompany | `/wp-content/uploads/2023/03/torecompany.png` | 100×100 |

### About Page Skill Icons
| Asset | Path | Display Size |
|---|---|---|
| Illustrator | `/wp-content/uploads/2023/03/illustrator.png` | 100px |
| WordPress | `/wp-content/uploads/2023/03/wordpress-150x150.png` | 83px |
| Photoshop | `/wp-content/uploads/2023/03/photoshop.png` | 115px |
| Coding | `/wp-content/uploads/2023/03/coding-150x150.png` | 95px |
| Premiere Pro | `/wp-content/uploads/2023/03/premiere-pro-150x150.png` | 80px |
| After Effects | `/wp-content/uploads/2023/03/after-effects-150x150.png` | 71px |
| SEO | `/wp-content/uploads/2023/03/seo-150x150.png` | 84px |

---

## 9. Placeholder Inventory (Claude Spec vs Live)

| Placeholder ID | Claude Spec | Live Evidence | Status |
|---|---|---|---|
| `GLOBAL-HEADER` | Navigation | OBSERVED — Elementor template 6817 | CONFIRMED |
| `GLOBAL-LOGO` | [LOGO] | OBSERVED — main-logo.png (300×74) + light variant | CONFIRMED |
| `GLOBAL-NAV-ICONS` | [ICON] ×2 | OBSERVED — Search + 3×3 grid (side panel trigger) | CONFIRMED |
| `GLOBAL-SIDEBAR-SOCIAL` | [ICON] ×4 | OBSERVED — Part of TRX Addons mouse-helper | CONFIRMED |
| `GLOBAL-CHAT-WIDGET` | [INTERACTIVE_MEDIA] | OBSERVED — Chaty plugin | CONFIRMED |
| `GLOBAL-GOTOTOP` | [ICON] + structural | OBSERVED — Scroll-triggered button | CONFIRMED |
| `GLOBAL-DOT-MARKER` | [UNKNOWN_MEDIA] | OBSERVED — TRX Addons mouse-helper cursor | CONFIRMED |
| `GLOBAL-FOOTER` | Structural + [LOGO] | OBSERVED — Elementor template 4105 | CONFIRMED |
| `HOME-HERO-PORTRAIT` | [HERO_IMAGE] | OBSERVED — Saber.png (555×1000) | CONFIRMED |
| `HOME-HERO-DECOR-DOTGRID` | [DECORATIVE_GRAPHIC] | OBSERVED — img-animation-5-white.png | CONFIRMED |
| `HOME-HERO-DECOR-BLUERING` | [DECORATIVE_GRAPHIC] | OBSERVED — In slider markup | CONFIRMED |
| `HOME-HERO-DECOR-REDRING` | [DECORATIVE_GRAPHIC] | OBSERVED — In slider markup | CONFIRMED |
| `HOME-HERO-DECOR-XMARKS` | [DECORATIVE_GRAPHIC] | OBSERVED — In slider markup | CONFIRMED |
| `HOME-HERO-DECOR-DOTCLUSTER` | [DECORATIVE_GRAPHIC] | OBSERVED — In slider markup | CONFIRMED |
| `HOME-HERO-WATCHINTRO-ICON` | [ICON] → [VIDEO] | OBSERVED — Play button in slider | CONFIRMED |
| `HOME-WHYUS-ICON-1/2/3` | [ICON] ×3 | OBSERVED — In page content | CONFIRMED |
| `HOME-ABOUTPREVIEW-ILLUSTRATION` | [ILLUSTRATION] | OBSERVED — home-drawing.png | CONFIRMED |
| `HOME-ABOUTPREVIEW-LOGOSTRIP` | [LOGO] ×4 | OBSERVED — 4 platform logos | CONFIRMED |
| `HOME-SERVICES-PANEL-1..4` | [IMAGE] ×4 | OBSERVED — 4 service backgrounds | CONFIRMED |
| `HOME-FUNFACTS-ICON-1/2/3` | [ICON] ×3 | OBSERVED — Stats section icons | CONFIRMED |
| `HOME-PORTFOLIO-IMG-1/2/3` | [IMAGE] ×3 | OBSERVED — 3 portfolio thumbnails | CONFIRMED |
| `ABOUT-HERO-DESKPHOTO` | [IMAGE] | OBSERVED — graphic-design-scaled.jpg | CONFIRMED |
| `ABOUT-HERO-BADGE` | [ANIMATION] | NOT OBSERVED on About page — badge is on Home page Creative Approach section | CONFLICT |
| `ABOUT-HERO-SCROLLCUE` | [ICON] | NOT OBSERVED on About page | CONFLICT |
| `ABOUT-SERVICES-STRIP-IMAGE` | [IMAGE] | NOT OBSERVED — About page has different structure | CONFLICT |
| `ABOUT-TESTIMONIAL-AVATAR-1` | [IMAGE] | NOT OBSERVED on About page — testimonials are on Home page | CONFLICT |
| `ABOUT-TESTIMONIAL-LOGO-2` | [LOGO] | NOT OBSERVED on About page | CONFLICT |
| `ABOUT-TEAM-PHOTO-1` | [IMAGE] | NOT OBSERVED on About page — team section is on Home page | CONFLICT |
| `ABOUT-TEAM-PHOTO-2` | [IMAGE] | NOT OBSERVED on About page | CONFLICT |
| `ABOUT-CTA-BGPHOTO` | [IMAGE] or [BACKGROUND_VIDEO] | NOT OBSERVED on About page — CTA is on Home page | CONFLICT |
| `ABOUT-CTA-COUNTDOWN` | [INTERACTIVE_MEDIA] | NOT OBSERVED on About page — countdown is on Home page | CONFLICT |

---

## 10. Interaction Inventory

| Interaction | Implementation | Status |
|---|---|---|
| Hero Slider | Slider Revolution 6.6.20 (3D text intro) | OBSERVED |
| Profile Image Swap | TRX Addons image effects (on_swap) | OBSERVED |
| Portfolio Filter | QW Extension portfolio filter | OBSERVED |
| Testimonial Carousel | Swiper.js 8.4.5 (slide effect, autoplay, loop) | OBSERVED |
| Platform Logo Slider | Swiper.js 8.4.5 | OBSERVED |
| Portfolio Slider (About) | Swiper.js 8.4.5 (3 slides/view, autoplay, loop) | OBSERVED |
| Mouse Parallax | TRX Addons mouse-helper (transform3d) | OBSERVED |
| Custom Cursor | TRX Addons mouse-helper (permanent, smooth) | OBSERVED |
| Lightbox | Magnific Popup | OBSERVED |
| Dropdown Menu | Superfish.js | OBSERVED |
| Countdown Timer | jQuery Countdown (target: 2026-03-21) | OBSERVED |
| Contact Form | WPForms 1.9.9.3 | OBSERVED |
| Search Form | TRX Addons search overlay | OBSERVED |
| Page Transitions | Elementor page transition (#FFBC7D) | OBSERVED |
| GSAP Animations | GSAP 3.12.2 (core only, no ScrollTrigger) | OBSERVED |
| SVG Animations | Vivus.js | OBSERVED |
| 3D Flipbook | DearFlip (dFlip) Lite 2.4.37 | OBSERVED |
| Lazy Loading | Elementor lazy-load + IntersectionObserver | OBSERVED |
| Speculation Rules | Prefetch for internal links | OBSERVED |
| Side Panel | Elementor template 4445 (slide from left) | OBSERVED |
| Skills/Counters | TRX Addons skills (duration: 1500ms) | OBSERVED |
| Hover Video | Portfolio items with hover-triggered video | OBSERVED |
| Image Effects | Smudge effect on About hero image | OBSERVED |

---

## 11. Animation Inventory

| Animation | Trigger | Target | Implementation | Status |
|---|---|---|---|---|
| Hero Slider Transitions | Auto/Manual | Hero section | Slider Revolution (3D text) | OBSERVED |
| Page Transition | Page load | Full page | Elementor (#FFBC7D bg) | OBSERVED |
| Mouse Cursor Trail | Mouse move | Global cursor dot | TRX Addons mouse-helper | OBSERVED |
| Parallax Elements | Mouse move | Decorative elements | TRX Addons parallax (transform3d) | OBSERVED |
| Profile Image Swap | Hover | About hero images | TRX Addons image effects | OBSERVED |
| GSAP Animations | Scroll/Load | Various elements | GSAP 3.12.2 (core) | OBSERVED |
| SVG Icon Animations | Scroll/Load | Icon elements | Vivus.js | OBSERVED |
| Counter Animation | Scroll into view | Stats section | TRX Addons skills (1500ms) | OBSERVED |
| Rotating Badge | Continuous | "ABOUT US" badge | CSS keyframes (qwery-infinite-rotate) | OBSERVED |
| Scroll-triggered Go to Top | Scroll threshold | Go to top button | Custom JS | OBSERVED |
| Portfolio Hover Effects | Hover | Portfolio thumbnails | CSS transitions (opacity) | OBSERVED |
| Logo Hover Effects | Hover | Platform logos | CSS transitions (opacity 0.5→1) | OBSERVED |
| Button Underline | Hover | CTA buttons | CSS transform: scaleX(1→0) | OBSERVED |
| Skills Progress Bars | Scroll into view | Progress bars | Elementor progress widget | OBSERVED |
| Floating Icons Parallax | Mouse move | Skill icons | TRX Addons parallax (transform3d) | OBSERVED |
| Hover Video | Hover | Portfolio items | TRX Addons hover video | OBSERVED |
| Smudge Effect | Hover | About hero image | TRX Addons image effects | OBSERVED |

---

## 12. Font Findings

| Font Family | Source | Usage | CSS Variable |
|---|---|---|---|
| **sofia-pro** | Custom (Adobe Fonts/Typekit) | Hero headings, H1 | `--wp--preset--font-family--h-1-font` |
| **europa** | Typekit (`use.typekit.net/lrz6aog.css`) | Body text, paragraphs | `--wp--preset--font-family--p-font` |
| **Lora** | Google Fonts (400-700, italic) | Serif text, special elements | `--wp--preset--font-family--other-font` |
| **Roboto** | Google Fonts (locally hosted) | Elementor primary/text | `--e-global-typography-primary-font-family` |
| **Roboto Slab** | Google Fonts (locally hosted) | Elementor secondary | `--e-global-typography-secondary-font-family` |
| **Material Icons** | Google Fonts | Icon font | Used in Slider Revolution |

### Font Sizes (from CSS)
| Token | Value | Usage |
|---|---|---|
| Small | 13px | Eyebrow labels |
| Medium | clamp(14px, 0.875rem + ((1vw - 3.2px) * 0.619), 20px) | Body text |
| Large | clamp(22.041px, 1.378rem + ((1vw - 3.2px) * 1.439), 36px) | H2 sections |
| X-Large | clamp(25.014px, 1.563rem + ((1vw - 3.2px) * 1.751), 42px) | H1 hero |

### Icon Fonts
| Font | Source | Usage |
|---|---|---|
| TRX Addons Icons | Theme plugin | UI icons |
| QW Extension Icons | Theme plugin | Portfolio icons |
| Fontello | Qwery theme | Theme icons |

---

## 13. Technical Findings

### CMS & Platform
| Property | Value | Evidence |
|---|---|---|
| CMS | WordPress 6.9.7 | OBSERVED (meta generator) |
| Theme | Qwery | OBSERVED (body class `wp-theme-qwery`) |
| Theme Skin | Default | OBSERVED (body class `skin_default`) |
| Page Builder | Elementor 4.1.4 | OBSERVED (meta generator) |
| Page Builder Pro | Elementor Pro 3.35.0 | OBSERVED (CSS files) |
| Slider | Slider Revolution 6.6.20 | OBSERVED (meta generator) |
| Hosting | Likely shared/cPanel | INFERRED (wp-content structure) |

### JavaScript Libraries
| Library | Version | Purpose |
|---|---|---|
| jQuery | 3.7.1 | Core JS |
| jQuery Migrate | 3.4.1 | Backward compatibility |
| jQuery UI Core | 1.13.3 | UI interactions |
| Slider Revolution | 6.6.20 | Hero slider |
| Swiper.js | 8.4.5 | Carousels/sliders |
| GSAP | 3.12.2 | Animations (core only) |
| Vivus.js | -- | SVG animations |
| Magnific Popup | -- | Lightbox |
| Superfish.js | -- | Dropdown menus |
| Masonry | 4.2.2 | Grid layouts |
| imagesLoaded | 5.0.0 | Image load detection |
| MediaElement.js | 4.2.17 | Media player |
| DearFlip (dFlip) | 2.4.37 | 3D flipbook |
| Chaty | 3.5.31771985686 | Chat widget |
| WPForms | 1.9.9.3 | Contact form |
| jQuery Countdown | -- | Countdown timer |

### WordPress Plugins Detected
| Plugin | Purpose |
|---|---|
| TRX Addons | Theme addon suite (mouse helper, parallax, search, portfolio, skills, icons, countdown, animations) |
| QW Extension | Qwery extension (portfolio filter, icons) |
| Elementor | Page builder |
| Elementor Pro | Advanced page builder |
| Slider Revolution | Hero slider |
| Chaty | Chat widget |
| WPForms | Contact form |
| DearFlip (dFlip) | 3D flipbook |

### Color Palette (Confirmed from CSS)
| Token | Hex | Usage | Confidence |
|---|---|---|---|
| Primary Accent | `#FF5B4A` | Links, buttons, CTA, progress bars | HIGH (from CSS vars) |
| Hover Accent | `#FD4431` | Link hover states | HIGH |
| Secondary Blue | `#2F39D3` | Secondary links, icons, play button, bg canvas | HIGH |
| Secondary Hover | `#222BB7` | Secondary hover | HIGH |
| Tertiary Warm | `#C5A48E` | Tertiary links | HIGH |
| Tertiary Hover | `#AB8E7A` | Tertiary hover | HIGH |
| Dark Background | `#171A21` | Footer bg, dark sections | HIGH |
| Light Background | `#F6F6F6` | Page bg | HIGH |
| Section BG | `#F9F9F9` | About portfolio section | HIGH |
| Border | `#E2E2E2` | Borders | HIGH |
| Text Dark | `#222733` | Headings | HIGH |
| Text Light | `#A5A6AA` | Muted text | HIGH |
| Footer Text | `#D2D3D5` | Footer text | HIGH |
| Footer Border | `#DDDDDD` | Footer dividers | HIGH |
| Chat Purple | `#A886CD` | Chat widget | HIGH |
| Page Transition | `#FFBC7D` | Page transition bg | HIGH |
| Elementor Primary | `#6EC1E4` | Elementor kit | HIGH |
| Elementor Secondary | `#54595F` | Elementor kit | HIGH |
| Elementor Text | `#7A7A7A` | Elementor kit | HIGH |
| Elementor Accent | `#61CE70` | Elementor kit | HIGH |

### Container/Layout System
| Property | Value |
|---|---|
| Max width (boxed) | 1320px |
| Max width (tablet) | 1024px |
| Max width (mobile) | 767px |
| Content size | 840px |
| Wide size | 1290px |

### Elementor Responsive Breakpoints
| Label | Max-width | Enabled |
|---|---|---|
| Mobile Portrait | 767px | Yes |
| Tablet Portrait | 1279px | Yes |
| Mobile Extra | 880px | No |
| Tablet Extra | 1200px | No |
| Laptop | 1366px | No |
| Widescreen | 2400px | No |

---

## 14. Conflicts Between Claude Specification and Live Reference

### CRITICAL CONFLICTS (structural differences)

| # | Claude Spec | Live Evidence | Resolution |
|---|---|---|---|
| 1 | **About page has blue background hero** | About page hero has **white** background | FOLLOW LIVE |
| 2 | **About page has "Services Strip" section** (1 wide photo + 3 labels) | About page has **"What makes us happy" portfolio slider** (30 items) + **Skills/Progress bars** section | FOLLOW LIVE — About page structure is completely different |
| 3 | **About page has "Meet Our Team" section** (2 photos) | Team section is on **Home page**, not About | FOLLOW LIVE — Move team to Home |
| 4 | **About page has testimonials carousel** | Testimonials are on **Home page**, not About | FOLLOW LIVE — Move testimonials to Home |
| 5 | **About page has CTA/Countdown section** | CTA/countdown is on **Home page**, not About | FOLLOW LIVE — Move CTA to Home |
| 6 | **About page has "Creative Approach" section** | "Creative Approach" is on **Home page**, not About | FOLLOW LIVE — Move creative approach to Home |
| 7 | **About page has services panel** (3-column, dark) | Services panel is on **Home page**, not About | FOLLOW LIVE — Move services panel to Home |
| 8 | **About page has rotating badge** | Rotating badge is on **Home page** (Creative Approach section) | FOLLOW LIVE — Move badge to Home |

### MODERATE CONFLICTS (content/structure differences)

| # | Claude Spec | Live Evidence | Resolution |
|---|---|---|---|
| 9 | About page hero is 2-column (framed photo + text) | About page hero is **3-column** (workspace photo + spacer + text with features) | FOLLOW LIVE |
| 10 | About page has "Our Platforms" with prev/next arrows | About page "Our Platforms" is a **4-column grid** (no arrows/carousel) | FOLLOW LIVE |
| 11 | About page testimonials show 2 visible (carousel with peek) | No testimonials on About page at all | FOLLOW LIVE |
| 12 | About page has profile images (Fiverr/Upwork) | About page has **profile swap effect** (Fiverr ↔ Upwork on hover) | FOLLOW LIVE |
| 13 | About page has floating circular icons | About page has **7 floating skill icons** with parallax mouse-follow | FOLLOW LIVE (partially confirmed) |
| 14 | Home hero is static 2-column (55% text / 45% image) | Home hero is **Slider Revolution** (fullscreen with 3D text animations) | FOLLOW LIVE |
| 15 | "Discover More" is underlined text-link | "Discover More" is a **button** in the slider context | FOLLOW LIVE |
| 16 | CTA countdown shows "00 : 00 : 00 : 00" | Timer targets **2026-03-21** (dynamic) | FOLLOW LIVE |
| 17 | Team member 2 is unnamed | Team member 2 is **Mohamed Maksoud** (Graphic Designer) | FOLLOW LIVE |
| 18 | Team member 1 role is unknown | Team member 1 is **Saber Nasr** (Project Manager) | FOLLOW LIVE |
| 19 | Copyright says "Template" | Copyright says **"Saber Nasr"** | FOLLOW LIVE |
| 20 | Footer has 3 icons (Facebook, WhatsApp, Phone) | Footer has **4 icons** (Facebook, WhatsApp, Phone, Email) | FOLLOW LIVE |
| 21 | About page has "Corporate service" eyebrow | About page has **"corporate service"** eyebrow (lowercase) | FOLLOW LIVE |
| 22 | Home page has "Our Platforms" with 3 logos | Home page "Our Platforms" has **4 logos** (Fiverr, Upwork, Freelancer, Saber Nasr) | FOLLOW LIVE |
| 23 | About page has 3 platform logos | About page has **4 platform logos** (same as Home) | FOLLOW LIVE |
| 24 | Home page "Services Panel" has 4 items | Home page "Services Panel" has **3 items** (no SEO) | FOLLOW LIVE |
| 25 | About page services panel has 3 labels | No services panel on About page | FOLLOW LIVE |

### MINOR CONFLICTS

| # | Claude Spec | Live Evidence | Resolution |
|---|---|---|---|
| 26 | Chat widget is bottom-left | Confirmed bottom-left | CONFIRMED |
| 27 | Go to top is bottom-right | Confirmed bottom-right | CONFIRMED |
| 28 | Floating sidebar has 4 items | Confirmed 4 items (Email, Phone, WhatsApp, Facebook) | CONFIRMED |
| 29 | Footer is dark navy | Confirmed #171A21 | CONFIRMED |
| 30 | Logo is multicolor angular mark | Confirmed (main-logo.png) | CONFIRMED |

---

## 15. Unknowns Requiring Later Investigation

| # | Item | What's Unknown | Required Investigation |
|---|---|---|---|
| 1 | Hero Slider Content | Exact slide transitions, timing, and 3D text animations | Inspect Slider Revolution settings in WordPress admin |
| 2 | Mouse Helper Behavior | Exact cursor replacement behavior, blend mode, size | Test live site with mouse movement |
| 3 | Profile Swap Trigger | Whether Fiverr↔Upwork swap is hover or timed | Test live site interaction |
| 4 | GSAP Animation Targets | Which elements have GSAP scroll animations | Inspect JS initialization code |
| 5 | Counter Animation | Exact trigger (scroll-into-view vs page load) and duration | Test live site scroll behavior (confirmed 1500ms duration) |
| 6 | Rotating Badge Speed | CSS animation speed and direction | Inspect live CSS keyframes |
| 7 | Portfolio Filter | Exact filter categories and animation | Test live site filter interaction |
| 8 | 3D Flipbook Content | What content is in the flipbook | Test live site flipbook interaction |
| 9 | Curtains.js Usage | Which elements use WebGL effects | Inspect JS initialization (not found in current inspection) |
| 10 | Mobile Menu Behavior | Fullscreen overlay animation details | Test on mobile device |
| 11 | Search Modal | Search overlay behavior and animation | Test live site search interaction |
| 12 | Contact Form Validation | Client-side validation rules | Test form submission |
| 13 | Google Map Config | Map center, zoom, markers | Inspect map embed (not found in current fetch) |
| 14 | Additional Pages | Content of `/about-personal/` and `/shop/` | Both return 404 — pages do not exist |
| 15 | Exact Font Loading | Font file formats, loading strategy | Inspect network requests |
| 16 | Image Optimization | WebP usage, lazy loading strategy | Inspect image serving |
| 17 | Performance Metrics | Core Web Vitals, load times | Run performance audit |
| 18 | Hover Video Files | Exact video files and format for portfolio hover | Inspect portfolio item data attributes |
| 19 | Slider Revolution Layers | Exact layer positions, animations, timing | Inspect SR editor settings |
| 20 | About Hero Profile Swap | Displacement image source and effect parameters | Inspect TRX Addons image effects config |

---

## 16. Recommended Implementation Order

### Phase 1: Foundation
1. Initialize React + Vite project
2. Set up Tailwind CSS with design tokens from Section 13
3. Create base HTML structure
4. Implement CSS custom properties (color palette, fonts)
5. Set up React Router with shared layout pattern

### Phase 2: Global Components
6. Header/Navigation (logo, nav, search, mobile menu, side panel)
7. Footer (copyright, logo, social icons)
8. Floating sidebar (social links — part of mouse helper system)
9. Chat widget (Chaty integration or equivalent)
10. Go to top button
11. Custom cursor (TRX Addons mouse-helper equivalent)
12. Page transitions

### Phase 3: Homepage Sections (in scroll order)
13. Hero Slider (Slider Revolution or custom implementation)
14. "Why Choose Us" section
15. "We develop & create digital future" section (About Preview)
16. Platform logos strip
17. Services gallery (4-panel)
18. Fun Facts/Stats section (animated counters)
19. Portfolio preview grid
20. "Creative Approach" section (dark, with rotating badge)
21. Services panel (3-column, dark, with hover swap)
22. Platform logos slider
23. Testimonials carousel (7 slides)
24. Team section (2 photos with names/roles)
25. Countdown CTA section

### Phase 4: About Page
26. About hero (3-column with profile swap effect)
27. Portfolio slider (30 items, Swiper)
28. Skills/Progress bars section (4 bars + floating icons)
29. Platform logos (4-column grid)

### Phase 5: Portfolio Page
30. Portfolio grid with filters
31. Category filtering logic

### Phase 6: Contact Page
32. Contact form (WPForms or custom)
33. Form validation

### Phase 7: Interactions & Animations
34. Mouse helper / custom cursor (TRX Addons equivalent)
35. GSAP animations
36. SVG icon animations (Vivus)
37. Parallax effects (mouse-driven transform3d)
38. Counter animations
39. Page transitions
40. Hover video on portfolio items
41. Image effects (smudge, swap)

### Phase 8: Responsive & Polish
42. Mobile responsive layouts
43. Tablet responsive layouts
44. Performance optimization
45. Cross-browser testing

---

## Appendix A: Evidence Classification Summary

| Classification | Count | Examples |
|---|---|---|
| **OBSERVED** | 200+ | Routes, content, images, colors, fonts, interactions, JS libraries, CSS values |
| **INFERRED** | 20+ | Counter animation trigger, badge rotation, grid behavior, hosting type |
| **UNKNOWN** | 20+ | GSAP targets, exact animation timings, hover video formats, slider revolution config |

---

## Appendix B: Key Technical Decisions Required

1. **Framework**: React + Vite (as recommended by Claude spec) — greenfield, no existing implementation
2. **CSS Approach**: Tailwind CSS (as recommended) with design tokens from live site
3. **Slider Implementation**: Slider Revolution (WordPress plugin) vs custom Swiper.js implementation
4. **Form Handling**: WPForms equivalent or custom form
5. **Animation Library**: GSAP 3.12.2 (confirmed in reference) + Framer Motion (as recommended)
6. **3D Flipbook**: DearFlip equivalent or simplified implementation
7. **Chat Widget**: Chaty equivalent or custom implementation
8. **Mouse Helper**: TRX Addons mouse-helper equivalent (custom cursor with parallax)
9. **Image Effects**: Smudge effect, profile swap — need equivalent JS library
10. **Deployment**: GitHub Pages (implied by repo path) or other
11. **Font Loading**: sofia-pro and europa are proprietary — need alternatives or licensing
12. **Portfolio Hover Video**: Need to determine format and implementation approach

---

*Report generated: 2026-09-11*
*Source: Live site inspection (sabernasr.com) + Claude specification + repository inspection*
*Status: Phase 1 Reconnaissance Complete*
