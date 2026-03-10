10-contact-cta.md
📬 Contact / Call to Action

Concept: Split-screen design, minimal 3D background, modern form UX, clear availability and social links.

1. Layout

Left Panel:

Headline: "Let's build something."

Short subline: "Reach out to discuss your next project or collaboration."

Availability badge (green / amber dot)

Social links: GitHub, LinkedIn, Twitter/X (Dribbble optional)

Right Panel:

Clean contact form: Name / Email / Message

Inline validation and feedback

Submit button with subtle animation

Responsive:

Mobile: stacked vertical layout, social links below form

Tablet: split layout with slightly reduced spacing

Desktop: full split-screen

2. Availability Badge
● Available for freelance / full-time  (green dot, subtle pulse)
● Currently not taking new projects    (amber dot)

Signals your human presence

Updates manually → shows thoughtfulness

3. Form UX
Step	Interaction
Input	Real-time validation (errors inline, no popups)
Submit	Button morphs → shows spinner
Success	Particle burst → button text → "Sent ✓" → fields reset
Error	Gentle shake → inline error message

Backend: Express API or Formspree integration (simple, reliable)

4. 3D Background (Subtle)

Slow undulating low-poly wireframe mesh

Accent gradient colors, minimal motion

Reacts gently to cursor movement (wave effect)

Does not distract from form readability

5. Social Links
GitHub · LinkedIn · Twitter/X · Dribbble (optional)

Custom SVG icons

24px consistent size

Hover: accent color + scale 1.1

6. Accessibility

All form fields focusable via keyboard

ARIA labels for inputs, live region for success/error feedback

Color contrast meets AA for body text

Reduced motion respected → subtle fade instead of 3D mesh animation

7. Example Copy

Left Panel:

Headline: "Let's build something."
Subline: "Reach out to discuss your next project or collaboration."
Availability: "● Available for freelance / full-time"

Right Panel (Form Fields):

Name: [_________]
Email: [_________]
Message: [_________]
[Send Message →]