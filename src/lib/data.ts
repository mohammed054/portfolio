import type { ProjectData, SkillNode, TimelineMilestone, Testimonial } from '@/types';

export const projects: ProjectData[] = [
  {
    id: 'project-1',
    title: 'Stellar Design System',
    subtitle: 'Component Library',
    tags: ['React', 'TypeScript', 'Storybook', 'Figma'],
    year: '2024',
    description:
      'A production-grade design system powering 5+ products. Token-driven, accessible, and dark-mode first.',
    color: '#7A3CFF',
  },
  {
    id: 'project-2',
    title: 'Orbit Analytics',
    subtitle: 'Data Visualization Platform',
    tags: ['Next.js', 'D3.js', 'PostgreSQL', 'Redis'],
    year: '2024',
    description:
      'Real-time analytics dashboard processing 10M+ events/day with sub-second query performance.',
    color: '#00D0FF',
  },
  {
    id: 'project-3',
    title: 'Void CMS',
    subtitle: 'Headless Content Platform',
    tags: ['Node.js', 'GraphQL', 'MongoDB', 'AWS'],
    year: '2023',
    description:
      'A headless CMS built for editorial teams — custom block editor, real-time collaboration, CDN-first.',
    color: '#FF5C5C',
  },
  {
    id: 'project-4',
    title: 'Nebula Commerce',
    subtitle: 'E-commerce Infrastructure',
    tags: ['React', 'Shopify', 'Stripe', 'Edge Functions'],
    year: '2023',
    description:
      'High-conversion storefronts with edge-rendered product pages and one-click checkout flows.',
    color: '#00D0FF',
  },
];

export const skills: SkillNode[] = [
  { id: 's1', label: 'React', domain: 'frontend', level: 0.95, position: [2, 1, 0] },
  { id: 's2', label: 'Next.js', domain: 'frontend', level: 0.9, position: [-2, 1.5, 1] },
  { id: 's3', label: 'TypeScript', domain: 'frontend', level: 0.92, position: [0, 2, -1] },
  { id: 's4', label: 'Three.js', domain: 'frontend', level: 0.8, position: [1.5, -1, 2] },
  { id: 's5', label: 'GSAP', domain: 'frontend', level: 0.85, position: [-1.5, -1.5, 1.5] },
  { id: 's6', label: 'Node.js', domain: 'backend', level: 0.88, position: [2.5, 0, -1.5] },
  { id: 's7', label: 'GraphQL', domain: 'backend', level: 0.83, position: [-2.5, 0.5, -1] },
  { id: 's8', label: 'PostgreSQL', domain: 'backend', level: 0.8, position: [0, -2, -2] },
  { id: 's9', label: 'Docker', domain: 'devops', level: 0.75, position: [-1, 2.5, -1.5] },
  { id: 's10', label: 'AWS', domain: 'devops', level: 0.72, position: [1, -2.5, 0] },
  { id: 's11', label: 'Figma', domain: 'design', level: 0.9, position: [3, 1.5, 0.5] },
  { id: 's12', label: 'Framer', domain: 'design', level: 0.85, position: [-3, -1, 0.5] },
];

export const timeline: TimelineMilestone[] = [
  {
    year: '2019',
    title: 'First Line of Code',
    subtitle: 'Self-taught',
    description: 'Started with HTML/CSS, built first websites for local businesses.',
  },
  {
    year: '2020',
    title: 'Junior Developer',
    subtitle: 'Agency work',
    description: 'Joined a digital agency, shipped 12+ client projects in React.',
  },
  {
    year: '2021',
    title: 'Frontend Engineer',
    subtitle: 'SaaS startup',
    description:
      'Led frontend architecture of a B2B SaaS product from 0 to 50k users.',
  },
  {
    year: '2022',
    title: 'Senior Engineer',
    subtitle: 'Scale-up',
    description: 'Designed a component library adopted by 4 cross-functional teams.',
  },
  {
    year: '2023',
    title: 'Tech Lead',
    subtitle: 'Full-stack',
    description: 'Led a team of 5 engineers, introduced TypeScript and testing culture.',
  },
  {
    year: '2024',
    title: 'Independent',
    subtitle: 'Freelance & consulting',
    description: 'Building products for global clients. Obsessed with craft and performance.',
  },
];

export const testimonials: Testimonial[] = [
  {
    id: 't1',
    name: 'Sarah Chen',
    role: 'CTO',
    company: 'Orbit Labs',
    text: 'Mohammed rebuilt our frontend from scratch in 6 weeks — performance went from 42 to 98 on Lighthouse. He\'s the kind of engineer who makes the whole team better.',
  },
  {
    id: 't2',
    name: 'Alex Rivera',
    role: 'Product Lead',
    company: 'Voidspace',
    text: 'Working with Mohammed felt effortless. He translated our most complex product requirements into an interface that users actually love. Rare combination of engineer and designer.',
  },
  {
    id: 't3',
    name: 'Yuki Tanaka',
    role: 'Founder',
    company: 'Nebula Commerce',
    text: 'Shipped faster than any agency I\'ve worked with, and the code was cleaner. Mohammed doesn\'t just build features — he builds systems.',
  },
];
