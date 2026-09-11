import { useState } from 'react'
import SectionHeading from '../components/shared/SectionHeading'

function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  })

  const handleSubmit = (e) => {
    e.preventDefault()
  }

  return (
    <section className="py-[140px] bg-white">
      <div className="container-main max-w-[840px]">
        <SectionHeading
          eyebrow="CONTACT US"
          title="Have a Cool Project? Get in touch!"
          className="mb-12"
        />

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-semibold text-text-dark mb-2">Name *</label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-4 py-3 border border-border rounded-lg focus:outline-none focus:border-primary transition-colors"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-text-dark mb-2">Email *</label>
            <input
              type="email"
              required
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="w-full px-4 py-3 border border-border rounded-lg focus:outline-none focus:border-primary transition-colors"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-text-dark mb-2">Subject</label>
            <input
              type="text"
              value={formData.subject}
              onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
              className="w-full px-4 py-3 border border-border rounded-lg focus:outline-none focus:border-primary transition-colors"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-text-dark mb-2">Your Message</label>
            <textarea
              rows={6}
              value={formData.message}
              onChange={(e) => setFormData({ ...formData, message: e.target.value })}
              className="w-full px-4 py-3 border border-border rounded-lg focus:outline-none focus:border-primary transition-colors resize-none"
            />
          </div>

          <button
            type="submit"
            className="px-8 py-4 bg-primary text-white rounded-full font-semibold hover:bg-primary-hover transition-colors"
          >
            Submit
          </button>
        </form>
      </div>
    </section>
  )
}

export default Contact
