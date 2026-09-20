import { User, Target, Trophy } from 'lucide-react'
import { useInView } from 'framer-motion'
import EyebrowLabel from '../shared/EyebrowLabel.jsx'
import SectionHeading from '../shared/SectionHeading.jsx'
import CountUp from 'react-countup'

// TODO(spec 5.5): animated count-up counters on scroll-into-view.
const stats = [
  { Icon: User, value: '2,000+', label: 'Total Clients' },
  { Icon: Target, value: '3,000+', label: 'Total Projects' },
  { Icon: Trophy, value: '1,000+', label: 'Total Reviews' },
]

export default function FunFacts() {
  const ref1 = useRef(null)
  const ref2 = useRef(null)
  const ref3 = useRef(null)

  const [, isVisible1] = useInView({ ref: ref1, once: true })
  const [, isVisible2] = useInView({ ref: ref2, once: true })
  const [, isVisible3] = useInView({ ref: ref3, once: true })

  return (
    <section className="bg-white px-6 py-20 text-center md:px-10">
      <EyebrowLabel>Fun Facts</EyebrowLabel>
      <SectionHeading className="mt-3">An original team of creators, designers & dreamers.</SectionHeading>

      <div className="mx-auto mt-14 grid max-w-5xl gap-10 sm:grid-cols-3">
        <div
          key="stats-1"
          ref={ref1}
          className={`flex flex-col items-center gap-4 ${isVisible1 ? '' : 'display-none'}`}
        >
          <Icon size={48} strokeWidth={1} className="text-gray-300 hover:text-primary transition-colors" />
          <CountUp
            value={Number('2,000+'.replace(',', ''))}
            duration={1500}
            className="text-4xl font-extrabold text-ink"
          />
          <p className="text-muted">Total Clients</p>
        </div>

        <div
          key="stats-2"
          ref={ref2}
          className={`flex flex-col items-center gap-4 ${isVisible2 ? '' : 'display-none'}`}
        >
          <Icon size={48} strokeWidth={1} className="text-gray-300 hover:text-primary transition-colors" />
          <CountUp
            value={Number('3,000+'.replace(',', ''))}
            duration={1500}
            className="text-4xl font-extrabold text-ink"
          />
          <p className="text-muted">Total Projects</p>
        </div>

        <div
          key="stats-3"
          ref={ref3}
          className={`flex flex-col items-center gap-4 ${isVisible3 ? '' : 'display-none'}`}
        >
          <Icon size={48} strokeWidth={1} className="text-gray-300 hover:text-primary transition-colors" />
          <CountUp
            value={Number('1,000+'.replace(',', ''))}
            duration={1500}
            className="text-4xl font-extrabold text-ink"
          />
          <p className="text-muted">Total Reviews</p>
        </div>
      </div>
    </section>
  )
}