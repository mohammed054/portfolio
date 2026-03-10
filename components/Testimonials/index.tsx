'use client'
import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { testimonials } from '@/lib/data'

type Testimonial = typeof testimonials[0]

/* ── Quote Mark SVG ─────────────────────────────────────── */
function QuoteMark({ className = '' }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 40 32"
      className={className}
      aria-hidden="true"
      fill="none"
    >
      <path
        d="M0 32V20.5C0 13.833 1.833 8.583 5.5 4.75 9.167.917 14.167 0 20.5 0v5.5c-3.5 0-6.083.917-7.75 2.75S10.5 12.583 10.5 15.5h9.5V32H0zm21.5 0V20.5C21.5 13.833 23.333 8.583 27 4.75 30.667.917 35.667 0 42 0v5.5c-3.5 0-6.083.917-7.75 2.75S32 12.583 32 15.5h9.5V32H21.5z"
        fill="currentColor"
      />
    </svg>
  )
}

/* ── Featured Testimonial ─────────────────────────────── */
function FeaturedTestimonial({ item, inView }: { item: Testimonial; inView: boolean }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
      className="relative glass rounded-3xl p-10 md:p-14 text-center glow-border mb-10"
    >
      {/* Glow */}
      <div
        className="absolute inset-0 rounded-3xl pointer-events-none"
        style={{ boxShadow: '0 0 60px rgba(79,142,247,0.08), inset 0 0 40px rgba(79,142,247,0.04)' }}
      />

      {/* Large quote marks */}
      <QuoteMark className="w-10 h-8 text-accent/20 mx-auto mb-6" />

      <blockquote className="font-syne text-xl md:text-2xl font-medium text-text-primary leading-relaxed mb-8 max-w-3xl mx-auto">
        "{item.quote}"
      </blockquote>

      {/* Attribution */}
      <div className="flex flex-col items-center gap-1">
        <div className="w-10 h-px bg-gradient-to-r from-transparent via-accent to-transparent mb-4" />
        <span className="font-dm font-medium text-text-primary">{item.name}</span>
        <span className="font-mono text-xs text-text-muted">
          {item.role} · {item.company}
        </span>
        {item.linkedIn !== '#' && (
          <a
            href={item.linkedIn}
            className="mt-2 font-mono text-xs text-accent hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent rounded"
            target="_blank"
            rel="noopener noreferrer"
          >
            LinkedIn →
          </a>
        )}
      </div>
    </motion.div>
  )
}

/* ── Supporting Testimonial ───────────────────────────── */
function SupportingTestimonial({
  item,
  index,
  inView,
}: {
  item: Testimonial
  index: number
  inView: boolean
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 32 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1], delay: index * 0.1 + 0.3 }}
      className="glass rounded-2xl p-7 flex flex-col justify-between hover:border-border/60 transition-all duration-300 group"
      style={{ '--hover-glow': 'rgba(79,142,247,0.1)' } as React.CSSProperties}
    >
      <div>
        <QuoteMark className="w-6 h-5 text-accent/20 mb-4" />
        <blockquote className="font-dm text-text-secondary leading-relaxed text-sm">
          "{item.quote}"
        </blockquote>
      </div>

      <div className="mt-6 pt-5 border-t border-border">
        <div className="flex items-start justify-between">
          <div>
            <p className="font-dm font-medium text-text-primary text-sm">{item.name}</p>
            <p className="font-mono text-xs text-text-muted mt-0.5">
              {item.role} · {item.company}
            </p>
          </div>
          {item.linkedIn !== '#' && (
            <a
              href={item.linkedIn}
              className="text-text-muted hover:text-accent transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent rounded"
              aria-label={`${item.name}'s LinkedIn profile`}
              target="_blank"
              rel="noopener noreferrer"
            >
              <svg viewBox="0 0 24 24" className="w-4 h-4" fill="currentColor">
                <path d="M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-2-2 2 2 0 00-2 2v7h-4v-7a6 6 0 016-6zM2 9h4v12H2z" />
                <circle cx="4" cy="4" r="2" />
              </svg>
            </a>
          )}
        </div>
      </div>
    </motion.div>
  )
}

/* ── Testimonials Component ───────────────────────────── */
export default function Testimonials() {
  const titleRef = useRef<HTMLDivElement>(null)
  const inView = useInView(titleRef, { once: true, margin: '-10% 0px' })

  const featured = testimonials.find((t) => t.featured)!
  const supporting = testimonials.filter((t) => !t.featured)

  return (
    <section id="testimonials" className="relative py-24 md:py-32 px-6 overflow-hidden">
      {/* Background decoration */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full pointer-events-none"
        style={{
          background: 'radial-gradient(circle, rgba(79,142,247,0.04) 0%, transparent 70%)',
        }}
      />

      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div ref={titleRef} className="text-center mb-16">
          <motion.p
            className="section-eyebrow justify-center mb-4"
            initial={{ opacity: 0 }}
            animate={inView ? { opacity: 1 } : {}}
            transition={{ duration: 0.6 }}
          >
            Social Proof
          </motion.p>
          <motion.h2
            className="font-syne font-extrabold text-text-primary"
            style={{ fontSize: 'clamp(2rem, 5vw, 3.5rem)' }}
            initial={{ opacity: 0, y: 24 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1], delay: 0.1 }}
          >
            What Teams Say
          </motion.h2>
          <motion.p
            className="mt-4 text-text-secondary max-w-lg mx-auto leading-relaxed"
            initial={{ opacity: 0, y: 24 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1], delay: 0.2 }}
          >
            Real words from engineers, founders, and product leaders I've worked alongside.
          </motion.p>
        </div>

        {/* Featured */}
        <FeaturedTestimonial item={featured} inView={inView} />

        {/* Supporting grid */}
        <div className="grid md:grid-cols-3 gap-5">
          {supporting.map((item, i) => (
            <SupportingTestimonial key={item.id} item={item} index={i} inView={inView} />
          ))}
        </div>
      </div>
    </section>
  )
}
