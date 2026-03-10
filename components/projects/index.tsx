'use client'

import Image from 'next/image'
import { AnimatePresence, motion } from 'framer-motion'
import { useState } from 'react'
import { projects } from '@/lib/data'

export default function Projects() {
  const [open, setOpen] = useState<string | null>(null)
  const project = projects.find((p) => p.id === open) ?? null

  return (
    <section id="projects" className="section">
      <div className="section-inner">
        <p className="eyebrow">Projects</p>
        <div className="mt-8 grid gap-6">
          {projects.map((item, index) => (
            <article key={item.id} className="glass grid gap-4 rounded-2xl p-6 md:grid-cols-2">
              <div className={index % 2 ? 'md:order-2' : ''}>
                <Image src={item.image} alt={`${item.title} screenshot`} width={640} height={360} className="w-full rounded-xl border border-[var(--border)]" />
              </div>
              <div className={index % 2 ? 'md:order-1' : ''}>
                <div className="flex gap-2">{item.tags.map((t) => <span key={t} className="chip">{t}</span>)}</div>
                <h3 className="t-h2 mt-3">{item.title}</h3>
                <p className="t-body mt-2">{item.summary}</p>
                <p className="t-body-sm mt-2">{item.stack.join(' · ')}</p>
                <button className="btn btn-ghost mt-4" onClick={() => setOpen(item.id)}>View Case Study</button>
              </div>
            </article>
          ))}
        </div>
      </div>

      <AnimatePresence>
        {project && (
          <motion.aside className="fixed inset-0 z-50 bg-[var(--background)]/95 p-6" initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }}>
            <div className="section-inner glass max-h-[90vh] overflow-auto rounded-2xl p-6">
              <button className="btn btn-ghost mb-4" onClick={() => setOpen(null)}>Close</button>
              <h3 className="t-h2">{project.title}</h3>
              <p className="t-body mt-3"><strong>Problem:</strong> {project.problem}</p>
              <p className="t-body mt-2"><strong>Solution:</strong> {project.solution}</p>
              <ul className="mt-3 list-disc pl-5 text-[var(--text-secondary)]">
                {project.results.map((result) => <li key={result}>{result}</li>)}
              </ul>
            </div>
          </motion.aside>
        )}
      </AnimatePresence>
    </section>
  )
}
