import { useState } from 'react'
import SectionHeading from '../components/shared/SectionHeading'
import Reveal from '../components/shared/Reveal'

function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  })
  const [submitting, setSubmitting] = useState(false)

  const handleSubmit = (e) => {
    e.preventDefault()
    setSubmitting(true)
    setTimeout(() => setSubmitting(false), 2000)
  }

  return (
    <section className="section-padding bg-white">
      <div className="container-main max-w-[840px]">
        <Reveal>
          <SectionHeading
            eyebrow="CONTACT US"
            title="Have a Cool Project? Get in touch!"
            className="mb-14"
          />
        </Reveal>

        <Reveal delay={0.15}>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-[0.833rem] font-semibold text-text-dark mb-2 font-[Poppins]">Name *</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-5 py-3.5 border border-border rounded-lg focus:outline-none focus:border-primary transition-colors duration-300 text-[0.833rem]"
                />
              </div>

              <div>
                <label className="block text-[0.833rem] font-semibold text-text-dark mb-2 font-[Poppins]">Email *</label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-5 py-3.5 border border-border rounded-lg focus:outline-none focus:border-primary transition-colors duration-300 text-[0.833rem]"
                />
              </div>
            </div>

            <div>
              <label className="block text-[0.833rem] font-semibold text-text-dark mb-2 font-[Poppins]">Subject</label>
              <input
                type="text"
                value={formData.subject}
                onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                className="w-full px-5 py-3.5 border border-border rounded-lg focus:outline-none focus:border-primary transition-colors duration-300 text-[0.833rem]"
              />
            </div>

            <div>
              <label className="block text-[0.833rem] font-semibold text-text-dark mb-2 font-[Poppins]">Your Message</label>
              <textarea
                rows={6}
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                className="w-full px-5 py-3.5 border border-border rounded-lg focus:outline-none focus:border-primary transition-colors duration-300 resize-none text-[0.833rem]"
              />
            </div>

            <button
              type="submit"
              className="btn-pill btn-pill-primary"
              disabled={submitting}
            >
              {submitting ? (
                <span className="flex items-center gap-2">
                  <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  Submitting...
                </span>
              ) : 'Submit'}
            </button>
          </form>
        </Reveal>
      </div>
    </section>
  )
}

export default Contact
