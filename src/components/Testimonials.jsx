import { useState } from 'react'
import { ChevronLeft, ChevronRight, Star } from 'lucide-react'
import SectionHeading from './shared/SectionHeading'
import PlaceholderBox from './shared/PlaceholderBox'

const testimonials = [
  {
    id: 1,
    author: 'banmas',
    role: 'Project Manager',
    avatar: 'HOME-TESTIMONIAL-AVATAR-1',
    text: 'Saber is a great person to work with, very professional and goes above and beyond to ensure the customer is happy.',
    rating: 5,
  },
  {
    id: 2,
    author: 'ginabuckney',
    role: 'Project Manager',
    avatar: 'HOME-TESTIMONIAL-AVATAR-2',
    text: 'Saber is a great person to work with, very professional and goes above and beyond to ensure the customer is happy. He is very quick to respond to any request and provides advice to make the site better.',
    rating: 5,
  },
  {
    id: 3,
    author: 'bollybeatz',
    role: 'Project Manager',
    avatar: 'HOME-TESTIMONIAL-AVATAR-3',
    text: 'Best WordPress developer available and very quick in development.',
    rating: 5,
  },
]

function Testimonials() {
  const [current, setCurrent] = useState(0)

  const next = () => setCurrent((prev) => (prev + 1) % testimonials.length)
  const prev = () => setCurrent((prev) => (prev - 1 + testimonials.length) % testimonials.length)

  return (
    <section className="section-padding bg-light-bg">
      <div className="container-main">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_2.5fr] gap-12 items-start">
          <div>
            <SectionHeading eyebrow="TESTIMONIALS" title="Suggestions & Feedback" className="text-left mb-8" />
            <div className="flex gap-3">
              <button
                onClick={prev}
                className="w-12 h-12 border border-card-border rounded-full flex items-center justify-center hover:bg-primary hover:text-white hover:border-primary transition-all duration-300"
              >
                <ChevronLeft size={18} />
              </button>
              <button
                onClick={next}
                className="w-12 h-12 border border-card-border rounded-full flex items-center justify-center hover:bg-primary hover:text-white hover:border-primary transition-all duration-300"
              >
                <ChevronRight size={18} />
              </button>
            </div>
          </div>

          <div className="relative overflow-hidden">
            <div
              className="flex gap-6 transition-transform duration-500 ease-out"
              style={{ transform: `translateX(-${current * 66.666}%)` }}
            >
              {testimonials.map((t) => (
                <div key={t.id} className="min-w-[calc(66.666%-12px)] bg-white p-10 border border-card-border flex-shrink-0 max-md:min-w-full">
                  <div className="flex items-center gap-4 mb-6">
                    <PlaceholderBox
                      id={t.avatar}
                      type="[IMAGE]"
                      width="56px"
                      height="56px"
                      label={`Avatar — ${t.author}`}
                      className="rounded-full flex-shrink-0"
                    />
                    <div>
                      <div className="font-bold text-text-dark font-[Poppins]">{t.author}</div>
                      <div className="text-sm text-text-muted">{t.role}</div>
                    </div>
                    <div className="flex gap-0.5 ml-auto">
                      {Array.from({ length: t.rating }).map((_, i) => (
                        <Star key={i} size={14} className="star-filled" />
                      ))}
                    </div>
                  </div>
                  <p className="text-text-muted leading-[1.7] italic text-[15px]">
                    &ldquo;{t.text}&rdquo;
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Testimonials
