'use client'
import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { testimonials } from '@/lib/data'

/**
 * Testimonials — Design System compliance:
 * Colors:  surface, border, accent1, accent-glow, text-primary, text-secondary, text-muted
 * Type:    Syne 500 for featured quote (t-24); Syne 700 name; DM Sans 400 t-14 supporting;
 *          JetBrains Mono t-12 for role/company
 * Motion:  dur-slow (600ms) stagger; ease-enter; 5–10px Y float on scroll (spec)
 * Spacing: sp-* only; section pad 96–128px
 */

type T = typeof testimonials[0]

/* Decorative large quote mark SVG */
function QuoteSVG({ className = '', color = 'var(--accent1)' }: { className?: string; color?: string }) {
  return (
    <svg viewBox="0 0 48 36" className={className} fill="none" aria-hidden="true"
      style={{ width:'48px', height:'36px' }}>
      <path
        d="M0 36V23.5c0-7.667 2.083-13.333 6.25-17S16.667 0 23.5 0v6c-3.5 0-6.25 1-8.25 3S12 13.167 12 16.5h11V36H0zm26 0V23.5C26 15.833 28.083 10.167 32.25 6.5S42.667 0 49.5 0v6c-3.5 0-6.25 1-8.25 3s-3.25 4.167-3.25 7.5H49V36H26z"
        fill={color}
        opacity="0.18"
      />
    </svg>
  )
}

/* ── Featured testimonial ───────────────────────────── */
function Featured({ item, inView }: { item: T; inView: boolean }) {
  return (
    <motion.div
      initial={{ opacity:0, y:40 }}
      animate={inView ? { opacity:1, y:0 } : {}}
      transition={{ duration:0.6, ease:[0.22,1,0.36,1] }}  /* dur-slow, ease-enter */
      className="accent-ring glass"
      style={{
        borderRadius:'24px',
        padding:'var(--sp-12) var(--sp-12)',
        textAlign:'center',
        marginBottom:'var(--sp-6)',
        position:'relative',
        overflow:'hidden',
      }}
    >
      {/* Ambient glow */}
      <div aria-hidden="true" style={{
        position:'absolute', inset:0,
        background:'radial-gradient(ellipse 70% 60% at 50% 50%, var(--accent-glow) 0%, transparent 70%)',
        pointerEvents:'none',
      }}/>

      {/* Large decorative quote */}
      <QuoteSVG />

      {/* Quote — Syne 500, t-24, text-primary, lh-heading */}
      <blockquote style={{
        fontFamily:'var(--font-display)', fontWeight:500,
        fontSize:'clamp(var(--t-16),2.2vw,var(--t-24))',
        lineHeight:'var(--lh-heading)',
        color:'var(--text-primary)',
        margin:'var(--sp-6) auto var(--sp-8)',
        maxWidth:'780px',
        position:'relative', zIndex:1,
      }}>
        "{item.quote}"
      </blockquote>

      {/* Divider */}
      <div aria-hidden="true" style={{
        width:'48px', height:'1px', margin:'0 auto var(--sp-4)',
        background:'linear-gradient(90deg, transparent, var(--accent1), transparent)',
      }}/>

      {/* Attribution */}
      <div>
        <p style={{
          fontFamily:'var(--font-body)', fontWeight:500,
          fontSize:'var(--t-16)', lineHeight:'var(--lh-body)',
          color:'var(--text-primary)',
        }}>
          {item.name}
        </p>
        <p style={{
          fontFamily:'var(--font-mono)', fontWeight:400,
          fontSize:'var(--t-12)', lineHeight:'var(--lh-mono)',
          color:'var(--text-muted)',
          marginTop:'var(--sp-1)',
        }}>
          {item.role} · {item.company}
        </p>
        {item.linkedIn !== '#' && (
          <a
            href={item.linkedIn}
            target="_blank" rel="noopener noreferrer"
            style={{
              fontFamily:'var(--font-mono)', fontWeight:400,
              fontSize:'var(--t-12)', lineHeight:'var(--lh-mono)',
              color:'var(--accent1)', textDecoration:'none',
              display:'inline-block', marginTop:'var(--sp-2)',
              transition:`opacity var(--dur-base) var(--ease-std)`,
            }}
            onMouseEnter={e => (e.currentTarget.style.opacity = '0.7')}
            onMouseLeave={e => (e.currentTarget.style.opacity = '1')}
          >
            LinkedIn →
          </a>
        )}
      </div>
    </motion.div>
  )
}

/* ── Supporting card ────────────────────────────────── */
function Card({ item, index, inView }: { item: T; index: number; inView: boolean }) {
  return (
    <motion.div
      className="glass"
      initial={{ opacity:0, y:32 }}
      animate={inView ? { opacity:1, y:0 } : {}}
      transition={{
        duration:0.6,                              /* dur-slow */
        ease:[0.22,1,0.36,1],                      /* ease-enter */
        delay: 0.28 + index * 0.1,
      }}
      style={{
        borderRadius:'20px',
        padding:'var(--sp-6)',
        display:'flex', flexDirection:'column', justifyContent:'space-between',
        transition:`border-color var(--dur-base) var(--ease-std),
                    transform    var(--dur-base) var(--ease-std)`,
      }}
      /* Spec: 5–10px Y lift on hover */
      onMouseEnter={e => {
        e.currentTarget.style.borderColor = 'var(--border)'
        e.currentTarget.style.transform   = 'translateY(-6px)'   /* 5–10px Y offset */
      }}
      onMouseLeave={e => {
        e.currentTarget.style.transform = 'translateY(0)'
      }}
    >
      <div>
        {/* Small quote mark */}
        <QuoteSVG color="var(--accent1)" />
        <style>{`.supporting-quote { width:32px !important; height:24px !important; }`}</style>

        {/* Quote — DM Sans 400, t-14, text-secondary, lh-body */}
        <blockquote style={{
          fontFamily:'var(--font-body)', fontWeight:400,
          fontSize:'var(--t-14)', lineHeight:'var(--lh-body)',
          color:'var(--text-secondary)',
          marginTop:'var(--sp-4)',
        }}>
          "{item.quote}"
        </blockquote>
      </div>

      {/* Bottom — border-top divider */}
      <div style={{
        marginTop:'var(--sp-6)',
        paddingTop:'var(--sp-4)',
        borderTop:'1px solid var(--border)',
        display:'flex', alignItems:'flex-start', justifyContent:'space-between',
      }}>
        <div>
          {/* Name — DM Sans 500, t-14, text-primary */}
          <p style={{
            fontFamily:'var(--font-body)', fontWeight:500,
            fontSize:'var(--t-14)', lineHeight:'var(--lh-body)',
            color:'var(--text-primary)',
          }}>
            {item.name}
          </p>
          {/* Role · Company — mono t-12, text-muted */}
          <p style={{
            fontFamily:'var(--font-mono)', fontWeight:400,
            fontSize:'var(--t-12)', lineHeight:'var(--lh-mono)',
            color:'var(--text-muted)',
            marginTop:'2px',
          }}>
            {item.role} · {item.company}
          </p>
        </div>

        {/* LinkedIn icon */}
        {item.linkedIn !== '#' && (
          <a
            href={item.linkedIn}
            target="_blank" rel="noopener noreferrer"
            aria-label={`${item.name}'s LinkedIn`}
            style={{
              color:'var(--text-muted)',
              transition:`color var(--dur-fast) var(--ease-std)`,
              flexShrink:0,
            }}
            onMouseEnter={e => (e.currentTarget.style.color = 'var(--accent1)')}
            onMouseLeave={e => (e.currentTarget.style.color = 'var(--text-muted)')}
          >
            <svg viewBox="0 0 24 24" style={{ width:'16px', height:'16px' }} fill="currentColor">
              <path d="M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-2-2 2 2 0 00-2 2v7h-4v-7a6 6 0 016-6zM2 9h4v12H2z"/>
              <circle cx="4" cy="4" r="2"/>
            </svg>
          </a>
        )}
      </div>
    </motion.div>
  )
}

/* ── Testimonials ──────────────────────────────────── */
export default function Testimonials() {
  const ref    = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once:true, margin:'-8% 0px' })

  const featured   = testimonials.find(t => t.featured)!
  const supporting = testimonials.filter(t => !t.featured)

  return (
    <section id="testimonials" className="section">
      {/* Ambient glow center */}
      <div aria-hidden="true" style={{
        position:'absolute', top:'50%', left:'50%',
        transform:'translate(-50%,-50%)',
        width:'640px', height:'640px', borderRadius:'50%',
        background:'radial-gradient(circle, var(--accent-glow) 0%, transparent 70%)',
        pointerEvents:'none',
      }}/>

      <div className="section-inner">
        {/* Header */}
        <div
          ref={ref}
          style={{ textAlign:'center', marginBottom:'var(--sp-12)' }}
        >
          <motion.p
            className="eyebrow"
            style={{ justifyContent:'center', marginBottom:'var(--sp-4)' }}
            initial={{ opacity:0 }}
            animate={inView ? { opacity:1 } : {}}
            transition={{ duration:0.6 }}
          >
            Social Proof
          </motion.p>

          <motion.h2
            style={{ fontSize:'clamp(var(--t-32),5vw,var(--t-48))' }}
            initial={{ opacity:0, y:24 }}
            animate={inView ? { opacity:1, y:0 } : {}}
            transition={{ duration:0.6, ease:[0.22,1,0.36,1], delay:0.08 }}
          >
            What Teams Say
          </motion.h2>

          <motion.p
            className="t-body"
            style={{
              maxWidth:'480px', margin:'var(--sp-4) auto 0',
            }}
            initial={{ opacity:0, y:24 }}
            animate={inView ? { opacity:1, y:0 } : {}}
            transition={{ duration:0.6, ease:[0.22,1,0.36,1], delay:0.16 }}
          >
            Real words from engineers, founders, and product leaders I've built alongside.
          </motion.p>
        </div>

        {/* Featured */}
        <Featured item={featured} inView={inView} />

        {/* Supporting grid */}
        <div style={{
          display:'grid',
          gridTemplateColumns:'repeat(auto-fill,minmax(280px,1fr))',
          gap:'var(--sp-4)',
        }}>
          {supporting.map((t, i) => (
            <Card key={t.id} item={t} index={i} inView={inView} />
          ))}
        </div>
      </div>
    </section>
  )
}
