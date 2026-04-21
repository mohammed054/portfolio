# 10 — HANDSHAKE
## Cinematic Close-Up

---

## OVERVIEW

After the comedy of the Golden Tie, this section delivers a moment of **cinematic gravity and sincerity**. A dramatic close-up photograph of two hands completing a firm business handshake fills the entire viewport. It's shot like a movie still. No text initially — just the image. It communicates: "We've had our fun. But this is what we're actually here for."

This is the emotional gear-shift before the final contact information. Dark, intimate, powerful.

---

## VISUAL BREAKDOWN

### The Image
- **Full-bleed photograph**: extreme close-up of two hands in a handshake
- Both individuals are in formal business attire (white dress shirts, suit jacket cuffs visible at wrists)
- One hand has a **diamond ring** on the finger — adding a subtle personal, human detail
- The grip is firm, confident — a completed deal, not a greeting
- The background is **pure black** — studio shot, complete darkness behind the hands
- The hands are **lit dramatically** from camera-right: a strong key light creates deep shadows between the fingers and on the far sides of the wrists, with a very subtle cool fill from camera-left

**Mood**: This shot belongs in a Wall Street film. It communicates trust, commitment, the closing of a deal. Professional, intimate, final.

**Image file**: `handshake.webp`
**Resolution**: 2560×1440px minimum
**Treatment**:
- Slightly desaturated (skin tones preserved, but background and jacket colors pulled toward neutral)
- Slight cinematic contrast curve (lifted shadows at bottom, compressed highlights)
- Very subtle film grain overlay

### Layout
- Image fills full viewport: `100vw × 100vh`, `object-fit: cover`, `object-position: center center`
- No text overlay in the primary view of this section
- A top fade: `linear-gradient(to bottom, #000000 0%, transparent 10%)` — seamless transition from the golden tie darkness
- A bottom fade: `linear-gradient(to top, #0d0d0d 0%, transparent 15%)` — transition into next section

### Parallax
- The image has a **deep parallax**: moves at `0.35x` scroll speed
- Effect: the hands appear to recede as you scroll, like pulling away from a signed contract

---

## ANIMATION

### Enter
- The image is initially at `opacity: 0`
- It fades to full opacity over 800ms as the golden tie section scrolls off
- **Slight zoom-out on enter**: starts at `scale: 1.05`, settles to `1.0` over 1.2s
- This creates a dramatic "push out" reveal

### While in View
- Static — no looping animation
- The parallax scroll effect is the only motion
- This deliberate stillness is important after the kinetic tie section

### Exit
- As the "Good buy" phones section enters from below, this image fades out and scales down slightly

---

## OPTIONAL TEXT LAYER

Depending on pacing decisions, a brief text overlay may appear as the user spends time in this section (triggered by time-in-view, not scroll position):

```
[optional]
"Ready to take your enterprise to the next level?"
```
- Font: `Playfair Display`, italic, ~2rem
- Color: `rgba(240, 236, 228, 0.7)` — ghostly, low opacity
- Centered bottom-third of viewport
- This may be omitted — the video recording did not show text here
- **Default: no text** unless client requests it

---

## ASSETS REQUIRED

- [ ] `handshake.webp`
  - **Spec**: Cinematic extreme close-up, two hands in handshake, black background, dramatic side lighting
  - One hand should have a ring (character detail)
  - NO face, NO context beyond wrists/hands
  - Resolution: 2560×1440px minimum
  - Format: `.webp` (quality 92)
  - Treatment: slight desaturation, cinematic contrast, subtle grain

---

## NO COPY (default)

This section contains **no text** by default. The image is the entire statement.

---

## MOBILE BEHAVIOR

- Image: full-bleed, `object-position: 60% center` — crops to show the handshake centrally
- Parallax: disabled
- min-height: `85vh`
- Fades same as desktop
