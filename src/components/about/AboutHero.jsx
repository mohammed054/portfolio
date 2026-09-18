import PlaceholderBox from '../shared/PlaceholderBox.jsx'

export default function AboutHero() {
  return (
    // bg-primary, NOT a dark/near-black value — Round 1 QA item 11.5 (critical)
    <section className="bg-primary px-6 py-24 md:px-10">
      <div className="mx-auto grid max-w-6xl items-center gap-16 lg:grid-cols-2">
        <div className="relative">
          <PlaceholderBox
            id="ABOUT-HERO-DESKPHOTO"
            type="[IMAGE]"
            label="Home-office desk setup, two monitors + laptop"
            className="aspect-[13/8] w-full border-white/40 bg-white/90 text-ink"
          />
          <PlaceholderBox
            id="ABOUT-HERO-BADGE"
            type="[ANIMATION]"
            label="Rotating 'ABOUT US' circular text badge"
            className="absolute -right-6 -top-6 h-32 w-32 rounded-full border-white/60 bg-white/90 p-2 text-[9px] text-ink"
          />
        </div>

        {/* text-white at full opacity — Round 1 QA item 11.5 (critical):
            this content was previously rendering at near-invisible opacity. */}
        <div>
          <p className="text-xs font-semibold uppercase tracking-[2px] text-white/80">Creative Approach</p>
          <h2 className="mt-3 text-4xl font-extrabold leading-tight text-white md:text-5xl">
            We develop &amp; create digital future.
          </h2>
          <p className="mt-6 max-w-md text-white/90">
            For those who love videos, animation and motion graphics, we have come up with a new cool project!
          </p>
        </div>
      </div>
    </section>
  )
}
