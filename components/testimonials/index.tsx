'use client'

import { motion } from 'framer-motion'
import { testimonials } from '@/lib/data'

export default function Testimonials() {
  return (
    <section id="testimonials" className="section">
      <div className="section-inner">
        <p className="eyebrow">Testimonials</p>
        <div className="mt-8 grid gap-4 md:grid-cols-3">
          {testimonials.map((item, index) => (
            <motion.blockquote
              key={item.id}
              className="glass rounded-2xl p-5"
              initial={{ opacity: 0, y: 80 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.08, duration: 0.3 }}
              viewport={{ once: true, amount: 0.2 }}
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
