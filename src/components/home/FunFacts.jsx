import { User, Target, Trophy } from 'lucide-react'
import EyebrowLabel from '../shared/EyebrowLabel.jsx'
import SectionHeading from '../shared/SectionHeading.jsx'
import { useInView } from 'framer-motion'
import CountUp from 'react-countup'

// TODO(spec 5.5): these are animated count-up counters on scroll-into-view.
// Powered by react-countup + Framer Motion useInView.
const stats = [
  { Icon: User, value: '2,000+', label: 'Total Clients' },
  { Icon: Target, value: '3,000+', label: 'Total Projects' },
  { Icon: Trophy, value: '1,000+', label: 'Total Reviews' },
]

export default function FunFacts() {
  const [ref, intersect] = useInView({ threshold: 0.5 })

  if (!intersect) return null

  return (
    <section className="bg-white px-6 py-20 text-center md:px-10">
      <EyebrowLabel>Fun Facts</EyebrowLabel>
      <SectionHeading className="mt-3">An original team of creators, designers & dreamers.</SectionHeading>

      <div className="mx-auto mt-14 grid max-w-5xl gap-10 sm:grid-cols-3">
        {stats.map(({ Icon, value, label }) => (
          <div key={label} className="flex flex-col items-center gap-4">
            <Icon size={48} strokeWidth={1} className="text-gray-300 hover:text-primary transition-colors" />
            <CountUp
              value={Number(value.replace(',', ''))}
              duration={1500}
              className="text-4xl font-extrabold text-ink"
            />
            <p className="text-muted">{label}</p>
          </div>
        ))}
      </div>
    </section>
  )
}
