import { PenTool, Layout, Layers } from 'lucide-react'
import SectionHeading from './shared/SectionHeading'
import Reveal from './shared/Reveal'

const cards = [
  { icon: PenTool, title: 'High Quality' },
  { icon: Layout, title: 'Fast Support' },
  { icon: Layers, title: '100% Satisfaction' },
]

function WhyChooseUs() {
  return (
    <section className="section-padding bg-white">
      <div className="container-main">
        <Reveal>
          <SectionHeading eyebrow="CREATIVE VISION" title="Why Choose Us!" className="mb-16" />
        </Reveal>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {cards.map((card, i) => (
            <Reveal key={i} delay={i * 0.15}>
              <div className="card-bordered p-10 text-center">
                <div className="flex justify-center mb-6">
                  <div className="w-[70px] h-[70px] flex items-center justify-center text-secondary">
                    <card.icon size={52} strokeWidth={1.5} />
                  </div>
                </div>
                <h3 className="text-lg font-bold text-text-dark font-[Poppins]">{card.title}</h3>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}

export default WhyChooseUs
