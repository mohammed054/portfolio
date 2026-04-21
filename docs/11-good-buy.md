# 11 — GOOD BUY
## "Good buy." — The Phone Monument

---

## OVERVIEW

The penultimate content section is a **3D monument of stacked office phones**, spotlit and arranged like a product advertisement — or a shrine. Above or below the arrangement, the text **"Good buy."** appears in massive type. The period after "buy" is intentional. The deliberate misspelling of "goodbye" as "Good buy" is the final joke: a corporate farewell, a business affirmation, and a literal sell — all simultaneously.

This section is dark, cinematic, slightly absurd.

---

## VISUAL BREAKDOWN

### Background
- **Near-black**: `#0d0d0d` — continuous with the rest of the dark world
- A subtle **floor reflection** beneath the phones (slightly glossy ground plane in Three.js) — optional, adds to the "display shelf" quality

### The Phone Monument (3D Scene)

**A sculptural arrangement of 4–5 retro office telephone units**:

**Phones visible in video**:
1. **Base unit** (center, bottom): A flat horizontal answering machine / cordless phone base with charging cradle — labeled "SHADER" on the front face
2. **Cordless handset** (standing upright, center-back): A tall cordless phone handset with numerical keypad, standing in its base
3. **Desktop phone unit** (left): A boxy desk phone with number buttons on top surface — labeled "SHADER"
4. **Additional handset** (right): Another cordless handset variant

**Phone aesthetics**:
- All phones are **cream/off-white/light gray** — classic late-1990s office phone color
- Matte plastic surface (`roughness: 0.75, metalness: 0.1`)
- The SHADER branding appears on the face/label area of each unit — a small logo sticker
- The phones are positioned in a **tight cluster** — it looks like a consumer electronics product display or a shrine
- Clean, minimal — the phones are the total subject

**Lighting**:
- Strong **overhead spot** — very similar to the Golden Tie spotlight
- The phones cast dramatic shadows downward on the ground plane
- A slight warm rim light from behind gives depth
- The ambient is very low — the unlit faces of the phones are very dark

**Camera angle**:
- Slightly elevated, looking down at ~15° — like a product photography setup
- The arrangement is centered in the viewport
- The camera slowly orbits as the user scrolls through this section (very slow, ~20° of total orbit over the section duration)

### "Good buy." Text

**Position**: below the phone arrangement, centered

**"Good buy."**:
- Font: `Playfair Display`, weight 900
- Size: approximately `12–14vw` — absolutely massive, taking up the full width
- Color: `#f0ece4` (warm white)
- The period is **part of the text** — it must render correctly and with the same scale
- No special effects — clean, bold, final

**Spacing**: ~48px below the phone arrangement

---

## LAYOUT

```
VIEWPORT

        [PHONE MONUMENT — 3D SCENE]
        
     ┌──────────────────────────────┐
     │        [Base Unit]           │
     │   [Phone L]  [Handset]  [R]  │
     │         [Floor]              │
     └──────────────────────────────┘

              Good buy.
```

The phone scene occupies ~65% of viewport height (centered).
The "Good buy." text is below, centered, ~20% of viewport height.

---

## ANIMATION

### Enter
- The phone arrangement **descends from above** into position: `translateY(-30px) opacity:0 → rest` over 800ms
- Or alternatively: the phones **fade in** from pure darkness (spotlight switches on)
- "Good buy." text fades up 400ms after the phones settle

### While in View (Scroll Interaction)
- The camera slowly orbits the phone arrangement (20° arc, GSAP ScrollTrigger scrub)
- This means as the user scrolls through this section, they see the phones from slightly different angles — back of the handset, side profile of the base unit
- The floor reflection shifts with the camera angle

### Exit
- Phones scale down and fade as the footer section enters from below
- "Good buy." remains visible a moment longer, then fades

---

## ASSETS REQUIRED

- [ ] `phones-array.glb` — 3D model of the phone monument
  - Must include: base unit, upright handset, 1–2 additional desk phone units
  - "SHADER" logo/label on each unit face
  - Materials: cream/off-white matte plastic
  - DRACO compressed, < 2MB
  - The model can be kitbashed from multiple reference phone models

---

## COPY (exact strings)

```
Good buy.
```

*(Note: the period is deliberate and required. The capitalization is "Good buy." — not "GOOD BUY." or "good buy.")*

---

## MOBILE BEHAVIOR

- 3D phones: rendered but simpler — no orbit animation, just a static view with slight idle rotation (±3° yoyo)
- "Good buy." text: `clamp(60px, 14vw, 110px)`
- Scene height: 55vh
- Spotlight: preserved (key visual)
