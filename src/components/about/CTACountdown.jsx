import Button from '../shared/Button.jsx'
import { useCountdown } from '../../hooks/useCountdown.js'

// PLACEHOLDER target date — real offer end-date unconfirmed (spec Section 9 item 13).
// Defaults to "7 days from page load" purely so the timer visibly ticks.
const TARGET_DATE = new Date(Date.now() + 1000 * 60 * 60 * 24 * 7)

export default function CTACountdown() {
  const { days, hours, minutes, seconds } = useCountdown(TARGET_DATE)
  const pad = (n) => String(n).padStart(2, '0')
  const blocks = [
    ['Days', days],
    ['Hours', hours],
    ['Minutes', minutes],
    ['Seconds', seconds],
  ]

  return (
    <section className="bg-dark px-6 py-24 text-center text-white md:px-10">
      <div className="mx-auto max-w-3xl">
        <p className="text-xs font-semibold uppercase tracking-[2px] text-white/60">Get the Offer</p>
        <h2 className="mt-3 text-4xl font-extrabold md:text-5xl">Ask Us About Limited Discount</h2>

        <div className="mt-10 flex justify-center gap-8">
          {blocks.map(([label, value]) => (
            <div key={label} className="w-16">
              <p className="text-4xl font-extrabold">{pad(value)}</p>
              <p className="mt-2 border-t border-white/30 pt-2 text-xs uppercase tracking-widest text-white/60">
                {label}
              </p>
            </div>
          ))}
        </div>

        <Button to="/contact" className="mt-10">
          Contact Us
        </Button>
      </div>
    </section>
  )
}
