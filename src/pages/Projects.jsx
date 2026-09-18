import { useState } from 'react'
import Reveal from '../components/shared/Reveal'

const projects = [
  {
    id: '1',
    title: 'SmartRoute - Route Optimization Engine',
    category: 'Full-Stack Application',
    subtitle: 'Web scraping + OCR + Route optimization + Price history management',
    github: 'https://github.com/mohammed054/route-app',
    demo: 'Literal full-scale app handling: web scraping for prices, Tesseract.js OCR for thousands of pages, route optimization algorithms, discount handling, price history tracking, store subset analysis, cost summaries (fuel, time, distance), and mobile-first screens. Built with React Native/Expo, TypeScript, and sophisticated backend pipelines.',
    tags: ['React Native', 'Expo', 'TypeScript', 'Python', 'Web Scraping', 'Tesseract OCR', 'Route Algorithms', 'Node.js', 'Express', 'MongoDB'],
    image: '/images/projects/smartroute.png',
    fullImage: '/images/projects/smartroute-full.png',
    preview: 'Route optimization dashboard with store pricing, calculated routes, and cost summaries',
    caption: 'Highest-scale project | 12,769→28,989 products | Live on Railway | 41% matching rate on prod runs',
  },
  {
    id: '2',
    title: 'EduBridge - School Operations SaaS',
    category: 'Education Technology',
    subtitle: 'Full school-management platform with admin/teacher/student portals',
    github: 'https://github.com/mohammed054/edu-bridge',
    demo: 'React/Vite frontend + Express/Mongoose backend. Admin/teacher/student portals for attendance, schedules, grades, feedback, surveys, broadcasts, notifications, calendars, report cards, campus filtering. Real-time Socket.io notifications, bilingual Arabic/English UI, RBAC permission matrix, intelligence services for student/class/school recomputation. Ready for controlled paid pilot.',
    tags: ['React', 'Vite', 'Express.js', 'MongoDB', 'Mongoose', 'Socket.io', 'JWT', 'RBAC', 'Tailwind CSS', 'Arabic UI'],
    image: '/images/projects/edubridge.png',
    fullImage: '/images/projects/edubridge-full.png',
    preview: 'School dashboard with attendance, grades, reports, and student detail views',
    caption: '67 commits (frontend) + 55 commits (backend) | Pilot-ready SaaS',
  },
  {
    id: '3',
    title: 'Scrapling CLI - YouTube Channel Analyzer',
    category: 'Automation & AI',
    subtitle: 'Python CLI for transcript-aware YouTube analysis and incremental fetching',
    github: 'https://github.com/mohammed054/scrapping-cli',
    demo: 'Python CLI built around Scrapling, transcript resolution through multiple backends (youtube-transcript-api, yt-dlp, OpenAI ASR fallback), retry/cooldown handling, scoring/reporting logic (views, likes, comments, engagement), deterministic Markdown/CSV exports, pytest coverage. 25 GitHub commits | Daily usage for channel monitoring.',
    tags: ['Python', 'Scrapling', 'yt-dlp', 'youtube-transcript-api', 'OpenAI API', 'Rich', 'pytest', 'CSV', 'Markdown'],
    image: '/images/projects/scrapling.png',
    fullImage: '/images/projects/scrapling-full.png',
    preview: 'YouTube channel report with scored videos and engagement metrics',
    caption: '25 GitHub commits | Daily automation runner',
  },
  {
    id: '4',
    title: 'AI Videos & Creative Workflows',
    category: 'AI & Creative',
    subtitle: 'AI-powered video generation and content automation pipelines',
    github: 'https://github.com/mohammed054/ai-workflow',
    demo: 'AI-powered video generation combining LLM APIs (OpenRouter, Hugging Face), Tesseract.js OCR for text extraction from images, structured JSON generation, and custom pipelines for automated content creation. Also handles AI-assisted grade import and feedback workflows. Creative focus: turning data into engaging visual content.',
    tags: ['OpenRouter APIs', 'Hugging Face', 'Tesseract.js OCR', 'LLM workflows', 'Content automation', 'Grade import', 'Feedback systems'],
    image: '/images/projects/ai-vids.png',
    fullImage: '/images/projects/ai-vids-full.png',
    preview: 'AI video generation pipeline with OCR and LLM integration',
    caption: 'Creative AI work | Video generation pipelines | Content automation',
  },
  {
    id: '5',
    title: 'Hassoun.ae - Personal Brand Site',
    category: 'Personal Brand & Web',
    subtitle: 'Next.js 16 App Router personal brand website',
    github: 'https://github.com/mohammed054/pro71-hassoun-ae',
    demo: 'Next.js 16 App Router implementation of personal brand site. TypeScript, Tailwind CSS v4, Radix UI primitives, Framer Motion animations. Static export mode (generates output in out/). Core structure: src/app/ layout, src/components/ UI primitives, src/lib/content.ts typed content model, public/assets/ images and fonts. Machine-readable endpoints (llms.txt files).',
    tags: ['Next.js 16', 'App Router', 'TypeScript', 'Tailwind CSS v4', 'Radix UI', 'Framer Motion', 'Static Export'],
    image: '/images/projects/hassoun-ae.png',
    fullImage: '/images/projects/hassoun-ae-full.png',
    preview: 'Personal brand site with motion animations and clean layout',
    caption: 'Named portfolio site | Next.js static export | Brand presence',
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
              Featured Projects
            </span>
            <h2 className="text-[clamp(28px,1.5rem+1.2vw,42px)] font-bold leading-tight" style={{ fontFamily: "'sofia-pro', 'europa', sans-serif", color: '#222733' }}>
              Selected Work <span style={{ color: '#eab308' }}>•</span> Client Solutions
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
                  
                  <p className="text-[14px] text-white/60 line-clamp-3" style={{ fontFamily: "'europa', sans-serif", color: '#A5A6AA', overflow: 'hidden' }}>
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
            View All Projects
          </button>
        </div>
      </div>
    </section>
  )
}

export default Projects