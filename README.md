# ◈ Portfolio — Immersive 3D Portfolio

A high-performance, 3D-enabled portfolio built with Next.js 14, Three.js, GSAP, and Framer Motion.

## Stack

| Layer | Tool |
|---|---|
| Framework | Next.js 14 (App Router) |
| 3D Engine | Three.js + React Three Fiber |
| Animations | Framer Motion + GSAP |
| Styling | Tailwind CSS |
| Language | TypeScript |
| Backend | Next.js API Routes |
| Deployment | Vercel (recommended) |

## Quick Start

```bash
# 1. Install dependencies
npm install

# 2. Copy env template
cp .env.local.example .env.local

# 3. Start dev server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Customization

**All content lives in one file:** `lib/data.ts`

Edit these exports to personalize:
- `personal` — name, initials, tagline, social links, email
- `timeline` — career milestones
- `skillDomains` — skills organized by domain
- `projects` — case studies
- `testimonials` — quotes from collaborators

### Contact Form

The contact form at `/api/contact/route.ts` is pre-wired for two backends:

**Resend (recommended):**
1. Create account at [resend.com](https://resend.com)
2. Add `RESEND_API_KEY` to `.env.local`
3. Uncomment the Resend block in `app/api/contact/route.ts`

**Formspree:**
1. Create form at [formspree.io](https://formspree.io)
2. Replace `YOUR_FORM_ID` in the Formspree block and uncomment

### Design Tokens

Global tokens are in `app/globals.css` under `:root {}`.
Tailwind tokens are in `tailwind.config.ts`.

Main colors:
- `--color-bg`: Background (`#080B14`)
- `--color-accent`: Electric blue (`#4F8EF7`)
- `--color-violet`: Violet (`#8B5CF6`)

### Fonts

Using Google Fonts via `next/font`:
- **Display:** Syne (headings, hero)
- **Body:** DM Sans
- **Mono:** JetBrains Mono

## Performance

- 3D scenes use `frameloop="demand"` — only renders when something changes
- Mobile (<768px): 3D swapped for CSS/static fallback
- `prefers-reduced-motion`: all 3D/animations disabled
- Below-fold sections: lazy loaded with `next/dynamic`
- Assets: Draco-compress GLTFs, use WebP textures (max 1024×1024)

## Deployment (Vercel)

```bash
npm install -g vercel
vercel
```

Add environment variables in the Vercel dashboard.

## Sections

1. **Loader** — Branded intro with stroke-animated initials
2. **Hero** — GLSL nebula shader + particle constellation
3. **About** — Alternating timeline with milestone cards
4. **Skills** — Domain-organized skill explorer with proficiency bars
5. **Projects** — Cinematic case studies with full overlay
6. **Testimonials** — Editorial Wall of Trust
7. **Contact** — Split form with real-time validation

## Accessibility

- All 3D is decorative — never the only content path
- Keyboard navigable end-to-end
- `prefers-reduced-motion` respected globally
- ARIA labels on all interactive elements
- Custom focus ring (accent color)
- Color contrast: AA minimum for body text

## License

MIT — use freely, attribution appreciated.
