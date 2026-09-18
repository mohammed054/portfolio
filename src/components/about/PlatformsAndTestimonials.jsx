import { ChevronLeft, ChevronRight, Quote, Star } from 'lucide-react'
import EyebrowLabel from '../shared/EyebrowLabel.jsx'
import SectionHeading from '../shared/SectionHeading.jsx'
import PlaceholderBox from '../shared/PlaceholderBox.jsx'

// Only 3 here — the 4th own-brand logo belongs to the Home "About Preview"
// strip only. Round 1 QA flagged a 4th card as an incorrect copy-paste.
const platforms = ['Fiverr', 'Upwork', 'Freelancer']

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

        {/* TODO(spec 6.3): this is a carousel with prev/next controls and
            a partially-visible next slide — this skeleton shows one static
            slide. Wire Swiper/Embla here (see spec Section 2.4). */}
        <div className="mt-16 grid gap-8 rounded-md bg-surface p-8 lg:grid-cols-[1fr_2fr]">
          <div>
            <EyebrowLabel>Testimonials</EyebrowLabel>
            <SectionHeading className="mt-3 text-3xl md:text-4xl">Suggestions &amp; Feedback</SectionHeading>
            <div className="mt-8 flex gap-3">
              <button
                aria-label="Previous testimonial"
                className="flex h-10 w-10 items-center justify-center rounded-full border border-gray-300 hover:border-accent hover:text-accent"
              >
                <ChevronLeft size={16} />
              </button>
              <button
                aria-label="Next testimonial"
                className="flex h-10 w-10 items-center justify-center rounded-full border border-gray-300 hover:border-accent hover:text-accent"
              >
                <ChevronRight size={16} />
              </button>
            </div>
          </div>

          <div className="rounded-md bg-white p-8 shadow-sm">
            <Quote className="text-primary" />
            <p className="mt-4 text-muted">
              Saber is a great person to work with, very professional and goes above and beyond to ensure the
              customer is happy.
            </p>
            <div className="mt-6 flex items-center gap-3">
              <PlaceholderBox
                id="ABOUT-TESTIMONIAL-AVATAR-1"
                type="[IMAGE]"
                className="h-12 w-12 shrink-0 rounded-full p-0 text-[7px]"
              />
              <div>
                <p className="font-bold text-ink">ginabuckney</p>
                <p className="text-sm text-muted">Project Manager</p>
              </div>
            </div>
            <div className="mt-3 flex gap-1 text-accent">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star key={i} size={14} fill="currentColor" />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
