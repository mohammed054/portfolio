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
    <section className="py-[140px] bg-light-bg">
      <div className="container-main">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_2fr] gap-16 items-start">
          <div>
            <SectionHeading eyebrow="TESTIMONIALS" title="Suggestions & Feedback" className="text-left mb-8" />
            <div className="flex gap-4">
              <button onClick={prev} className="w-12 h-12 border border-card-border rounded-full flex items-center justify-center hover:bg-primary hover:text-white hover:border-primary transition-all">
                <ChevronLeft size={20} />
              </button>
              <button onClick={next} className="w-12 h-12 border border-card-border rounded-full flex items-center justify-center hover:bg-primary hover:text-white hover:border-primary transition-all">
                <ChevronRight size={20} />
              </button>
            </div>
          </div>

          <div className="relative overflow-hidden">
            <div className="flex gap-6 transition-transform duration-500" style={{ transform: `translateX(-${current * (100 / 1.5)}%)` }}>
              {testimonials.map((t) => (
                <div key={t.id} className="min-w-[70%] bg-white p-10 border border-card-border flex-shrink-0">
                  <PlaceholderBox
                    id={t.avatar}
                    type="[IMAGE]"
                    width="60px"
                    height="60px"
                    label={`Avatar — ${t.author}`}
                    className="rounded-full mb-6 flex-shrink-0"
                  />
                  <p className="text-text-muted leading-relaxed mb-6 italic">
                    &ldquo;{t.text}&rdquo;
                  </p>
                  <div className="flex items-center gap-4">
                    <div>
                      <div className="font-bold text-text-dark">{t.author}</div>
                      <div className="text-sm text-text-muted">{t.role}</div>
                    </div>
                    <div className="flex gap-1 ml-auto">
                      {Array.from({ length: t.rating }).map((_, i) => (
                        <Star key={i} size={14} className="fill-primary text-primary" />
                      ))}
                    </div>
                  </div>
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
