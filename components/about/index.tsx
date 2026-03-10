'use client'

import { motion, useReducedMotion } from 'framer-motion'
import { timeline } from '@/lib/data'

export default function About() {
  const reduced = useReducedMotion()

  return (
    <section id="about" className="section">
      <div className="section-inner">
        <p className="eyebrow">About / Timeline</p>
        <div className="mt-8 grid gap-6 md:grid-cols-2">
          {timeline.map((item, index) => (
            <motion.article
              key={item.id}
              className="glass rounded-2xl p-6"
              initial={{ opacity: 0, y: reduced ? 0 : 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: index * 0.08 }}
              viewport={{ once: true, amount: 0.2 }}
              tabIndex={0}
            >
              <p className="t-mono text-[var(--accent1)]">{item.year}</p>
              <h3 className="t-h3 mt-2">{item.title}</h3>
              <p className="t-body mt-3">{item.details}</p>
              <div className="mt-4 flex flex-wrap gap-2">
                {item.tags.map((tag) => (
                  <span className="chip" key={tag}>
                    {tag}
                  </span>
                ))}
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  )
}
