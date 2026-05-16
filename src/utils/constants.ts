import type { NavLink, Project } from '../types';
import { CONTACT as PORTFOLIO_CONTACT, PROFILE } from '../content/portfolio';

export const CONTACT = {
  name: PROFILE.name,
  email: PORTFOLIO_CONTACT.email,
  ceoEmail: PORTFOLIO_CONTACT.email,
  calUrl: PORTFOLIO_CONTACT.emailHref,
  address: {
    street: 'United Arab Emirates',
    city: 'Dubai',
    country: 'Remote-friendly',
  },
  social: {
    github: PORTFOLIO_CONTACT.githubUrl,
    linkedin: PORTFOLIO_CONTACT.githubUrl,
    instagram: PORTFOLIO_CONTACT.githubUrl,
    twitter: PORTFOLIO_CONTACT.githubUrl,
  },
  copyright: '(c) Mohamed Hassoun, 2026. All Rights Reserved.',
  tagline: 'Full-stack software developer for automation, AI workflows, and useful web systems',
} as const;

export const NAV_LINKS: NavLink[] = [
  { label: 'Home', href: '#home', sectionId: 'home' },
  { label: 'Services', href: '#services', sectionId: 'services' },
  { label: 'Work', href: '#work', sectionId: 'work' },
  { label: 'Process', href: '#process', sectionId: 'process' },
  { label: 'Contact', href: '#contact', sectionId: 'contact' },
];

export const SECTION_THEMES: Record<string, 'light' | 'dark'> = {
  home: 'dark',
  services: 'dark',
  proof: 'dark',
  work: 'dark',
  process: 'dark',
  about: 'dark',
  contact: 'dark',
  'about-us': 'light',
  'about-copy': 'dark',
  'about-vintage': 'dark',
  clients: 'dark',
  business: 'dark',
  shredder: 'dark',
  'contact-tease': 'light',
  'golden-tie': 'light',
  handshake: 'light',
  'good-buy': 'light',
  footer: 'light',
};

export const COPY = {
  preloader: {
    line1: 'Mohamed Hassoun, Portfolio',
    line2: 'Build 2026.05',
    footer: 'Copyright (c) Mohamed Hassoun, 2026. All Rights Reserved.',
  },
  hero: {
    headline: ['Mohamed', 'Hassoun', 'Builds Practical', 'AI Software'],
    subCta: 'Scroll to inspect projects from GitHub',
  },
  selectedWork: {
    title: 'Selected Projects',
    subtitle: 'A carousel of real repositories, prototypes, tools, and shipped systems.',
  },
  aboutHero: {
    title: 'About Mohamed',
  },
  aboutCopy: {
    headline: 'Turning Messy Workflows Into Usable Software',
    col1:
      'I am Mohamed Hassoun, a software developer focused on practical automation, full-stack web systems, AI-assisted tools, browser extensions, and mobile applications. My work tends to start where the workflow is messy: scattered documents, slow websites, manual checking, school operations, content systems, or data that needs to become useful output.',
    col2:
      'Across the local GitHub workspace, the same pattern shows up again and again: React and Next.js frontends, Express and MongoDB backends, Python CLIs, Chrome Manifest V3 extensions, Android Kotlin apps, OCR, LLM integrations, Three.js interfaces, and enough testing and operational care to make prototypes feel sturdy.',
    col3:
      'I like building software that is direct, useful, and a little memorable: tools that parse, classify, translate, optimize, visualize, remind, extract, and ship.',
  },
  business: {
    headline: 'Available for Practical Product Builds',
    col1:
      'Bring a workflow that wastes time, a product idea that needs shape, or a data problem that keeps coming back. I can help design the interface, build the backend, wire AI/OCR where it genuinely helps, and package the result into something people can use.',
    col2:
      'The strongest fit is hands-on product work: automation dashboards, internal tools, web apps, Chrome extensions, AI-assisted pipelines, content systems, and polished portfolio or campaign sites with real engineering under the surface.',
  },
  shredder: {
    headline: 'No Placeholder Case Studies Here.',
    subtext: 'Every project in this portfolio is pulled from the local GitHub workspace.',
  },
  contactTease: {
    headlineLines: ['Need', 'Automation,', 'AI Tools,', 'or a Web App?'],
    subtext: 'Send the problem. I will turn it into a working path.',
  },
  goldenTie: {
    headline: 'Built With Craft, Shipped With Receipts',
    subtext: 'Repos, prototypes, scripts, tests, and interfaces, all in one working trail.',
  },
  contact: {
    headline: 'Contact',
    subtext: 'For freelance builds, automation work, AI-assisted tools, and full-stack web projects, reach out directly.',
    ceoHeading: 'Direct contact',
    ceoCopy: 'Email Mohamed at',
  },
} as const;

export const MODEL_PATHS = {
  heroComputer: '/models/70s_retro_computer_asset_-_old_commodore_pet.glb',
  shredderMachine: '/models/office_electronics_paper_shredder.glb',
} as const;

export const PROJECTS: Project[] = [
  {
    id: 1,
    name: 'Scrapling CLI',
    category: 'Python Automation / YouTube Analysis',
    url: 'https://github.com/mohammed054/scrapling-cli',
    description:
      'Transcript-aware YouTube channel analysis with incremental fetching, retry logic, CSV/Markdown reporting, and scored channel summaries.',
    tech: ['Python', 'Scrapling', 'yt-dlp', 'OpenAI', 'pytest'],
    imageAvailable: false,
  },
  {
    id: 2,
    name: 'Edu Bridge',
    category: 'School Operations Platform',
    url: 'https://github.com/mohammed054/edu-bridge',
    description:
      'React school portal paired with an Express/MongoDB backend for RBAC, surveys, notifications, analytics, grade imports, and AI-assisted workflows.',
    tech: ['React', 'Express', 'MongoDB', 'JWT', 'OpenRouter'],
    imageAvailable: false,
  },
  {
    id: 3,
    name: 'School CMS',
    category: 'Public Site + Admin Backend',
    url: 'https://github.com/mohammed054/school-web',
    description:
      'A dynamic school website with a separate admin CMS, draft/publish flows, Cloudinary uploads, session auth, SEO defaults, and test coverage.',
    tech: ['React', 'Express', 'Mongoose', 'Cloudinary', 'Vitest'],
    imageAvailable: false,
  },
  {
    id: 4,
    name: 'Bashify',
    category: 'Natural Language to Bash',
    url: 'https://github.com/mohammed054/bashify',
    description:
      'Full-stack translator that turns plain English into safer Bash commands through a guarded Express API and Hugging Face inference.',
    tech: ['React', 'Vite', 'Node.js', 'Hugging Face', 'Web Audio'],
    imageAvailable: false,
  },
  {
    id: 5,
    name: 'Browser-Based OS',
    category: 'Interactive Portfolio System',
    url: 'https://github.com/mohammed054/Browser-Based-OS-System',
    description:
      'A browser-native desktop simulation with window management, terminal commands, settings, taskbar, file explorer, resume, projects, and persistent UI state.',
    tech: ['React', 'Vite', 'Window Manager', 'localStorage'],
    imageAvailable: false,
  },
  {
    id: 6,
    name: 'Dirham Mirror AI',
    category: 'Arabic-First Finance Prototype',
    url: 'https://github.com/mohammed054/hackathon-project',
    description:
      'A personal finance habit mirror that shows how small recurring spending choices can shape a future goal, with optional AI guidance.',
    tech: ['React', 'TypeScript', 'AI UX', 'Arabic UI'],
    imageAvailable: false,
  },
  {
    id: 7,
    name: 'Quiz Extractor',
    category: 'Chrome Extension / OCR',
    url: 'https://github.com/mohammed054/QuestionAnswer',
    description:
      'Manifest V3 extension that extracts quiz questions, answers, images, and Arabic/English OCR text into downloadable ZIP archives.',
    tech: ['Chrome MV3', 'Tesseract.js', 'JSZip', 'Canvas'],
    imageAvailable: false,
  },
  {
    id: 8,
    name: 'LeanGPT',
    category: 'Browser Performance Extension',
    url: 'https://github.com/mohammed054/leanGPT',
    description:
      'Chrome extension for improving ChatGPT page performance by managing heavy DOM growth, persisted optimization settings, and visual indicators.',
    tech: ['Chrome MV3', 'MutationObserver', 'DOM APIs'],
    imageAvailable: false,
  },
  {
    id: 9,
    name: 'WA Checker',
    category: 'WhatsApp Validation CLI',
    url: 'https://github.com/mohammed054/wha-filter',
    description:
      'Command-line tool for checking which phone numbers have active WhatsApp accounts, with QR auth, throttling, progress, CSV, and grouped outputs.',
    tech: ['Node.js', 'Puppeteer', 'whatsapp-web.js', 'CSV'],
    imageAvailable: false,
  },
  {
    id: 10,
    name: 'Pill Reminder',
    category: 'Native Android App',
    url: 'https://github.com/mohammed054/pill-app',
    description:
      'Kotlin reminder app using Room, ViewModel, WorkManager scheduling, notification channels, boot rescheduling, and taken/skip actions.',
    tech: ['Kotlin', 'Room', 'WorkManager', 'Material UI'],
    imageAvailable: false,
  },
  {
    id: 11,
    name: 'SmartRoute',
    category: 'React Native Route Optimizer',
    url: 'https://github.com/mohammed054/route-app',
    description:
      'Expo prototype that parses shopping lists, compares store subsets, estimates fuel/time cost, and recommends best-value, fastest, and balanced routes.',
    tech: ['React Native', 'Expo', 'TypeScript', 'Route Scoring'],
    imageAvailable: false,
  },
];

export const FEATURES = {
  enable3D: import.meta.env.VITE_ENABLE_3D !== 'false',
  enableGrain: import.meta.env.VITE_ENABLE_GRAIN !== 'false',
  enablePreloader: import.meta.env.VITE_ENABLE_PRELOADER !== 'false',
} as const;
