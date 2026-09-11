import { useInView } from 'framer-motion'
import { useRef } from 'react'
import CountUp from 'react-countup'
import { User, Target, Trophy } from 'lucide-react'
import SectionHeading from './shared/SectionHeading'
import PlaceholderBox from './shared/PlaceholderBox'

const stats = [
  { icon: User, id: 'HOME-FUNFACTS-ICON-1', value: 2000, suffix: '+', label: 'Total Clients' },
  { icon: Target, id: 'HOME-FUNFACTS-ICON-2', value: 3000, suffix: '+', label: 'Total Projects' },
  { icon: Trophy, id: 'HOME-FUNFACTS-ICON-3', value: 1000, suffix: '+', label: 'Total Reviews' },
]

function FunFacts() {
  return (
    <section className="py-[140px] bg-white">
      <div className="container-main">
        <SectionHeading
          eyebrow="FUN FACTS"
          title="An original team of creators, designers & dreamers."
          className="mb-16"
        />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {stats.map((stat) => (
            <StatItem key={stat.id} stat={stat} />
          ))}
        </div>
      </div>
    </section>
  )
}

function StatItem({ stat }) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-100px' })

  return (
    <div ref={ref} className="text-center">
      <div className="flex justify-center mb-6">
        <div className="w-[90px] h-[90px] flex items-center justify-center text-text-muted/40">
          <stat.icon size={72} strokeWidth={1} />
        </div>
      </div>
      <PlaceholderBox
        id={stat.id}
        type="[ICON]"
        width="90px"
        height="90px"
        label={stat.label}
        className="mx-auto mb-4 hidden"
      />
      <div className="text-[clamp(36px,2.5rem+1vw,56px)] font-bold text-text-dark mb-2">
        {isInView ? <CountUp end={stat.value} duration={1.5} /> : '0'}{stat.suffix}
      </div>
      <p className="text-text-muted text-lg">{stat.label}</p>
    </div>
  )
}

export default FunFacts
