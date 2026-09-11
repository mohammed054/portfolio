import SectionHeading from './shared/SectionHeading'
import PlaceholderBox from './shared/PlaceholderBox'
import Button from './shared/Button'

function AboutPreview() {
  return (
    <section className="section-padding bg-light-bg">
      <div className="container-main">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div>
            <SectionHeading eyebrow="MORE EFFECTIVE" title="We develop & create digital future." className="text-left mb-8" />
            <p className="text-text-muted leading-[1.7] mb-8 text-[16px]">
              We appreciate your trust greatly. Our clients choose us and our products because they know we are the best.
            </p>
            <div className="relative inline-block">
              <Button to="/about/">About Us</Button>
              <span className="absolute -top-1.5 -right-1.5 w-3 h-3 bg-secondary rounded-full" />
            </div>

            <div className="grid grid-cols-4 gap-4 mt-14">
              {['Fiverr logo', 'Upwork logo', 'Freelancer logo', 'SND Design logo'].map((label, i) => (
                <div key={i} className="border border-card-border p-4 flex items-center justify-center bg-white">
                  <PlaceholderBox
                    id={`HOME-ABOUTPREVIEW-LOGOSTRIP-${i + 1}`}
                    type="[LOGO]"
                    width="100%"
                    height="80px"
                    label={label}
                  />
                </div>
              ))}
            </div>
          </div>

          <div className="relative">
            <PlaceholderBox
              id="HOME-ABOUTPREVIEW-ILLUSTRATION"
              type="[ILLUSTRATION]"
              width="100%"
              height="450px"
              label="ILLUSTRATION — person painting colorful abstract splash, flat vector style"
            />
          </div>
        </div>
      </div>
    </section>
  )
}

export default AboutPreview
