import PlaceholderBox from '../shared/PlaceholderBox.jsx'

const labels = ['Graphic Designs', 'Web Development', 'Creative Video']

export default function ServicesStrip() {
  return (
    // Continues bg-primary from AboutHero — Round 1 QA flagged this
    // dropping to white as a background-continuity bug.
    <section className="bg-primary px-6 pb-24 md:px-10">
      <div className="mx-auto grid max-w-6xl grid-cols-1 gap-px overflow-hidden rounded-md bg-white/20 sm:grid-cols-3">
        {labels.map((label) => (
          <div key={label} className="relative aspect-[4/3] bg-primary hover:bg-primary/90 transition-colors">
            <PlaceholderBox
              id={`ABOUT-SERVICES-STRIP-${label.replace(/\s+/g, '')}`}
              type="[IMAGE]"
              className="h-full w-full rounded-none border-0 bg-black/40 text-white"
            />
            <span className="absolute bottom-4 left-4 text-lg font-bold text-white">{label}</span>
          </div>
        ))}
      </div>
    </section>
  )
}
