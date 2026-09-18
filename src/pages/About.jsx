import { useState } from 'react'
import Reveal from '../components/shared/Reveal'

function About() {
  const [hovered, setHovered] = useState(false)

  return (
    <section className="section-padding bg-secondary text-white relative overflow-hidden">
      <div className="container-main">
        <div className="grid grid-cols-1 lg:grid-cols-[31.5%_17.8%_50%] gap-8 items-center">
          <Reveal variant="fadeLeft" className="relative">
            <div
              className="relative overflow-hidden"
              onMouseEnter={() => setHovered(true)}
              onMouseLeave={() => setHovered(false)}
            >
              <img
                src="/images/about/home-drawing.png"
                alt="Home office desk setup"
                className="w-full h-[320px] object-cover"
              />
              <div className="absolute inset-0 bg-black/10 opacity-0 hover:opacity-100 transition-opacity duration-500" />
            </div>
            <div className="absolute -bottom-10 -right-10 hidden lg:block w-[210px] h-[250px]">
              <div className="relative w-full h-full">
                <img
                  src="/images/about/fiverr-profile.png"
                  alt="Fiverr profile"
                  className="absolute inset-0 w-full h-full object-cover rounded-full p-[5px] bg-white shadow-[0px_3px_16px_0px_rgba(0,0,0,0.08)] transition-opacity duration-700"
                  style={{ opacity: hovered ? 0 : 1 }}
                />
                <img
                  src="/images/about/upwork-profile.png"
                  alt="Upwork profile"
                  className="absolute inset-0 w-full h-full object-cover rounded-full p-[5px] bg-white shadow-[0px_3px_16px_0px_rgba(0,0,0,0.08)] transition-opacity duration-700"
                  style={{ opacity: hovered ? 1 : 0 }}
                />
              </div>
            </div>
            <img
              src="/images/decorative/img-animation-5.png"
              alt="Floating dot grid"
              className="absolute -top-6 -left-6 hidden lg:block w-[130px] h-[130px] object-contain animate-float-slow"
            />
            <img
              src="/images/decorative/img-ellipse.png"
              alt=""
              className="absolute -bottom-16 -right-16 hidden lg:block w-[200px] h-[200px] object-contain animate-rotate-slow opacity-40"
              aria-hidden="true"
            />
          </Reveal>

          <div className="hidden lg:block" />

          <Reveal variant="fadeRight">
            <span className="eyebrow text-white">
              About Mohammed Hassoun
            </span>
            <h1 className="text-[clamp(32px,2rem+1.5vw,48px)] font-bold leading-[1.1] mb-6 text-white">
              Freelance Software Developer & AI Specialist
            </h1>
            <p className="text-white/80 leading-[1.7] mb-10 text-[16px]">
              Mohammed Hassoun — Freelance Software Developer & AI Specialist. I build full-stack systems, automate workflows, and create AI-powered solutions. My sweet spot is taking complex problems and turning them into working software that non-technical businesses can actually use.
            </p>

            <div className="space-y-8">
              <div key={1} className="flex gap-5">
                <div className="w-14 h-14 flex-shrink-0 flex items-center justify-center text-white">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" className="mx-auto">
                    <polygon points="5,3 19,12 5,21" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-bold text-white mb-2">Route Optimization & SmartRoute</h3>
                  <p className="text-white/70 text-[0.833rem] leading-[1.7]">Full-stack web application that scrapes web prices, OCRs thousands of pages, optimizes routes, and handles discounts and price history. Built with React Native/Expo, TypeScript, and sophisticated pricing algorithms.</p>
                </div>
              </div>
              <div key={2} className="flex gap-5">
                <div className="w-14 h-14 flex-shrink-0 flex items-center justify-center text-white">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" className="mx-auto">
                    <rect x="2" y="6" width="20" height="6" rx="2" ry="2" />
                    <rect x="6" y="14" width="12" height="6" rx="2" ry="2" />
                    <rect x="14" y="14" width="6" height="6" rx="2" ry="2" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-bold text-white mb-2">EduBridge - School Operations</h3>
                  <p className="text-white/70 text-[0.833rem] leading-[1.7]">React + Vite + Express/Mongoose school management platform with admin/teacher/student portals, RBAC, Socket.io notifications, and bilingual Arabic/English UI. Ready for paid pilot.</p>
                </div>
              </div>
              <div key={3} className="flex gap-5">
                <div className="w-14 h-14 flex-shrink-0 flex items-center justify-center text-white">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" className="mx-auto">
                    <polygon points="13,2 3,14 12,14 11,22 21,10 20,2 12,3 14,12 10,14 21,14 13,2" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-bold text-white mb-2">AI Videos & Creative</h3>
                  <p className="text-white/70 text-[0.833rem] leading-[1.7]">AI-powered video generation and creative content workflows. Combining LLM APIs, Tesseract.js OCR, and custom pipelines for automated content creation.</p>
                </div>
              </div>
              <div key={4} className="flex gap-5">
                <div className="w-14 h-14 flex-shrink-0 flex items-center justify-center text-white">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" className="mx-auto">
                    <polygon points="5,3 19,12 5,21" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-bold text-white mb-2">AI Workflows & AEIS</h3>
                  <p className="text-white/70 text-[0.833rem] leading-[1.7]">Autonomous Economic Intelligence System — persistent digital organism for economic value creation. "Capture demand, don't create it" strategy. 38 sessions documented.</p>
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  )
}

export default About