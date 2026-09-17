import { motion } from 'framer-motion'
import Reveal from '../components/shared/Reveal'

function Skills() {
  return (
    <section className="section-padding bg-secondary text-white">
      <div className="container-main">
        <Reveal variant="fadeUp">
          <div className="text-center mb-16">
            <span className="inline-block text-[0.722rem] font-semibold tracking-[2px] uppercase mb-4" style={{ fontFamily: "'europa', sans-serif", color: '#A5A6AA' }}>
              Skills & Technologies
            </span>
            <h2 className="text-[clamp(28px,1.5rem+1.2vw,42px)] font-bold leading-tight" style={{ fontFamily: "'sofia-pro', 'europa', sans-serif", color: '#ffffff' }}>
              My Technical Stack
            </h2>
          </div>
        </Reveal>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="p-4 rounded-lg bg-white/10 backdrop-blur-sm">
            <h3 className="text-lg font-bold mb-4" style={{ fontFamily: "'sofia-pro', 'europa', sans-serif" }}>Languages</h3>
            <ul className="space-y-2 text-sm">
              <li><span className="text-white/60">Python</span> — CLIs, automation, OCR pipelines, yt-dlp, youtube-transcript-api</li>
              <li><span className="text-white/60">JavaScript</span> — React, Node, Chrome Extensions, Manifest V3</li>
              <li><span className="text-white/60">TypeScript</span> — Type-safe frontend development, route-app, SmartRoute</li>
              <li><span className="text-white/60">Kotlin</span> — Android SDK, native apps, WorkManager, Room DB</li>
              <li><span className="text-white/60">HTML</span> / <span className="text-white/60">CSS</span> — Semantic markup, responsive design, RTL/bilingual support</li>
            </ul>
          </div>

          <div className="p-4 rounded-lg bg-white/10 backdrop-blur-sm">
            <h3 className="text-lg font-bold mb-4" style={{ fontFamily: "'sofia-pro', 'europa', sans-serif" }}>Frontend</h3>
            <ul className="space-y-2 text-sm">
              <li><span className="text-white/60">React 19</span> — Hooks, Context, Router, performance optimization</li>
              <li><span className="text-white/60">Next.js</span> — App router, SSR, static generation</li>
              <li><span className="text-white/60">Vite</span> — Fast dev server, HMR, production builds</li>
              <li><span className="text-white/60">React Router</span> — Navigation, lazy loading, route guards</li>
              <li><span className="text-white/60">Tailwind CSS</span> — Utility-first styling, responsive design, custom components</li>
            </ul>
          </div>

          <div className="p-4 rounded-lg bg-white/10 backdrop-blur-sm">
            <h3 className="text-lg font-bold mb-4" style={{ fontFamily: "'sofia-pro', 'europa', sans-serif" }}>Backend</h3>
            <ul className="space-y-2 text-sm">
              <li><span className="text-white/60">Node.js</span> — Express, REST APIs, authentication</li>
              <li><span className="text-white/60">Express.js</span> — Middleware, routing, rate limiting</li>
              <li><span className="text-white/60">MongoDB/Mongoose</span> — Document modeling, queries, migrations</li>
              <li><span className="text-white/60">JWT Auth</span> — Token-based authentication, session management</li>
              <li><span className="text-white/60">RBAC</span> — Role-based access control, permission matrices</li>
            </ul>
          </div>

          <div className="p-4 rounded-lg bg-white/10 backdrop-blur-sm">
            <h3 className="text-lg font-bold mb-4" style={{ fontFamily: "'sofia-pro', 'europa', sans-serif" }}>AI & Automation</h3>
            <ul className="space-y-2 text-sm">
              <li><span className="text-white/60">OpenAI/OpenRouter APIs</span> — LLM calls, prompt-to-command workflows</li>
              <li><span className="text-white/60">Hugging Face</span> — Inference, ASR models (whisper-large-v3)</li>
              <li><span className="text-white/60">Tesseract.js OCR</span> — English/Arabic text extraction from images</li>
              <li><span className="text-white/60">Scrapling/yt-dlp</span> — YouTube transcript extraction, channel analysis</li>
              <li><span className="text-white/60">LLM-assisted workflows</span> — Grade import, feedback generation</li>
            </ul>
          </div>

          <div className="p-4 rounded-lg bg-white/10 backdrop-blur-sm">
            <h3 className="text-lg font-bold mb-4" style={{ fontFamily: "'sofia-pro', 'europa', sans-serif" }}>Mobile</h3>
            <ul className="space-y-2 text-sm">
              <li><span className="text-white/60">Android Kotlin</span> — SDK, native development</li>
              <li><span className="text-white/60">Room DB</span> — Local persistence, DAO patterns</li>
              <li><span className="text-white/60">WorkManager</span> — Periodic scheduling, background tasks</li>
              <li><span className="text-white/60">LiveData/ViewModel</span> — Architecture components, data streams</li>
              <li><span className="text-white/60">React Native/Expo</span> — Cross-platform mobile prototypes</li>
            </ul>
          </div>

          <div className="p-4 rounded-lg bg-white/10 backdrop-blur-sm">
            <h3 className="text-lg font-bold mb-4" style={{ fontFamily: "'sofia-pro', 'europa', sans-serif" }}>Browser & Extensions</h3>
            <ul className="space-y-2 text-sm">
              <li><span className="text-white/60">Chrome Manifest V3</span> — Content scripts, service workers, popups</li>
              <li><span className="text-white/60">Tesseract.js</span> — On-page OCR extraction</li>
              <li><span className="text-white/60">Puppeteer</span> — Browser automation, QR auth, session management</li>
              <li><span className="text-white/60">MutationObserver</span> — DOM change detection, dynamic content handling</li>
              <li><span className="text-white/60">JSZip</span> — Package/download generation from web content</li>
            </ul>
          </div>

          <div className="p-4 rounded-lg bg-white/10 backdrop-blur-sm">
            <h3 className="text-lg font-bold mb-4" style={{ fontFamily: "'sofia-pro', 'europa', sans-serif" }}>Testing & DevOps</h3>
            <ul className="space-y-2 text-sm">
              <li><span className="text-white/60">pytest</span> — Python testing, transcript retry behavior</li>
              <li><span className="text-white/60">Vitest</span> — React component testing</li>
              <li><span className="text-white/60">React Testing Library</span> — Component behavior tests</li>
              <li><span className="text-white/60">supertest</span> — API endpoint testing</li>
              <li><span className="text-white/60">Git/GitHub</span> — Version control, daily commits, repository management</li>
              <li><span className="text-white/60">Railway/Vercel</span> — Deployment, production builds</li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Skills