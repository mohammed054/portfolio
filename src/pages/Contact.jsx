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
    <section className="bg-white min-h-screen">
      <div className="grid grid-cols-1 lg:grid-cols-[58%_42%] min-h-[635px]">
        <Reveal variant="fadeLeft">
          <div className="w-full h-[400px] lg:h-full bg-gray-200">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3454.1234567890123!2d31.2357!3d30.0444!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMzDCsDAyJzM5LjgiTiAzMcKwMTQnMDguNSJF!5e0!3m2!1sen!2seg!4v1234567890"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen=""
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Office location map"
            />
          </div>
        </Reveal>

        <div className="relative lg:ml-[-105px] z-10 flex items-center justify-center py-16 px-8 lg:py-20">
          <Reveal variant="fadeRight" className="w-full max-w-[540px]">
            <div className="bg-white rounded-[20px] p-8 lg:p-[70px] shadow-[0_5px_40px_rgba(0,0,0,0.08)]">
              <h2 className="text-[clamp(24px,1.5rem+1vw,36px)] font-bold leading-[1.15] mb-4 text-text-dark font-[Poppins]">
                Have a Cool Project?<br />Get in touch!
              </h2>

              <form onSubmit={handleSubmit} className="space-y-5 mt-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-sm font-semibold text-text-dark mb-2 font-[Poppins]">Name *</label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full px-4 py-3 border border-[rgba(0,0,0,0.25)] rounded-[3px] focus:outline-none focus:border-primary transition-colors duration-300 text-base"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-text-dark mb-2 font-[Poppins]">Email *</label>
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full px-4 py-3 border border-[rgba(0,0,0,0.25)] rounded-[3px] focus:outline-none focus:border-primary transition-colors duration-300 text-base"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-text-dark mb-2 font-[Poppins]">Subject</label>
                  <input
                    type="text"
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    className="w-full px-4 py-3 border border-[rgba(0,0,0,0.25)] rounded-[3px] focus:outline-none focus:border-primary transition-colors duration-300 text-base"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-text-dark mb-2 font-[Poppins]">Your Message</label>
                  <textarea
                    rows={6}
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    className="w-full px-4 py-3 border border-[rgba(0,0,0,0.25)] rounded-[3px] focus:outline-none focus:border-primary transition-colors duration-300 resize-none text-base"
                  />
                </div>

                <button
                  type="submit"
                  className="bg-[#066aab] hover:bg-[#055a94] text-white px-8 py-3.5 rounded-[3px] text-base font-semibold transition-all duration-300 hover:shadow-lg"
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
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  )
}

export default Contact
