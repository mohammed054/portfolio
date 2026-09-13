import { useState, useRef } from 'react'
import { motion } from 'framer-motion'
import { ChevronLeft, ChevronRight, Star } from 'lucide-react'
import SectionHeading from './shared/SectionHeading'
import Reveal from './shared/Reveal'

const testimonials = [
  {
    id: 1,
    author: 'banmas',
    role: 'Project Manager',
    avatarSrc: '/images/testimonials/banmas.png',
    text: 'One of the fastest people I\'ve worked with on Linkedin. very transparent and giving great advice. it was fun doing the website with him and will definitely do more with him later.',
    rating: 5,
  },
  {
    id: 2,
    author: 'ginabuckney',
    role: 'Project Manager',
    avatarSrc: '/images/testimonials/ginabuckney.jpeg',
    text: 'Saber is a great person to work with, very professional and goes above and beyond to ensure the customer is happy. He is very quick to respond to any request and provides advice to make the site better.',
    rating: 5,
  },
  {
    id: 3,
    author: 'bollybeatz',
    role: 'Project Manager',
    avatarSrc: '/images/testimonials/bollybeatz.png',
    text: 'Best WordPress developer I have ever found on Fiverr, great communication, always available and very quick in his work. I will be contacting him for all my future development.',
    rating: 5,
  },
  {
    id: 4,
    author: 'chrismoran',
    role: 'Project Manager',
    avatarSrc: '/images/testimonials/chrismoran.jpg',
    text: 'this guy is awesome, his talent is great. He created an absolutely stunning site in a matter of days. He was very responsive and i was able to see the changes before my eyes.',
    rating: 5,
  },
  {
    id: 5,
    author: 'huiyin',
    role: 'Project Manager',
    avatarSrc: '/images/testimonials/huiyin.jpg',
    text: 'Saber is by far the best FIverr Service provider I\'ve met. He offers me much more than I\'ve accepted. He even promised me for unlimited revisions as long as I need it help. HIGHLY RECOMMEND SABER!',
    rating: 5,
  },
  {
    id: 6,
    author: 'mohamednawar',
    role: 'Project Manager',
    avatarSrc: '/images/testimonials/mohamednawar.jpg',
    text: 'Excellent Redesign! I recommend him for redesigns and fixes on WordPress sites. He is highly qualified and easy to work with. thank you so much',
    rating: 5,
  },
  {
    id: 7,
    author: 'torecompany',
    role: 'Project Manager',
    avatarSrc: '/images/testimonials/torecompany.png',
    text: 'This guy is amazing))) he just need some motivation and inspiration))) which I gave him a lot))) now he fixed all problems and so quickly))) I believed in him, I know when he wants something he will do it))) Thank you',
    rating: 5,
  },
]

function Testimonials() {
  const [current, setCurrent] = useState(0)

  const next = () => setCurrent((prev) => (prev + 1) % testimonials.length)
  const prev = () => setCurrent((prev) => (prev - 1 + testimonials.length) % testimonials.length)

  return (
    <section className="section-padding bg-white">
      <div className="container-main">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
          <Reveal variant="fadeLeft">
            <div className="text-left">
              <span className="inline-block text-[0.722rem] font-semibold tracking-[2px] uppercase mb-4" style={{ fontFamily: "'europa', sans-serif", color: '#A5A6AA' }}>
                Testimonials
              </span>
              <h2 className="text-[clamp(28px,1.5rem+1.2vw,42px)] font-bold leading-tight mb-8" style={{ fontFamily: "'sofia-pro', 'Poppins', sans-serif", color: '#222733' }}>
                Suggestions & Feedback
              </h2>
            </div>
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
          </Reveal>

          <Reveal variant="fadeRight">
            <div className="relative overflow-hidden">
              <motion.div
                className="flex cursor-grab active:cursor-grabbing"
                animate={{ x: `-${current * 100}%` }}
                transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              >
                {testimonials.map((t) => (
                  <div key={t.id} className="min-w-full px-2 select-none">
                    <div className="flex items-center gap-4 mb-6">
                      <img
                        src={t.avatarSrc}
                        alt={`Avatar — ${t.author}`}
                        className="w-[100px] h-[100px] rounded-full flex-shrink-0 object-cover"
                        loading="lazy"
                      />
                      <div>
                        <h4 className="font-bold text-lg" style={{ fontFamily: "'sofia-pro', 'Poppins', sans-serif", color: '#222733' }}>{t.author}</h4>
                        <div className="text-[0.833rem]" style={{ color: '#A5A6AA' }}>{t.role}</div>
                        <div className="flex gap-0.5 mt-2">
                          {Array.from({ length: t.rating }).map((_, i) => (
                            <Star key={i} size={14} className="star-filled" />
                          ))}
                        </div>
                      </div>
                    </div>
                    <p className="leading-[1.7] italic text-[16px]" style={{ color: '#6b6e71', fontFamily: "'europa', sans-serif" }}>
                      {t.text}
                    </p>
                  </div>
                ))}
              </motion.div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  )
}

export default Testimonials
