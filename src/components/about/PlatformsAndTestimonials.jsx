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

// Full testimonial list — sourced live from sabernasr.com/about/
const testimonials = [
  {
    author: 'banmas',
    role: 'Project Manager',
    avatar: 'ABOUT-TESTIMONIAL-AVATAR-1',
    quote: 'One of the fastest people I\'ve worked with on Linkedin. very transparent and giving great advice. it was fun doing the website with him and will definitely do more with him later.',
    stars: 5,
  },
  {
    author: 'ginabuckney',
    role: 'Project Manager',
    avatar: 'ABOUT-TESTIMONIAL-AVATAR-2',
    quote: 'Saber is a great person to work with, very professional and goes above and beyond to ensure the customer is happy. He is very quick to respond to any request and provides advice to make the site better. He is very patient waiting for information and provides great support. I would definitely recommend him for a job and work with him again.',
    stars: 5,
  },
  {
    author: 'bollybeatz',
    role: 'Project Manager',
    avatar: 'ABOUT-TESTIMONIAL-AVATAR-3',
    quote: 'Best WordPress developer I have ever found on Fiverr, great communication, always available and very quick in his work. I will be contacting him for all my future development.',
    stars: 5,
  },
  {
    author: 'chrismoran',
    role: 'Project Manager',
    avatar: 'ABOUT-TESTIMONIAL-AVATAR-4',
    quote: 'This guy is awesome, his talent is great. He created an absolutely stunning site in a matter of days. He was very responsive and i was able to see the changes before my eyes. His professionalism and communication were awesome.',
    stars: 5,
  },
  {
    author: 'huiyin',
    role: 'Project Manager',
    avatar: 'ABOUT-TESTIMONIAL-AVATAR-5',
    quote: 'Saber is by far the best Fiverr Service provider I\'ve met. He offers me much more than I\'ve accepted. He even promised me for unlimited revisions as long as I need it help. where will you get this type of service? HIGHLY RECOMMEND SABER!',
    stars: 5,
  },
  {
    author: 'mohamednawar',
    role: 'Project Manager',
    avatar: 'ABOUT-TESTIMONIAL-AVATAR-6',
    quote: 'Excellent Redesign! I recommend him for redesigns and fixes on WordPress sites. He is highly qualified and easy to work with. Thank you so much.',
    stars: 5,
  },
  {
    author: 'torearcompany',
    role: 'Project Manager',
    avatar: 'ABOUT-TESTIMONIAL-AVATAR-7',
    quote: 'This guy is amazing))) he just need some motivation and inspiration))) which I gave him a lot))) now he fixed all problems and so quickly))) I believed in him, I know when he wants something he will do it))) Thank you.',
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
          slidesPerView={1}
          pagination={{ clickable: true }}
          navigation={Navigation}
          loop={true}
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