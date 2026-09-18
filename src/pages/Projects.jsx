import { useState } from 'react'
import Reveal from '../components/shared/Reveal'

const projects = [
  {
    id: '1',
    title: 'SmartRoute - Route Optimization Engine',
    category: 'Full-Stack Application',
    subtitle: 'Web scraping + OCR + Route optimization + Price history management',
    github: 'https://github.com/mohammed054/route-app',
    demo: 'Full-stack web application that scrapes web prices, uses Tesseract.js OCR for text extraction from images, optimizes routes across store subsets, assigns each item to the cheapest store, calculates round-trip distance, fuel cost, time cost, item totals, and savings against a one-store baseline. Produces best-value, fastest, and balanced route options with item assignments, store order previews, cost summaries, route notes, and mobile-first screens.',
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
    demo: 'React/Vite frontend + Express/Mongoose backend. Admin/teacher/student portals for attendance, schedules, grades, feedback, surveys, broadcasts, notifications, calendars, report cards, campus filtering. Real-time Socket.io notifications, bilingual Arabic/English UI, RBAC permission matrix, intelligence services for student/class/school recomputation, scheduled jobs, risk scoring, survey assignment synchronization, engagement events, and AI-assisted feedback/analytics workflows. Ready for controlled paid pilot.',
    tags: ['React', 'Vite', 'Express.js', 'MongoDB', 'Mongoose', 'Socket.io', 'JWT', 'RBAC', 'Tailwind CSS', 'Arabic UI'],
    image: '/images/projects/edubridge.png',
    fullImage: '/images/projects/edubridge-full.png',
    preview: 'School dashboard with attendance, grades, reports, and student detail views',
    caption: '67 commits (frontend) + 55 commits (backend) | Pilot-ready SaaS',
  },
  {
    id: '3',
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
    id: '4',
    title: 'Barber Republic Dubai Landing Page',
    category: 'Non-Technical Business',
    subtitle: 'React + Three.js landing page for grooming lounge at Vida The Hills',
    github: 'https://github.com/mohammed054/pro71-web',
    demo: 'Precision cuts, beard lines, hot towels, and Fresha booking for Barber Republic at Vida The Hills, Dubai. Built with React, Vite, Three.js, and Tailwind CSS. Three.js scene includes custom window manager, desktop system simulation (boot, login, lock screen, taskbar, start menu), and polished interaction-heavy frontend work. Target: non-technical barbershop owners.',
    tags: ['React', 'Vite', 'Three.js', 'React Three Fiber', 'Drei', 'GSAP', 'ScrollTrigger', 'Lenis', 'Framer Motion', 'Tailwind CSS'],
    image: '/images/projects/barber.png',
    fullImage: '/images/projects/barber-full.png',
    preview: 'Barber Republic Dubai grooming lounge landing page',
    caption: 'Non-technical business target | React + Three.js integration',
  },
  {
    id: '5',
    title: 'L-Arginine Pill Reminder Android App',
    category: 'Mobile Applications',
    subtitle: 'Native Android medication/reminder app with WorkManager scheduling',
    github: 'https://github.com/mohammed054/pill-app',
    demo: 'Native Android medication/reminder app. Uses Room entities for pills, pill history, and custom notification phrases, with database seeding for default phrases. Repository and ViewModel layers expose Flow/LiveData data streams and handle add/update/delete/toggle actions. WorkManager schedules periodic reminders with custom intervals, initial delay calculation, boot rescheduling, and cancellation/rescheduling logic. Notifications include privacy-aware text, vibration/sound/channel handling, and action buttons for "taken" or "skip" that write history entries through a broadcast receiver.',
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
              Featured Work
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
            View All Projects
          </button>
        </div>
      </div>
    </section>
  )
}

export default Projects