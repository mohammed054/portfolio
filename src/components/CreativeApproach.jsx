import SectionHeading from './shared/SectionHeading'
import Reveal from './shared/Reveal'

function CreativeApproach() {
  return (
    <section className="section-padding bg-dark-bg text-white relative overflow-hidden">
      <div className="container-main">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <Reveal variant="fadeLeft">
            <div className="relative">
              <img
                src="/images/services/digital-agency.jpg"
                alt="Digital agency workspace photo"
                className="w-full h-auto object-cover"
                loading="lazy"
              />
              <img
                src="/images/decorative/about-us-white.svg"
                alt="About Us badge"
                className="absolute -top-6 -right-6 hidden lg:block w-[148px] h-[148px] object-contain animate-rotate-slow"
              />
            </div>
          </Reveal>

          <Reveal variant="fadeRight">
            <div className="text-left">
              <span className="inline-block text-[0.722rem] font-semibold tracking-[2px] uppercase mb-4" style={{ fontFamily: "'europa', sans-serif", color: '#A5A6AA' }}>
                Creative Approach
              </span>
              <h2 className="text-[clamp(28px,1.5rem+1.2vw,42px)] font-bold leading-tight mb-8 text-white" style={{ fontFamily: "'sofia-pro', 'Poppins', sans-serif" }}>
                We develop & create digital future.
              </h2>
            </div>
            <p className="leading-[1.7] mb-8 text-[16px] text-white" style={{ fontFamily: "'europa', sans-serif" }}>
              For those who love videos, animation and motion graphics, we have come up with a new cool project!
            </p>
          </Reveal>
        </div>
      </div>
    </section>
  )
}

export default CreativeApproach
