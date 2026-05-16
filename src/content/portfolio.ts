export type ServiceId =
  | 'automation'
  | 'ai-ocr'
  | 'full-stack'
  | 'browser-mobile';

export interface PortfolioService {
  id: ServiceId;
  title: string;
  clientProblem: string;
  buildSummary: string;
  proofProjectIds: string[];
}

export interface PortfolioProject {
  id: string;
  name: string;
  serviceIds: ServiceId[];
  type: string;
  summary: string;
  problem: string;
  build: string;
  outcome: string;
  tech: string[];
  repoUrl: string;
  demoUrl?: string;
  featured?: boolean;
}

export interface ProcessStep {
  title: string;
  description: string;
}

export interface StackGroup {
  title: string;
  items: string[];
}

export const PROFILE = {
  name: 'Mohamed Hassoun',
  role: 'Freelance Software Developer',
  eyebrow: 'Mohamed Hassoun - Freelance Software Developer',
  headline: 'I build practical software for messy workflows.',
  summary:
    'Automation tools, AI/OCR pipelines, full-stack web apps, browser extensions, and mobile utilities for clients who need working systems, not decorative prototypes.',
  proofLine: [
    'React',
    'Next.js',
    'Node',
    'Python',
    'MongoDB',
    'Chrome Extensions',
    'Android',
  ],
  email: 'mohammed.hassoun054@gmail.com',
  emailHref:
    'mailto:mohammed.hassoun054@gmail.com?subject=Project%20inquiry',
  githubUrl: 'https://github.com/mohammed054',
  about: [
    'Mohamed is a freelance software developer focused on practical automation, full-stack web systems, AI-assisted tools, browser extensions, and mobile apps.',
    'He is strongest where workflows are messy and software can save time: repeated checks, scattered documents, slow admin processes, content operations, and data that needs to become useful output.',
    'His work spans Python, Node/Express, MongoDB, React/Next.js/Vite, Chrome MV3, Android Kotlin, OCR, and LLM integrations.',
  ],
} as const;

export const CONTACT = {
  heading: 'Have a workflow worth turning into software?',
  copy:
    'Send the problem, the current process, and what a useful result would look like.',
  email: PROFILE.email,
  emailHref: PROFILE.emailHref,
  githubUrl: PROFILE.githubUrl,
} as const;

export const SERVICES: PortfolioService[] = [
  {
    id: 'automation',
    title: 'Automation and Internal Tools',
    clientProblem:
      'Repetitive checks, scattered data, manual reporting, and admin workflows slow the team down.',
    buildSummary:
      'Scripts, dashboards, CLIs, data pipelines, import/export tooling, and small internal systems that make the workflow repeatable.',
    proofProjectIds: [
      'scrapling-cli',
      'wa-checker',
      'bd-organizer',
      'pro71-content-ops',
    ],
  },
  {
    id: 'ai-ocr',
    title: 'AI and OCR Workflows',
    clientProblem:
      'Documents, images, forms, quizzes, and raw text need to become clean structured output.',
    buildSummary:
      'OCR extraction, JSON/Excel outputs, AI-assisted parsing, and guarded LLM workflows with practical fallbacks.',
    proofProjectIds: [
      'quiz-extractor',
      'ocr-structured-excel',
      'bashify',
      'document-intelligence',
    ],
  },
  {
    id: 'full-stack',
    title: 'Full-Stack Web Apps',
    clientProblem:
      'A product, CMS, portal, or public website needs frontend and backend ownership.',
    buildSummary:
      'React and Next.js frontends, Express APIs, MongoDB/Mongoose models, auth, roles, uploads, admin flows, and deployment-ready structure.',
    proofProjectIds: [
      'edu-bridge',
      'school-cms',
      'pro71-web',
      'hassoun-ae',
    ],
  },
  {
    id: 'browser-mobile',
    title: 'Browser and Mobile Utilities',
    clientProblem:
      'Users need focused tools that live where the workflow already happens.',
    buildSummary:
      'Chrome extensions, Android apps, React Native prototypes, reminders, route optimizers, and performance helpers.',
    proofProjectIds: [
      'leangpt',
      'pill-reminder',
      'smartroute',
      'browser-os',
    ],
  },
];

export const PROJECTS: PortfolioProject[] = [
  {
    id: 'scrapling-cli',
    name: 'Scrapling CLI',
    serviceIds: ['automation'],
    type: 'Automation',
    summary:
      'Transcript-aware YouTube channel analysis with repeatable CSV and Markdown exports.',
    problem:
      'YouTube channel research is slow, and transcript coverage is inconsistent.',
    build:
      'Python CLI for channel fetches, transcript recovery, scoring, reports, CSV, and Markdown exports.',
    outcome:
      'Retry/cooldown logic, tests, and deterministic outputs support repeated analysis.',
    tech: ['Python', 'Scrapling', 'yt-dlp', 'OpenAI API', 'pytest'],
    repoUrl: 'https://github.com/mohammed054/scrapling-cli',
    featured: true,
  },
  {
    id: 'wa-checker',
    name: 'WA Checker',
    serviceIds: ['automation'],
    type: 'Automation',
    summary:
      'WhatsApp number validation CLI with QR auth, throttling, progress, and CSV outputs.',
    problem:
      'Contact lists need validation without manual checking one number at a time.',
    build:
      'Node CLI using WhatsApp Web authentication, throttled validation, progress tracking, and grouped exports.',
    outcome:
      'The tool turns a repeated manual verification task into a controlled batch workflow.',
    tech: ['Node.js', 'Puppeteer', 'whatsapp-web.js', 'CSV'],
    repoUrl: 'https://github.com/mohammed054/wha-filter',
    featured: true,
  },
  {
    id: 'bd-organizer',
    name: 'BD Organizer',
    serviceIds: ['automation'],
    type: 'Internal Tool',
    summary:
      'Guest and item claiming workflow with backend support for shared event planning.',
    problem:
      'Group event planning can become scattered across messages, lists, and split calculations.',
    build:
      'Frontend and backend workflow for item claiming, guest coordination, and split tracking.',
    outcome:
      'The project captures the core coordination path in a small purpose-built tool.',
    tech: ['React', 'Node.js', 'Express', 'MongoDB'],
    repoUrl: 'https://github.com/mohammed054/BD',
  },
  {
    id: 'pro71-content-ops',
    name: 'PRO71 Content Ops',
    serviceIds: ['automation'],
    type: 'Content Operations',
    summary:
      'File-backed content operations knowledge server for a public web presence.',
    problem:
      'Content teams need structured source material that can be edited and reused without a heavy CMS.',
    build:
      'Repository-backed content operations system with organized data and workflow notes.',
    outcome:
      'Content stays inspectable in Git while remaining ready for website and operations use.',
    tech: ['TypeScript', 'Content Ops', 'Git-backed Data'],
    repoUrl: 'https://github.com/pro71-ae/pro71-content-ops',
  },
  {
    id: 'quiz-extractor',
    name: 'Quiz Extractor',
    serviceIds: ['ai-ocr', 'browser-mobile'],
    type: 'Chrome Extension',
    summary:
      'Manifest V3 quiz extraction extension with image OCR and ZIP exports.',
    problem:
      'Quiz content can be split across page text, screenshots, answer blocks, and images.',
    build:
      'Browser extension that extracts questions, answers, images, and OCR text into downloadable archives.',
    outcome:
      'Arabic and English quiz material can be captured into portable structured files.',
    tech: ['Chrome MV3', 'Tesseract.js', 'JSZip', 'Canvas'],
    repoUrl: 'https://github.com/mohammed054/QuestionAnswer',
    featured: true,
  },
  {
    id: 'ocr-structured-excel',
    name: 'OCR to Structured Excel',
    serviceIds: ['ai-ocr'],
    type: 'OCR Workflow',
    summary:
      'PDF and image extraction workflow that turns visual documents into spreadsheet-ready output.',
    problem:
      'PDFs and images often contain useful information that is trapped outside spreadsheets.',
    build:
      'OCR processing pipeline for extracting text and shaping it into structured Excel output.',
    outcome:
      'The workflow creates editable tables from source material that would otherwise need retyping.',
    tech: ['Python', 'OCR', 'Excel', 'Data Cleaning'],
    repoUrl: 'https://github.com/mohammed054/ocr-to-structured-excel',
  },
  {
    id: 'bashify',
    name: 'Bashify',
    serviceIds: ['ai-ocr', 'full-stack'],
    type: 'AI Workflow',
    summary:
      'Natural-language to Bash translator with a guarded backend and usable frontend.',
    problem:
      'Terminal commands are powerful, but the exact syntax can slow people down or create risk.',
    build:
      'Full-stack translator that routes plain English through an Express API and Hugging Face inference.',
    outcome:
      'The app demonstrates AI assistance wrapped in a safer product surface.',
    tech: ['React', 'Vite', 'Node.js', 'Hugging Face', 'Web Audio'],
    repoUrl: 'https://github.com/mohammed054/bashify',
    featured: true,
  },
  {
    id: 'dirham-mirror',
    name: 'Dirham Mirror AI',
    serviceIds: ['ai-ocr'],
    type: 'AI Finance Prototype',
    summary:
      'Arabic-first personal finance habit mirror with optional AI guidance.',
    problem:
      'Small recurring spending choices can be hard to connect to longer-term goals.',
    build:
      'Interactive finance prototype that visualizes spending habits and adds optional AI interpretation.',
    outcome:
      'The project proves an Arabic-first AI-assisted product path for personal finance behavior.',
    tech: ['React', 'TypeScript', 'AI UX', 'Arabic UI'],
    repoUrl: 'https://github.com/mohammed054/hackathon-project',
  },
  {
    id: 'document-intelligence',
    name: 'Document Intelligence Pipeline',
    serviceIds: ['ai-ocr', 'automation'],
    type: 'Document Workflow',
    summary:
      'Document processing pipeline for extraction, parsing, and structured output.',
    problem:
      'Document-heavy workflows need reliable conversion from raw files into usable data.',
    build:
      'Processing pipeline for document ingestion, extraction, and structured result generation.',
    outcome:
      'The repository provides a practical foundation for document automation workflows.',
    tech: ['Python', 'Document AI', 'Structured Output'],
    repoUrl: 'https://github.com/mohammed054/document-intelligence-pipeline',
  },
  {
    id: 'edu-bridge',
    name: 'Edu Bridge',
    serviceIds: ['full-stack'],
    type: 'Full-Stack App',
    summary:
      'School operations platform with frontend, backend, auth, roles, analytics, and AI-assisted workflows.',
    problem:
      'School operations need connected tools for users, roles, surveys, notifications, and analytics.',
    build:
      'React portal with Express/MongoDB backend, RBAC, grade imports, notifications, analytics, and AI-assisted features.',
    outcome:
      'The project shows ownership across product UI, API design, data models, and admin operations.',
    tech: ['React', 'Express', 'MongoDB', 'JWT', 'OpenRouter'],
    repoUrl: 'https://github.com/mohammed054/edu-bridge',
    featured: true,
  },
  {
    id: 'school-cms',
    name: 'School CMS',
    serviceIds: ['full-stack'],
    type: 'CMS',
    summary:
      'Public school website and admin CMS with draft/publish flows, uploads, and SEO defaults.',
    problem:
      'A school website needs public pages and a protected admin workflow for updates.',
    build:
      'Dynamic website with separate admin CMS, Cloudinary uploads, session auth, SEO defaults, and testing.',
    outcome:
      'The system covers both public content presentation and private publishing operations.',
    tech: ['React', 'Express', 'Mongoose', 'Cloudinary', 'Vitest'],
    repoUrl: 'https://github.com/mohammed054/school-web',
    featured: true,
  },
  {
    id: 'pro71-web',
    name: 'PRO71 Web',
    serviceIds: ['full-stack'],
    type: 'Public Website',
    summary:
      'Next.js public website frontend connected to an organized content operations workflow.',
    problem:
      'A public brand site needs clear pages and maintainable content structure.',
    build:
      'Next.js frontend for PRO71 with repository-managed content and production-oriented structure.',
    outcome:
      'The project links frontend delivery with a content workflow that can be maintained over time.',
    tech: ['Next.js', 'TypeScript', 'Content Ops'],
    repoUrl: 'https://github.com/pro71-ae/pro71-web',
  },
  {
    id: 'hassoun-ae',
    name: 'Hassoun.ae',
    serviceIds: ['full-stack'],
    type: 'Brand Site',
    summary:
      'Personal brand and course website built with a modern Next.js stack.',
    problem:
      'A personal brand needs a fast public site that can present content and offerings clearly.',
    build:
      'Next.js site for a personal brand/course presence with structured page implementation.',
    outcome:
      'The repository shows a practical public web build for a real brand domain.',
    tech: ['Next.js', 'React', 'TypeScript'],
    repoUrl: 'https://github.com/ahassoun/hassoun.ae',
  },
  {
    id: 'cooperative',
    name: 'Cooperative',
    serviceIds: ['full-stack'],
    type: 'Landing Site',
    summary:
      'Animated React landing site for a cooperative-style concept.',
    problem:
      'A campaign or concept site needs a polished public-facing frontend.',
    build:
      'React landing page with motion and responsive presentation.',
    outcome:
      'The project demonstrates frontend polish without requiring a heavy application backend.',
    tech: ['React', 'Animation', 'Responsive CSS'],
    repoUrl: 'https://github.com/mohammed054/cooperative',
  },
  {
    id: 'leangpt',
    name: 'LeanGPT',
    serviceIds: ['browser-mobile'],
    type: 'Chrome Extension',
    summary:
      'Browser extension for reducing heavy DOM performance issues in ChatGPT sessions.',
    problem:
      'Long browser sessions can become sluggish when page DOM grows heavy.',
    build:
      'Chrome extension that manages DOM growth, optimization settings, and visible status indicators.',
    outcome:
      'The tool proves a focused extension can improve a workflow inside an existing web app.',
    tech: ['Chrome MV3', 'MutationObserver', 'DOM APIs'],
    repoUrl: 'https://github.com/mohammed054/leanGPT',
    featured: true,
  },
  {
    id: 'pill-reminder',
    name: 'Pill Reminder',
    serviceIds: ['browser-mobile'],
    type: 'Android App',
    summary:
      'Native Android reminder app with local storage, scheduled work, and notification handling.',
    problem:
      'Medication reminders need to survive app restarts and support simple taken/skip actions.',
    build:
      'Kotlin app using Room, ViewModel, WorkManager scheduling, notification channels, and boot rescheduling.',
    outcome:
      'The app demonstrates a native mobile utility with the background behavior users expect.',
    tech: ['Kotlin', 'Room', 'WorkManager', 'Material UI'],
    repoUrl: 'https://github.com/mohammed054/pill-app',
    featured: true,
  },
  {
    id: 'smartroute',
    name: 'SmartRoute',
    serviceIds: ['browser-mobile'],
    type: 'React Native App',
    summary:
      'Route optimizer prototype for shopping lists, store subsets, fuel, time, and value tradeoffs.',
    problem:
      'Shopping across stores creates tradeoffs between price, travel time, and route complexity.',
    build:
      'Expo prototype that parses lists, compares store subsets, estimates cost, and recommends route options.',
    outcome:
      'The project turns a fuzzy route-planning decision into ranked practical choices.',
    tech: ['React Native', 'Expo', 'TypeScript', 'Route Scoring'],
    repoUrl: 'https://github.com/mohammed054/route-app',
    featured: true,
  },
  {
    id: 'browser-os',
    name: 'Browser-Based OS',
    serviceIds: ['browser-mobile', 'full-stack'],
    type: 'Interactive Web App',
    summary:
      'Desktop-style browser portfolio system with windows, terminal, settings, and persistent UI state.',
    problem:
      'An interactive portfolio needs navigation that feels memorable while still running in the browser.',
    build:
      'React desktop simulation with window management, taskbar, file explorer, terminal commands, and persistence.',
    outcome:
      'The project proves complex browser UI state can be packaged into an approachable experience.',
    tech: ['React', 'Vite', 'Window Manager', 'localStorage'],
    repoUrl: 'https://github.com/mohammed054/Browser-Based-OS-System',
    featured: true,
  },
];

export const PROCESS_STEPS: ProcessStep[] = [
  {
    title: 'Diagnose',
    description:
      'Understand the current workflow, data, users, and desired output before writing the solution.',
  },
  {
    title: 'Prototype',
    description:
      'Build the smallest useful path and test the risky parts first.',
  },
  {
    title: 'Ship',
    description:
      'Turn the prototype into a usable interface, API, extension, script, or app.',
  },
  {
    title: 'Handoff',
    description:
      'Provide the repo, setup notes, environment requirements, and next-step recommendations.',
  },
];

export const STACK_GROUPS: StackGroup[] = [
  {
    title: 'Frontend',
    items: ['React', 'Next.js', 'Vite', 'TypeScript', 'Tailwind/CSS', 'Framer Motion'],
  },
  {
    title: 'Backend',
    items: ['Node.js', 'Express', 'MongoDB', 'Mongoose', 'REST APIs', 'Auth/RBAC'],
  },
  {
    title: 'Automation',
    items: ['Python', 'Scrapling', 'yt-dlp', 'Puppeteer', 'CSV/Markdown/Excel outputs'],
  },
  {
    title: 'AI/OCR',
    items: ['OpenAI-compatible APIs', 'Hugging Face', 'Tesseract.js', 'PaddleOCR-style workflows'],
  },
  {
    title: 'Extensions/Mobile',
    items: ['Chrome MV3', 'Android Kotlin', 'Room', 'WorkManager', 'React Native/Expo'],
  },
  {
    title: 'Quality',
    items: ['pytest', 'Vitest', 'React Testing Library', 'supertest', 'typed models'],
  },
];
