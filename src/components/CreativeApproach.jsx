import SectionHeading from './shared/SectionHeading'

function CreativeApproach() {
  return (
    <section className="section-padding bg-secondary text-white relative overflow-hidden">
      <div className="container-main">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div className="relative">
            <img
              src="/images/services/digital-agency.jpg"
              alt="Digital agency workspace photo"
              className="w-full h-[500px] object-cover"
            />
            <img
              src="/images/decorative/about-us-white.svg"
              alt="About Us badge"
              className="absolute -top-6 -right-6 hidden lg:block w-[148px] h-[148px] object-contain"
            />
          </div>

          <div>
            <SectionHeading
              eyebrow="CREATIVE APPROACH"
              title="We develop & create digital future."
              className="text-left mb-8"
            />
            <p className="text-footer-text leading-[1.7] mb-8 text-[16px]">
              For those who love videos, animation and motion graphics, we have come up with a new cool project!
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}

export default CreativeApproach
