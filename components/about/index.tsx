'use client'

import { useState } from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import { timeline } from '@/lib/data'

export default function About() {
  const reduced = useReducedMotion()
  const [open, setOpen] = useState<string | null>(timeline[0]?.id ?? null)

  return (
    <section id="about" className="section">
      <div className="section-inner grid gap-8 lg:grid-cols-[1.25fr_0.85fr]">
        <div className="space-y-4">
          <p className="eyebrow">About / Timeline</p>
          {timeline.map((item, i) => (
            <motion.button
              key={item.id}
              className="glass w-full rounded-2xl p-6 text-left"
              onClick={() => setOpen(item.id)}
              initial={{ opacity: 0, y: reduced ? 0 : 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08, duration: 0.35 }}
              viewport={{ once: true, amount: 0.25 }}
            >
              <p className="t-mono text-[var(--accent1)]">{item.year}</p>
              <h3 className="t-h3 mt-2">{item.title}</h3>
              <p className="t-body mt-2">{item.details}</p>
            </motion.button>
          ))}
        </div>

        <aside className="glass sticky top-10 h-fit rounded-2xl p-6">
          <p className="eyebrow">Whoami</p>
          <p className="t-mono mt-4 text-[var(--text-secondary)]">$ whoami</p>
          <p className="t-body mt-2">Full-stack engineer designing cinematic digital products with AI and real-time 3D systems.</p>
          {timeline
            .filter((item) => item.id === open)
            .map((item) => (
              <div key={item.id} className="mt-6 rounded-xl border border-[var(--border)] bg-[var(--surface)] p-4">
                <p className="t-h4">{item.title}</p>
                <div className="mt-2 flex flex-wrap gap-2">{item.tags.map((tag) => <span className="chip" key={tag}>{tag}</span>)}</div>
              </div>
            ))}
        </aside>
      </div>
    </section>
  )
}
