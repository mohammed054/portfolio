import PlaceholderBox from '../shared/PlaceholderBox.jsx'

const labels = ['Graphic Designs', 'Web Development', 'Creative Video']

export default function ServicesStrip() {
  return (
    <section className="bg-primary px-6 pb-24 md:px-10">
      <div className="mx-auto max-w-6xl">
        <div className="relative overflow-hidden rounded-md">
          <PlaceholderBox
            id="ABOUT-SERVICES-STRIP-IMAGE"
            type="[IMAGE]"
            label="Creative workspace flat-lay with Adobe icons, keyboard, notebook — single wide photo"
            className="aspect-[16/7] w-full rounded-none border-0 bg-black/40 text-white"
          />
          <div className="pointer-events-none absolute inset-x-0 bottom-0 flex items-stretch">
            {labels.map((label, i) => (
              <div key={label} className="flex flex-1 items-center justify-center border-white/30" style={i > 0 ? { borderLeft: '1px solid rgba(255,255,255,0.3)' } : {}}>
                <span className="py-6 text-lg font-bold text-white">{label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
