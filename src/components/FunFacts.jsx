import { User, Target, Trophy } from 'lucide-react'
import SectionHeading from './shared/SectionHeading'
import Reveal from './shared/Reveal'

const stats = [
  { icon: User, value: 2000, suffix: '+', label: 'Total Clients' },
  { icon: Target, value: 3000, suffix: '+', label: 'Total Projects' },
  { icon: Trophy, value: 1000, suffix: '+', label: 'Total Reviews' },
]

function FunFacts() {
  return (
    <section className="section-padding bg-white">
      <div className="container-main">
        <Reveal>
          <SectionHeading
            eyebrow="FUN FACTS"
            title="An original team of creators, designers & dreamers."
            className="mb-16"
          />
        </Reveal>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {stats.map((stat, i) => (
            <Reveal key={i} delay={i * 0.15}>
              <StatItem stat={stat} />
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}

function StatItem({ stat }) {
  return (
      <div className="text-center">
      <div className="flex justify-center mb-5">
        <div className="w-[90px] h-[90px] flex items-center justify-center text-[#D1D5DB]">
          <stat.icon size={72} strokeWidth={1} />
        </div>
      </div>
      <div className="text-[clamp(40px,3rem+1vw,56px)] font-bold text-text-dark mb-2 font-[Poppins]">
        0+
      </div>
      <p className="text-text-muted text-[0.944rem]">{stat.label}</p>
    </div>
  )
}

export default FunFacts
