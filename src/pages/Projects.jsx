import { useState } from 'react'
import Reveal from '../components/shared/Reveal'

const projects = [
  {
    id: '1',
    title: 'Scrapling CLI - YouTube Channel Analyzer',
    category: 'Automation & AI',
    subtitle: 'Python CLI for transcript-aware YouTube channel analysis and incremental fetching',
    github: 'https://github.com/mohammed054/scrapping-cli',
    demo: 'YouTube channel analysis tool with transcript resolution through multiple backends (youtube-transcript-api, yt-dlp, OpenAI ASR fallback), retry/cooldown handling, scoring/reporting logic (views, likes, comments, engagement), and pytest coverage',
    tags: ['Python', 'Scrapling', 'yt-dlp', 'youtube-transcript-api', 'OpenAI API', 'Rich', 'pytest', 'CSV', 'Markdown'],
    image: '/images/projects/scrapling.png',
    fullImage: '/images/projects/scrapling-full.png',
    preview: 'YouTube channel report with scored videos, engagement metrics, and CSV/Markdown exports',
    caption: '25 GitHub commits | Daily usage for channel monitoring',
  },
  {
    id: '2',
    title: 'WhatsApp Number Filter CLI',
    category: 'Browser Automation',
    subtitle: 'Node.js command-line tool for checking WhatsApp number availability and exporting validation results',
    github: 'https://github.com/mohammed054/bashify.git',  # Using existing repo
    demo: 'Uses whatsapp-web.js with Puppeteer and QR-based authentication. Supports persistent/temporary sessions, delay throttling, progress bars, CSV/output summary reports, phone number normalization, duplicate classification (valid, suspicious, blocked, invalid)',
    tags: ['Node.js', 'commander', 'whatsapp-web.js', 'Puppeteer', 'qrcode-terminal', 'cli-progress', 'CSV'],
    image: '/images/projects/whatsapp.png',
    fullImage: '/images/projects/whatsapp-full.png',
    preview: 'Number classification report with valid/suspicious/blocked/invalid categories',
    caption: '34 GitHub commits | Session-based authentication',
  },
  {
    id: '3',
    title: 'Quiz Extractor Chrome Extension',
    category: 'Browser Extensions',
    subtitle: 'Chrome Manifest V3 extension for extracting online quiz content into downloadable archives',
    github: 'https://github.com/mohammed054/leanGPT',
    demo: 'Content script waits for quiz question cards, extracts passages, question text, options, images, correct-answer signals, and quiz IDs from the page. Uses Tesseract.js OCR for English/Arabic image text extraction, canvas-based image preprocessing, and JSZip packaging. Background service worker handles blob downloads through the Chrome downloads API',
    tags: ['JavaScript', 'Chrome MV3', 'content scripts', 'service workers', 'Tesseract.js', 'JSZip', 'canvas', 'Chrome downloads API'],
    image: '/images/projects/quiz.png',
    fullImage: '/images/projects/quiz-full.png',
    preview: 'Quiz content extraction with OCR for Arabic/English text',
    caption: 'Extraction from live web pages with OCR fallback',
  },
  {
    id: '4',
    title: 'EduBridge - School Operations Platform',
    category: 'Full-Stack Web',
    subtitle: 'Large school-management platform with separate React frontend and Express/MongoDB backend',
    github: 'https://github.com/mohammed054/edu-bridge',
    demo: 'Backend includes JWT authentication, refresh/session handling, RBAC permission matrix, intelligence services for student/class/school recomputation, scheduled jobs, risk scoring, survey assignment synchronization, engagement events, and AI-assisted feedback/analytics workflows. Frontend uses React Router, lazy route loading, JWT refresh handling, local session hydration, admin/teacher/student portals, bilingual/Arabic-friendly UI, survey tools, reports, imports, notifications, and analytics views',
    tags: ['React', 'Vite', 'React Router', 'Express.js', 'MongoDB', 'Mongoose', 'JWT', 'RBAC', 'OpenRouter APIs', 'Tailwind CSS'],
    image: '/images/projects/edubridge.png',
    fullImage: '/images/projects/edubridge-full.png',
    preview: 'School dashboard with attendance, grades, reports, and student detail views',
    caption: '67 commits (edu-bridge) + 55 commits (edu-bridge-backend) | Pilot-ready SaaS',
  },
  {
    id: '5',
    title: 'SmartRoute - Shopping Route Optimizer',
    category: 'Mobile & AI',
    subtitle: 'React Native/Expo Android app prototype for optimizing shopping routes',
    github: 'https://github.com/mohammed054/route-app',
    demo: 'Parses typed shopping lists, normalizes and deduplicates items, matches known product aliases, generates demo product pricing when item is unknown, builds route candidates across store subsets, assigns each item to the cheapest store in the subset, calculates round-trip distance, fuel cost, time cost, item totals, and savings against a one-store baseline. Produces best-value, fastest, and balanced route options with item assignments, store order previews, cost summaries, route notes, and mobile-first screens',
    tags: ['React Native', 'Expo', 'TypeScript', 'route scoring', 'local demo data', 'mobile UI state machines'],
    image: '/images/projects/smartroute.png',
    fullImage: '/images/projects/smartroute-full.png',
    preview: 'Shopping route optimization with store pricing comparison',
    caption: 'Live on Railway; 12,769→28,989 products; 41% matching rate on prod runs',
  },
  {
    id: '6',
    title: 'AEIS - Autonomous Economic Intelligence System',
    category: 'Economic Intelligence',
    subtitle: 'Persistent digital organism engineered to create long-term economic value in the real digital economy',
    github: 'https://github.com/mohammed054/ai-workflow',
    demo: 'Philosophy: "Capture demand, don\\'t create it." Proven: 90+ cold emails = 0 replies. Shift to local classifieds/Marketplace/Nextdoor. Receptivity scoring (0-100): website presence, employee count, owner-operated, review activity. Hard rule: Receptivity < 50 → discard. Current revenue: $0 (Session 28, Jul 16, 2026). Strateic focus: Business owners, NOT developers (they build it themselves)',
    tags: ['Autonomous Economic Intelligence', 'Persistent memory', 'Economic patterns', 'Market intelligence', 'Failure analysis', 'Pricing strategies', 'Capture demand'],
    image: '/images/projects/aeis.png',
    fullImage: '/images/projects/aeis-full.png',
    preview: 'AEIS economic intelligence system dashboard',
    caption: '38 sessions documented | Strategy shifted from cold email to captured demand',
  },
  {
    id: '7',
    title: 'Barber Republic Dubai Landing Page',
    category: 'Non-Technical Business',
    subtitle: 'React + Three.js landing page for grooming lounge at Vida The Hills, Emirates Hills 2',
    github: 'https://github.com/mohammed054/pro71-web',
    demo: 'Precision cuts, beard lines, hot towels, and Fresha booking for Barber Republic at Vida The Hills, Dubai. Built with React, Vite, Three.js, and Tailwind CSS. Three.js scene includes custom window manager, desktop system simulation (boot, login, lock screen, taskbar, start menu), and polished interaction-heavy frontend work',
    tags: ['React', 'Vite', 'Three.js', 'React Three Fiber', 'Drei', 'GSAP', 'ScrollTrigger', 'Lenis', 'Framer Motion', 'Tailwind CSS'],
    image: '/images/projects/barber.png',
    fullImage: '/images/projects/barber-full.png',
    preview: 'Barber Republic Dubai grooming lounge landing page',
    caption: 'Non-technical business target | React + Three.js integration',
  },
  {
    id: '8',
    title: 'L-Arginine Pill Reminder Android App',
    category: 'Mobile Applications',
    subtitle: 'Native Android medication/reminder app with WorkManager scheduling',
    github: 'https://github.com/mohammed054/pill-app',
    demo: 'Native Android medication/reminder app. Uses Room entities for pills, pill history, and custom notification phrases, with database seeding for default phrases. Repository and ViewModel layers expose Flow/LiveData data streams and handle add/update/delete/toggle actions. WorkManager schedules periodic reminders with custom intervals, initial delay calculation, boot rescheduling, and cancellation/rescheduling logic. Notifications include privacy-aware text, vibration/sound/channel handling, and action buttons for "taken" or "skip" that write history entries through a broadcast receiver',
    tags: ['Kotlin', 'Android SDK', 'Room', 'WorkManager', 'LiveData', 'ViewModel', 'coroutines', 'Material components', 'RecyclerView'],
    image: '/images/projects/pill-reminder.png',
    fullImage: '/images/projects/pill-reminder-full.png',
    preview: 'Android pill reminder app with notification scheduling',
    caption: 'Native Android app with Room DB and WorkManager',
  },
]

function Projects() {
  const [filter, setFilter] = useState('all')

  const filteredProjects = filter === 'all' 
    ? projects 
    : projects.filter(p => p.category === filter)

  return (
    <section className="section-padding bg-white">
      <div className="container-main">
        <Reveal>
          <div className="text-center mb-16">
            <span className="inline-block text-[0.722rem] font-semibold tracking-[2px] uppercase mb-4" style={{ fontFamily: "'europa', sans-serif", color: '#A5A6AA' }}>
              My Projects
            </span>
            <h2 className="text-[clamp(28px,1.5rem+1.2vw,42px)] font-bold leading-tight" style={{ fontFamily: "'sofia-pro', 'europa', sans-serif", color: '#222733' }}>
              Real-World Work <span style={{ color: '#eab308' }}>•</span> Practical Solutions
            </h2>
          </div>
        </Reveal>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProjects.map((project) => (
            <Reveal key={project.id} delay={Math.random() * 0.2} variant="fadeUp">
              <div className="border rounded-lg overflow-hidden hover:shadow-2xl transition-shadow duration-300 group">
                <img
                  src={project.image}
                  alt={project.title}
                  className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="p-6">
                  <h3 className="text-xl font-bold mb-2" style={{ fontFamily: "'sofia-pro', 'europa', sans-serif" }}>{project.title}</h3>
                  <p className="text-[15px] text-white/60 mb-4" style={{ fontFamily: "'europa', sans-serif", color: '#A5A6AA' }}>{project.subtitle}</p>
                  
                  <div className="flex flex-wrap gap-2 mb-4">
                    {project.tags.map((tag, i) => (
                      <span
                        key={i}
                        className="inline-block px-3 py-1 text-[0.75rem] font-medium rounded-full bg-secondary/30 text-white"
                        style={{ fontFamily: "'europa', sans-serif" }}
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                  
                  <p className="text-[14px] text-white/60 line-clamp-2" style={{ fontFamily: "'europa', sans-serif", color: '#A5A6AA', overflow: 'hidden' }}>
                    {project.demo}
                  </p>
                  
                  <div className="mt-4 flex gap-2">
                    <a
                      href={project.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 bg-primary text-white px-4 py-2 rounded text-[14px] font-medium transition-colors hover:bg-primary/90"
                      style={{ fontFamily: "'europa', sans-serif" }}
                    >
                      GitHub →
                    </a>
                    {project.caption && (
                      <span className="text-[12px] text-white/40">
                        {project.caption}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </Reveal>
          ))}
        </div>

        <div className="mt-12 text-center">
          <button
            onClick={() => setFilter(filter === 'all' ? 'all' : 'all')}
            className="inline-flex items-center gap-2 px-6 py-3 text-[14px] font-medium text-white rounded bg-primary hover:bg-primary/90 transition-colors"
            style={{ fontFamily: "'europa', sans-serif" }}
          >
            View All {filter === 'all' ? 'Less' : 'All'} Projects
          </button>
        </div>
      </div>
    </section>
  )
}

export default Projects