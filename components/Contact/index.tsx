'use client'
import { useRef, useState, useCallback } from 'react'
import { motion, useInView, AnimatePresence } from 'framer-motion'
import { personal } from '@/lib/data'

/* ── Social Icon ──────────────────────────────────────── */
const SocialIcons = {
  github: (
    <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
      <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
    </svg>
  ),
  linkedin: (
    <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
    </svg>
  ),
  twitter: (
    <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  ),
  dribbble: (
    <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
      <path d="M12 24C5.385 24 0 18.615 0 12S5.385 0 12 0s12 5.385 12 12-5.385 12-12 12zm10.12-10.358c-.35-.11-3.17-.953-6.384-.438 1.34 3.684 1.887 6.684 1.992 7.308 2.3-1.555 3.936-4.02 4.395-6.87zm-6.115 7.808c-.153-.9-.75-4.032-2.19-7.77l-.066.02c-5.79 2.015-7.86 6.025-8.048 6.39a10.16 10.16 0 006.29 2.166c1.42 0 2.77-.29 4.014-.806zm-9.443-2.814c.24-.43 3.027-5.257 8.26-6.965.18-.06.37-.12.55-.177-.35-.787-.717-1.57-1.1-2.34-5.M3.118 6.71c-2.09 2.6-3.36 5.87-3.36 9.29 0 1.6.32 3.12.898 4.5l.004-.007c.063-.14 1.545-3.4 5.67-5.96l.016-.01A52.432 52.432 0 003.118 6.71zm10.16-5.16c-1.74 0-3.38.47-4.79 1.29l.012.022c3.02 2.76 4.84 6.04 4.84 9.12 0 .12-.01.24-.02.36 3.08-.52 5.73-1.86 7.24-3.7C19.31 5.36 16.11 1.55 13.278 1.55z" />
    </svg>
  ),
}

/* ── Form State ───────────────────────────────────────── */
type FormState = 'idle' | 'loading' | 'success' | 'error'

interface FormData {
  name: string
  email: string
  message: string
}

interface FieldError {
  name?: string
  email?: string
  message?: string
}

/* ── Contact Component ────────────────────────────────── */
export default function Contact() {
  const titleRef = useRef<HTMLDivElement>(null)
  const inView = useInView(titleRef, { once: true, margin: '-10% 0px' })

  const [form, setForm] = useState<FormData>({ name: '', email: '', message: '' })
  const [errors, setErrors] = useState<FieldError>({})
  const [formState, setFormState] = useState<FormState>('idle')

  const validate = useCallback((): boolean => {
    const e: FieldError = {}
    if (!form.name.trim()) e.name = 'Name is required'
    if (!form.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) e.email = 'Valid email required'
    if (form.message.length < 10) e.message = 'Message must be at least 10 characters'
    setErrors(e)
    return Object.keys(e).length === 0
  }, [form])

  const handleChange = (field: keyof FormData, value: string) => {
    setForm((f) => ({ ...f, [field]: value }))
    if (errors[field]) setErrors((e) => ({ ...e, [field]: undefined }))
  }

  const handleSubmit = async () => {
    if (!validate()) return
    setFormState('loading')

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      if (res.ok) {
        setFormState('success')
        setForm({ name: '', email: '', message: '' })
      } else {
        setFormState('error')
      }
    } catch {
      setFormState('error')
    }

    if (formState !== 'success') {
      setTimeout(() => setFormState('idle'), 3000)
    }
  }

  return (
    <section id="contact" className="relative py-24 md:py-32 px-6 overflow-hidden">
      {/* Gradient bg */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse 80% 50% at 50% 100%, rgba(79,142,247,0.05) 0%, transparent 70%)',
        }}
      />

      {/* Top divider */}
      <div
        className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-px pointer-events-none"
        style={{ background: 'linear-gradient(90deg, transparent, rgba(79,142,247,0.3), transparent)' }}
      />

      <div className="max-w-7xl mx-auto">
        {/* Section header */}
        <div ref={titleRef} className="text-center mb-16">
          <motion.p
            className="section-eyebrow justify-center mb-4"
            initial={{ opacity: 0 }}
            animate={inView ? { opacity: 1 } : {}}
            transition={{ duration: 0.6 }}
          >
            Let's Work Together
          </motion.p>
          <motion.h2
            className="font-syne font-extrabold text-text-primary"
            style={{ fontSize: 'clamp(2rem, 5vw, 3.5rem)' }}
            initial={{ opacity: 0, y: 24 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1], delay: 0.1 }}
          >
            Start a Conversation
          </motion.h2>
        </div>

        {/* Split layout */}
        <div className="grid md:grid-cols-2 gap-12 md:gap-20 items-start">
          {/* Left — info */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1], delay: 0.2 }}
          >
            <p className="text-text-secondary leading-relaxed mb-8 text-lg">
              Whether you have a project in mind, need a senior engineer, or just want to chat about
              technology — I read every message and respond within 48 hours.
            </p>

            {/* Availability badge */}
            <div className="glass rounded-xl p-4 mb-8 flex items-center gap-3">
              <span className="relative flex h-3 w-3">
                <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${personal.available ? 'bg-green-400' : 'bg-yellow-400'}`} />
                <span className={`relative inline-flex rounded-full h-3 w-3 ${personal.available ? 'bg-green-500' : 'bg-yellow-500'}`} />
              </span>
              <span className="font-dm text-sm text-text-primary">
                {personal.availabilityText}
              </span>
            </div>

            {/* Email */}
            <a
              href={`mailto:${personal.email}`}
              className="font-mono text-accent hover:underline text-sm block mb-8 transition-opacity duration-200 hover:opacity-80"
            >
              {personal.email}
            </a>

            {/* Social links */}
            <div className="flex gap-4">
              {Object.entries(personal.social).map(([platform, url]) => (
                <a
                  key={platform}
                  href={url}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={platform}
                  className="w-10 h-10 glass rounded-xl flex items-center justify-center text-text-secondary hover:text-accent hover:border-accent transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
                >
                  {SocialIcons[platform as keyof typeof SocialIcons]}
                </a>
              ))}
            </div>
          </motion.div>

          {/* Right — form */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1], delay: 0.3 }}
            className="glass rounded-2xl p-8"
          >
            {/* Success state */}
            <AnimatePresence mode="wait">
              {formState === 'success' ? (
                <motion.div
                  key="success"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex flex-col items-center justify-center py-12 text-center"
                >
                  <div className="w-16 h-16 rounded-full flex items-center justify-center text-2xl mb-4"
                    style={{ background: 'rgba(16,185,129,0.15)', border: '1px solid rgba(16,185,129,0.3)' }}>
                    ✓
                  </div>
                  <h3 className="font-syne font-bold text-xl text-text-primary mb-2">Message Sent!</h3>
                  <p className="text-text-secondary text-sm">I'll get back to you within 48 hours.</p>
                </motion.div>
              ) : (
                <motion.div key="form" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                  {/* Name */}
                  <div className="mb-5">
                    <label htmlFor="name" className="block font-dm text-xs text-text-muted mb-2 uppercase tracking-widest">
                      Name
                    </label>
                    <input
                      id="name"
                      type="text"
                      value={form.name}
                      onChange={(e) => handleChange('name', e.target.value)}
                      className={`w-full bg-bg border rounded-xl px-4 py-3 font-dm text-sm text-text-primary placeholder-text-muted transition-all duration-200 outline-none focus:border-accent ${
                        errors.name ? 'border-red-500' : 'border-border'
                      }`}
                      placeholder="Jane Smith"
                      autoComplete="name"
                    />
                    {errors.name && (
                      <p className="mt-1.5 font-mono text-xs text-red-400">{errors.name}</p>
                    )}
                  </div>

                  {/* Email */}
                  <div className="mb-5">
                    <label htmlFor="email" className="block font-dm text-xs text-text-muted mb-2 uppercase tracking-widest">
                      Email
                    </label>
                    <input
                      id="email"
                      type="email"
                      value={form.email}
                      onChange={(e) => handleChange('email', e.target.value)}
                      className={`w-full bg-bg border rounded-xl px-4 py-3 font-dm text-sm text-text-primary placeholder-text-muted transition-all duration-200 outline-none focus:border-accent ${
                        errors.email ? 'border-red-500' : 'border-border'
                      }`}
                      placeholder="jane@company.com"
                      autoComplete="email"
                    />
                    {errors.email && (
                      <p className="mt-1.5 font-mono text-xs text-red-400">{errors.email}</p>
                    )}
                  </div>

                  {/* Message */}
                  <div className="mb-7">
                    <label htmlFor="message" className="block font-dm text-xs text-text-muted mb-2 uppercase tracking-widest">
                      Message
                    </label>
                    <textarea
                      id="message"
                      rows={5}
                      value={form.message}
                      onChange={(e) => handleChange('message', e.target.value)}
                      className={`w-full bg-bg border rounded-xl px-4 py-3 font-dm text-sm text-text-primary placeholder-text-muted transition-all duration-200 outline-none focus:border-accent resize-none ${
                        errors.message ? 'border-red-500' : 'border-border'
                      }`}
                      placeholder="Tell me about your project or idea..."
                    />
                    {errors.message && (
                      <p className="mt-1.5 font-mono text-xs text-red-400">{errors.message}</p>
                    )}
                  </div>

                  {/* Submit */}
                  <motion.button
                    onClick={handleSubmit}
                    disabled={formState === 'loading'}
                    className="w-full py-3.5 rounded-xl font-dm font-medium text-sm text-bg transition-all duration-200 hover:opacity-90 disabled:opacity-60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent relative overflow-hidden"
                    style={{ background: 'linear-gradient(135deg, #4F8EF7, #8B5CF6)' }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <AnimatePresence mode="wait">
                      {formState === 'loading' ? (
                        <motion.span
                          key="loading"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          className="flex items-center justify-center gap-2"
                        >
                          <span className="w-4 h-4 border-2 border-bg/30 border-t-bg rounded-full animate-spin" />
                          Sending...
                        </motion.span>
                      ) : formState === 'error' ? (
                        <motion.span key="error" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                          Failed — try again
                        </motion.span>
                      ) : (
                        <motion.span key="idle" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
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

        {/* Footer bar */}
        <motion.div
          className="mt-24 pt-8 border-t border-border flex flex-col md:flex-row items-center justify-between gap-4 text-text-muted"
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ delay: 0.6 }}
        >
          <span className="font-mono text-xs">
            © {new Date().getFullYear()} {personal.name}. All rights reserved.
          </span>
          <span className="font-mono text-xs">
            Built with Next.js · Three.js · GSAP
          </span>
        </motion.div>
      </div>
    </section>
  )
}
