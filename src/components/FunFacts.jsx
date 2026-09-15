import { useRef, useState, useEffect } from 'react'
import { useInView } from 'framer-motion'
import Reveal from './shared/Reveal'

const stats = [
  { iconPath: 'M16 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2M12 11a4 4 0 100-8 4 4 0 000 8z', value: 2000, suffix: '+', label: 'Total Clients' },
  { iconPath: 'M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5', value: 3000, suffix: '+', label: 'Total Projects' },
  { iconPath: 'M6 9l6 6 6-6', value: 1000, suffix: '+', label: 'Total Reviews' },
]

function FunFacts() {
  return (
    <section className="section-padding bg-white">
      <div className="container-main">
        <Reveal>
          <div className="text-center mb-16">
            <span className="inline-block text-[0.722rem] font-semibold tracking-[2px] uppercase mb-4" style={{ fontFamily: "'europa', sans-serif", color: '#A5A6AA' }}>
              Fun Facts
            </span>
            <h2 className="text-[clamp(28px,1.5rem+1.2vw,42px)] font-bold leading-tight" style={{ fontFamily: "'sofia-pro', 'Poppins', sans-serif", color: '#222733' }}>
              An original team of creators<br />designers & dreamers.
            </h2>
          </div>
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
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-80px' })
  const [count, setCount] = useState(0)

  useEffect(() => {
    if (!inView) return
    let start = 0
    const end = stat.value
    const duration = 1500
    const step = end <= 1000 ? 10 : end <= 2000 ? 20 : 30
    const stepTime = (duration / end) * step
    const timer = setInterval(() => {
      start += step
      if (start >= end) { start = end; clearInterval(timer) }
      setCount(start)
    }, stepTime)
    return () => clearInterval(timer)
  }, [inView, stat.value])

  return (
    <div ref={ref} className="text-center">
      <div className="flex justify-center mb-5">
        <div className="w-[80px] h-[80px] flex items-center justify-center" style={{ color: '#222733' }}>
          <svg width="50" height="50" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <path d={stat.iconPath} />
          </svg>
        </div>
      </div>
      <div className="text-[clamp(40px,3rem+1vw,56px)] font-bold mb-2" style={{ fontFamily: "'sofia-pro', 'Poppins', sans-serif", color: '#222733' }}>
        {count.toLocaleString()}{stat.suffix}
      </div>
      <p className="text-[0.944rem]" style={{ color: '#A5A6AA', fontFamily: "'europa', sans-serif" }}>{stat.label}</p>
    </div>
  )
}

export default FunFacts
