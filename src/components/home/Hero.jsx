import { Play } from 'lucide-react'
import Button from '../shared/Button.jsx'
import PlaceholderBox from '../shared/PlaceholderBox.jsx'

export default function Hero() {
  return (
    <section className="relative overflow-hidden bg-surface px-6 py-20 md:px-10 lg:py-28">
      <div className="mx-auto grid max-w-6xl items-center gap-12 lg:grid-cols-2">
        <div>
          <h1 className="text-5xl font-extrabold leading-[1.05] text-ink md:text-6xl">
            Build Innovative Digital Projects
          </h1>
          <p className="mt-6 max-w-md text-muted">
            Saber is a digital agency consists of strategists, creative minds, technologists, designers,
            marketers, storytellers, and inventors. 🤘
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-8">
            <Button variant="text" href="#about-preview" className="hover:text-accent">
              Discover More
            </Button>
            <button className="flex items-center gap-3 text-sm font-semibold tracking-widest text-ink hover:scale-105 transition-transform">
              <span className="flex h-12 w-12 items-center justify-center rounded-full border-2 border-primary text-primary">
                <Play size={16} />
              </span>
              WATCH INTRO
            </button>
          </div>
        </div>

        <div className="relative mx-auto w-full max-w-lg">
          {/* Decorative dot grid — upper right, behind the photo */}
          <div className="pointer-events-none absolute right-0 top-0 z-0 grid grid-cols-6 gap-[6px] opacity-40">
            {Array.from({ length: 48 }).map((_, i) => (
              <div key={i} className="h-[5px] w-[5px] rounded-full bg-gray-400" />
            ))}
          </div>

          {/* White X marks on the vest area */}
          <div className="pointer-events-none absolute left-[30%] top-[45%] z-20 text-[40px] font-bold leading-none text-white/80" style={{ transform: 'rotate(-10deg)' }}>X</div>
          <div className="pointer-events-none absolute left-[55%] top-[40%] z-20 text-[40px] font-bold leading-none text-white/80" style={{ transform: 'rotate(10deg)' }}>X</div>

          {/* White dot cluster — lower right of photo */}
          <div className="pointer-events-none absolute bottom-[10%] right-[5%] z-20 grid grid-cols-7 gap-[4px]">
            {Array.from({ length: 49 }).map((_, i) => (
              <div key={i} className="h-[4px] w-[4px] rounded-full bg-white" />
            ))}
          </div>

          <PlaceholderBox
            id="HOME-HERO-PORTRAIT"
            type="[HERO_IMAGE]"
            label="Man in navy vest, professional portrait photo"
            className="relative z-10 aspect-[3/4] w-full bg-gray-200"
          />

          {/* Blue ring — overlaps top-right of photo */}
          <div className="pointer-events-none absolute -right-8 -top-8 z-0 h-[220px] w-[220px] rounded-full border-[6px] border-primary/60" />

          {/* Coral/red ring — bottom left, partially cropped */}
          <div className="pointer-events-none absolute -bottom-12 -left-12 z-0 h-[240px] w-[240px] rounded-full border-[6px] border-accent/60" />
        </div>
      </div>
    </section>
  )
}
