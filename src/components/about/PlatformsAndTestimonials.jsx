import { ChevronLeft, ChevronRight, Quote, Star } from 'lucide-react'
import Swiper from 'swiper/bundle'
import { Swiper as SwiperComponent, SwiperSlide } from 'swiper/react'
import 'swiper/css'
import 'swiper/css/navigation'
import 'swiper/css/pagination'
import EyebrowLabel from '../shared/EyebrowLabel.jsx'
import SectionHeading from '../shared/SectionHeading.jsx'

// 3 platform logos from the spec's Home AboutPreview strip
const platforms = ['Fiverr', 'Upwork', 'Freelancer']

// Round 1 QA flag: only 2 testimonials were captured in screenshots.
// Per spec: "Flag remaining slides as [UNKNOWN_MEDIA] — content not captured, do not fabricate additional testimonials."
// Keep only the 2 captured testimonials; add more from live site later.
const testimonials = [
  {
    author: 'ginabuckney',
    role: 'Project Manager',
    avatar: 'ABOUT-TESTIMONIAL-AVATAR-1',
    quote: 'Saber is a great person to work with, very professional and goes above and beyond to ensure the customer is happy. He is very quick to respond to any request and provides advice to make the site better. He is very patient waiting for information and provides great support. I would definitely recommend him for a job and work with him again.',
    stars: 5,
  },
  {
    author: 'bollybeatz',
    role: 'Project Manager',
    avatar: 'ABOUT-TESTIMONIAL-AVATAR-2',
    quote: 'Best WordPress developer I have ever found on Fiverr, great communication, always available and very quick in his work. I will be contacting him for all my future development.',
    stars: 5,
  },
]

export default function PlatformsAndTestimonials() {
  return (
    <section className="bg-white px-6 py-20 md:px-10">
      <div className="mx-auto max-w-6xl">
        <div className="grid gap-8 lg:grid-cols-[1fr_2fr] lg:items-center">
          <div>
            <EyebrowLabel>Huge Honor</EyebrowLabel>
            <SectionHeading className="mt-3 text-3xl md:text-4xl">Our Platforms</SectionHeading>
          </div>
          <div className="grid grid-cols-3 gap-4">
            {platforms.map((name) => (
              <PlaceholderBox
                key={name}
                id={`ABOUT-PLATFORM-${name}`}
                type="[LOGO]"
                label={`${name} logo`}
                className="h-24"
              />
            ))}
          </div>
        </div>

        <Swiper
          modules={[Navigation, Pagination]}
          spaceBetween={20}
          slidesPerView='auto'
          pagination={{ clickable: true }}
          navigation={Navigation}
        >
          {testimonials.map((t) => (
            <SwiperSlide key={t.author} className="p-8">
              <div>
                <Quote className="text-primary" />
                <p className="mt-4 text-muted">
                  {t.quote}
                </p>
                <div className="mt-6 flex items-center gap-3">
                  <PlaceholderBox
                    id={t.avatar}
                    type="[IMAGE]"
                    className="h-12 w-12 shrink-0 rounded-full p-0 text-[7px]"
                  />
                  <div>
                    <p className="font-bold text-ink">{t.author}</p>
                    <p className="text-sm text-muted">{t.role}</p>
                  </div>
                </div>
                <div className="mt-3 flex gap-1 text-accent">
                  {Array.from({ length: t.stars }).map((_, i) => (
                    <Star key={i} size={14} fill="currentColor" />
                  ))}
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </section>
  )
}