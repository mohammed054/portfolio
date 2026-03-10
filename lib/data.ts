export const personal = {
  name: 'Mohammed Al-Sayegh',
  initials: 'MS',
  tagline: 'Full Stack Developer · AI-Driven Product Builder',
  headline: 'Building thoughtful\ndigital systems.',
  subline:
    'I design and engineer performant web platforms that blend clean UX, robust backend architecture, and modern interactive visuals.',
  email: 'mohammed.dev@example.com',
  location: 'UAE',
  available: true,
  availabilityText: 'Available for freelance / full-time',
  social: {
    github: 'https://github.com/mohammed',
    linkedin: 'https://linkedin.com/in/mohammed',
    twitter: 'https://twitter.com/mohammed',
  },
}

export const timeline = [
  {
    id: 1,
    year: '2023',
    month: 'Sep',
    role: 'Education',
    company: 'High School · UAE',
    companyUrl: '#',
    summary: 'Focused on computer science and AI foundations while building first production-ready web projects.',
    tags: ['CS', 'AI', 'Algorithms'],
    color: 'var(--accent1)',
  },
  {
    id: 2,
    year: '2024',
    month: 'Jun',
    role: 'Skills Expansion',
    company: 'Independent Study',
    companyUrl: '#',
    summary: 'Deepened practical expertise in React, Express, MongoDB, Three.js, GSAP, and Framer Motion.',
    tags: ['React', 'Express', 'MongoDB', 'Three.js'],
    color: 'var(--accent2)',
  },
  {
    id: 3,
    year: '2025',
    month: 'Mar',
    role: 'Signature Project',
    company: 'Edu Bridge Platform',
    companyUrl: '#',
    summary: 'Built a full-stack school operations platform with AI-assisted workflows and 3D analytics dashboards.',
    tags: ['Next.js', 'Express', 'MongoDB', 'GSAP', 'AI'],
    color: 'var(--accent1)',
  },
  {
    id: 4,
    year: '2025+',
    month: 'Now',
    role: 'Growth',
    company: 'Open Source & Product Work',
    companyUrl: '#',
    summary: 'Continuing to ship impactful products and contribute to developer-focused tools and AI systems.',
    tags: ['Open Source', 'Product', 'AI'],
    color: 'var(--accent2)',
  },
]

export const skillDomains = [
  {
    id: 'engineering',
    label: 'Engineering / Dev',
    color: 'var(--accent1)',
    skills: [
      { name: 'React / Next.js', years: 4, proficiency: 90, tools: ['Redux', 'Zustand', 'RTK'] },
      { name: 'Express', years: 3, proficiency: 87, tools: ['REST APIs', 'Validation'] },
      { name: 'MongoDB', years: 3, proficiency: 84, tools: ['Aggregation', 'Indexes'] },
    ],
  },
  {
    id: 'three',
    label: '3D / Animations',
    color: 'var(--accent2)',
    skills: [
      { name: 'Three.js', years: 2, proficiency: 82, tools: ['R3F', 'Drei'] },
      { name: 'GSAP', years: 3, proficiency: 88, tools: ['ScrollTrigger', 'Timelines'] },
      { name: 'Framer Motion', years: 3, proficiency: 85, tools: ['Variants', 'Layout'] },
    ],
  },
  {
    id: 'ai',
    label: 'AI / Logic',
    color: 'var(--accent1)',
    skills: [
      { name: 'AI Workflows', years: 2, proficiency: 80, tools: ['Prompt Design', 'Evaluation'] },
      { name: 'Problem Solving', years: 5, proficiency: 90, tools: ['Algorithms', 'Optimization'] },
    ],
  },
  {
    id: 'design',
    label: 'Design / UX',
    color: 'var(--accent2)',
    skills: [
      { name: 'Layout Systems', years: 4, proficiency: 86, tools: ['Grid', 'Typography'] },
      { name: 'Accessibility', years: 3, proficiency: 84, tools: ['AA Contrast', 'Keyboard UX'] },
    ],
  },
]

export const projects = [
  {
    id: 1,
    tag: 'Web App',
    title: 'Edu Bridge',
    summary: 'Smart school platform improving administration, teaching workflows, and performance tracking.',
    description:
      'A unified school management platform built as a full-stack product with modern UX, automation, and analytics.',
    problem: 'Traditional school management workflows were fragmented, manual, and difficult to scale.',
    solution:
      'Designed a central platform with role-based workflows, reporting dashboards, and AI-assisted recommendations.',
    results: ['Reduced manual entry by 60%', 'Improved admin efficiency by 45%', 'Faster reporting turnaround'],
    stack: ['React', 'Express', 'MongoDB', 'Three.js', 'GSAP'],
    color: 'var(--accent1)',
    accentBg: 'var(--accent1-10)',
    liveUrl: '#',
    githubUrl: '#',
    featured: true,
  },
]

export const testimonials = [
  {
    id: 1,
    quote:
      'Mohammed built an outstanding school management platform — efficient, intuitive, and AI-powered. Highly recommended.',
    name: 'Sara Al-Mansoor',
    role: 'Principal',
    company: 'Edu Bridge Partner School',
    linkedIn: '#',
    featured: true,
  },
  {
    id: 2,
    quote:
      'The interface is simple but powerful. It drastically improved how we manage classes and track student performance.',
    name: 'Ayesha Khan',
    role: 'Teacher',
    company: 'Edu Bridge Partner School',
    linkedIn: '#',
    featured: false,
  },
  {
    id: 3,
    quote:
      'From frontend to backend, the platform is robust. Mohammed’s code is clean, performant, and easy to maintain.',
    name: 'Omar Al-Farsi',
    role: 'IT Manager',
    company: 'Edu Bridge Partner School',
    linkedIn: '#',
    featured: false,
  },
]
