'use client'

import { motion } from 'framer-motion'
import { testimonials } from '@/lib/data'

export default function Testimonials() {
  return (
    <section id="testimonials" className="section">
      <div className="section-inner">
        <p className="eyebrow">Testimonials</p>
        <div className="mt-8 grid gap-4 md:grid-cols-[1fr_1.2fr_1fr]">
          {testimonials.map((item, i) => (
            <motion.blockquote
              key={item.id}
              className="glass rounded-2xl p-6"
              initial={{ opacity: 0, y: 80 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35, delay: i * 0.08 }}
              viewport={{ once: true, amount: 0.3 }}
              tabIndex={0}
            >
              <p className="t-body">“{item.quote}”</p>
              <footer className="mt-4 t-body-sm">
                <span className="text-[var(--accent1)]">{item.name}</span> · {item.role}
              </footer>
            </motion.blockquote>
          ))}
        </div>
      </div>
    </section>
  )
}
