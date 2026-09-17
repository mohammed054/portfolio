import { useState } from 'react'
import Reveal from '../components/shared/Reveal'

function Contact() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [message, setMessage] = useState('')
  const [submitting, setSubmitting] = useState(false)

  return (
    <section className="section-padding bg-dark-bg text-white">
      <div className="container-main">
        <Reveal>
          <div className="text-center mb-16">
            <span className="inline-block text-[0.722rem] font-semibold tracking-[2px] uppercase mb-4" style={{ fontFamily: "'europa', sans-serif", color: '#A5A6AA' }}>
              Get In Touch
            </span>
            <h2 className="text-[clamp(28px,1.5rem+1.2vw,42px)] font-bold leading-tight">
              Discuss Your Project
            </h2>
          </div>
        </Reveal>

        <div className="max-w-2xl mx-auto space-y-4">
          <form
            onSubmit={async (e) => {
              e.preventDefault()
              setSubmitting(true)
              // In a real implementation, would send to backend
              alert(`Thank you ${name}! I'll review your project and get back within 48 hours.`)
              setSubmitting(false)
              setName('')
              setEmail('')
              setMessage('')
            }}
            className="space-y-4"
          >
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <div>
                <label
                  className="block text-[14px] font-medium text-white/60 mb-2"
                  style={{ fontFamily: "'europa', sans-serif" }}
                >
                  Your Name
                </label>
                <input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Your name"
                  required
                  className="w-full bg-secondary/20 border border-white/10 rounded-pill p-3 focus:border-primary transition-colors focus:bg-white/5 focus:text-white"
                  style={{ fontFamily: "'europa', sans-serif" }}
                />
              </div>
              <div>
                <label
                  className="block text-[14px] font-medium text-white/60 mb-2"
                  style={{ fontFamily: "'europa', sans-serif" }}
                >
                  Email Address
                </label>
                <input
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  type="email"
                  placeholder="you@email.com"
                  required
                  className="w-full bg-secondary/20 border border-white/10 rounded-pill p-3 focus:border-primary transition-colors focus:bg-white/5 focus:text-white"
                  style={{ fontFamily: "'europa', sans-serif" }}
                />
              </div>
            </div>
            <div>
              <label
                className="block text-[14px] font-medium text-white/60 mb-2"
                style={{ fontFamily: "'europa', sans-serif" }}
              >
                Project Description
              </label>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Describe your project or business need...\n\nExamples:\n• Barber shop needs booking system integration\n• Clinic needs patient data organization\n• Gym wants membership tracking automation\n• School needs operations platform"
                rows={5}
                required
                className="w-full bg-secondary/20 border border-white/10 rounded-pill p-3 focus:border-primary transition-colors focus:bg-white/5 focus:text-white resize-none"
                style={{ fontFamily: "'europa', sans-serif" }}
              />
            </div>
            <button
              type="submit"
              disabled={submitting}
              className="w-full bg-primary text-white py-3 rounded-pill px-6 font-medium transition-colors hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed"
              style={{ fontFamily: "'europa', sans-serif" }}
            >
              {submitting ? 'Sending...' : 'Send Message'}
            </button>
          </form>

          <div className="mt-8 text-center">
            <p className="text-[14px] text-white/40">
              Response within 48 hours. I reply to captured demand (people already asking for help), not cold outreach.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Contact