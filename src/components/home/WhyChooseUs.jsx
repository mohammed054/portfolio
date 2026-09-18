import { PenTool, AppWindow, Layers } from 'lucide-react'
import EyebrowLabel from '../shared/EyebrowLabel.jsx'
import SectionHeading from '../shared/SectionHeading.jsx'

const cards = [
  { Icon: PenTool, label: 'High Quality' },
  { Icon: AppWindow, label: 'Fast Support' },
  { Icon: Layers, label: '100% Satisfaction' },
]

export default function WhyChooseUs() {
  return (
    <section className="bg-white px-6 py-20 text-center md:px-10">
      <EyebrowLabel>Creative Vision</EyebrowLabel>
      <SectionHeading className="mt-3">Why Choose Us!</SectionHeading>

      <div className="mx-auto mt-14 grid max-w-5xl gap-6 sm:grid-cols-3">
        {cards.map(({ Icon, label }) => (
          <div key={label} className="flex flex-col items-center gap-4 border border-gray-200 px-6 py-12">
            <Icon size={40} strokeWidth={1.5} className="text-primary" />
            <p className="text-lg font-bold text-ink">{label}</p>
          </div>
        ))}
      </div>
    </section>
  )
}
