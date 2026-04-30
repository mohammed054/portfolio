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
  clients: 'dark',
  business: 'dark',
  shredder: 'dark',
  'contact-tease': 'light',
  contact: 'light',
  'golden-tie': 'light',
  handshake: 'light',
  'good-buy': 'light',
  footer: 'light',
};

export const COPY = {
  preloader: {
    line1: 'Shader Development Studio, Website',
    line2: 'Version 1.02',
    footer: 'Copyright (c) Shader Development Studio AB, 2026. All Rights Reserved.',
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
  business: {
    headline: 'For Companies Serious About Technology',
    col1:
      'We build interactive web experiences, 3D product tools, and AI-assisted interfaces for teams that need the internet to feel less ordinary. The work is playful on the surface, but the delivery is buttoned up where it counts.',
    col2:
      'Bring us a launch, a campaign, a prototype, or a strange digital problem with commercial consequences. We will help shape the idea, build the thing, and make sure it holds together when real customers arrive.',
  },
  shredder: {
    headline: "Had Enough Reading? Let's Shred This Thing.",
    subtext: "We've got one last trick up our sleeve.",
  },
  contactTease: {
    headlineLines: [
      'Still Not',
      "Convinced We're",
      'Serious About',
      'Business?',
    ],
    subtext: "We've got one last trick up our sleeve.",
  },
  goldenTie: {
    headline: 'Check Out This Golden Tie',
    subtext: 'You made it this far. You deserve a tie-break.',
  },
  contact: {
    headline: 'Contact',
    subtext: "Contact us about your digital project idea or general enquires. Let's interface, call us today!",
    ceoHeading: 'New business',
    ceoCopy: 'Reach out today to our CEO for new business enquiries at',
  },
} as const;

export const MODEL_PATHS = {
  heroComputer: '/models/70s_retro_computer_asset_-_old_commodore_pet.glb',
  shredderMachine: '/models/office_electronics_paper_shredder.glb',
} as const;

export const PROJECTS: Project[] = [
  {
    id: 1,
    name: 'eHealth Arena',
    category: '3D Showroom',
    url: 'https://www.shader.se/work/ehealth-arena',
    imageAvailable: true,
    images: { main: '/images/carousel/project-01-main.jpg' },
  },
  {
    id: 2,
    name: 'Select Concept',
    category: '3D Interior Designer',
    url: 'https://www.shader.se/work/select-concept',
    imageAvailable: true,
    images: { main: '/images/carousel/project-02-main.jpg' },
  },
  {
    id: 3,
    name: 'Gamily',
    category: 'Campaign Website',
    url: 'https://www.shader.se/work/gamily',
    imageAvailable: true,
    images: { main: '/images/carousel/project-03-main.jpg' },
  },
  {
    id: 4,
    name: 'Alamance Foods',
    category: 'Website',
    url: 'https://www.shader.se/work/alamance-foods',
    imageAvailable: true,
    images: { main: '/images/carousel/project-04-main.jpg' },
  },
  {
    id: 5,
    name: 'Norrk\u00f6pings Symfoniorkester',
    category: 'Website',
    url: 'https://www.shader.se/work/son',
    imageAvailable: true,
    images: { main: '/images/carousel/project-05-main.jpg' },
  },
  {
    id: 6,
    name: 'Glasbolaget',
    category: '3D Configurator',
    url: 'https://www.shader.se/work/glasbolaget',
    imageAvailable: true,
    images: { main: '/images/carousel/project-06-main.jpg' },
  },
  {
    id: 7,
    name: 'SPP Dream Generator',
    category: 'AI Image and Video Generator',
    url: 'https://www.shader.se/work/spp-dream-generator',
    imageAvailable: true,
    images: { main: '/images/carousel/project-07-main.jpg' },
  },
  {
    id: 8,
    name: 'ICA-nissen',
    category: 'AR Game',
    url: 'https://www.shader.se/work/ica-nissen',
    imageAvailable: true,
    images: { main: '/images/carousel/project-08-main.jpg' },
  },
  {
    id: 9,
    name: 'Norrk\u00f6pings Hamn',
    category: '3D Flow Visualization',
    url: 'https://www.shader.se/work/norrkopings-hamn',
    imageAvailable: true,
    images: { main: '/images/carousel/project-09-main.jpg' },
  },
  {
    id: 10,
    name: 'HEIP',
    category: '3D Visualisation',
    url: 'https://www.shader.se/work/heip',
    imageAvailable: true,
    images: { main: '/images/carousel/project-10-main.jpg' },
  },
  {
    id: 11,
    name: 'Design is Funny',
    category: 'Portfolio',
    url: 'https://www.shader.se/work/design-is-funny',
    imageAvailable: true,
    images: { main: '/images/carousel/project-11-main.jpg' },
  },
];

export const FEATURES = {
  enable3D: import.meta.env.VITE_ENABLE_3D !== 'false',
  enableGrain: import.meta.env.VITE_ENABLE_GRAIN !== 'false',
  enablePreloader: import.meta.env.VITE_ENABLE_PRELOADER !== 'false',
} as const;
