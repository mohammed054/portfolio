'use client'

import { FormEvent, useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import { profile } from '@/lib/data'

type Status = 'idle' | 'loading' | 'success' | 'error'

export default function Contact() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [message, setMessage] = useState('')
  const [status, setStatus] = useState<Status>('idle')

  const error = useMemo(() => {
    if (!name.trim()) return 'Name is required.'
    if (!email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) return 'A valid email is required.'
    if (message.trim().length < 10) return 'Message should be at least 10 characters.'
    return ''
  }, [name, email, message])

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (error) {
      setStatus('error')
      return
    }
    setStatus('loading')
    const res = await fetch('/api/contact', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ name, email, message }),
    })
    if (!res.ok) {
      setStatus('error')
      return
    }
    setStatus('success')
    setName('')
    setEmail('')
    setMessage('')
  }

  return (
    <section id="contact" className="section">
      <div className="section-inner grid gap-6 lg:grid-cols-2">
        <aside className="glass rounded-2xl p-6">
          <h2 className="t-h2">{profile.contactHeadline}</h2>
          <p className="t-body mt-3">{profile.contactSubline}</p>
          <p className="mt-4 flex items-center gap-2 t-body-sm">
            <span className={`h-2 w-2 rounded-full ${profile.available ? 'bg-green-500' : 'bg-amber-500'}`} />
            {profile.availability}
          </p>
          <div className="mt-4 flex flex-wrap gap-3">
            {profile.socials.map((social) => (
              <a key={social.label} href={social.href} className="btn btn-ghost" target="_blank" rel="noreferrer">
                {social.label}
              </a>
            ))}
          </div>
        </aside>

        <motion.form className="glass rounded-2xl p-6" onSubmit={onSubmit} animate={status === 'error' ? { x: [-6, 6, -4, 4, 0] } : { x: 0 }}>
          <label className="t-body-sm">Name</label>
          <input aria-label="Name" className="mt-1 w-full rounded-lg border border-[var(--border)] bg-[var(--surface)] p-3 text-[var(--text-primary)]" value={name} onChange={(e) => setName(e.target.value)} />
          <label className="t-body-sm mt-4 block">Email</label>
          <input aria-label="Email" className="mt-1 w-full rounded-lg border border-[var(--border)] bg-[var(--surface)] p-3 text-[var(--text-primary)]" value={email} onChange={(e) => setEmail(e.target.value)} />
          <label className="t-body-sm mt-4 block">Message</label>
          <textarea aria-label="Message" className="mt-1 min-h-32 w-full rounded-lg border border-[var(--border)] bg-[var(--surface)] p-3 text-[var(--text-primary)]" value={message} onChange={(e) => setMessage(e.target.value)} />
          <p aria-live="polite" className="t-body-xs mt-2 text-[var(--danger)]">{status === 'error' ? error || 'Could not send message.' : ' '}</p>
          <button className="btn btn-primary mt-4" type="submit" disabled={status === 'loading'}>
            <span>{status === 'loading' ? 'Sending…' : status === 'success' ? 'Sent ✓' : 'Send Message →'}</span>
          </button>
        </motion.form>
      </div>
    </section>
  )
}
