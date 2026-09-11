import { MousePointer2, Share2, Target } from 'lucide-react'
import PlaceholderBox from './shared/PlaceholderBox'

const features = [
  { icon: MousePointer2, title: 'Creative Design', description: 'Get the best animation and interactive services for your business.' },
  { icon: Share2, title: 'Web Design and Development', description: "A brand's .com experience is its best opportunity to control its own message." },
  { icon: Target, title: 'Video Production', description: 'Visual effects in videos enhance the probability of sales conversion by a huge margin.' },
]

function AboutHero() {
  return (
    <section className="py-[140px] bg-white relative overflow-hidden">
      <div className="container-main">
        <div className="grid grid-cols-1 lg:grid-cols-[31.5%_17.8%_50%] gap-8 items-center">
          {/* Left column - workspace image */}
          <div className="relative">
            <PlaceholderBox
              id="ABOUT-HERO-DESKPHOTO"
              type="[IMAGE]"
              width="100%"
              height="320px"
              label="Home-office desk setup with two monitors, MacBook, lamp, coffee mug"
            />
            <PlaceholderBox
              id="ABOUT-HERO-PROFILE-SWAP"
              type="[INTERACTIVE_MEDIA]"
              width="200px"
              height="240px"
              label="Profile swap — Fiverr ↔ Upwork on hover"
              className="absolute -bottom-10 -right-10 hidden lg:block"
            />
            <PlaceholderBox
              id="ABOUT-HERO-DOTGRID"
              type="[DECORATIVE_GRAPHIC]"
              width="130px"
              height="130px"
              label="Floating dot grid (parallax)"
              className="absolute -top-6 -left-6 hidden lg:block"
            />
          </div>

          {/* Center column - spacer */}
          <div className="hidden lg:block" />

          {/* Right column - text + features */}
          <div>
            <span className="inline-block text-sm font-semibold tracking-[2px] uppercase text-text-muted mb-4">
              Get to Know Us
            </span>
            <h1 className="text-[clamp(36px,2.5rem+1.5vw,52px)] font-bold leading-[1.1] mb-6 text-text-dark">
              We build the future.
            </h1>
            <p className="text-text-muted leading-relaxed mb-10">
              Saber is a digital agency consists of strategists, creative minds, technologists, designers, marketers, storytellers, and inventors. 🤘
            </p>

            <div className="space-y-8">
              {features.map((feature, i) => (
                <div key={i} className="flex gap-4">
                  <div className="w-14 h-14 flex-shrink-0 flex items-center justify-center text-secondary">
                    <feature.icon size={40} strokeWidth={1.5} />
                  </div>
                  <div>
                    <h3 className="font-bold text-text-dark mb-2">{feature.title}</h3>
                    <p className="text-text-muted text-sm leading-relaxed">{feature.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default AboutHero
