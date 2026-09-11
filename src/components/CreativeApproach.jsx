import SectionHeading from './shared/SectionHeading'
import PlaceholderBox from './shared/PlaceholderBox'

function CreativeApproach() {
  return (
    <section className="py-[140px] bg-dark-bg text-white relative overflow-hidden">
      <div className="container-main">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div className="relative">
            <PlaceholderBox
              id="HOME-CREATIVEAPPROACH-IMAGE"
              type="[IMAGE]"
              width="100%"
              height="500px"
              label="Digital agency workspace photo"
            />
            <PlaceholderBox
              id="ABOUT-HERO-BADGE"
              type="[ANIMATION]"
              width="148px"
              height="148px"
              label="ABOUT US — rotating circular text badge"
              className="absolute -top-6 -right-6 hidden lg:flex"
            />
          </div>

          <div>
            <SectionHeading
              eyebrow="CREATIVE APPROACH"
              title="We develop & create digital future."
              className="text-left mb-8"
            />
            <p className="text-footer-text leading-relaxed mb-8">
              For those who love videos, animation and motion graphics, we have come up with a new cool project!
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}

export default CreativeApproach
