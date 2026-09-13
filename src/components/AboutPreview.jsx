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

            <div className="grid grid-cols-4 gap-4 mt-14">
              {[
                { src: '/images/platforms/fiverr.png', alt: 'Fiverr logo' },
                { src: '/images/platforms/upwork.png', alt: 'Upwork logo' },
                { src: '/images/platforms/freelancer.png', alt: 'Freelancer logo' },
                { src: '/images/platforms/snd-design.png', alt: 'SND Design logo' },
              ].map((logo, i) => (
                <div key={i} className="border border-card-border p-4 flex items-center justify-center bg-white">
                  <img
                    src={logo.src}
                    alt={logo.alt}
                    className="w-full h-[80px] object-contain"
                  />
                </div>
              ))}
            </div>
          </Reveal>

          <Reveal variant="fadeRight" className="relative">
            <img
              src="/images/about/home-drawing.png"
              alt="Illustration — person painting colorful abstract splash"
              className="w-full h-[450px] object-contain"
            />
          </Reveal>
        </div>
      </div>
    </section>
  )
}

export default AboutPreview
