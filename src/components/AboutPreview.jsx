import SectionHeading from './shared/SectionHeading'
import Button from './shared/Button'
import Reveal from './shared/Reveal'

function AboutPreview() {
  return (
    <section className="section-padding bg-white">
      <div className="container-main">
        <div className="grid grid-cols-1 lg:grid-cols-[50%_25%_25%] gap-8 items-center">
          <Reveal variant="fadeLeft">
            <div className="pr-4">
              <SectionHeading eyebrow="More Effective" title="We develop & create digital future." className="text-left mb-8" />
              <p className="leading-[1.7] mb-8 text-[16px]" style={{ color: '#6b6e71', fontFamily: "'europa', sans-serif" }}>
                We appreciate your trust greatly. Our clients choose us and our products because they know we are the best.
              </p>
              <div className="relative inline-block">
                <Button to="/about/">About Us</Button>
                <span className="absolute -top-1.5 -right-1.5 w-3 h-3 bg-secondary rounded-full" />
              </div>
            </div>
          </Reveal>

          <Reveal variant="fadeRight" className="relative">
            <img
              src="/images/about/home-drawing.png"
              alt="Illustration — person painting colorful abstract splash"
              className="w-full h-[280px] object-contain"
              loading="lazy"
            />
          </Reveal>

          <Reveal variant="fadeRight" className="relative">
            <img
              src="/images/hero/Saber-Designer.jpg"
              alt="Saber Nasr — Designer at work"
              className="w-full h-[280px] object-cover"
              loading="lazy"
            />
            <img
              src="/images/decorative/img-animation-5-white.png"
              alt=""
              className="absolute -top-6 -left-6 hidden lg:block w-[130px] h-[130px] object-contain animate-float-slow"
              aria-hidden="true"
            />
            <img
              src="/images/decorative/img-ellipse.png"
              alt=""
              className="absolute -bottom-8 -right-8 hidden lg:block w-[87px] h-[87px] object-contain animate-rotate-slow opacity-40"
              aria-hidden="true"
            />
          </Reveal>
        </div>
      </div>
    </section>
  )
}

export default AboutPreview
