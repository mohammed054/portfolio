import PlaceholderBox from '../shared/PlaceholderBox.jsx'

const panels = [
  { n: '01', title: 'Graphic Designs' },
  { n: '02', title: 'Web Development' },
  { n: '03', title: 'Creative Video' },
  { n: '04', title: 'SEO' },
]

export default function ServicesGallery() {
  return (
    <section className="grid grid-cols-2 lg:grid-cols-4">
      {panels.map(({ n, title }) => (
        <div key={title} className="group relative aspect-[4/5]">
          <PlaceholderBox
            id={`HOME-SERVICES-PANEL-${n}`}
            type="[IMAGE]"
            className="h-full w-full rounded-none border-0 bg-gray-800 text-white"
          />
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
          <span className="pointer-events-none absolute left-4 top-4 text-sm text-white">{n}.</span>
          <span className="pointer-events-none absolute bottom-6 left-6 text-lg font-bold text-white">{title}</span>
        </div>
      ))}
    </section>
  )
}
