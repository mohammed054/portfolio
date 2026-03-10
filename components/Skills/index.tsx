'use client'
import { useRef, useState } from 'react'
import { motion, useInView, AnimatePresence } from 'framer-motion'
import { skillDomains } from '@/lib/data'

/**
 * Skills — Design System compliance:
 * Colors:  surface, border, accent1, accent2, text-primary, text-secondary, text-muted
 * Type:    Syne 700 domain labels; DM Sans 500 skill names; Mono t-12 stats/years
 * Motion:  dur-slow entry (600ms); ease-enter; dur-base accordion (300ms)
 *          scaleHover 1.04 on filter pills
 * Spacing: sp-* only; section pad 96–128px
 */

type Skill   = typeof skillDomains[0]['skills'][0]
type Domain  = typeof skillDomains[0]

/* ── Proficiency bar ────────────────────────────────── */
function ProfBar({ pct, color }: { pct: number; color: string }) {
  return (
    <div style={{
      width:'100%', height:'3px',
      background:'var(--border)', borderRadius:'999px', overflow:'hidden',
      marginTop:'var(--sp-2)', marginBottom:'var(--sp-2)',
    }}>
      <motion.div
        style={{
          height:'100%', borderRadius:'999px',
          background:`linear-gradient(90deg, ${color}, ${color}80)`,
          transformOrigin:'left',
        }}
        initial={{ scaleX:0 }}
        animate={{ scaleX: pct / 100 }}
        transition={{ duration:0.7, ease:[0.22,1,0.36,1] }}
      />
    </div>
  )
}

/* ── Skill row ──────────────────────────────────────── */
function SkillRow({ skill, color, delay }: { skill: Skill; color: string; delay: number }) {
  return (
    <motion.div
      initial={{ opacity:0, x:-10 }}
      animate={{ opacity:1, x:0 }}
      transition={{ delay, duration:0.4, ease:[0.22,1,0.36,1] }}
      style={{
        background:'var(--background)',
        border:'1px solid var(--border)',
        borderRadius:'12px',
        padding:'var(--sp-4) var(--sp-4)',
        transition:`border-color var(--dur-base) var(--ease-std)`,
      }}
      onMouseEnter={e => (e.currentTarget.style.borderColor = `${color}40`)}
      onMouseLeave={e => (e.currentTarget.style.borderColor = 'var(--border)')}
    >
      {/* Name + percentage */}
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center' }}>
        <span style={{
          fontFamily:'var(--font-body)', fontWeight:500,
          fontSize:'var(--t-14)', lineHeight:'var(--lh-body)',
          color:'var(--text-primary)',
        }}>
          {skill.name}
        </span>
        <span style={{
          fontFamily:'var(--font-mono)', fontWeight:400,
          fontSize:'var(--t-12)', lineHeight:'var(--lh-mono)',
          color:'var(--text-muted)',
        }}>
          {skill.proficiency}%
        </span>
      </div>

      {/* Progress bar */}
      <ProfBar pct={skill.proficiency} color={color} />

      {/* Years + tools — mono t-12, text-muted */}
      <p style={{
        fontFamily:'var(--font-mono)', fontWeight:400,
        fontSize:'var(--t-12)', lineHeight:'var(--lh-mono)',
        color:'var(--text-muted)',
      }}>
        {skill.years}yr · {skill.tools.slice(0,3).join(', ')}
      </p>
    </motion.div>
  )
}

/* ── Domain accordion ──────────────────────────────── */
function DomainCard({
  domain, index, isActive, onToggle, inView,
}: {
  domain: Domain; index: number; isActive: boolean; onToggle: () => void; inView: boolean
}) {
  return (
    <motion.div
      initial={{ opacity:0, y:28 }}
      animate={inView ? { opacity: isActive ? 1 : 0.38, y:0 } : {}}
      transition={{ duration:0.6, ease:[0.22,1,0.36,1], delay: index * 0.09 }}
    >
      {/* Domain header button */}
      <button
        onClick={onToggle}
        aria-expanded={isActive}
        style={{
          width:'100%', textAlign:'left',
          background: isActive ? 'var(--surface)' : 'var(--background)',
          border:`1px solid ${isActive ? `${domain.color}40` : 'var(--border)'}`,
          borderRadius:'16px',
          padding:'var(--sp-4) var(--sp-6)',
          cursor:'pointer',
          marginBottom:'var(--sp-3)',
          display:'flex', alignItems:'center', justifyContent:'space-between',
          boxShadow: isActive ? `0 0 24px ${domain.color}12` : 'none',
          transition:`all var(--dur-base) var(--ease-std)`,
        }}
        onMouseEnter={e => {
          if (!isActive) (e.currentTarget.style.borderColor = 'var(--border)')
        }}
      >
        <div style={{ display:'flex', alignItems:'center', gap:'var(--sp-3)' }}>
          {/* Domain color dot */}
          <div style={{
            width:'12px', height:'12px', borderRadius:'50%',
            background: domain.color,
            boxShadow: isActive ? `0 0 10px ${domain.color}60` : 'none',
          }} aria-hidden="true" />
          {/* Label — Syne 700, t-16 */}
          <span style={{
            fontFamily:'var(--font-display)', fontWeight:700,
            fontSize:'var(--t-16)', lineHeight:'var(--lh-heading)',
            color:'var(--text-primary)',
          }}>
            {domain.label}
          </span>
        </div>

        <div style={{ display:'flex', alignItems:'center', gap:'var(--sp-3)' }}>
          {/* Skill count — mono t-12, text-muted */}
          <span style={{
            fontFamily:'var(--font-mono)', fontWeight:400,
            fontSize:'var(--t-12)', lineHeight:'var(--lh-mono)',
            color:'var(--text-muted)',
          }}>
            {domain.skills.length} skills
          </span>
          {/* Chevron */}
          <motion.span
            animate={{ rotate: isActive ? 180 : 0 }}
            transition={{ duration: 0.3 }}  /* dur-base-ish */
            style={{
              fontFamily:'var(--font-mono)', fontSize:'var(--t-12)',
              color:'var(--text-muted)', display:'block',
            }}
            aria-hidden="true"
          >
            ▼
          </motion.span>
        </div>
      </button>

      {/* Skill grid — dur-base accordion */}
      <AnimatePresence>
        {isActive && (
          <motion.div
            initial={{ height:0, opacity:0 }}
            animate={{ height:'auto', opacity:1 }}
            exit={{ height:0, opacity:0 }}
            transition={{ duration:0.3, ease:[0.22,1,0.36,1] }}  /* dur-base */
            style={{ overflow:'hidden' }}
          >
            <div style={{
              display:'grid',
              gridTemplateColumns:'repeat(auto-fill, minmax(260px, 1fr))',
              gap:'var(--sp-3)',
              paddingBottom:'var(--sp-4)',
            }}>
              {domain.skills.map((skill, i) => (
                <SkillRow
                  key={skill.name}
                  skill={skill}
                  color={domain.color}
                  delay={i * 0.05}
                />
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

/* ── Skills ─────────────────────────────────────────── */
export default function Skills() {
  const ref    = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once:true, margin:'-8% 0px' })
  const [active, setActive] = useState<number | null>(0)

  return (
    <section id="skills" className="section">
      {/* Subtle dot grid — matches spec aesthetic */}
      <div aria-hidden="true" style={{
        position:'absolute', inset:0, pointerEvents:'none',
        backgroundImage:`radial-gradient(circle, var(--border) 1px, transparent 1px)`,
        backgroundSize:'32px 32px', opacity:0.5,
      }}/>

      <div className="section-inner">
        {/* Header */}
        <div
          ref={ref}
          style={{
            display:'grid', gridTemplateColumns:'1fr 1fr', gap:'var(--sp-8)',
            alignItems:'end', marginBottom:'var(--sp-12)',
          }}
        >
          <div>
            <motion.p
              className="eyebrow"
              initial={{ opacity:0, x:-20 }}
              animate={inView ? { opacity:1, x:0 } : {}}
              transition={{ duration:0.6 }}
              style={{ marginBottom:'var(--sp-4)' }}
            >
              Expertise
            </motion.p>
            <motion.h2
              style={{ fontSize:'clamp(var(--t-32),5vw,var(--t-48))' }}
              initial={{ opacity:0, y:24 }}
              animate={inView ? { opacity:1, y:0 } : {}}
              transition={{ duration:0.6, ease:[0.22,1,0.36,1], delay:0.08 }}
            >
              What I{' '}
              <span className="text-grad">Build With</span>
            </motion.h2>
          </div>

          <motion.p
            className="t-body"
            initial={{ opacity:0, y:24 }}
            animate={inView ? { opacity:1, y:0 } : {}}
            transition={{ duration:0.6, ease:[0.22,1,0.36,1], delay:0.16 }}
          >
            Organized by domain. Click to explore the stack — skills compound across every project.
          </motion.p>
        </div>

        {/* Filter pills — scaleHover 1.04, dur-base transitions */}
        <div style={{
          display:'flex', flexWrap:'wrap',
          gap:'var(--sp-2)', marginBottom:'var(--sp-8)',
        }}>
          {skillDomains.map((d, i) => (
            <motion.button
              key={d.id}
              onClick={() => setActive(active === i ? null : i)}
              initial={{ opacity:0, scale:0.9 }}
              animate={inView ? { opacity:1, scale:1 } : {}}
              transition={{ delay: 0.28 + i * 0.06 }}
              whileHover={{ scale: 1.04 }}              /* scaleHover */
              whileTap={{ scale: 0.97 }}
              style={{
                fontFamily:'var(--font-body)', fontWeight:500,
                fontSize:'var(--t-14)', lineHeight:'var(--lh-body)',
                padding:'6px var(--sp-4)',
                borderRadius:'999px',
                border:`1px solid ${active === i ? d.color : 'var(--border)'}`,
                color: active === i ? 'var(--background)' : 'var(--text-secondary)',
                background: active === i ? d.color : 'transparent',
                cursor:'pointer',
                transition:`all var(--dur-base) var(--ease-std)`,
              }}
            >
              {d.label}
            </motion.button>
          ))}
        </div>

        {/* Domains */}
        <div style={{ display:'flex', flexDirection:'column', gap:'var(--sp-3)' }}>
          {skillDomains.map((d, i) => (
            <DomainCard
              key={d.id}
              domain={d}
              index={i}
              isActive={active === i}
              onToggle={() => setActive(active === i ? null : i)}
              inView={inView}
            />
          ))}
        </div>
      </div>
    </section>
  )
}
