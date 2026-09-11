import { useState, useEffect } from 'react'
import PlaceholderBox from './shared/PlaceholderBox'
import SectionHeading from './shared/SectionHeading'
import Button from './shared/Button'

function getTimeLeft(target) {
  const diff = target - Date.now()
  if (diff <= 0) return { days: 0, hours: 0, minutes: 0, seconds: 0 }
  return {
    days: Math.floor(diff / (1000 * 60 * 60 * 24)),
    hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
    minutes: Math.floor((diff / (1000 * 60)) % 60),
    seconds: Math.floor((diff / 1000) % 60),
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
      <PlaceholderBox
        id="ABOUT-CTA-BGPHOTO"
        type="[BACKGROUND_VIDEO]"
        width="100%"
        height="100%"
        label="CTA background — hands on tablet, dark overlay"
        className="absolute inset-0 opacity-20"
      />
      <div className="absolute inset-0 bg-gradient-to-b from-dark-bg/80 via-dark-bg/60 to-dark-bg/80 z-[1]" />

      <div className="container-main relative z-10 text-center">
        <SectionHeading eyebrow="GET THE OFFER" title="Ask Us About Limited Discount" className="mb-12" />

        <div className="flex justify-center gap-5 mb-14">
          {[
            { value: time.days, label: 'Days' },
            { value: time.hours, label: 'Hours' },
            { value: time.minutes, label: 'Minutes' },
            { value: time.seconds, label: 'Seconds' },
          ].map(({ value, label }) => (
            <div key={label} className="flex flex-col items-center">
              <div className="text-[clamp(36px,2.5rem+1vw,52px)] font-bold mb-3 border-b-2 border-white/20 pb-4 px-5 font-[Poppins] min-w-[90px]">
                {pad(value)}
              </div>
              <span className="text-sm text-footer-text font-medium">{label}</span>
            </div>
          ))}
        </div>

        <Button to="/contact-us/">Contact Us</Button>
      </div>
    </section>
  )
}

export default CountdownCTA
