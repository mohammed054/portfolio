import { ArrowDown } from 'lucide-react'
import PlaceholderBox from '../shared/PlaceholderBox.jsx'

export default function AboutHero() {
  return (
    <section className="relative bg-primary px-6 pt-10 pb-24 md:px-10">
      {/* Scroll cue arrow at top center */}
      <div className="mb-6 flex justify-center">
        <ArrowDown size={20} className="animate-bounce text-white/60" />
      </div>

      <div className="mx-auto grid max-w-6xl items-center gap-16 lg:grid-cols-2">
        <div className="relative">
          <PlaceholderBox
            id="ABOUT-HERO-DESKPHOTO"
            type="[IMAGE]"
            label="Home-office desk setup, two monitors + laptop"
            className="aspect-[13/8] w-full border-white/40 bg-white/90 text-ink"
          />
          {/* Rotating circular badge */}
          <div className="absolute -right-6 -top-6 z-10 flex h-32 w-32 items-center justify-center">
            <div className="animate-badge absolute inset-0 rounded-full border-2 border-white/40" />
            <svg viewBox="0 0 100 100" className="absolute inset-0 h-full w-full animate-badge">
              <path id="badge-circle" d="M 50,50 m -37,0 a 37,37 0 1,1 74,0 a 37,37 0 1,1 -74,0" fill="none" />
              <text className="fill-white text-[10px] font-semibold uppercase tracking-[3px]">
                <textPath href="#badge-circle">ABOUT US · ABOUT US · ABOUT US · </textPath>
              </text>
            </svg>
            <ArrowDown size={16} className="relative z-10 text-white" />
          </div>
        </div>

        <div>
          <p className="text-xs font-semibold uppercase tracking-[2px] text-white/80">Creative Approach</p>
          <h2 className="mt-3 text-4xl font-extrabold leading-tight text-white md:text-5xl">
            We develop & create digital future.
          </h2>
          <p className="mt-6 max-w-md text-white/90">
            For those who love videos, animation and motion graphics, we have come up with a new cool project!
          </p>
        </div>
      </div>
    </section>
  )
}
