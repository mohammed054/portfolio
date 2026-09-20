import { useRef } from 'react'
import { useInView } from 'framer-motion'
import { User, Target, Trophy } from 'lucide-react'
import EyebrowLabel from '../shared/EyebrowLabel.jsx'
import SectionHeading from '../shared/SectionHeading.jsx'
import CountUp from 'react-countup'

const stats = [
  { Icon: User, value: 2000, label: 'Total Clients' },
  { Icon: Target, value: 3000, label: 'Total Projects' },
  { Icon: Trophy, value: 1000, label: 'Total Reviews' },
]

export default function FunFacts() {
  const ref1 = useRef(null)
  const ref2 = useRef(null)
  const ref3 = useRef(null)
  const refs = [ref1, ref2, ref3]

  const [, vis1] = useInView({ ref: ref1, once: true })
  const [, vis2] = useInView({ ref: ref2, once: true })
  const [, vis3] = useInView({ ref: ref3, once: true })
  const visible = [vis1, vis2, vis3]

  return (
    <section className="bg-white px-6 py-20 text-center md:px-10">
      <EyebrowLabel className="items-center justify-center">Fun Facts</EyebrowLabel>
      <SectionHeading className="mt-3">An original team of creators, designers &amp; dreamers.</SectionHeading>

      <div className="mx-auto mt-14 grid max-w-5xl gap-10 sm:grid-cols-3">
        {stats.map(({ Icon, value, label }, i) => (
          <div
            key={label}
            ref={refs[i]}
            className={`flex flex-col items-center gap-4 ${visible[i] ? '' : 'invisible'}`}
          >
            <Icon size={48} strokeWidth={1} className="text-gray-300" />
            <CountUp
              end={value}
              duration={2.5}
              separator=","
              className="text-4xl font-extrabold text-ink"
            />
            <span className="text-muted">{label}</span>
          </div>
        ))}
      </div>
    </section>
  )
}
