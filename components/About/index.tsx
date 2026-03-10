'use client'
import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { timeline, personal } from '@/lib/data'

/* ── Tag chip ─────────────────────────────────────────── */
const Tag = ({ label }: { label: string }) => (
  <span className="font-mono text-xs px-2 py-0.5 rounded border border-border text-text-muted bg-surface">
    {label}
  </span>
)

/* ── Timeline Node ────────────────────────────────────── */
interface NodeProps {
  item: typeof timeline[0]
  index: number
  isLeft: boolean
}

function TimelineNode({ item, index, isLeft }: NodeProps) {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: '-10% 0px' })

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, x: isLeft ? -40 : 40 }}
      animate={inView ? { opacity: 1, x: 0 } : {}}
      transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1], delay: index * 0.1 }}
      className={`relative flex w-full ${isLeft ? 'md:justify-end' : 'justify-start'} mb-12 md:mb-0`}
    >
      {/* Card */}
      <div
        className={`relative w-full md:w-[44%] glass rounded-2xl p-6 hover:border-accent/40 transition-all duration-300 group cursor-default ${
          isLeft ? 'md:mr-[calc(50%+1.5rem)]' : 'md:ml-[calc(50%+1.5rem)]'
        }`}
      >
        {/* Glow on hover */}
        <div
          className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"
          style={{ boxShadow: `0 0 30px ${item.color}15, inset 0 0 30px ${item.color}05` }}
        />

        {/* Header */}
        <div className="flex items-start justify-between mb-3">
          <div>
            <p className="font-mono text-xs tracking-widest" style={{ color: item.color }}>
              {item.month} {item.year}
            </p>
            <h3 className="font-syne font-bold text-lg text-text-primary mt-0.5 leading-tight">
              {item.role}
            </h3>
          </div>
          {/* Dot indicator */}
          <div
            className="w-3 h-3 rounded-full shrink-0 mt-1.5 ring-2 ring-offset-2 ring-offset-surface"
            style={{ background: item.color, ringColor: item.color }}
          />
        </div>

        {/* Company */}
        <a
          href={item.companyUrl}
          className="text-sm font-medium transition-colors duration-200 hover:underline"
          style={{ color: item.color }}
          target="_blank"
          rel="noopener noreferrer"
        >
          {item.company}
        </a>

        {/* Summary */}
        <p className="mt-3 text-sm text-text-secondary leading-relaxed">
          {item.summary}
        </p>

        {/* Tags */}
        <div className="mt-4 flex flex-wrap gap-1.5">
          {item.tags.map((tag) => <Tag key={tag} label={tag} />)}
        </div>
      </div>

      {/* Center dot — desktop only */}
      <div className="hidden md:flex absolute left-1/2 -translate-x-1/2 top-6 items-center justify-center">
        <motion.div
          initial={{ scale: 0 }}
          animate={inView ? { scale: 1 } : {}}
          transition={{ duration: 0.4, ease: 'backOut', delay: index * 0.1 + 0.2 }}
          className="w-4 h-4 rounded-full ring-2 ring-offset-2 ring-offset-bg z-10"
          style={{ background: item.color, ringColor: item.color }}
        />
      </div>
    </motion.div>
  )
}

/* ── About Component ─────────────────────────────────── */
export default function About() {
  const titleRef = useRef<HTMLDivElement>(null)
  const inView = useInView(titleRef, { once: true })

  return (
    <section id="about" className="relative py-24 md:py-32 px-6 overflow-hidden">
      {/* Background accent */}
      <div
        className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-px"
        style={{ background: 'linear-gradient(90deg, transparent, rgba(79,142,247,0.3), transparent)' }}
      />

      <div className="max-w-7xl mx-auto">
        {/* Section header */}
        <div ref={titleRef} className="mb-20">
          <motion.p
            className="section-eyebrow mb-4"
            initial={{ opacity: 0, x: -20 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6 }}
          >
            Background
          </motion.p>
          <motion.h2
            className="font-syne font-extrabold text-text-primary"
            style={{ fontSize: 'clamp(2rem, 5vw, 3.5rem)' }}
            initial={{ opacity: 0, y: 24 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1], delay: 0.1 }}
          >
            The Story So Far
          </motion.h2>
          <motion.p
            className="mt-4 text-text-secondary max-w-xl leading-relaxed"
            initial={{ opacity: 0, y: 24 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1], delay: 0.2 }}
          >
            A journey through engineering, leadership, and building things that outlast their deadlines.
          </motion.p>
        </div>

        {/* Timeline */}
        <div className="relative">
          {/* Vertical line — desktop */}
          <div className="hidden md:block absolute left-1/2 -translate-x-px top-0 bottom-0 w-px">
            <motion.div
              className="w-full h-full"
              style={{
                background: 'linear-gradient(to bottom, transparent, #4F8EF750, #8B5CF650, transparent)',
              }}
              initial={{ scaleY: 0 }}
              animate={inView ? { scaleY: 1 } : {}}
              transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1], delay: 0.3 }}
            />
          </div>

          {/* Nodes */}
          <div className="flex flex-col md:gap-16">
            {timeline.map((item, i) => (
              <TimelineNode
                key={item.id}
                item={item}
                index={i}
                isLeft={i % 2 === 0}
              />
            ))}
          </div>
        </div>

        {/* Bottom stats bar */}
        <div className="mt-24 grid grid-cols-2 md:grid-cols-4 gap-px bg-border rounded-2xl overflow-hidden">
          {[
            { label: 'Years Experience', value: '6+' },
            { label: 'Projects Shipped', value: '40+' },
            { label: 'Engineers Mentored', value: '12' },
            { label: 'Open Source Stars', value: '3k+' },
          ].map((stat, i) => (
            <motion.div
              key={stat.label}
              className="bg-surface flex flex-col items-center justify-center p-8 text-center"
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.4 + i * 0.08, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            >
              <span
                className="font-syne font-extrabold text-4xl text-gradient block mb-1"
                aria-label={stat.value}
              >
                {stat.value}
              </span>
              <span className="font-dm text-xs text-text-muted tracking-wide">{stat.label}</span>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
