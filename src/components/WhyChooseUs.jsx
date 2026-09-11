import { PenTool, Layout, Layers } from 'lucide-react'
import SectionHeading from './shared/SectionHeading'
import PlaceholderBox from './shared/PlaceholderBox'

const cards = [
  { icon: PenTool, id: 'HOME-WHYUS-ICON-1', title: 'High Quality' },
  { icon: Layout, id: 'HOME-WHYUS-ICON-2', title: 'Fast Support' },
  { icon: Layers, id: 'HOME-WHYUS-ICON-3', title: '100% Satisfaction' },
]

function WhyChooseUs() {
  return (
    <section className="py-[140px] bg-white">
      <div className="container-main">
        <SectionHeading eyebrow="CREATIVE VISION" title="Why Choose Us!" className="mb-16" />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {cards.map((card) => (
            <div key={card.id} className="border border-card-border p-10 text-center">
              <div className="flex justify-center mb-6">
                <div className="w-[70px] h-[70px] flex items-center justify-center text-secondary">
                  <card.icon size={56} strokeWidth={1.5} />
                </div>
              </div>
              <PlaceholderBox
                id={card.id}
                type="[ICON]"
                width="70px"
                height="70px"
                label={card.title}
                className="mx-auto mb-4 hidden"
              />
              <h3 className="text-lg font-bold text-text-dark">{card.title}</h3>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default WhyChooseUs
