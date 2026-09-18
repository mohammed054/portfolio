import { Play } from 'lucide-react'
import Button from '../shared/Button.jsx'
import PlaceholderBox from '../shared/PlaceholderBox.jsx'

export default function Hero() {
  return (
    <section className="bg-surface px-6 py-20 md:px-10 lg:py-28">
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
            <Button variant="text" href="#about-preview">
              Discover More
            </Button>
            <button className="flex items-center gap-3 text-sm font-semibold tracking-widest text-ink">
              <span className="flex h-12 w-12 items-center justify-center rounded-full border-2 border-primary text-primary">
                <Play size={16} />
              </span>
              WATCH INTRO
            </button>
          </div>
        </div>

        {/* No fabricated stats row here — that was a Round 1 QA fabrication.
            The only stats block in the reference site is FunFacts, further down. */}
        <div className="relative mx-auto w-full max-w-md">
          <PlaceholderBox
            id="HOME-HERO-PORTRAIT"
            type="[HERO_IMAGE]"
            label="Man in navy vest, professional portrait photo"
            className="aspect-[3/4] w-full bg-gray-200"
          />
          {/* Decorative rings: outline-only, behind the photo, small — not
              opaque captioned boxes covering the subject (Round 1 bug). */}
          <div className="pointer-events-none absolute -right-8 -top-8 -z-10 h-36 w-36 rounded-full border-4 border-primary/50" />
          <div className="pointer-events-none absolute -bottom-10 -left-8 -z-10 h-36 w-36 rounded-full border-4 border-accent/50" />
        </div>
      </div>
    </section>
  )
}
