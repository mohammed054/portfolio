import type { NavLink, Project } from '../types';

export const CONTACT = {
  email: 'hello@shader.se',
  ceoEmail: 'ceo@shader.se',
  calUrl: 'https://cal.com/simon-hedlund-kglzne',
  address: {
    street: 'Laxholmstorget 3',
    city: '602 21 Norrk\u00f6ping',
    country: 'Sweden',
  },
  social: {
    linkedin: 'https://linkedin.com/company/shadersweden/',
    instagram: 'https://instagram.com/shadersweden/',
    twitter: 'https://x.com/shadersweden',
  },
  copyright: '\u00a9 Shader Sweden AB. All Rights Reserved.',
  tagline: 'A High Tech Business Solutions Company',
} as const;

export const NAV_LINKS: NavLink[] = [
  { label: 'Home', href: '#home', sectionId: 'home' },
  { label: 'Selected Work', href: '#work', sectionId: 'work' },
  { label: 'About Us', href: '#about-us', sectionId: 'about-us' },
  { label: 'Contact', href: '#contact', sectionId: 'contact' },
];

export const SECTION_THEMES: Record<string, 'light' | 'dark'> = {
  home: 'light',
  work: 'light',
  'about-us': 'light',
  'about-copy': 'dark',
  'about-vintage': 'dark',
  shredder: 'dark',
  contact: 'light',
  'golden-tie': 'light',
  handshake: 'light',
  'good-buy': 'light',
  footer: 'light',
};

export const COPY = {
  preloader: {
    line1: 'Shader Development Studio, Website /',
    line2: 'Version 1.02',
    footer: '\u00a9 Shader Sweden AB. All Rights Reserved.',
  },
  hero: {
    headline: ['A Creative', 'Development', 'Studio, Plugged', 'into the Future'],
    subCta: 'Scroll to Inspect Our Closed Deals',
  },
  selectedWork: {
    title: 'Selected Work',
    subtitle: 'Browse our project carousel to explore our selected work.',
  },
  aboutHero: {
    title: 'About Us',
  },
  aboutCopy: {
    headline: 'Making Digital Storytelling More Playful, Powerful, and Alive',
    col1:
      "Shader is a creative development studio specialized in building interactive 3D and AI solutions for the web. Serious about business, based in Sweden, and working with brands, agencies and designers worldwide. Plugged into the future. While we're a small team of creative engineers, we have a hand-picked network of collaborators: designers, 3D artists, copywriters, animators, and creative technologists, ready to plug in with an array of capabilities.",
    col2:
      "This modular approach means we can scale and adapt to each challenge. Whether it's a WebGL experiment, an interactive product visualization, a mobile app, or an AI-driven experience, we help bold brands stand out across every screen. We build storytelling platforms that demand attention and reward curiosity. We push digital mediums to places you haven't seen before, and have fun doing it. Beyond code, we offer 3D design and animation, UI and motion design, concepts and digital strategy, full-stack development, and creative consulting.",
    col3:
      "Whether it's prototyping an idea, launching an augmented reality experience, or bringing high-fidelity visuals to life, Shader bridges the gap between creative ambition and technical execution. Our process is hands-on, collaborative, and tailored for teams that value both craft and innovation. We combine technical expertise with a designer's eye, ensuring that every interaction feels natural and every pixel is perfectly placed. We're not your regular IT department. We don't troubleshoot printers.",
  },
} as const;

export const MODEL_PATHS = {
  heroComputer: '/models/70s_retro_computer_asset_-_old_commodore_pet.glb',
} as const;

export const PROJECTS: Project[] = [
  {
    id: 1,
    name: 'Design is Funny',
    category: 'Brand Identity',
    url: '#',
    imageAvailable: false,
    images: { main: '/images/carousel/project-01-main.webp' },
  },
  {
    id: 2,
    name: 'eHealth Arena',
    category: '3D Showroom',
    url: '#',
    imageAvailable: false,
    images: { main: '/images/carousel/project-02-main.webp' },
  },
  {
    id: 3,
    name: 'Untitled 03',
    category: 'Web Experience',
    url: '#',
    imageAvailable: false,
    images: { main: '/images/carousel/project-03-main.webp' },
  },
  {
    id: 4,
    name: 'Untitled 04',
    category: 'Interactive Prototype',
    url: '#',
    imageAvailable: false,
    images: { main: '/images/carousel/project-04-main.webp' },
  },
  {
    id: 5,
    name: 'Untitled 05',
    category: 'Motion Design',
    url: '#',
    imageAvailable: false,
    images: { main: '/images/carousel/project-05-main.webp' },
  },
  {
    id: 6,
    name: 'Untitled 06',
    category: 'Brand Campaign',
    url: '#',
    imageAvailable: false,
    images: { main: '/images/carousel/project-06-main.webp' },
  },
  {
    id: 7,
    name: 'Untitled 07',
    category: 'Product Visualization',
    url: '#',
    imageAvailable: false,
    images: { main: '/images/carousel/project-07-main.webp' },
  },
  {
    id: 8,
    name: 'Untitled 08',
    category: 'AI Experience',
    url: '#',
    imageAvailable: false,
    images: { main: '/images/carousel/project-08-main.webp' },
  },
  {
    id: 9,
    name: 'Untitled 09',
    category: 'Creative Technology',
    url: '#',
    imageAvailable: false,
    images: { main: '/images/carousel/project-09-main.webp' },
  },
  {
    id: 10,
    name: 'Untitled 10',
    category: 'Digital Strategy',
    url: '#',
    imageAvailable: false,
    images: { main: '/images/carousel/project-10-main.webp' },
  },
  {
    id: 11,
    name: 'Untitled 11',
    category: 'Full-Stack Build',
    url: '#',
    imageAvailable: false,
    images: { main: '/images/carousel/project-11-main.webp' },
  },
];

export const FEATURES = {
  enable3D: import.meta.env.VITE_ENABLE_3D !== 'false',
  enableGrain: import.meta.env.VITE_ENABLE_GRAIN !== 'false',
  enablePreloader: import.meta.env.VITE_ENABLE_PRELOADER !== 'false',
} as const;
