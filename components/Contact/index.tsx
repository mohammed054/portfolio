'use client'
import { useRef, useState, useCallback } from 'react'
import { motion, useInView, AnimatePresence } from 'framer-motion'
import { personal } from '@/lib/data'

/**
 * Contact — Design System compliance:
 * Colors:  surface, border, accent1, accent2, accent-glow, background,
 *          text-primary, text-secondary, text-muted
 * Type:    Syne 800 heading; DM Sans 400/500 body/labels; Mono t-12 for counters/status
 * Motion:  dur-slow (600ms) entry; ease-enter; dur-base form transitions (300ms)
 *          scaleHover 1.04 submit button
 * Spacing: sp-* only; section pad 96–128px
 * Form UX: real-time validation; loading → success → reset
 */

const SOCIAL_ICONS: Record<string, JSX.Element> = {
  github: (
    <svg viewBox="0 0 24 24" fill="currentColor" style={{ width:'18px', height:'18px' }}>
      <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/>
    </svg>
  ),
  linkedin: (
    <svg viewBox="0 0 24 24" fill="currentColor" style={{ width:'18px', height:'18px' }}>
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
    </svg>
  ),
  twitter: (
    <svg viewBox="0 0 24 24" fill="currentColor" style={{ width:'18px', height:'18px' }}>
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
    </svg>
  ),
  dribbble: (
    <svg viewBox="0 0 24 24" fill="currentColor" style={{ width:'18px', height:'18px' }}>
      <path d="M12 24C5.385 24 0 18.615 0 12S5.385 0 12 0s12 5.385 12 12-5.385 12-12 12zm10.12-10.358c-.35-.11-3.17-.953-6.384-.438 1.34 3.684 1.887 6.684 1.992 7.308 2.3-1.555 3.936-4.02 4.395-6.87zm-6.115 7.808c-.153-.9-.75-4.032-2.19-7.77l-.066.02c-5.79 2.015-7.86 6.025-8.048 6.39a10.16 10.16 0 006.29 2.166c1.42 0 2.77-.29 4.014-.806zm-9.443-2.814c.24-.43 3.027-5.257 8.26-6.965.18-.06.37-.12.55-.177-.35-.787-.717-1.57-1.1-2.34-5.385 1.612-10.47 1.53-10.96 1.522L3 12c0 2.467.91 4.721 2.41 6.442zm-2.25-8.232c.503.01 4.856.02 9.928-1.374C12.96 7.53 11.7 5.942 10.46 4.58a10.1 10.1 0 00-6.149 5.636zm7.484-6.63c1.27 1.38 2.52 2.995 3.748 4.877 3.43-1.286 4.886-3.24 5.054-3.48A10.124 10.124 0 0012 1.9c-1.42 0-2.77.29-4.004.806zm8.332 1.777c-.196.265-1.79 2.35-5.363 3.797.23.47.452.948.656 1.433.073.17.145.34.215.511 3.396-.427 6.773.257 7.115.33a10.127 10.127 0 00-2.623-6.071z"/>
    </svg>
  ),
}

/* ── Field label ────────────────────────────────────── */
function Label({ id, children }: { id: string; children: React.ReactNode }) {
  return (
    <label
      htmlFor={id}
      style={{
        display:'block',
        fontFamily:'var(--font-mono)', fontWeight:400,
        fontSize:'var(--t-12)', lineHeight:'var(--lh-mono)',
        letterSpacing:'0.16em', textTransform:'uppercase',
        color:'var(--text-muted)',
        marginBottom:'var(--sp-2)',
      }}
    >
      {children}
    </label>
  )
}

/* ── Contact ─────────────────────────────────────────── */
export default function Contact() {
  const ref    = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once:true, margin:'-8% 0px' })

  const [form, setForm]   = useState({ name:'', email:'', message:'' })
  const [errors, setErrors] = useState<Record<string,string>>({})
  const [status, setStatus] = useState<'idle'|'loading'|'success'|'error'>('idle')

  type F = keyof typeof form
  const set = (f: F, v: string) => {
    setForm(p => ({ ...p, [f]:v }))
    if (errors[f]) setErrors(p => ({ ...p, [f]:'' }))
  }

  const validate = useCallback(() => {
    const e: Record<string,string> = {}
    if (!form.name.trim())                                 e.name    = 'Name is required'
    if (!form.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) e.email   = 'Valid email required'
    if (form.message.length < 10)                          e.message = 'At least 10 characters'
    setErrors(e)
    return Object.keys(e).length === 0
  }, [form])

  const submit = async () => {
    if (!validate()) return
    setStatus('loading')
    try {
      const res = await fetch('/api/contact', {
        method:'POST',
        headers:{ 'Content-Type':'application/json' },
        body: JSON.stringify(form),
      })
      setStatus(res.ok ? 'success' : 'error')
      if (res.ok) setForm({ name:'', email:'', message:'' })
    } catch {
      setStatus('error')
    }
    if (status !== 'success') setTimeout(() => setStatus('idle'), 3000)
  }

  /* Shared input style — surface bg, border, focus: accent1 */
  const inputStyle = (field: string): React.CSSProperties => ({
    width:'100%',
    background:'var(--background)',
    border:`1px solid ${errors[field] ? 'var(--danger)' : 'var(--border)'}`,
    borderRadius:'12px',
    padding:'12px var(--sp-4)',
    fontFamily:'var(--font-body)', fontWeight:400,
    fontSize:'var(--t-14)', lineHeight:'var(--lh-body)',
    color:'var(--text-primary)',
    outline:'none',
    transition:`border-color var(--dur-base) var(--ease-std)`,
  })

  const focusStyle = { borderColor:'var(--accent1)' }

  return (
    <section id="contact" className="section">
      {/* Ambient glow — accent-glow token */}
      <div aria-hidden="true" style={{
        position:'absolute', inset:0, pointerEvents:'none',
        background:'radial-gradient(ellipse 80% 50% at 50% 100%, var(--accent-glow) 0%, transparent 70%)',
      }}/>
      <div aria-hidden="true" style={{
        position:'absolute', top:0, left:'50%', transform:'translateX(-50%)',
        width:'720px', height:'1px',
        background:'linear-gradient(90deg, transparent, var(--accent1-30), transparent)',
      }}/>

      <div className="section-inner">
        {/* Header */}
        <div ref={ref} style={{ textAlign:'center', marginBottom:'var(--sp-12)' }}>
          <motion.p
            className="eyebrow"
            style={{ justifyContent:'center', marginBottom:'var(--sp-4)' }}
            initial={{ opacity:0 }}
            animate={inView ? { opacity:1 } : {}}
            transition={{ duration:0.6 }}
          >
            Let's Work Together
          </motion.p>

          <motion.h2
            style={{ fontSize:'clamp(var(--t-32),5vw,var(--t-48))' }}
            initial={{ opacity:0, y:24 }}
            animate={inView ? { opacity:1, y:0 } : {}}
            transition={{ duration:0.6, ease:[0.22,1,0.36,1], delay:0.08 }}
          >
            Start a Conversation
          </motion.h2>
        </div>

        {/* Split layout */}
        <div style={{
          display:'grid',
          gridTemplateColumns:'repeat(auto-fit,minmax(300px,1fr))',
          gap:'var(--sp-12)',
          alignItems:'start',
        }}>
          {/* ── Left: info ─────────────────────── */}
          <motion.div
            initial={{ opacity:0, x:-36 }}
            animate={inView ? { opacity:1, x:0 } : {}}
            transition={{ duration:0.6, ease:[0.22,1,0.36,1], delay:0.16 }}
          >
            <p className="t-body" style={{
              fontSize:'var(--t-20)', marginBottom:'var(--sp-8)',
            }}>
              Whether you have a project in mind, need a senior engineer, or just want to chat about
              technology — I read every message and respond within 48 hours.
            </p>

            {/* Availability badge — green pulse */}
            <div className="glass" style={{
              borderRadius:'12px', padding:'var(--sp-3) var(--sp-4)',
              marginBottom:'var(--sp-8)',
              display:'flex', alignItems:'center', gap:'var(--sp-3)',
            }}>
              <span style={{ position:'relative', display:'inline-flex' }}>
                {/* Ping ring */}
                <span style={{
                  position:'absolute', inset:0,
                  borderRadius:'50%',
                  background: personal.available ? 'var(--success)' : 'var(--warning)',
                  animation:'pulseDot 2s ease-in-out infinite',
                  opacity:0.7,
                }} aria-hidden="true"/>
                {/* Solid dot */}
                <span style={{
                  display:'block', width:'12px', height:'12px',
                  borderRadius:'50%',
                  background: personal.available ? 'var(--success)' : 'var(--warning)',
                  position:'relative',
                }}/>
              </span>
              <span style={{
                fontFamily:'var(--font-body)', fontWeight:500,
                fontSize:'var(--t-14)', lineHeight:'var(--lh-body)',
                color:'var(--text-primary)',
              }}>
                {personal.availabilityText}
              </span>
            </div>

            {/* Email — mono, accent1 */}
            <a
              href={`mailto:${personal.email}`}
              style={{
                fontFamily:'var(--font-mono)', fontWeight:400,
                fontSize:'var(--t-14)', lineHeight:'var(--lh-mono)',
                color:'var(--accent1)', textDecoration:'none',
                display:'block', marginBottom:'var(--sp-8)',
                transition:`opacity var(--dur-base) var(--ease-std)`,
              }}
              onMouseEnter={e => (e.currentTarget.style.opacity = '0.75')}
              onMouseLeave={e => (e.currentTarget.style.opacity = '1')}
            >
              {personal.email}
            </a>

            {/* Social icons */}
            <div style={{ display:'flex', gap:'var(--sp-3)' }}>
              {Object.entries(personal.social).map(([platform, url]) => (
                <a
                  key={platform}
                  href={url}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={platform}
                  className="glass"
                  style={{
                    width:'40px', height:'40px', borderRadius:'12px',
                    display:'flex', alignItems:'center', justifyContent:'center',
                    color:'var(--text-secondary)', textDecoration:'none',
                    transition:`color var(--dur-base) var(--ease-std),
                                border-color var(--dur-base) var(--ease-std),
                                transform var(--dur-fast) var(--ease-std)`,
                  }}
                  onMouseEnter={e => {
                    e.currentTarget.style.color       = 'var(--accent1)'
                    e.currentTarget.style.borderColor = 'var(--accent1-40)'
                    e.currentTarget.style.transform   = `scale(1.04)` /* scaleHover */
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.color       = 'var(--text-secondary)'
                    e.currentTarget.style.borderColor = 'var(--border)'
                    e.currentTarget.style.transform   = 'scale(1)'
                  }}
                >
                  {SOCIAL_ICONS[platform as keyof typeof SOCIAL_ICONS]}
                </a>
              ))}
            </div>
          </motion.div>

          {/* ── Right: form ────────────────────── */}
          <motion.div
            className="glass"
            style={{ borderRadius:'20px', padding:'var(--sp-8)' }}
            initial={{ opacity:0, x:36 }}
            animate={inView ? { opacity:1, x:0 } : {}}
            transition={{ duration:0.6, ease:[0.22,1,0.36,1], delay:0.24 }}
          >
            <AnimatePresence mode="wait">
              {status === 'success' ? (
                <motion.div
                  key="success"
                  initial={{ opacity:0, scale:0.96 }}
                  animate={{ opacity:1, scale:1 }}
                  exit={{ opacity:0 }}
                  style={{
                    display:'flex', flexDirection:'column',
                    alignItems:'center', justifyContent:'center',
                    padding:'var(--sp-12) 0', textAlign:'center',
                  }}
                >
                  <div style={{
                    width:'56px', height:'56px', borderRadius:'50%',
                    display:'flex', alignItems:'center', justifyContent:'center',
                    fontSize:'var(--t-24)',
                    background:'var(--success-12)',
                    border:'1px solid var(--success-25)',
                    marginBottom:'var(--sp-4)',
                  }}>
                    ✓
                  </div>
                  <h3 style={{
                    fontFamily:'var(--font-display)', fontWeight:700,
                    fontSize:'var(--t-20)', lineHeight:'var(--lh-heading)',
                    color:'var(--text-primary)', marginBottom:'var(--sp-2)',
                  }}>
                    Message Sent
                  </h3>
                  <p className="t-body-sm">I'll get back to you within 48 hours.</p>
                </motion.div>
              ) : (
                <motion.div key="form" initial={{ opacity:0 }} animate={{ opacity:1 }} exit={{ opacity:0 }}>
                  {/* Name */}
                  <div style={{ marginBottom:'var(--sp-4)' }}>
                    <Label id="name">Name</Label>
                    <input
                      id="name" type="text" value={form.name} autoComplete="name"
                      onChange={e => set('name', e.target.value)}
                      placeholder="Jane Smith"
                      style={inputStyle('name')}
                      onFocus={e => Object.assign(e.target.style, focusStyle)}
                      onBlur={e => { if (!errors.name) e.target.style.borderColor = 'var(--border)' }}
                    />
                    {errors.name && (
                      <p style={{
                        fontFamily:'var(--font-mono)', fontSize:'var(--t-12)',
                        color:'var(--danger)', marginTop:'var(--sp-1)',
                      }}>
                        {errors.name}
                      </p>
                    )}
                  </div>

                  {/* Email */}
                  <div style={{ marginBottom:'var(--sp-4)' }}>
                    <Label id="email">Email</Label>
                    <input
                      id="email" type="email" value={form.email} autoComplete="email"
                      onChange={e => set('email', e.target.value)}
                      placeholder="jane@company.com"
                      style={inputStyle('email')}
                      onFocus={e => Object.assign(e.target.style, focusStyle)}
                      onBlur={e => { if (!errors.email) e.target.style.borderColor = 'var(--border)' }}
                    />
                    {errors.email && (
                      <p style={{
                        fontFamily:'var(--font-mono)', fontSize:'var(--t-12)',
                        color:'var(--danger)', marginTop:'var(--sp-1)',
                      }}>
                        {errors.email}
                      </p>
                    )}
                  </div>

                  {/* Message */}
                  <div style={{ marginBottom:'var(--sp-8)' }}>
                    <Label id="message">Message</Label>
                    <textarea
                      id="message" rows={5} value={form.message}
                      onChange={e => set('message', e.target.value)}
                      placeholder="Tell me about your project..."
                      style={{ ...inputStyle('message'), resize:'none' }}
                      onFocus={e => Object.assign(e.target.style, focusStyle)}
                      onBlur={e => { if (!errors.message) e.target.style.borderColor = 'var(--border)' }}
                    />
                    {errors.message && (
                      <p style={{
                        fontFamily:'var(--font-mono)', fontSize:'var(--t-12)',
                        color:'var(--danger)', marginTop:'var(--sp-1)',
                      }}>
                        {errors.message}
                      </p>
                    )}
                  </div>

                  {/* Submit — scaleHover 1.04 */}
                  <motion.button
                    onClick={submit}
                    disabled={status === 'loading'}
                    whileHover={status === 'idle' ? { scale: 1.04 } : {}} /* scaleHover */
                    whileTap={{ scale: 0.98 }}
                    style={{
                      width:'100%',
                      padding:'14px var(--sp-8)',
                      borderRadius:'12px',
                      border:'none',
                      background:'linear-gradient(135deg, var(--accent1), var(--accent2))',
                      fontFamily:'var(--font-body)', fontWeight:500,
                      fontSize:'var(--t-14)', lineHeight:'var(--lh-body)',
                      color:'var(--background)',
                      cursor: status === 'loading' ? 'wait' : 'pointer',
                      opacity: status === 'loading' ? 0.7 : 1,
                      transition:`opacity var(--dur-base) var(--ease-std)`,
                      display:'flex', alignItems:'center', justifyContent:'center', gap:'var(--sp-2)',
                    }}
                  >
                    <AnimatePresence mode="wait">
                      {status === 'loading' ? (
                        <motion.span
                          key="loading"
                          initial={{ opacity:0 }} animate={{ opacity:1 }} exit={{ opacity:0 }}
                          style={{ display:'flex', alignItems:'center', gap:'var(--sp-2)' }}
                        >
                          <span style={{
                            width:'14px', height:'14px',
                            border:'2px solid var(--border)',
                            borderTopColor:'var(--background)',
                            borderRadius:'50%',
                            animation:'spin 0.7s linear infinite',
                            display:'block',
                          }} aria-hidden="true"/>
                          Sending…
                        </motion.span>
                      ) : status === 'error' ? (
                        <motion.span
                          key="error"
                          initial={{ opacity:0 }} animate={{ opacity:1 }} exit={{ opacity:0 }}
                        >
                          Failed — try again
                        </motion.span>
                      ) : (
                        <motion.span
                          key="idle"
                          initial={{ opacity:0 }} animate={{ opacity:1 }} exit={{ opacity:0 }}
                        >
                          Send Message →
                        </motion.span>
                      )}
                    </AnimatePresence>
                  </motion.button>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </div>

        {/* Footer */}
        <motion.div
          style={{
            marginTop:'var(--sp-24)',
            paddingTop:'var(--sp-8)',
            borderTop:'1px solid var(--border)',
            display:'flex', flexWrap:'wrap',
            justifyContent:'space-between', alignItems:'center',
            gap:'var(--sp-4)',
          }}
          initial={{ opacity:0 }}
          animate={inView ? { opacity:1 } : {}}
          transition={{ delay:0.6 }}
        >
          <span style={{
            fontFamily:'var(--font-mono)', fontWeight:400,
            fontSize:'var(--t-12)', lineHeight:'var(--lh-mono)',
            color:'var(--text-muted)',
          }}>
            © {new Date().getFullYear()} {personal.name}. All rights reserved.
          </span>
          <span style={{
            fontFamily:'var(--font-mono)', fontWeight:400,
            fontSize:'var(--t-12)', lineHeight:'var(--lh-mono)',
            color:'var(--text-muted)',
          }}>
            Built with Next.js · Three.js · GSAP
          </span>
        </motion.div>
      </div>
    </section>
  )
}
