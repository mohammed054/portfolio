📱 Responsive Strategy (Mobile-First)

Critical mistake most 3D portfolios make: desktop-only. We fix this upfront.

1. Device Breakpoints
Device Type	Width	Strategy
Mobile	<768px	Swap heavy 3D → CSS 3D / Lottie; simplified hero + skills
Tablet	768–1024px	Reduced 3D complexity; partial mesh detail; smaller particle counts
Desktop	>1024px	Full 3D experience: hero, particles, skills constellation, projects
2. 3D Fallback Strategy
const isMobile = useMediaQuery('(max-width: 768px)')
const prefersReducedMotion = useReducedMotion()

return isMobile || prefersReducedMotion ? <StaticHero /> : <ThreeHero />

StaticHero → lightweight canvas / CSS 3D animation / Lottie

ThreeHero → full Three.js + R3F mesh + particles + shader background

3. Reduced Motion & Accessibility

Respect prefers-reduced-motion

Disable 3D rotation, particle drift

Fade transitions only

Ensure text readability over any 3D scene

All interactive elements remain keyboard-navigable

3D always decorative, never essential for navigation

4. Section Responsiveness
Section	Mobile	Tablet	Desktop
Hero	Static mesh / Lottie	Simplified 3D	Full 3D + particles + shader
About / Timeline	Vertical stacked cards	Angled timeline, reduced path length	Full angled/diagonal timeline, 3D nodes
Skills	Static cluster / minimal nodes	Partial constellation	Full constellation, orbiting nodes, scroll-triggered rotation
Projects	Single column scroll	Split left/right layout	Cinematic sequence, alternating scenes, 3D hover tilt
Testimonials	Flat panels	Slight floating parallax	Subtle 3D depth layers, editorial layout
Contact	Full width form	Split screen form	Split screen + undulating 3D mesh background
5. Performance Guidelines per Device
Device	Target FPS	Asset Guidelines	Notes
Mobile	30fps	Reduce particle count, low-poly meshes, compressed textures	Avoid real-time shadows
Tablet	45fps	Medium poly meshes, partial particle count	Mix full/partial 3D
Desktop	60fps	Full mesh + particle effects	Maximum visual fidelity

Use adaptive quality detection (GPU tier via detect-gpu)

Lazy load below-fold content (IntersectionObserver)

Frame invalidation for R3F canvas (<Canvas frameloop="demand">)

6. Utility Hooks
// Media query hook
function useMediaQuery(query) {
  const [matches, setMatches] = useState(false);
  useEffect(() => {
    const media = window.matchMedia(query);
    if (media.matches !== matches) setMatches(media.matches);
    const listener = () => setMatches(media.matches);
    media.addListener(listener);
    return () => media.removeListener(listener);
  }, [matches, query]);
  return matches;
}

// Reduced motion hook
import { useReducedMotion } from 'framer-motion';

✅ Key Takeaways

Mobile-first mindset → always consider fallbacks for performance.

3D is enhancement, not a requirement for navigation.

Animations must respect user preferences (prefers-reduced-motion).

Section layouts adapt diagonally, vertically, or cinematic depending on device width.

Performance and smoothness are non-negotiable.