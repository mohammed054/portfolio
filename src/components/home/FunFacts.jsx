import { User, Target, Trophy } from 'lucide-react'
import EyebrowLabel from '../shared/EyebrowLabel.jsx'
import SectionHeading from '../shared/SectionHeading.jsx'

// TODO(spec 5.5): these are very likely animated count-up counters on
// scroll-into-view — this skeleton renders the final values statically.
// Add react-countup + useInView here once the animation pass starts
// (see spec Section 2.4).
const stats = [
  { Icon: User, value: '2,000+', label: 'Total Clients' },
  { Icon: Target, value: '3,000+', label: 'Total Projects' },
  { Icon: Trophy, value: '1,000+', label: 'Total Reviews' },
]

export default function FunFacts() {
  return (
    <section className="bg-white px-6 py-20 text-center md:px-10">
      <EyebrowLabel>Fun Facts</EyebrowLabel>
      <SectionHeading className="mt-3">An original team of creators, designers &amp; dreamers.</SectionHeading>

      <div className="mx-auto mt-14 grid max-w-5xl gap-10 sm:grid-cols-3">
        {stats.map(({ Icon, value, label }) => (
          <div key={label} className="flex flex-col items-center gap-4">
            <Icon size={48} strokeWidth={1} className="text-gray-300" />
            <p className="text-4xl font-extrabold text-ink">{value}</p>
            <p className="text-muted">{label}</p>
          </div>
        ))}
      </div>
    </section>
  )
}
