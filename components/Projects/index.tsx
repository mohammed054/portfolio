'use client'
import { useRef, useState } from 'react'
import { motion, useInView, AnimatePresence } from 'framer-motion'
import { projects } from '@/lib/data'

/**
 * Projects — Design System compliance:
 * Colors:  surface, border, accent1, accent2, text-primary, text-secondary, text-muted
 * Type:    Syne 800 titles; DM Sans 400 body; Mono t-12 for tags/stack
 * Motion:  dur-slow (600ms) entry stagger; dur-slow (600ms) overlay slide;
 *          ease-enter throughout; scaleHover 1.03–1.05 on cards
 * Spacing: sp-* only; section pad 96–128px
 */

type Project = typeof projects[0]

/* ── Case Study Overlay ────────────────────────────── */
function CaseStudy({ project, onClose }: { project: Project; onClose: () => void }) {
  return (
    <motion.div
      style={{ position:'fixed', inset:0, zIndex:50, overflowY:'auto' }}
      initial={{ opacity:0 }}
      animate={{ opacity:1 }}
      exit={{ opacity:0 }}
      transition={{ duration:0.3 }}
      role="dialog"
      aria-modal="true"
      aria-label={`${project.title} case study`}
    >
      {/* Backdrop */}
      <div
        onClick={onClose}
        style={{
          position:'fixed', inset:0,
          background:'rgba(8,11,20,0.92)',
          backdropFilter:'blur(18px)',
        }}
      />

      {/* Panel — slides up; dur-slow ease-enter */}
      <motion.div
        style={{
          position:'relative', zIndex:10,
          minHeight:'100vh',
          maxWidth:'880px',
          margin:'0 auto',
          padding:'var(--sp-16) var(--sp-6)',
        }}
        initial={{ y:48 }}
        animate={{ y:0 }}
        exit={{ y:48 }}
        transition={{ duration:0.6, ease:[0.22,1,0.36,1] }}  /* dur-slow, ease-enter */
      >
        {/* Close — glass token */}
        <button
          onClick={onClose}
          className="glass"
          style={{
            position:'fixed', top:'var(--sp-6)', right:'var(--sp-6)',
            width:'40px', height:'40px',
            display:'flex', alignItems:'center', justifyContent:'center',
            borderRadius:'50%', cursor:'pointer',
            fontFamily:'var(--font-mono)',
            fontSize:'var(--t-14)', color:'var(--text-secondary)',
            transition:`color var(--dur-base) var(--ease-std),
                        border-color var(--dur-base) var(--ease-std)`,
          }}
          onMouseEnter={e => {
            e.currentTarget.style.color = 'var(--text-primary)'
            e.currentTarget.style.borderColor = 'var(--accent1-40)'
          }}
          onMouseLeave={e => {
            e.currentTarget.style.color = 'var(--text-secondary)'
            e.currentTarget.style.borderColor = 'var(--border)'
          }}
          aria-label="Close"
        >
          ✕
        </button>

        {/* Tag — mono t-12, chip-like with project color */}
        <span style={{
          fontFamily:'var(--font-mono)', fontWeight:400,
          fontSize:'var(--t-12)', lineHeight:'var(--lh-mono)',
          letterSpacing:'0.15em', textTransform:'uppercase',
          padding:'4px var(--sp-3)',
          borderRadius:'999px',
          border:`1px solid ${project.color}40`,
          color: project.color,
          background:`${project.color}10`,
        }}>
          {project.tag}
        </span>

        {/* Title — Syne 800, fluid t-48 */}
        <h2 style={{
          fontFamily:'var(--font-display)', fontWeight:800,
          fontSize:'clamp(var(--t-32),5vw,var(--t-48))',
          lineHeight:'var(--lh-display)',
          color:'var(--text-primary)',
          margin:'var(--sp-4) 0 var(--sp-3)',
        }}>
          {project.title}
        </h2>

        {/* Description — DM Sans 400, t-20, text-secondary */}
        <p style={{
          fontFamily:'var(--font-body)', fontWeight:400,
          fontSize:'var(--t-20)', lineHeight:'var(--lh-body)',
          color:'var(--text-secondary)',
          marginBottom:'var(--sp-12)',
        }}>
          {project.description}
        </p>

        {/* Mock hero — accent background */}
        <div
          style={{
            width:'100%', aspectRatio:'16/7',
            borderRadius:'20px', marginBottom:'var(--sp-12)',
            border:'1px solid var(--border)',
            background:`linear-gradient(135deg, ${project.accentBg}, rgba(14,18,32,0.85))`,
            display:'flex', alignItems:'center', justifyContent:'center',
            overflow:'hidden', position:'relative',
          }}
        >
          {/* Dot pattern */}
          <div style={{
            position:'absolute', inset:0,
            backgroundImage:`radial-gradient(circle, ${project.color} 1px, transparent 1px)`,
            backgroundSize:'28px 28px', opacity:0.07,
          }} aria-hidden="true"/>
          <div style={{ textAlign:'center', position:'relative' }}>
            <div style={{
              width:'64px', height:'64px', borderRadius:'16px',
              display:'flex', alignItems:'center', justifyContent:'center',
              fontFamily:'var(--font-display)', fontWeight:800,
              fontSize:'var(--t-32)', color: project.color,
              background:`${project.color}18`,
              border:`1px solid ${project.color}30`,
              margin:'0 auto var(--sp-3)',
            }}>
              {project.title[0]}
            </div>
            <p style={{
              fontFamily:'var(--font-mono)', fontSize:'var(--t-12)',
              color:'var(--text-muted)', fontWeight:400,
            }}>
              Project Preview
            </p>
          </div>
        </div>

        {/* Problem / Solution — surface glass panels */}
        <div style={{
          display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(280px,1fr))',
          gap:'var(--sp-6)', marginBottom:'var(--sp-12)',
        }}>
          <div className="glass" style={{ borderRadius:'16px', padding:'var(--sp-6)' }}>
            <h3 style={{
              fontFamily:'var(--font-mono)', fontWeight:400,
              fontSize:'var(--t-12)', letterSpacing:'0.18em',
              textTransform:'uppercase', color:'var(--text-muted)',
              marginBottom:'var(--sp-3)', lineHeight:'var(--lh-mono)',
            }}>
              The Problem
            </h3>
            <p className="t-body-sm">{project.problem}</p>
          </div>

          <div className="glass" style={{
            borderRadius:'16px', padding:'var(--sp-6)',
            borderColor:`${project.color}30`,
          }}>
            <h3 style={{
              fontFamily:'var(--font-mono)', fontWeight:400,
              fontSize:'var(--t-12)', letterSpacing:'0.18em',
              textTransform:'uppercase', color: project.color,
              marginBottom:'var(--sp-3)', lineHeight:'var(--lh-mono)',
            }}>
              The Solution
            </h3>
            <p className="t-body-sm">{project.solution}</p>
          </div>
        </div>

        {/* Results */}
        <div style={{ marginBottom:'var(--sp-12)' }}>
          <h3 style={{
            fontFamily:'var(--font-display)', fontWeight:700,
            fontSize:'var(--t-20)', lineHeight:'var(--lh-heading)',
            color:'var(--text-primary)', marginBottom:'var(--sp-6)',
          }}>
            Results
          </h3>
          <div style={{
            display:'grid',
            gridTemplateColumns:'repeat(auto-fill,minmax(200px,1fr))',
            gap:'var(--sp-4)',
          }}>
            {project.results.map((r, i) => (
              <motion.div
                key={i}
                className="glass"
                style={{ borderRadius:'12px', padding:'var(--sp-4)', textAlign:'center' }}
                initial={{ opacity:0, y:12 }}
                animate={{ opacity:1, y:0 }}
                transition={{ delay: i * 0.07 }}
              >
                <p className="t-body-sm" style={{ color:'var(--text-secondary)' }}>{r}</p>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Stack — chip tokens */}
        <div style={{ marginBottom:'var(--sp-12)' }}>
          <h3 style={{
            fontFamily:'var(--font-display)', fontWeight:700,
            fontSize:'var(--t-20)', lineHeight:'var(--lh-heading)',
            color:'var(--text-primary)', marginBottom:'var(--sp-4)',
          }}>
            Tech Stack
          </h3>
          <div style={{ display:'flex', flexWrap:'wrap', gap:'var(--sp-2)' }}>
            {project.stack.map(t => (
              <span key={t} className="chip" style={{ padding:'6px var(--sp-3)' }}>{t}</span>
            ))}
          </div>
        </div>

        {/* Links — btn tokens */}
        <div style={{ display:'flex', gap:'var(--sp-4)' }}>
          {project.liveUrl !== '#' && (
            <a
              href={project.liveUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="btn"
              style={{
                background: project.color,
                color:'var(--background)',
                border:`1px solid ${project.color}`,
                fontFamily:'var(--font-body)', fontWeight:500,
                fontSize:'var(--t-14)', borderRadius:'12px',
                padding:'12px var(--sp-6)',
                textDecoration:'none',
                transition:`opacity var(--dur-base) var(--ease-std),
                            transform var(--dur-fast) var(--ease-std)`,
              }}
              onMouseEnter={e => { e.currentTarget.style.opacity = '0.88'; e.currentTarget.style.transform = `scale(1.04)` }}
              onMouseLeave={e => { e.currentTarget.style.opacity = '1'; e.currentTarget.style.transform = `scale(1)` }}
            >
              ↗ Live Demo
            </a>
          )}
          {project.githubUrl !== '#' && (
            <a
              href={project.githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-ghost"
              style={{ textDecoration:'none' }}
            >
              ⌥ GitHub
            </a>
          )}
        </div>
      </motion.div>
    </motion.div>
  )
}

/* ── Project Card ────────────────────────────────────── */
function ProjectCard({
  project, index, inView, onOpen,
}: {
  project: Project; index: number; inView: boolean; onOpen: () => void
}) {
  const odd = index % 2 !== 0

  return (
    <motion.article
      initial={{ opacity:0, y:36 }}
      animate={inView ? { opacity:1, y:0 } : {}}
      transition={{ duration:0.6, ease:[0.22,1,0.36,1], delay: index * 0.12 }}
      style={{
        display:'grid',
        gridTemplateColumns:'repeat(auto-fit,minmax(300px,1fr))',
        gap:'var(--sp-8)',
        alignItems:'center',
        direction: odd ? 'rtl' : 'ltr',  /* flip alternating rows */
      }}
    >
      {/* ── Visual ─────────────────────────────── */}
      <motion.div
        onClick={onOpen}
        whileHover={{ scale: 1.02 }}           /* scaleHover */
        transition={{ duration: 0.3 }}
        style={{
          aspectRatio:'16/10', borderRadius:'20px', overflow:'hidden',
          cursor:'pointer', position:'relative',
          border:'1px solid var(--border)',
          direction:'ltr',
        }}
      >
        {/* Background */}
        <div style={{
          position:'absolute', inset:0,
          background:`linear-gradient(135deg, ${project.accentBg}, rgba(14,18,32,0.9))`,
        }}/>
        {/* Dot texture */}
        <div style={{
          position:'absolute', inset:0,
          backgroundImage:`radial-gradient(circle, ${project.color} 1px, transparent 1px)`,
          backgroundSize:'24px 24px', opacity:0.07,
        }} aria-hidden="true"/>
        {/* Center monogram */}
        <div style={{
          position:'absolute', inset:0,
          display:'flex', alignItems:'center', justifyContent:'center',
        }}>
          <motion.div
            whileHover={{ scale:1.1 }}
            transition={{ duration:0.3 }}
            style={{
              width:'72px', height:'72px', borderRadius:'18px',
              display:'flex', alignItems:'center', justifyContent:'center',
              fontFamily:'var(--font-display)', fontWeight:800,
              fontSize:'var(--t-32)', color: project.color,
              background:`${project.color}18`, border:`1px solid ${project.color}30`,
            }}
          >
            {project.title[0]}
          </motion.div>
        </div>
        {/* Hover CTA */}
        <div style={{
          position:'absolute', inset:0,
          background:'rgba(8,11,20,0.45)',
          backdropFilter:'blur(4px)',
          display:'flex', alignItems:'center', justifyContent:'center',
          opacity:0, transition:`opacity var(--dur-base) var(--ease-std)`,
        }}
          className="card-hover-overlay"
        >
          <span className="glass" style={{
            fontFamily:'var(--font-body)', fontWeight:500,
            fontSize:'var(--t-14)', lineHeight:'var(--lh-body)',
            color:'var(--text-primary)', padding:'10px var(--sp-6)',
            borderRadius:'12px',
          }}>
            View Case Study →
          </span>
        </div>
      </motion.div>

      {/* ── Content ────────────────────────────── */}
      <div style={{ direction:'ltr' }}>
        {/* Tag */}
        <span style={{
          fontFamily:'var(--font-mono)', fontWeight:400,
          fontSize:'var(--t-12)', lineHeight:'var(--lh-mono)',
          letterSpacing:'0.15em', textTransform:'uppercase',
          padding:'3px var(--sp-3)', borderRadius:'999px',
          border:`1px solid ${project.color}40`,
          color: project.color, background:`${project.color}10`,
        }}>
          {project.tag}
        </span>

        {/* Title — Syne 800, fluid t-32 */}
        <h3 style={{
          fontFamily:'var(--font-display)', fontWeight:800,
          fontSize:'clamp(var(--t-24),3vw,var(--t-32))',
          lineHeight:'var(--lh-heading)', color:'var(--text-primary)',
          margin:'var(--sp-3) 0',
        }}>
          {project.title}
        </h3>

        {/* Summary — DM Sans 400, t-16, text-secondary */}
        <p style={{
          fontFamily:'var(--font-body)', fontWeight:400,
          fontSize:'var(--t-16)', lineHeight:'var(--lh-body)',
          color:'var(--text-secondary)',
          marginBottom:'var(--sp-6)',
        }}>
          {project.summary}
        </p>

        {/* Stack chips */}
        <div style={{ display:'flex', flexWrap:'wrap', gap:'var(--sp-2)', marginBottom:'var(--sp-6)' }}>
          {project.stack.map(t => <span key={t} className="chip">{t}</span>)}
        </div>

        {/* Actions — btn tokens */}
        <div style={{ display:'flex', gap:'var(--sp-3)' }}>
          <button
            onClick={onOpen}
            className="btn btn-primary"
            style={{ padding:'11px var(--sp-6)' }}
          >
            <span>Case Study</span>
          </button>
          {project.githubUrl !== '#' && (
            <a
              href={project.githubUrl}
              target="_blank" rel="noopener noreferrer"
              className="btn btn-ghost"
              style={{ textDecoration:'none', padding:'11px var(--sp-6)' }}
            >
              GitHub
            </a>
          )}
        </div>
      </div>
    </motion.article>
  )
}

/* ── Projects ──────────────────────────────────────── */
export default function Projects() {
  const ref    = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once:true, margin:'-8% 0px' })
  const [open, setOpen] = useState<Project | null>(null)

  return (
    <section id="projects" className="section">
      <div aria-hidden="true" style={{
        position:'absolute', top:0, left:'50%', transform:'translateX(-50%)',
        width:'720px', height:'1px',
        background:'linear-gradient(90deg, transparent, var(--accent2-20), transparent)',
      }}/>

      <div className="section-inner">
        {/* Header */}
        <div ref={ref} style={{ marginBottom:'var(--sp-16)' }}>
          <motion.p
            className="eyebrow"
            initial={{ opacity:0, x:-20 }}
            animate={inView ? { opacity:1, x:0 } : {}}
            transition={{ duration:0.6 }}
            style={{ marginBottom:'var(--sp-4)' }}
          >
            Work
          </motion.p>
          <motion.h2
            style={{ fontSize:'clamp(var(--t-32),5vw,var(--t-48))' }}
            initial={{ opacity:0, y:24 }}
            animate={inView ? { opacity:1, y:0 } : {}}
            transition={{ duration:0.6, ease:[0.22,1,0.36,1], delay:0.08 }}
          >
            Selected Projects
          </motion.h2>
          <motion.p
            className="t-body"
            style={{ maxWidth:'480px', marginTop:'var(--sp-4)' }}
            initial={{ opacity:0, y:24 }}
            animate={inView ? { opacity:1, y:0 } : {}}
            transition={{ duration:0.6, ease:[0.22,1,0.36,1], delay:0.16 }}
          >
            Each project is a case study in decision-making. Click to see the thinking behind the execution.
          </motion.p>
        </div>

        {/* Project list */}
        <div style={{ display:'flex', flexDirection:'column', gap:'var(--sp-24)' }}>
          {projects.map((p, i) => (
            <ProjectCard
              key={p.id} project={p} index={i}
              inView={inView} onOpen={() => setOpen(p)}
            />
          ))}
        </div>
      </div>

      {/* Case study overlay */}
      <AnimatePresence>
        {open && <CaseStudy project={open} onClose={() => setOpen(null)} />}
      </AnimatePresence>

      <style>{`
        article:hover .card-hover-overlay { opacity: 1 !important; }
      `}</style>
    </section>
  )
}
