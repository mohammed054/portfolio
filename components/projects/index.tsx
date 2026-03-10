'use client'

import Image from 'next/image'
import { AnimatePresence, motion } from 'framer-motion'
import { useState } from 'react'
import { projects } from '@/lib/data'

export default function Projects() {
  const [open, setOpen] = useState<string | null>(null)
  const project = projects.find((item) => item.id === open)

  return (
    <section id="projects" className="section">
      <div className="section-inner">
        <p className="eyebrow">Projects</p>
      </div>

      {projects.map((item) => (
        <article key={item.id} className="section-inner mt-8 min-h-[80vh]">
          <div className="glass grid min-h-[70vh] items-center gap-6 rounded-3xl p-6 md:grid-cols-2">
            <motion.button className="relative block overflow-hidden rounded-2xl border border-[var(--border)] text-left" whileHover={{ rotateX: 0, rotateY: 0 }} initial={{ rotateX: 6, rotateY: -8 }} onClick={() => setOpen(item.id)}>
              <Image src={item.image} alt={`${item.title} screenshot`} width={1200} height={800} className="h-full w-full object-cover" />
            </motion.button>
            <div>
              <div className="flex flex-wrap gap-2">{item.tags.map((tag) => <span key={tag} className="chip">{tag}</span>)}</div>
              <h3 className="t-h1 mt-4">{item.title}</h3>
              <p className="t-body mt-3">{item.summary}</p>
              <p className="t-body-sm mt-2">{item.stack.join(' · ')}</p>
              <button className="btn btn-primary mt-6" onClick={() => setOpen(item.id)}><span>View Case Study</span></button>
            </div>
          </div>
        </article>
      ))}

      <AnimatePresence>
        {project && (
          <motion.aside className="fixed inset-0 z-50 bg-[var(--background)]/90 p-6" initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }}>
            <div className="section-inner glass max-h-[90vh] overflow-auto rounded-2xl p-6">
              <button className="btn btn-ghost" onClick={() => setOpen(null)}>Close</button>
              <h3 className="t-h1 mt-4">{project.title}</h3>
              <p className="t-body mt-4"><strong>Problem:</strong> {project.problem}</p>
              <p className="t-body mt-2"><strong>Solution:</strong> {project.solution}</p>
              <ul className="mt-4 list-disc pl-6 text-[var(--text-secondary)]">
                {project.results.map((result) => <li key={result}>{result}</li>)}
              </ul>
            </div>
          </motion.aside>
        )}
      </AnimatePresence>
    </section>
  )
}
