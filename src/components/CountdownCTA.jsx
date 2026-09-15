import { useState, useEffect } from 'react'
import Button from './shared/Button'
import Reveal from './shared/Reveal'

function getTimeLeft(target) {
  const diff = target - Date.now()
  if (diff <= 0) return { days: 0, hours: 0, minutes: 0, seconds: 0 }
  return {
    days: Math.floor(diff / (1000 * 60 * 60 * 24)),
    hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
    minutes: Math.floor((diff / (1000 * 60)) % 60),
    seconds: Math.floor(diff / 1000) % 60,
  }
}

function pad(n) {
  return String(n).padStart(2, '0')
}

function CountdownCTA() {
  const [target] = useState(() => {
    const d = new Date()
    d.setDate(d.getDate() + 30)
    return d.getTime()
  })
  const [time, setTime] = useState(() => getTimeLeft(target))

  useEffect(() => {
    const id = setInterval(() => setTime(getTimeLeft(target)), 1000)
    return () => clearInterval(id)
  }, [target])

  return (
    <section className="section-padding bg-dark-bg text-white relative overflow-hidden">
      <img
        src="/images/services/digital-agency.jpg"
        alt="CTA background"
        className="absolute inset-0 w-full h-full object-cover opacity-20"
        loading="lazy"
      />
      <div className="absolute inset-0 bg-gradient-to-b from-dark-bg/80 via-dark-bg/60 to-dark-bg/80 z-[1]" />

      <div className="container-main relative z-10 text-center">
        <Reveal>
          <div className="text-center mb-12">
            <span className="inline-block text-[0.722rem] font-semibold tracking-[2px] uppercase mb-4" style={{ fontFamily: "'europa', sans-serif", color: '#A5A6AA' }}>
              Get The Offer
            </span>
            <h2 className="text-[clamp(28px,1.5rem+1.2vw,42px)] font-bold leading-tight text-white" style={{ fontFamily: "'sofia-pro', 'Poppins', sans-serif" }}>
              Ask Us About Limited Discount
            </h2>
          </div>
        </Reveal>

        <Reveal delay={0.15}>
          <div className="flex justify-center items-center gap-2 mb-14">
            {[
              { value: time.days, label: 'Days' },
              { value: time.hours, label: 'Hours' },
              { value: time.minutes, label: 'Minutes' },
              { value: time.seconds, label: 'Seconds' },
            ].map(({ value, label }, idx) => (
              <div key={label} className="flex items-center">
                <div className="flex flex-col items-center">
                  <div className="text-[clamp(36px,2.5rem+1vw,52px)] font-bold mb-3 pb-4 px-5 min-w-[90px]" style={{ fontFamily: "'sofia-pro', 'Poppins', sans-serif", borderBottom: '2px solid rgba(255,255,255,0.2)' }}>
                    {pad(value)}
                  </div>
                  <span className="text-[0.833rem] font-medium" style={{ color: '#D2D3D5', fontFamily: "'europa', sans-serif" }}>{label}</span>
                </div>
                {idx < 3 && (
                  <span className="text-[clamp(36px,2.5rem+1vw,52px)] font-bold mb-8 px-2 text-white/40" style={{ fontFamily: "'sofia-pro', 'Poppins', sans-serif" }}>
                    :
                  </span>
                )}
              </div>
            ))}
          </div>
        </Reveal>

        <Reveal delay={0.3}>
          <Button to="/contact-us/">Contact Us</Button>
        </Reveal>
      </div>
    </section>
  )
}

export default CountdownCTA
