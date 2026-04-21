# 12 — FOOTER / CONTACT
## Contact Information & Site Footer

---

## OVERVIEW

The final section of the site is a **structured, dark, information-dense contact and footer** section. After the theatrical journey through every section, this is where business actually happens — email, address, social links, a personal CEO contact card, and a warm footer with the brand tagline. It is clean and professional but retains the Shader aesthetic: dark background, serif fonts, retro decorative elements.

---

## VISUAL BREAKDOWN

### Background
- **Deep dark navy**: `#0a0a14` — the same blue-black used in the contact tease section
- This creates visual continuity from the dark contact journey
- Subtle texture: the faint grain overlay present elsewhere

### Contact Grid (Upper Section)

A **3-column information grid** centered in the viewport, upper portion of the section:

```
┌──────────────────────┬──────────────────────┬──────────────────────┐
│  General Enquiries   │    Visit us          │      Social          │
│                      │                      │                      │
│  hello@shader.se     │  Laxholmstorget 3    │   LinkedIn           │
│  Book a call         │  602 21 Norrköping   │   Instagram          │
│                      │  Sweden              │   X (Twitter)        │
└──────────────────────┴──────────────────────┴──────────────────────┘
```

**Column header labels**:
- Font: `Playfair Display`, weight 700, ~1.2rem
- Color: `#f0ece4`

**Content items**:
- Font: `EB Garamond`, 400, ~1.0rem
- Color: `#c0b8a8` (muted warm gray-white)
- Links (`hello@shader.se`, `Book a call`, LinkedIn, Instagram, X): underlined on hover, color brightens to `#f0ece4` on hover
- "Book a call" links to `https://cal.com/simon-hedlund-kglzne`
- The address is plain text (not a link)
- Social links open in `_blank`

**Spacing**: Columns are spaced evenly with ~80px gap, the grid is max-width ~1000px, centered.

**Column layout**:
```
General Enquiries column:
  hello@shader.se      ← mailto link
  Book a call          ← cal.com link

Visit us column:
  Laxholmstorget 3
  602 21 Norrköping
  Sweden

Social column:
  LinkedIn    ← link
  Instagram   ← link
  X (Twitter) ← link
```

### "New Business" CEO Card

Below the contact grid, a **prominent contact card** with a dashed-border:

```
┌ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ┐

  [CEO PHOTO]    New business
                 Reach out today to our CEO for new 
                 business enquiries at ceo@shader.se

└ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ┘
```

**Card specs**:
- Border: `2px dashed rgba(240, 236, 228, 0.3)` — a distinctive **dashed** border (not solid)
- Background: slightly lighter than the section bg — `rgba(255,255,255,0.04)` — very subtle
- Padding: `32px` all sides
- Width: ~540px max, centered in the viewport
- Border-radius: `4px` (subtle, nearly sharp corners)

**CEO Photo**:
- A **cutout PNG** of a person (the CEO/spokesperson for the company)
- Vintage stock-photo aesthetic — the same visual world as the businessmen in the shredder section
- The person is holding a phone receiver to their ear (literally "call us")
- The photo is approximately 120×150px in the card
- Treatment: warm, slightly vintage-processed, slightly desaturated

**Card text**:
- "New business": `Playfair Display`, 700, ~1.2rem, `#f0ece4`
- "Reach out today...": `EB Garamond`, 400, ~1.0rem, `#c0b8a8`
- `ceo@shader.se`: underlined mailto link, brightens on hover

---

### Footer Bar (Bottom)

A horizontal footer bar at the very bottom of the section:

```
┌─────────────────────────────────────────────────────────────────────────────────┐
│                                                                                 │
│  [GLOBE ICON]           ══ SHADER                    [LAUREL]  READ OUR   [LAUREL]│
│  WORLDWIDE BUSINESS   A High Tech Business           ACESSIBILITY         │
│  CERTIFIED COMPANY    Solutions Company              STATEMENT            │
│                       © Shader Sweden AB.                                │
│                       All Rights Reserved.                               │
│                                                                                 │
└─────────────────────────────────────────────────────────────────────────────────┘
```

**Left element — "Worldwide Business Certified Company"**:
- A circular globe icon (like a wireframe globe SVG — the classic UN/ISO globe style)
- Text below: "WORLDWIDE BUSINESS / CERTIFIED COMPANY"
- Font: `EB Garamond` small caps or uppercase, ~0.7rem
- This is a **parody badge** — styled like an official certification but fictional
- Color: `#8a8680`

**Center element — Logo + tagline + copyright**:
- The SHADER logo (icon + wordmark) — same as navbar but centered
- Below: `"A High Tech Business Solutions Company"` — `EB Garamond`, italic, ~0.9rem, muted
- Below: `"© Shader Sweden AB. All Rights Reserved."` — `EB Garamond`, ~0.8rem, muted

**Right element — "Read Our Accessibility Statement"**:
- Two **laurel wreath** SVGs flanking a text block
- Text: `"READ OUR / ACCESSIBILITY / STATEMENT"`
- Font: `EB Garamond` caps, ~0.7rem
- This is also a humorous parody badge — making the accessibility statement sound like an award
- Links to `/accessibility-statement`
- Color: `#8a8680`

---

## ANIMATION

### Enter
- The contact grid items **fade in and stagger up** as the section enters viewport:
  - Each column header fades in first (stagger 100ms)
  - Then each row of content items (stagger 80ms)
- The CEO card scales up from `0.95` to `1.0` with `opacity: 0 → 1` over 500ms, 400ms delay
- Footer bar elements slide in from their respective edges

### While in View
- No continuous animation — this is a resting, final section
- Link hover states: color shift + underline expansion

---

## ASSETS REQUIRED

- [ ] `ceo-phone-portrait.png` — cutout of CEO holding phone
  - Transparent background, vintage stock photo aesthetic
  - ~240px × 300px at 2x
- [ ] Globe SVG — simple wireframe globe icon (classic parallel/meridian grid style)
- [ ] Laurel wreath SVG (left and right variants) — classical laurel leaves

---

## COPY (complete, verbatim from live site)

**Column headers**:
```
General Enquiries
Visit us
Social
```

**Column content**:
```
General Enquiries:
  hello@shader.se
  Book a call

Visit us:
  Laxholmstorget 3
  602 21 Norrköping
  Sweden

Social:
  LinkedIn
  Instagram
  X (Twitter)
```

**CEO Card**:
```
New business
Reach out today to our CEO for new business enquiries at ceo@shader.se
```

**Footer**:
```
WORLDWIDE BUSINESS CERTIFIED COMPANY
[globe icon]

SHADER
A High Tech Business Solutions Company
© Shader Sweden AB. All Rights Reserved.

READ OUR ACCESSIBILITY STATEMENT
[laurel] [text] [laurel]
```

---

## MOBILE BEHAVIOR

- Contact grid: **2-column grid** (General Enquiries + Visit Us in first row, Social spanning full width below)
- CEO card: full width (minus 6vw padding each side)
- Footer bar: stacks vertically (globe → logo → laurels, each block centered)
- Font sizes: slightly reduced body, headlines same
- All links: tap-friendly with `padding: 8px 0` minimum touch target
