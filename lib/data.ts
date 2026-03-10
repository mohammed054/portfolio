export type SocialLink = {
  label: string
  href: string
}

export type TimelineItem = {
  id: string
  year: string
  title: string
  details: string
  tags: string[]
}

export type SkillNode = {
  name: string
  years: number
  description: string
  proficiency: number
}

export type SkillDomain = {
  id: string
  label: string
  colorVar: string
  nodes: SkillNode[]
}

export type Project = {
  id: string
  title: string
  tags: string[]
  summary: string
  stack: string[]
  problem: string
  solution: string
  results: string[]
  image: string
  liveUrl: string
  githubUrl: string
  ambientVar: string
}

export type Testimonial = {
  id: string
  quote: string
  name: string
  role: string
  link: string
}

export const profile = {
  name: 'Mohammed Hassoun',
  initials: 'MH',
  eyebrow: 'Full Stack Engineer · AI Specialist',
  subline: 'I build things that matter.',
  heroCta: 'Explore My Universe →',
  contactHeadline: "Let's build something.",
  contactSubline: 'Reach out to discuss your next project or collaboration.',
  availability: 'Available for freelance / full-time',
  available: true,
  socials: [
    { label: 'GitHub', href: 'https://github.com/mohammedhassoun' },
    { label: 'LinkedIn', href: 'https://www.linkedin.com/in/mohammedhassoun' },
    { label: 'Twitter/X', href: 'https://x.com/mohammedhassoun' },
  ] satisfies SocialLink[],
}

export const timeline: TimelineItem[] = [
  {
    id: '2023-education',
    year: '2023',
    title: 'Education',
    details: 'High school, UAE — focused on computer science fundamentals and applied AI problem solving.',
    tags: ['Computer Science', 'AI'],
  },
  {
    id: '2024-skill-growth',
    year: '2024',
    title: 'Skills',
    details: 'Expanded production skills across React, Express, MongoDB, Three.js, GSAP, and Framer Motion.',
    tags: ['React', 'Express', 'MongoDB', 'Three.js'],
  },
  {
    id: '2025-signature-project',
    year: '2025',
    title: 'Signature Project',
    details: 'Built Edu Bridge, a full-stack platform for school operations with AI-assisted workflow automation.',
    tags: ['Edu Bridge', 'Full Stack', 'Analytics'],
  },
  {
    id: '2025-growth',
    year: '2025+',
    title: 'Growth',
    details: 'Continuing to ship user-centered products, AI tooling, and open-source contributions.',
    tags: ['Open Source', 'Product Systems'],
  },
]

export const skillDomains: SkillDomain[] = [
  {
    id: 'engineering',
    label: 'Engineering / Dev',
    colorVar: 'var(--accent1)',
    nodes: [
      { name: 'React', years: 4, description: 'Component architecture and state modeling.', proficiency: 88 },
      { name: 'Express', years: 3, description: 'REST APIs and resilient middleware design.', proficiency: 84 },
      { name: 'MongoDB', years: 3, description: 'Schema design and indexed query optimization.', proficiency: 82 },
    ],
  },
  {
    id: 'three',
    label: '3D / Animations',
    colorVar: 'var(--accent2)',
    nodes: [
      { name: 'Three.js', years: 2, description: 'Interactive, optimized real-time scenes.', proficiency: 80 },
      { name: 'GSAP', years: 3, description: 'Scrubbed scroll choreography and camera systems.', proficiency: 86 },
      { name: 'Framer Motion', years: 3, description: 'Accessible UI motion for polished interfaces.', proficiency: 85 },
    ],
  },
  {
    id: 'ai',
    label: 'AI / Logic',
    colorVar: 'var(--accent1)',
    nodes: [
      { name: 'AI Algorithms', years: 2, description: 'Applied intelligent workflow design.', proficiency: 78 },
      { name: 'Problem Solving', years: 5, description: 'Structured technical decision making.', proficiency: 90 },
    ],
  },
  {
    id: 'design',
    label: 'Design / UX',
    colorVar: 'var(--accent2)',
    nodes: [
      { name: 'Layout Systems', years: 4, description: 'Spatial hierarchy and composition.', proficiency: 84 },
      { name: 'Accessibility', years: 3, description: 'AA contrast and keyboard-first UX.', proficiency: 88 },
    ],
  },
]

export const projects: Project[] = [
  {
    id: 'edu-bridge',
    title: 'Edu Bridge',
    tags: ['Web App', 'Full Stack'],
    summary: 'Smart school platform enhancing administration and teaching workflows.',
    stack: ['React', 'Express', 'MongoDB', 'Three.js'],
    problem: 'Traditional school management was fragmented, manual, and data-poor.',
    solution: 'Designed a unified platform with AI-assisted workflow automation and dashboard-driven decisions.',
    results: ['Reduced manual data entry by 60%', 'Improved administration efficiency by 45%'],
    image: '/dist/images/wallpaper.png',
    liveUrl: 'https://example.com/edu-bridge',
    githubUrl: 'https://github.com/mohammedhassoun/edu-bridge',
    ambientVar: 'var(--accent1)',
  },
]

export const testimonials: Testimonial[] = [
  {
    id: 'sara',
    name: 'Sara Al-Mansoor',
    role: 'Principal',
    quote: 'Mohammed built an outstanding school management platform — efficient, intuitive, and AI-powered. Highly recommended.',
    link: 'https://www.linkedin.com',
  },
  {
    id: 'ayesha',
    name: 'Ayesha Khan',
    role: 'Teacher',
    quote: 'The interface is simple but powerful. It drastically improved how we manage classes and track student performance.',
    link: 'https://www.linkedin.com',
  },
  {
    id: 'omar',
    name: 'Omar Al-Farsi',
    role: 'IT Manager',
    quote: 'From frontend to backend, the platform is robust. Mohammed’s code is clean, performant, and easy to maintain.',
    link: 'https://www.linkedin.com',
  },
]

export const theme = { accent1: "#4F8EF7", accent2: "#8B5CF6", textPrimary: "#F0F4FF" } as const
