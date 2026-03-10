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
  email: 'mohammed@example.com',
  socials: [
    { label: 'GitHub', href: 'https://github.com/' },
    { label: 'LinkedIn', href: 'https://linkedin.com/' },
    { label: 'Twitter/X', href: 'https://x.com/' },
  ] satisfies SocialLink[],
}

export const timeline: TimelineItem[] = [
  {
    id: '2023-education',
    year: '2023',
    title: 'Education',
    details: 'High school in UAE with a strong focus on computer science and AI fundamentals.',
    tags: ['CS', 'AI'],
  },
  {
    id: '2024-skills',
    year: '2024',
    title: 'Skills',
    details: 'Deepened practical expertise in React, Express, MongoDB, Three.js, GSAP, and Framer Motion.',
    tags: ['React', 'Express', 'MongoDB', 'Three.js'],
  },
  {
    id: '2025-signature',
    year: '2025',
    title: 'Signature Project',
    details: 'Built Edu Bridge, a full-stack school operations platform with analytics and AI-assisted workflows.',
    tags: ['Edu Bridge', 'Full Stack', 'AI'],
  },
  {
    id: '2025-growth',
    year: '2025+',
    title: 'Growth',
    details: 'Continuing to build impactful products, tools, and open-source contributions.',
    tags: ['Open Source', 'Product'],
  },
]

export const skillDomains: SkillDomain[] = [
  {
    id: 'engineering',
    label: 'Engineering / Dev',
    colorVar: 'var(--accent1)',
    nodes: [
      { name: 'React', years: 4, description: 'Component architecture and state modeling.', proficiency: 88 },
      { name: 'Express', years: 3, description: 'REST APIs and middleware design.', proficiency: 86 },
      { name: 'MongoDB', years: 3, description: 'Schema design and performance tuning.', proficiency: 84 },
    ],
  },
  {
    id: 'three',
    label: '3D / Animations',
    colorVar: 'var(--accent2)',
    nodes: [
      { name: 'Three.js', years: 2, description: 'Interactive, performant 3D scenes.', proficiency: 80 },
      { name: 'GSAP', years: 3, description: 'Scroll-driven cinematic interactions.', proficiency: 87 },
      { name: 'Framer Motion', years: 3, description: 'Accessible UI motion systems.', proficiency: 86 },
    ],
  },
  {
    id: 'ai',
    label: 'AI / Logic',
    colorVar: 'var(--accent1)',
    nodes: [
      { name: 'AI Algorithms', years: 2, description: 'Applied model workflows and evaluation.', proficiency: 78 },
      { name: 'Problem Solving', years: 5, description: 'Structured technical reasoning.', proficiency: 90 },
    ],
  },
  {
    id: 'design',
    label: 'Design / UX',
    colorVar: 'var(--accent2)',
    nodes: [
      { name: 'Layout', years: 4, description: 'Grid systems and visual hierarchy.', proficiency: 84 },
      { name: 'Accessibility', years: 3, description: 'AA contrast and keyboard-first UX.', proficiency: 86 },
    ],
  },
]

export const projects: Project[] = [
  {
    id: 'edu-bridge',
    title: 'Edu Bridge',
    tags: ['Web App', 'Full Stack'],
    summary: 'Smart school platform enhancing admin and teaching workflows.',
    stack: ['React', 'Express', 'MongoDB', 'Three.js', 'GSAP'],
    problem: 'Traditional school management was slow, fragmented, and data-poor.',
    solution: 'Built a unified platform with AI-assisted workflows and data-rich dashboards.',
    results: ['Reduced manual data entry by 60%', 'Improved admin efficiency by 45%'],
    image: '/dist/images/wallpaper.png',
    liveUrl: '#',
    githubUrl: '#',
  },
]

export const testimonials: Testimonial[] = [
  {
    id: 'sara',
    name: 'Sara Al-Mansoor',
    role: 'Principal',
    quote: 'Mohammed built an outstanding school management platform — efficient, intuitive, and AI-powered. Highly recommended.',
    link: '#',
  },
  {
    id: 'ayesha',
    name: 'Ayesha Khan',
    role: 'Teacher',
    quote: 'The interface is simple but powerful. It drastically improved how we manage classes and track student performance.',
    link: '#',
  },
  {
    id: 'omar',
    name: 'Omar Al-Farsi',
    role: 'IT Manager',
    quote: 'From frontend to backend, the platform is robust. Mohammed’s code is clean, performant, and easy to maintain.',
    link: '#',
  },
]
