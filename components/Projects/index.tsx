'use client'
import { useRef, useState } from 'react'
import { motion, useInView, AnimatePresence } from 'framer-motion'
import { projects } from '@/lib/data'

type Project = typeof projects[0]

/* ── Case Study Overlay ───────────────────────────────── */
function CaseStudyOverlay({
  project,
  onClose,
}: {
  project: Project
  onClose: () => void
}) {
  return (
    <motion.div
      className="fixed inset-0 z-50 overflow-y-auto"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      role="dialog"
      aria-modal="true"
      aria-label={`Case study: ${project.title}`}
    >
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-bg/90 backdrop-blur-xl"
        onClick={onClose}
      />

      {/* Panel */}
      <motion.div
        className="relative z-10 min-h-screen max-w-4xl mx-auto px-6 py-20"
        initial={{ y: 40 }}
        animate={{ y: 0 }}
        exit={{ y: 40 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      >
        {/* Close */}
        <button
          onClick={onClose}
          className="fixed top-6 right-6 w-10 h-10 rounded-full glass flex items-center justify-center text-text-secondary hover:text-text-primary transition-colors hover:border-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
          aria-label="Close case study"
        >
          ✕
        </button>

        {/* Tag + title */}
        <div className="mb-10">
          <span
            className="font-mono text-xs tracking-widest uppercase px-3 py-1 rounded-full border"
            style={{ color: project.color, borderColor: `${project.color}40`, background: `${project.color}10` }}
          >
            {project.tag}
          </span>
          <h2 className="font-syne font-extrabold text-text-primary mt-4 mb-3"
            style={{ fontSize: 'clamp(2rem, 5vw, 3.5rem)' }}>
            {project.title}
          </h2>
          <p className="text-xl text-text-secondary leading-relaxed">{project.description}</p>
        </div>

        {/* Mock screenshot area */}
        <div
          className="w-full h-64 md:h-80 rounded-2xl mb-12 flex items-center justify-center border border-border overflow-hidden"
          style={{ background: `linear-gradient(135deg, ${project.accentBg}, rgba(14,18,32,0.8))` }}
        >
          <div className="text-center">
            <div className="w-16 h-16 rounded-2xl mx-auto mb-3 flex items-center justify-center text-2xl"
              style={{ background: `${project.color}20`, border: `1px solid ${project.color}30` }}>
              ⬡
            </div>
            <p className="font-mono text-xs text-text-muted">Project Screenshot</p>
          </div>
        </div>

        {/* Problem / Solution */}
        <div className="grid md:grid-cols-2 gap-8 mb-12">
          <div className="glass rounded-2xl p-6">
            <h3 className="font-syne font-bold text-sm text-text-secondary uppercase tracking-widest mb-3">
              The Problem
            </h3>
            <p className="text-text-secondary leading-relaxed">{project.problem}</p>
          </div>
          <div className="glass rounded-2xl p-6" style={{ borderColor: `${project.color}30` }}>
            <h3 className="font-syne font-bold text-sm uppercase tracking-widest mb-3"
              style={{ color: project.color }}>
              The Solution
            </h3>
            <p className="text-text-secondary leading-relaxed">{project.solution}</p>
          </div>
        </div>

        {/* Results */}
        <div className="mb-12">
          <h3 className="font-syne font-bold text-lg text-text-primary mb-6">Results</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {project.results.map((result, i) => (
              <motion.div
                key={i}
                className="glass rounded-xl p-4 text-center"
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.08 }}
              >
                <p className="font-dm text-sm text-text-secondary leading-snug">{result}</p>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Stack */}
        <div className="mb-12">
          <h3 className="font-syne font-bold text-lg text-text-primary mb-4">Tech Stack</h3>
          <div className="flex flex-wrap gap-2">
            {project.stack.map((tech) => (
              <span
                key={tech}
                className="font-mono text-xs px-3 py-1.5 rounded-lg border border-border text-text-secondary bg-surface"
              >
                {tech}
              </span>
            ))}
          </div>
        </div>

        {/* Links */}
        <div className="flex gap-4">
          {project.liveUrl && project.liveUrl !== '#' && (
            <a
              href={project.liveUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="px-6 py-3 rounded-xl font-dm text-sm font-medium text-bg transition-all duration-200 hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
              style={{ background: project.color }}
            >
              ↗ Live Demo
            </a>
          )}
          {project.githubUrl && project.githubUrl !== '#' && (
            <a
              href={project.githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="px-6 py-3 rounded-xl font-dm text-sm font-medium text-text-secondary border border-border hover:border-accent hover:text-accent transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
            >
              ⌥ GitHub
            </a>
          )}
        </div>
      </motion.div>
    </motion.div>
  )
}

/* ── Project Card ─────────────────────────────────────── */
function ProjectCard({
  project,
  index,
  inView,
  onOpen,
}: {
  project: Project
  index: number
  inView: boolean
  onOpen: () => void
}) {
  const isOdd = index % 2 !== 0

  return (
    <motion.article
      initial={{ opacity: 0, y: 40 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1], delay: index * 0.12 }}
      className={`grid md:grid-cols-2 gap-8 items-center ${isOdd ? 'md:flex-row-reverse' : ''}`}
    >
      {/* Visual pane */}
      <motion.div
        className={`relative aspect-video rounded-2xl overflow-hidden cursor-pointer group ${isOdd ? 'md:order-2' : ''}`}
        onClick={onOpen}
        whileHover={{ scale: 1.01 }}
        transition={{ duration: 0.4 }}
      >
        <div
          className="absolute inset-0 transition-all duration-500"
          style={{ background: `linear-gradient(135deg, ${project.accentBg}, rgba(14,18,32,0.9))` }}
        />
        {/* Decorative pattern */}
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: `radial-gradient(circle, ${project.color} 1px, transparent 1px)`,
            backgroundSize: '24px 24px',
          }}
        />
        {/* Center icon */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div
            className="w-20 h-20 rounded-2xl flex items-center justify-center text-3xl font-syne font-bold transition-transform duration-300 group-hover:scale-110"
            style={{ background: `${project.color}20`, border: `1px solid ${project.color}40`, color: project.color }}
          >
            {project.title[0]}
          </div>
        </div>
        {/* Hover overlay */}
        <div className="absolute inset-0 bg-bg/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
          <span className="font-dm text-sm text-text-primary glass px-4 py-2 rounded-lg">View Case Study →</span>
        </div>
        {/* Glow border */}
        <div
          className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
          style={{ boxShadow: `inset 0 0 0 1px ${project.color}40` }}
        />
      </motion.div>

      {/* Content pane */}
      <div className={isOdd ? 'md:order-1' : ''}>
        <span
          className="font-mono text-xs tracking-widest uppercase px-2.5 py-1 rounded-full border"
          style={{ color: project.color, borderColor: `${project.color}40`, background: `${project.color}10` }}
        >
          {project.tag}
        </span>

        <h3 className="font-syne font-extrabold text-text-primary mt-3 mb-3"
          style={{ fontSize: 'clamp(1.5rem, 3vw, 2.25rem)' }}>
          {project.title}
        </h3>

        <p className="text-text-secondary leading-relaxed mb-6">{project.summary}</p>

        {/* Stack chips */}
        <div className="flex flex-wrap gap-2 mb-6">
          {project.stack.map((tech) => (
            <span key={tech} className="font-mono text-xs px-2.5 py-1 rounded-lg bg-surface border border-border text-text-muted">
              {tech}
            </span>
          ))}
        </div>

        {/* Actions */}
        <div className="flex gap-3">
          <button
            onClick={onOpen}
            className="px-5 py-2.5 font-dm text-sm font-medium rounded-xl transition-all duration-200 hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
            style={{ background: project.color, color: '#080B14' }}
          >
            Case Study
          </button>
          {project.githubUrl !== '#' && (
            <a
              href={project.githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="px-5 py-2.5 font-dm text-sm rounded-xl border border-border text-text-secondary hover:border-accent hover:text-accent transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
            >
              GitHub
            </a>
          )}
        </div>
      </div>
    </motion.article>
  )
}

/* ── Projects Component ───────────────────────────────── */
export default function Projects() {
  const titleRef = useRef<HTMLDivElement>(null)
  const inView = useInView(titleRef, { once: true, margin: '-10% 0px' })
  const [activeProject, setActiveProject] = useState<Project | null>(null)

  return (
    <section id="projects" className="relative py-24 md:py-32 px-6 overflow-hidden">
      {/* Top divider */}
      <div
        className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-px pointer-events-none"
        style={{ background: 'linear-gradient(90deg, transparent, rgba(139,92,246,0.3), transparent)' }}
      />

      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div ref={titleRef} className="mb-20">
          <motion.p
            className="section-eyebrow mb-4"
            initial={{ opacity: 0, x: -20 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6 }}
          >
            Work
          </motion.p>
          <motion.h2
            className="font-syne font-extrabold text-text-primary"
            style={{ fontSize: 'clamp(2rem, 5vw, 3.5rem)' }}
            initial={{ opacity: 0, y: 24 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1], delay: 0.1 }}
          >
            Selected Projects
          </motion.h2>
          <motion.p
            className="mt-4 text-text-secondary max-w-lg leading-relaxed"
            initial={{ opacity: 0, y: 24 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1], delay: 0.2 }}
          >
            Each project is a case study in decision-making. Click to see the thinking behind the execution.
          </motion.p>
        </div>

        {/* Project list */}
        <div className="flex flex-col gap-20 md:gap-28">
          {projects.map((project, i) => (
            <ProjectCard
              key={project.id}
              project={project}
              index={i}
              inView={inView}
              onOpen={() => setActiveProject(project)}
            />
          ))}
        </div>
      </div>

      {/* Case Study Overlay */}
      <AnimatePresence>
        {activeProject && (
          <CaseStudyOverlay
            project={activeProject}
            onClose={() => setActiveProject(null)}
          />
        )}
      </AnimatePresence>
    </section>
  )
}
