import SectionHeading from './shared/SectionHeading'
import Button from './shared/Button'
import Reveal from './shared/Reveal'

function AboutPreview() {
  return (
    <section className="section-padding bg-light-bg">
      <div className="container-main">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <Reveal variant="fadeLeft">
            <SectionHeading eyebrow="MORE EFFECTIVE" title="We develop & create digital future." className="text-left mb-8" />
            <p className="text-text-muted leading-[1.7] mb-8 text-[16px]">
              We appreciate your trust greatly. Our clients choose us and our products because they know we are the best.
            </p>
            <div className="relative inline-block">
              <Button to="/about/">About Us</Button>
              <span className="absolute -top-1.5 -right-1.5 w-3 h-3 bg-secondary rounded-full" />
            </div>
          </Reveal>

          <Reveal variant="fadeRight" className="relative">
            <img
              src="/images/about/home-drawing.png"
              alt="Illustration — person painting colorful abstract splash"
              className="w-full h-[450px] object-contain"
              loading="lazy"
            />
            <img
              src="/images/decorative/img-animation-5-white.png"
              alt=""
              className="absolute -top-6 -right-6 hidden lg:block w-[130px] h-[130px] object-contain animate-float-slow"
              aria-hidden="true"
            />
          </Reveal>
        </div>
      </div>
    </section>
  )
}

export default AboutPreview
