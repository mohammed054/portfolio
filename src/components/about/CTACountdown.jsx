import Button from '../shared/Button.jsx'
import PlaceholderBox from '../shared/PlaceholderBox.jsx'
import { useCountdown } from '../../hooks/useCountdown.js'

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
    <section className="relative overflow-hidden py-24 text-center text-white">
      <PlaceholderBox
        id="ABOUT-CTA-BGPHOTO"
        type="[BACKGROUND_IMAGE]"
        label="Hands using tablet with fashion app, dark overlay"
        className="absolute inset-0 h-full w-full rounded-none border-0 bg-dark text-transparent"
      />
      <div className="absolute inset-0 bg-black/60" />
      <div className="relative z-10 mx-auto max-w-3xl px-6 md:px-10">
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
