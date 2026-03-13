// components/UIOverlay.tsx
'use client'

import React, {
  useRef,
  useState,
  useEffect,
  useCallback,
  MutableRefObject,
} from 'react'
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion'

// ─── Types ────────────────────────────────────────────────────
interface UIOverlayProps {
  sectionIndex:    number
  onSectionChange: (i: number) => void
  isTransitioning: boolean
}

// ─── Constants ────────────────────────────────────────────────
export const SECTION_NAMES  = ['Hero', 'Projects', 'About', 'Testimonials', 'Contact'] as const
export const SECTION_LABELS = ['01', '02', '03', '04', '05']
export type  SectionName    = (typeof SECTION_NAMES)[number]

// ─── Design tokens (mirror CSS vars) ─────────────────────────
const COLORS = {
  accent1:  '#4F8EF7',
  accent2:  '#8B5CF6',
  textPri:  '#F0F4FF',
  textSec:  '#7A89A8',
  bg:       '#080B14',
  glassBg:  'rgba(255,255,255,0.04)',
  glassBdr: 'rgba(255,255,255,0.09)',
}

// ─── Motion presets ───────────────────────────────────────────
const fadeUp = {
  hidden:  { opacity: 0, y: 24 },
  visible: { opacity: 1, y:  0 },
  exit:    { opacity: 0, y: -18 },
}

const fadeIn = {
  hidden:  { opacity: 0 },
  visible: { opacity: 1 },
  exit:    { opacity: 0 },
}

const slideRight = {
  hidden:  { opacity: 0, x: -32 },
  visible: { opacity: 1, x:   0 },
  exit:    { opacity: 0, x:  32 },
}

const trans = (delay = 0) => ({
  duration: 0.75,
  ease: [0.22, 1, 0.36, 1],
  delay,
})

// ─── Global styles (injected once) ───────────────────────────
const GLOBAL_CSS = `
  *, *::before, *::after { box-sizing: border-box; }
  @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Sans:ital,wght@0,300;0,400;0,500;1,300&family=DM+Mono:wght@300;400&display=swap');

  :root {
    --accent1:   #4F8EF7;
    --accent2:   #8B5CF6;
    --text-pri:  #F0F4FF;
    --text-sec:  #7A89A8;
    --glass-bg:  rgba(255,255,255,0.04);
    --glass-bdr: rgba(255,255,255,0.09);
  }

  body { cursor: none; }

  .ui-root {
    font-family: 'DM Sans', sans-serif;
    color: var(--text-pri);
  }

  /* ---------- Glass card ---------- */
  .glass {
    background: var(--glass-bg);
    border: 1px solid var(--glass-bdr);
    border-radius: 16px;
    backdrop-filter: blur(20px);
    -webkit-backdrop-filter: blur(20px);
  }

  /* ---------- Eyebrow ---------- */
  .eyebrow {
    font-family: 'DM Mono', monospace;
    font-size: 0.65rem;
    letter-spacing: 0.22em;
    text-transform: uppercase;
    color: var(--accent1);
    display: flex;
    align-items: center;
    gap: 10px;
    opacity: 0.9;
  }
  .eyebrow::before {
    content: '';
    display: block;
    width: 28px; height: 1px;
    background: var(--accent1);
    opacity: 0.6;
  }

  /* ---------- Heading ---------- */
  .t-display {
    font-family: 'Syne', sans-serif;
    font-weight: 800;
    font-size: clamp(2.6rem, 6.5vw, 6rem);
    letter-spacing: -0.025em;
    line-height: 1.06;
    background: linear-gradient(135deg, #fff 28%, var(--accent1) 62%, var(--accent2) 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }
  .t-h2 {
    font-family: 'Syne', sans-serif;
    font-weight: 700;
    font-size: clamp(1.6rem, 3.5vw, 2.8rem);
    letter-spacing: -0.02em;
    line-height: 1.15;
    background: linear-gradient(135deg, #fff 40%, var(--accent1) 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }
  .t-h3 {
    font-family: 'Syne', sans-serif;
    font-weight: 600;
    font-size: clamp(1rem, 2vw, 1.4rem);
    letter-spacing: -0.01em;
  }
  .t-body {
    font-family: 'DM Sans', sans-serif;
    font-size: clamp(0.88rem, 1.4vw, 1.05rem);
    line-height: 1.7;
    color: var(--text-sec);
    font-weight: 300;
  }
  .t-mono {
    font-family: 'DM Mono', monospace;
    font-size: 0.72rem;
    letter-spacing: 0.08em;
  }

  /* ---------- Buttons ---------- */
  .btn {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    font-family: 'DM Sans', sans-serif;
    font-size: 0.83rem;
    font-weight: 500;
    letter-spacing: 0.04em;
    padding: 12px 26px;
    border-radius: 50px;
    border: 1px solid var(--glass-bdr);
    background: var(--glass-bg);
    color: var(--text-pri);
    cursor: pointer;
    position: relative;
    overflow: hidden;
    backdrop-filter: blur(10px);
    transition: border-color 0.3s, color 0.3s, transform 0.25s;
    text-decoration: none;
  }
  .btn::after {
    content: '';
    position: absolute; inset: 0;
    background: linear-gradient(135deg, var(--accent1), var(--accent2));
    opacity: 0;
    transition: opacity 0.3s;
    border-radius: inherit;
  }
  .btn:hover { border-color: transparent; transform: translateY(-2px); }
  .btn:hover::after { opacity: 1; }
  .btn span { position: relative; z-index: 1; }
  .btn:focus-visible { outline: 2px solid var(--accent1); outline-offset: 3px; }

  .btn-ghost {
    background: transparent;
    border-color: rgba(79,142,247,0.35);
    color: var(--accent1);
  }

  /* ---------- Tag chips ---------- */
  .tag {
    display: inline-flex;
    align-items: center;
    padding: 3px 10px;
    border-radius: 99px;
    border: 1px solid rgba(79,142,247,0.3);
    font-family: 'DM Mono', monospace;
    font-size: 0.62rem;
    letter-spacing: 0.1em;
    color: var(--accent1);
    background: rgba(79,142,247,0.06);
  }

  /* ---------- Cursor ---------- */
  #ui-cursor, #ui-cursor-ring {
    position: fixed;
    pointer-events: none;
    z-index: 9999;
    border-radius: 50%;
    transform: translate(-50%, -50%);
  }
  #ui-cursor {
    width: 10px; height: 10px;
    background: var(--accent1);
    transition: transform 0.1s, width 0.25s, height 0.25s;
    mix-blend-mode: screen;
  }
  #ui-cursor-ring {
    width: 34px; height: 34px;
    border: 1px solid rgba(79,142,247,0.45);
    transition: transform 0.22s cubic-bezier(0.22,1,0.36,1),
                width 0.22s, height 0.22s, border-color 0.22s;
  }

  /* ---------- Scroll hint arrow ---------- */
  @keyframes bounce-x {
    0%,100% { transform: translateX(0);    }
    50%      { transform: translateX(5px); }
  }
  .scroll-hint-arrow { animation: bounce-x 1.8s ease-in-out infinite; }

  /* ---------- Skill pill ---------- */
  .skill-pill {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    padding: 5px 14px;
    border-radius: 99px;
    border: 1px solid var(--glass-bdr);
    background: var(--glass-bg);
    font-family: 'DM Mono', monospace;
    font-size: 0.68rem;
    letter-spacing: 0.06em;
    color: var(--text-sec);
    backdrop-filter: blur(8px);
  }
  .skill-dot {
    width: 6px; height: 6px; border-radius: 50%;
  }

  /* ---------- Input fields ---------- */
  .field {
    width: 100%;
    background: rgba(255,255,255,0.03);
    border: 1px solid var(--glass-bdr);
    border-radius: 10px;
    padding: 12px 16px;
    color: var(--text-pri);
    font-family: 'DM Sans', sans-serif;
    font-size: 0.88rem;
    outline: none;
    transition: border-color 0.25s, background 0.25s;
    resize: none;
  }
  .field::placeholder { color: var(--text-sec); opacity: 0.6; }
  .field:focus {
    border-color: var(--accent1);
    background: rgba(79,142,247,0.06);
  }

  /* ---------- Progress ---------- */
  #progress-fill {
    background: linear-gradient(90deg, var(--accent1), var(--accent2));
    height: 100%;
    border-radius: 2px;
    transition: width 0.9s cubic-bezier(0.22,1,0.36,1);
  }

  /* ---------- Reduce motion ---------- */
  @media (prefers-reduced-motion: reduce) {
    *, *::before, *::after {
      animation-duration: 0.01ms !important;
      transition-duration: 0.01ms !important;
    }
  }
`

// ─── Custom cursor ────────────────────────────────────────────
function Cursor() {
  const dotRef  = useRef<HTMLDivElement>(null)
  const ringRef = useRef<HTMLDivElement>(null)
  const pos     = useRef({ x: -100, y: -100 })
  const ring    = useRef({ x: -100, y: -100 })
  const hovering = useRef(false)
  const raf     = useRef<number>()

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      pos.current = { x: e.clientX, y: e.clientY }
      const el = e.target as HTMLElement
      hovering.current = !!(el.closest('a, button, [role=button], input, textarea'))
    }
    window.addEventListener('mousemove', onMove)
    return () => window.removeEventListener('mousemove', onMove)
  }, [])

  useEffect(() => {
    const tick = () => {
      ring.current.x += (pos.current.x - ring.current.x) * 0.14
      ring.current.y += (pos.current.y - ring.current.y) * 0.14
      if (dotRef.current) {
        dotRef.current.style.left = `${pos.current.x}px`
        dotRef.current.style.top  = `${pos.current.y}px`
        dotRef.current.style.transform = `translate(-50%,-50%) scale(${hovering.current ? 2.4 : 1})`
      }
      if (ringRef.current) {
        ringRef.current.style.left   = `${ring.current.x}px`
        ringRef.current.style.top    = `${ring.current.y}px`
        ringRef.current.style.width  = hovering.current ? '54px' : '34px'
        ringRef.current.style.height = hovering.current ? '54px' : '34px'
        ringRef.current.style.borderColor = hovering.current
          ? 'rgba(139,92,246,0.65)'
          : 'rgba(79,142,247,0.45)'
      }
      raf.current = requestAnimationFrame(tick)
    }
    raf.current = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf.current!)
  }, [])

  return (
    <>
      <div id="ui-cursor"      ref={dotRef}  />
      <div id="ui-cursor-ring" ref={ringRef} />
    </>
  )
}

// ─── Nav dots ─────────────────────────────────────────────────
function NavDots({
  current,
  onChange,
}: {
  current: number
  onChange: (i: number) => void
}) {
  return (
    <nav
      aria-label="Section navigation"
      style={{
        position: 'fixed',
        right: 28,
        top: '50%',
        transform: 'translateY(-50%)',
        display: 'flex',
        flexDirection: 'column',
        gap: 14,
        zIndex: 900,
      }}
    >
      {SECTION_NAMES.map((name, i) => (
        <button
          key={name}
          aria-label={`Go to ${name}`}
          onClick={() => onChange(i)}
          style={{
            width: current === i ? 22 : 7,
            height: 7,
            borderRadius: 99,
            border: 'none',
            background: current === i
              ? COLORS.accent1
              : 'rgba(122,137,168,0.45)',
            cursor: 'pointer',
            transition: 'all 0.35s cubic-bezier(0.22,1,0.36,1)',
            boxShadow: current === i ? `0 0 10px ${COLORS.accent1}88` : 'none',
            outline: 'none',
          }}
          onFocus={(e) => { (e.target as HTMLElement).style.outline = `2px solid ${COLORS.accent1}` }}
          onBlur ={(e) => { (e.target as HTMLElement).style.outline = 'none' }}
        />
      ))}
    </nav>
  )
}

// ─── Progress bar ─────────────────────────────────────────────
function ProgressBar({ index }: { index: number }) {
  const pct = (index / (SECTION_NAMES.length - 1)) * 100
  return (
    <div
      style={{
        position: 'fixed',
        bottom: 28,
        left: '50%',
        transform: 'translateX(-50%)',
        display: 'flex',
        alignItems: 'center',
        gap: 12,
        zIndex: 900,
      }}
    >
      <span
        className="t-mono"
        style={{ color: COLORS.textSec, minWidth: 48 }}
      >
        {SECTION_LABELS[index]} / 05
      </span>
      <div
        style={{
          width: 160,
          height: 2,
          background: 'rgba(255,255,255,0.08)',
          borderRadius: 2,
          overflow: 'hidden',
        }}
      >
        <div id="progress-fill" style={{ width: `${pct}%` }} />
      </div>
      <span
        className="t-mono"
        style={{ color: COLORS.textSec, minWidth: 72, textAlign: 'right' }}
      >
        {SECTION_NAMES[index]}
      </span>
    </div>
  )
}

// ─── Top-left logo mark ───────────────────────────────────────
function LogoMark({ onHome }: { onHome: () => void }) {
  return (
    <motion.button
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1, delay: 1.5 }}
      onClick={onHome}
      className="btn"
      style={{
        position: 'fixed',
        top: 28,
        left: 28,
        zIndex: 900,
        padding: '8px 18px',
        fontSize: '0.75rem',
        background: 'transparent',
        border: `1px solid ${COLORS.glassBdr}`,
      }}
      aria-label="Back to Hero"
    >
      <span style={{ fontFamily: "'Syne',sans-serif", fontWeight: 700, letterSpacing: '-0.02em' }}>
        MH<span style={{ color: COLORS.accent1 }}>.</span>
      </span>
    </motion.button>
  )
}

// ─── Section-specific content ─────────────────────────────────

// 1. HERO
function HeroContent({ onNext }: { onNext: () => void }) {
  return (
    <motion.div
      variants={fadeIn}
      initial="hidden"
      animate="visible"
      exit="exit"
      transition={{ duration: 0.6 }}
      style={{
        position: 'absolute',
        inset: 0,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        padding: '0 24px',
        pointerEvents: 'none',
      }}
    >
      <motion.p
        className="eyebrow"
        variants={fadeUp}
        initial="hidden"
        animate="visible"
        transition={trans(0.3)}
        style={{ justifyContent: 'center', marginBottom: '1.2rem' }}
      >
        Full Stack Engineer & AI Specialist
      </motion.p>

      <motion.h1
        className="t-display"
        variants={fadeUp}
        initial="hidden"
        animate="visible"
        transition={trans(0.55)}
      >
        Mohammed
        <br />
        Hassoun
      </motion.h1>

      <motion.p
        className="t-body"
        variants={fadeUp}
        initial="hidden"
        animate="visible"
        transition={trans(0.85)}
        style={{
          maxWidth: 440,
          marginTop: '1.3rem',
          lineHeight: 1.75,
        }}
      >
        Building intelligent systems at the intersection of
        modern web engineering and artificial intelligence.
        Open to impactful roles worldwide.
      </motion.p>

      <motion.div
        variants={fadeUp}
        initial="hidden"
        animate="visible"
        transition={trans(1.1)}
        style={{
          display: 'flex',
          gap: 14,
          marginTop: '2.2rem',
          pointerEvents: 'auto',
          flexWrap: 'wrap',
          justifyContent: 'center',
        }}
      >
        <button className="btn" onClick={onNext}>
          <span>View Work</span>
          <span style={{ color: COLORS.accent1 }}>→</span>
        </button>
        <a
          href="mailto:hi@mohammedhassoun.dev"
          className="btn btn-ghost"
        >
          <span>Get in Touch</span>
        </a>
      </motion.div>

      {/* Scroll hint */}
      <motion.div
        variants={fadeIn}
        initial="hidden"
        animate="visible"
        transition={trans(2)}
        style={{
          position: 'absolute',
          bottom: 70,
          display: 'flex',
          alignItems: 'center',
          gap: 10,
          color: COLORS.textSec,
          fontSize: '0.6rem',
          letterSpacing: '0.2em',
          textTransform: 'uppercase',
          fontFamily: "'DM Mono',monospace",
          pointerEvents: 'none',
        }}
      >
        Scroll or use arrow keys
        <span className="scroll-hint-arrow" style={{ fontSize: '0.8rem' }}>›</span>
      </motion.div>
    </motion.div>
  )
}

// 2. PROJECTS
const PROJECTS_DATA = [
  {
    title:   'AI Dashboard Platform',
    desc:    'Real-time LLM monitoring & analytics with streaming insights and custom model evaluation pipelines.',
    tags:    ['Next.js', 'Python', 'LLMs', 'WebSocket'],
    color:   COLORS.accent1,
    year:    '2024',
  },
  {
    title:   'Neural Search API',
    desc:    'Semantic vector search engine serving 50M+ queries/month with sub-10ms response times.',
    tags:    ['FastAPI', 'Pinecone', 'TypeScript', 'Redis'],
    color:   COLORS.accent2,
    year:    '2024',
  },
  {
    title:   'Real-Time Collab Suite',
    desc:    'Notion-like collaborative editor with AI writing assistance, live presence, and conflict-free sync.',
    tags:    ['React', 'CRDTs', 'OpenAI', 'PostgreSQL'],
    color:   COLORS.accent1,
    year:    '2023',
  },
]

function ProjectsContent() {
  return (
    <motion.div
      variants={fadeIn}
      initial="hidden"
      animate="visible"
      exit="exit"
      transition={{ duration: 0.5 }}
      style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', padding: '0 6vw' }}
    >
      <div style={{ width: '100%' }}>
        <motion.p className="eyebrow" variants={fadeUp} initial="hidden" animate="visible" transition={trans(0.1)}
          style={{ marginBottom: '0.9rem' }}>
          Selected Work
        </motion.p>
        <motion.h2 className="t-h2" variants={fadeUp} initial="hidden" animate="visible" transition={trans(0.25)}
          style={{ marginBottom: '2.2rem' }}>
          Spotlighted Projects
        </motion.h2>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 18 }}>
          {PROJECTS_DATA.map((p, i) => (
            <motion.div
              key={p.title}
              className="glass"
              variants={fadeUp}
              initial="hidden"
              animate="visible"
              transition={trans(0.35 + i * 0.12)}
              whileHover={{ y: -6, boxShadow: `0 12px 40px ${p.color}22` }}
              style={{ padding: '22px 24px', cursor: 'pointer' }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 10 }}>
                <span className="t-mono" style={{ color: p.color }}>{p.year}</span>
                <span style={{ color: COLORS.textSec, fontSize: '0.7rem', fontFamily: "'DM Mono',monospace" }}>↗</span>
              </div>
              <h3 className="t-h3" style={{ color: COLORS.textPri, marginBottom: 8, fontSize: '1rem' }}>{p.title}</h3>
              <p className="t-body" style={{ fontSize: '0.82rem', lineHeight: 1.6, marginBottom: 16 }}>{p.desc}</p>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                {p.tags.map((tag) => <span key={tag} className="tag">{tag}</span>)}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.div>
  )
}

// 3. ABOUT
const SKILL_PILLS = [
  { label: 'React / Next.js', color: '#61DAFB' },
  { label: 'TypeScript',      color: '#3178C6' },
  { label: 'Python',          color: '#FFD43B' },
  { label: 'AI / LLMs',      color: COLORS.accent2 },
  { label: 'Node.js',         color: '#68A063' },
  { label: 'PostgreSQL',      color: '#336791' },
  { label: 'Three.js',        color: COLORS.accent1 },
  { label: 'AWS / GCP',       color: '#FF9900' },
]

function AboutContent() {
  return (
    <motion.div
      variants={fadeIn}
      initial="hidden"
      animate="visible"
      exit="exit"
      transition={{ duration: 0.5 }}
      style={{
        position: 'absolute', inset: 0,
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        alignItems: 'center',
        padding: '0 6vw',
        gap: '4vw',
      }}
    >
      {/* Left: Bio */}
      <div>
        <motion.p className="eyebrow" variants={slideRight} initial="hidden" animate="visible" transition={trans(0.1)}
          style={{ marginBottom: '0.9rem' }}>
          About Me
        </motion.p>
        <motion.h2 className="t-h2" variants={slideRight} initial="hidden" animate="visible" transition={trans(0.25)}
          style={{ marginBottom: '1.4rem' }}>
          Constellation of Skills
        </motion.h2>
        <motion.p className="t-body" variants={slideRight} initial="hidden" animate="visible" transition={trans(0.4)}
          style={{ marginBottom: '1rem' }}>
          I'm a full-stack engineer with 6+ years building production systems —
          from high-throughput APIs to polished React interfaces — with a
          growing focus on applied AI and LLM product engineering.
        </motion.p>
        <motion.p className="t-body" variants={slideRight} initial="hidden" animate="visible" transition={trans(0.52)}
          style={{ marginBottom: '1.8rem' }}>
          I care deeply about developer experience, performance, and the craft
          of shipping things that genuinely work at scale.
        </motion.p>
        <motion.div
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          transition={trans(0.65)}
          style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}
        >
          {SKILL_PILLS.map((s, i) => (
            <motion.span
              key={s.label}
              className="skill-pill"
              initial={{ opacity: 0, scale: 0.85 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.7 + i * 0.07, duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            >
              <span className="skill-dot" style={{ background: s.color }} />
              {s.label}
            </motion.span>
          ))}
        </motion.div>
      </div>

      {/* Right: Stats */}
      <motion.div
        variants={fadeUp}
        initial="hidden"
        animate="visible"
        transition={trans(0.5)}
        style={{ display: 'flex', flexDirection: 'column', gap: 16 }}
      >
        {[
          { num: '6+',   label: 'Years of Experience',      accent: COLORS.accent1 },
          { num: '40+',  label: 'Production Projects',       accent: COLORS.accent2 },
          { num: '50M+', label: 'API Requests Served / mo.', accent: COLORS.accent1 },
          { num: '12+',  label: 'Open-Source Contributions', accent: COLORS.accent2 },
        ].map((stat, i) => (
          <motion.div
            key={stat.label}
            className="glass"
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.55 + i * 0.1, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            style={{ padding: '16px 22px', display: 'flex', alignItems: 'center', gap: 18 }}
          >
            <span style={{
              fontFamily: "'Syne',sans-serif",
              fontWeight: 800,
              fontSize: 'clamp(1.6rem, 3vw, 2.2rem)',
              color: stat.accent,
              minWidth: 70,
            }}>
              {stat.num}
            </span>
            <span className="t-body" style={{ fontSize: '0.85rem' }}>{stat.label}</span>
          </motion.div>
        ))}
      </motion.div>
    </motion.div>
  )
}

// 4. TESTIMONIALS
const TESTIMONIALS_DATA = [
  {
    quote:  "Mohammed shipped a full AI pipeline in two weeks that our previous team estimated at two months. Exceptional engineer.",
    name:   "Sarah Chen",
    role:   "CTO, DataLayer",
    color:  COLORS.accent2,
  },
  {
    quote:  "The product he built scaled effortlessly from 1k to 500k users without a single incident. I'd hire him again immediately.",
    name:   "James Okafor",
    role:   "VP Engineering, Stackmesh",
    color:  COLORS.accent1,
  },
  {
    quote:  "Rarely do you find someone who writes production-quality code AND communicates with such clarity to non-technical stakeholders.",
    name:   "Leila Nouri",
    role:   "Product Lead, Verona AI",
    color:  COLORS.accent2,
  },
]

function TestimonialsContent() {
  return (
    <motion.div
      variants={fadeIn}
      initial="hidden"
      animate="visible"
      exit="exit"
      transition={{ duration: 0.5 }}
      style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '0 6vw' }}
    >
      <motion.p className="eyebrow" variants={fadeUp} initial="hidden" animate="visible" transition={trans(0.1)}
        style={{ justifyContent: 'center', marginBottom: '0.9rem' }}>
        Testimonials
      </motion.p>
      <motion.h2 className="t-h2" variants={fadeUp} initial="hidden" animate="visible" transition={trans(0.25)}
        style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
        Orbiting Lights
      </motion.h2>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 20, width: '100%', maxWidth: 1000 }}>
        {TESTIMONIALS_DATA.map((t, i) => (
          <motion.div
            key={t.name}
            className="glass"
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            transition={trans(0.35 + i * 0.15)}
            whileHover={{ y: -5, scale: 1.02, boxShadow: `0 16px 48px ${t.color}22` }}
            style={{ padding: '26px 24px', position: 'relative' }}
          >
            {/* Quote mark */}
            <span style={{
              position: 'absolute', top: 16, right: 20,
              fontFamily: "'Syne',sans-serif", fontWeight: 800,
              fontSize: '3.5rem', lineHeight: 1,
              color: t.color, opacity: 0.18,
            }}>"</span>

            <p className="t-body" style={{ fontSize: '0.87rem', lineHeight: 1.7, marginBottom: 20, fontStyle: 'italic' }}>
              "{t.quote}"
            </p>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <div style={{
                width: 36, height: 36, borderRadius: '50%',
                background: `linear-gradient(135deg, ${t.color}88, ${t.color}33)`,
                border: `1px solid ${t.color}44`,
                flexShrink: 0,
              }} />
              <div>
                <div style={{ fontFamily: "'Syne',sans-serif", fontWeight: 600, fontSize: '0.85rem', color: COLORS.textPri }}>{t.name}</div>
                <div className="t-mono" style={{ color: COLORS.textSec, marginTop: 2 }}>{t.role}</div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  )
}

// 5. CONTACT
function ContactContent() {
  const [sent, setSent] = useState(false)

  return (
    <motion.div
      variants={fadeIn}
      initial="hidden"
      animate="visible"
      exit="exit"
      transition={{ duration: 0.5 }}
      style={{
        position: 'absolute', inset: 0,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '0 24px',
      }}
    >
      <motion.div
        className="glass"
        variants={fadeUp}
        initial="hidden"
        animate="visible"
        transition={trans(0.2)}
        style={{ width: '100%', maxWidth: 480, padding: '40px 36px' }}
      >
        <p className="eyebrow" style={{ marginBottom: '0.8rem' }}>Contact</p>
        <h2 className="t-h2" style={{ marginBottom: '0.5rem', fontSize: 'clamp(1.4rem, 3vw, 2rem)' }}>
          Beacon Form
        </h2>
        <p className="t-body" style={{ marginBottom: '2rem', fontSize: '0.85rem' }}>
          Let's build something meaningful. Drop a message and I'll reply within 24h.
        </p>

        {sent ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.92 }}
            animate={{ opacity: 1, scale: 1 }}
            style={{ textAlign: 'center', padding: '24px 0' }}
          >
            <div style={{ fontSize: '2.5rem', marginBottom: 12 }}>✦</div>
            <p className="t-h3" style={{ color: COLORS.accent1, marginBottom: 8 }}>Message Sent!</p>
            <p className="t-body" style={{ fontSize: '0.85rem' }}>I'll be in touch soon.</p>
          </motion.div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <input  className="field" placeholder="Your name"         />
            <input  className="field" placeholder="Email address"     type="email" />
            <textarea className="field" placeholder="Your message..."  rows={4} style={{ resize: 'none' }} />
            <motion.button
              className="btn"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setSent(true)}
              style={{
                justifyContent: 'center',
                padding: '14px',
                fontSize: '0.88rem',
                animation: 'pulse 2.5s ease-in-out infinite',
              }}
            >
              <span>Send Message ✦</span>
            </motion.button>

            <div style={{ display: 'flex', justifyContent: 'center', gap: 20, marginTop: 8 }}>
              {['GitHub', 'LinkedIn', 'Twitter'].map((link) => (
                <a key={link} href="#" className="btn btn-ghost" style={{ padding: '6px 14px', fontSize: '0.72rem' }}>
                  <span>{link}</span>
                </a>
              ))}
            </div>
          </div>
        )}
      </motion.div>
    </motion.div>
  )
}

// ─── Section content map ──────────────────────────────────────
const SECTION_CONTENT: Record<number, (props: { onNext: () => void }) => React.ReactElement> = {
  0: ({ onNext }) => <HeroContent       onNext={onNext}    />,
  1: ()           => <ProjectsContent                      />,
  2: ()           => <AboutContent                         />,
  3: ()           => <TestimonialsContent                  />,
  4: ()           => <ContactContent                       />,
}

// ─── Root UIOverlay ───────────────────────────────────────────
export default function UIOverlay({
  sectionIndex,
  onSectionChange,
  isTransitioning,
}: UIOverlayProps) {
  const prefersReduced = useReducedMotion()

  // Inject global CSS once
  useEffect(() => {
    const id = 'ui-overlay-styles'
    if (document.getElementById(id)) return
    const tag = document.createElement('style')
    tag.id = id
    tag.textContent = GLOBAL_CSS
    document.head.appendChild(tag)
    return () => { document.getElementById(id)?.remove() }
  }, [])

  const SectionComp = SECTION_CONTENT[sectionIndex]

  return (
    <div
      className="ui-root"
      style={{
        position: 'fixed', inset: 0,
        zIndex: 100,
        pointerEvents: 'none',
      }}
    >
      {/* Custom cursor */}
      {!prefersReduced && <Cursor />}

      {/* Logo */}
      <div style={{ pointerEvents: 'auto' }}>
        <LogoMark onHome={() => onSectionChange(0)} />
      </div>

      {/* Section content (animates on change) */}
      <div style={{ position: 'absolute', inset: 0, pointerEvents: 'auto' }}>
        <AnimatePresence mode="wait">
          <div key={`section-${sectionIndex}`} style={{ position: 'absolute', inset: 0 }}>
            {SectionComp && <SectionComp onNext={() => onSectionChange(sectionIndex + 1)} />}
          </div>
        </AnimatePresence>
      </div>

      {/* Nav dots */}
      <div style={{ pointerEvents: 'auto' }}>
        <NavDots current={sectionIndex} onChange={onSectionChange} />
      </div>

      {/* Progress bar */}
      <ProgressBar index={sectionIndex} />

      {/* Transition veil (flash between sections) */}
      <AnimatePresence>
        {isTransitioning && (
          <motion.div
            key="veil"
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.08 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.35 }}
            style={{
              position: 'absolute', inset: 0,
              background: `linear-gradient(135deg, ${COLORS.accent1}33, ${COLORS.accent2}22)`,
              pointerEvents: 'none',
            }}
          />
        )}
      </AnimatePresence>
    </div>
  )
}