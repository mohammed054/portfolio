'use client'

import { FormEvent, useMemo, useState } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { profile } from '@/lib/data'

type Status = 'idle' | 'loading' | 'success' | 'error'

function Wire() {
  const mesh = useState(() => new THREE.Mesh(new THREE.PlaneGeometry(8, 5, 20, 20), new THREE.MeshBasicMaterial({ color: 'white', wireframe: true, transparent: true, opacity: 0.15 })))[0]
  useFrame(({ clock, invalidate }) => {
    mesh.rotation.z = Math.sin(clock.getElapsedTime() * 0.2) * 0.04
    invalidate()
  })
  return <primitive object={mesh} />
}

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
    if (error) return setStatus('error')
    setStatus('loading')
    await new Promise((r) => setTimeout(r, 800))
    setStatus('success')
    setName('')
    setEmail('')
    setMessage('')
  }

  return (
    <section id="contact" className="section">
      <div className="absolute inset-0 hidden md:block opacity-40"><Canvas frameloop="demand" camera={{ position: [0, 0, 4] }}><Wire /></Canvas></div>
      <div className="section-inner relative grid gap-6 lg:grid-cols-2">
        <aside className="glass rounded-2xl p-6">
          <h2 className="t-h1">{profile.contactHeadline}</h2>
          <p className="t-body mt-3">{profile.contactSubline}</p>
          <p className="t-body-sm mt-4 flex items-center gap-2">
            <span className="inline-block h-2 w-2 rounded-full animate-pulse" style={{ backgroundColor: profile.available ? 'var(--success)' : 'var(--warning)' }} />
            {profile.availability}
          </p>
          <div className="mt-4 flex flex-wrap gap-2">
            {profile.socials.map((social) => (
              <a key={social.label} href={social.href} target="_blank" rel="noreferrer" className="btn btn-ghost">{social.label}</a>
            ))}
          </div>
        </aside>

        <form className="glass rounded-2xl p-6" onSubmit={onSubmit}>
          <label className="t-body-sm">Name</label>
          <input value={name} onChange={(e) => setName(e.target.value)} aria-label="Name" className="mt-1 w-full rounded-lg border border-[var(--border)] bg-[var(--surface)] p-3 text-[var(--text-primary)]" />
          <label className="t-body-sm mt-4 block">Email</label>
          <input value={email} onChange={(e) => setEmail(e.target.value)} aria-label="Email" className="mt-1 w-full rounded-lg border border-[var(--border)] bg-[var(--surface)] p-3 text-[var(--text-primary)]" />
          <label className="t-body-sm mt-4 block">Message</label>
          <textarea value={message} onChange={(e) => setMessage(e.target.value)} aria-label="Message" className="mt-1 min-h-32 w-full rounded-lg border border-[var(--border)] bg-[var(--surface)] p-3 text-[var(--text-primary)]" />
          <p className="t-body-xs mt-2 text-[var(--danger)]" aria-live="polite">{status === 'error' ? error || 'Unable to send.' : ' '}</p>
          <button type="submit" className="btn btn-primary mt-4 min-w-40" disabled={status === 'loading'}>
            <span>{status === 'loading' ? '● ● ●' : status === 'success' ? 'Sent ✓' : 'Send Message →'}</span>
          </button>
        </form>
      </div>
    </section>
  )
}
