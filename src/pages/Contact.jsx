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
    <section className="section-padding bg-white">
      <div className="container-main max-w-[840px]">
        <SectionHeading
          eyebrow="CONTACT US"
          title="Have a Cool Project? Get in touch!"
          className="mb-14"
        />

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-semibold text-text-dark mb-2 font-[Poppins]">Name *</label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-5 py-3.5 border border-border rounded-lg focus:outline-none focus:border-primary transition-colors duration-300 text-[15px]"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-text-dark mb-2 font-[Poppins]">Email *</label>
              <input
                type="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full px-5 py-3.5 border border-border rounded-lg focus:outline-none focus:border-primary transition-colors duration-300 text-[15px]"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-text-dark mb-2 font-[Poppins]">Subject</label>
            <input
              type="text"
              value={formData.subject}
              onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
              className="w-full px-5 py-3.5 border border-border rounded-lg focus:outline-none focus:border-primary transition-colors duration-300 text-[15px]"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-text-dark mb-2 font-[Poppins]">Your Message</label>
            <textarea
              rows={6}
              value={formData.message}
              onChange={(e) => setFormData({ ...formData, message: e.target.value })}
              className="w-full px-5 py-3.5 border border-border rounded-lg focus:outline-none focus:border-primary transition-colors duration-300 resize-none text-[15px]"
            />
          </div>

          <button
            type="submit"
            className="btn-pill btn-pill-primary"
          >
            Submit
          </button>
        </form>
      </div>
    </section>
  )
}

export default Contact
