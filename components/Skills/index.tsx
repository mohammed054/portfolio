'use client'
import { useRef, useState } from 'react'
import { motion, useInView, AnimatePresence } from 'framer-motion'
import { skillDomains } from '@/lib/data'

type Skill = {
  name: string
  years: number
  proficiency: number
  tools: string[]
}

type Domain = typeof skillDomains[0]

/* ── Skill Card Tooltip ───────────────────────────────── */
function SkillCard({ skill, color }: { skill: Skill; color: string }) {
  return (
    <motion.div
      className="glass rounded-xl p-4 w-56 shadow-2xl pointer-events-none"
      initial={{ opacity: 0, y: 8, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 8, scale: 0.95 }}
      transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
      style={{ borderColor: `${color}40` }}
    >
      <div className="flex items-center gap-2 mb-2">
        <div className="w-2 h-2 rounded-full" style={{ background: color }} />
        <span className="font-syne font-bold text-sm text-text-primary">{skill.name}</span>
      </div>
      <p className="font-mono text-xs text-text-muted mb-2">{skill.years} years</p>
      {/* Bar */}
      <div className="w-full h-1.5 bg-border rounded-full overflow-hidden mb-3">
        <motion.div
          className="h-full rounded-full"
          style={{ background: `linear-gradient(90deg, ${color}, ${color}80)` }}
          initial={{ width: 0 }}
          animate={{ width: `${skill.proficiency}%` }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        />
      </div>
      <div className="flex flex-wrap gap-1">
        {skill.tools.map((t) => (
          <span key={t} className="font-mono text-[10px] px-1.5 py-0.5 rounded bg-bg text-text-muted border border-border">
            {t}
          </span>
        ))}
      </div>
    </motion.div>
  )
}

/* ── Domain Card ──────────────────────────────────────── */
function DomainCard({
  domain,
  index,
  isActive,
  onToggle,
  inView,
}: {
  domain: Domain
  index: number
  isActive: boolean
  onToggle: () => void
  inView: boolean
}) {
  const [hoveredSkill, setHoveredSkill] = useState<Skill | null>(null)
  const [hoverPos, setHoverPos] = useState({ x: 0, y: 0 })

  const handleSkillHover = (skill: Skill, e: React.MouseEvent) => {
    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect()
    setHoverPos({ x: rect.left, y: rect.top })
    setHoveredSkill(skill)
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 32 }}
      animate={inView ? { opacity: isActive ? 1 : 0.35, y: 0 } : {}}
      transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1], delay: index * 0.1 }}
      className="relative"
    >
      {/* Domain header */}
      <button
        onClick={onToggle}
        className={`w-full text-left glass rounded-2xl p-5 mb-3 transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent ${
          isActive ? 'glow-border' : 'hover:border-border/80'
        }`}
        style={isActive ? { borderColor: `${domain.color}50`, boxShadow: `0 0 24px ${domain.color}15` } : {}}
        aria-expanded={isActive}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div
              className="w-3 h-3 rounded-full ring-4"
              style={{ background: domain.color, ringColor: `${domain.color}30` }}
            />
            <span className="font-syne font-bold text-base text-text-primary">{domain.label}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="font-mono text-xs text-text-muted">{domain.skills.length} skills</span>
            <motion.span
              animate={{ rotate: isActive ? 180 : 0 }}
              transition={{ duration: 0.3 }}
              className="text-text-muted text-xs"
            >
              ▼
            </motion.span>
          </div>
        </div>
      </button>

      {/* Skill grid */}
      <AnimatePresence>
        {isActive && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            className="overflow-hidden"
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pb-4">
              {domain.skills.map((skill, i) => (
                <motion.div
                  key={skill.name}
                  initial={{ opacity: 0, x: -12 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05, duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                  className="relative group"
                  onMouseEnter={(e) => handleSkillHover(skill, e)}
                  onMouseLeave={() => setHoveredSkill(null)}
                >
                  <div
                    className="glass rounded-xl p-4 cursor-default transition-all duration-200 group-hover:border-opacity-50"
                    style={{ '--hover-color': domain.color } as React.CSSProperties}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-dm text-sm font-medium text-text-primary">{skill.name}</span>
                      <span className="font-mono text-xs text-text-muted">{skill.proficiency}%</span>
                    </div>
                    {/* Progress */}
                    <div className="w-full h-1 bg-border rounded-full overflow-hidden">
                      <motion.div
                        className="h-full rounded-full"
                        style={{ background: `linear-gradient(90deg, ${domain.color}, ${domain.color}70)` }}
                        initial={{ width: 0 }}
                        animate={{ width: `${skill.proficiency}%` }}
                        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1], delay: i * 0.05 + 0.2 }}
                      />
                    </div>
                    <p className="mt-2 font-mono text-xs text-text-muted">{skill.years}y · {skill.tools.slice(0, 2).join(', ')}</p>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Tooltip */}
            <AnimatePresence>
              {hoveredSkill && (
                <div className="fixed z-50" style={{ left: hoverPos.x - 20, top: hoverPos.y - 160 }}>
                  <SkillCard skill={hoveredSkill} color={domain.color} />
                </div>
              )}
            </AnimatePresence>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

/* ── Skills Component ─────────────────────────────────── */
export default function Skills() {
  const titleRef = useRef<HTMLDivElement>(null)
  const inView = useInView(titleRef, { once: true, margin: '-10% 0px' })
  const [activeIndex, setActiveIndex] = useState<number | null>(0)

  const toggle = (i: number) => setActiveIndex(activeIndex === i ? null : i)

  return (
    <section id="skills" className="relative py-24 md:py-32 px-6 overflow-hidden">
      {/* Subtle grid */}
      <div
        className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage: `linear-gradient(#4F8EF7 1px, transparent 1px), linear-gradient(90deg, #4F8EF7 1px, transparent 1px)`,
          backgroundSize: '48px 48px',
        }}
      />

      <div className="max-w-7xl mx-auto">
        <div ref={titleRef} className="mb-16 grid md:grid-cols-2 gap-12 items-end">
          <div>
            <motion.p
              className="section-eyebrow mb-4"
              initial={{ opacity: 0, x: -20 }}
              animate={inView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.6 }}
            >
              Expertise
            </motion.p>
            <motion.h2
              className="font-syne font-extrabold text-text-primary"
              style={{ fontSize: 'clamp(2rem, 5vw, 3.5rem)' }}
              initial={{ opacity: 0, y: 24 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1], delay: 0.1 }}
            >
              What I <span className="text-gradient">Build With</span>
            </motion.h2>
          </div>
          <motion.p
            className="text-text-secondary leading-relaxed"
            initial={{ opacity: 0, y: 24 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1], delay: 0.2 }}
          >
            Organized by domain — click any area to explore the stack. Skills aren't silos; they compound across every project.
          </motion.p>
        </div>

        {/* Domain filter pills */}
        <div className="flex flex-wrap gap-2 mb-10">
          {skillDomains.map((domain, i) => (
            <motion.button
              key={domain.id}
              onClick={() => toggle(i)}
              className={`px-4 py-2 rounded-full font-dm text-sm transition-all duration-200 border focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent ${
                activeIndex === i
                  ? 'text-bg font-medium'
                  : 'text-text-secondary border-border hover:border-text-muted'
              }`}
              style={activeIndex === i ? { background: domain.color, borderColor: domain.color } : {}}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={inView ? { opacity: 1, scale: 1 } : {}}
              transition={{ delay: 0.3 + i * 0.06 }}
            >
              {domain.label}
            </motion.button>
          ))}
        </div>

        {/* Domain cards */}
        <div className="grid md:grid-cols-2 gap-6">
          {skillDomains.map((domain, i) => (
            <DomainCard
              key={domain.id}
              domain={domain}
              index={i}
              isActive={activeIndex === i}
              onToggle={() => toggle(i)}
              inView={inView}
            />
          ))}
        </div>
      </div>
    </section>
  )
}
