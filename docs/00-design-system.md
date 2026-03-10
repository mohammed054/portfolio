🎨 Color Palette
Token	Hex / RGBA	Usage
background	#080B14	Page background, canvas base
surface	#0E1220	Cards, panels, secondary sections
border	#1A2035	Subtle separators, dividers
accent1	#4F8EF7	Primary interactive elements, buttons, highlights
accent2	#8B5CF6	Secondary accents, hover effects
accentGlow	rgba(79,142,247,0.15)	Soft glows, hover shadows
textPrimary	#F0F4FF	Main text
textSecondary	#7A89A8	Secondary text
textMuted	#3D4A66	Labels, microcopy

Notes:

Always maintain minimum AA contrast (4.5:1) for body text.

Use accentGlow for subtle particle/hover effects in 3D.

🔤 Typography Scale
Role	Font Family	Weight	Size (px)	Line Height
Display / Hero	Syne	700–800	96 / 64 / 48 / 32	1.1
Headings H1-H6	Syne	700–800	32 / 24 / 20 / 16	1.2
Body	DM Sans	400–500	16 / 14 / 12	1.6
Mono / Code	JetBrains Mono	400–500	14 / 12	1.4

Notes:

Display fonts reserved for hero, headlines, key emphasis.

Mono used only for code snippets, stats, or data visuals.

Scale: 12 / 14 / 16 / 20 / 24 / 32 / 48 / 64 / 96px

📏 Spacing System
Unit	Pixels	Usage
base	4px	Default gap / padding increment
scale	4 / 8 / 12 / 16 / 24 / 32 / 48 / 64 / 96 / 128	Margins, padding, grid gutters
Section Padding	96–128px vertical	Top/bottom of major sections

Notes:

Use multiples of 4 for all spacing to maintain rhythm.

Section padding can be adjusted for 3D-intensive areas to prevent crowding.

🌀 Motion Tokens
Token	Value	Usage
durationFast	150ms	Micro-interactions, hover effects
durationBase	300ms	Standard UI transitions
durationSlow	600ms	Section transitions, modal animations
durationCinematic	1200ms	Hero / page-level animations
easingEnter	cubic-bezier(0.22, 1, 0.36, 1)	Springy entrance animations
easingExit	cubic-bezier(0.55, 0, 1, 0.45)	Exit / fade animations
easingStandard	cubic-bezier(0.4, 0, 0.2, 1)	Default motion easing
scaleHover	1.03–1.05	Buttons, cards, subtle hover scale

Notes:

Always combine duration + easing for consistent UX feel.

Motion is subtle, never distracts from professional tone.

For reduced motion, fallback to fade-only.

✅ Usage Guidelines

All sections inherit these tokens.

No custom colors outside palette.

Typography hierarchy must be respected.

All spacing and motion tokens strictly applied for cohesion.

Accessibility always enforced: contrast, motion, focus states.