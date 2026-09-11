import SectionHeading from './shared/SectionHeading'
import PlaceholderBox from './shared/PlaceholderBox'
import Button from './shared/Button'

function AboutPreview() {
  return (
    <section className="py-[140px] bg-light-bg">
      <div className="container-main">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div>
            <SectionHeading eyebrow="MORE EFFECTIVE" title="We develop & create digital future." className="text-left mb-8" />
            <p className="text-text-muted leading-relaxed mb-8">
              We appreciate your trust greatly. Our clients choose us and our products because they know we are the best.
            </p>
            <Button to="/about/" className="relative">
              About Us
              <span className="absolute -top-1 -right-1 w-3 h-3 bg-secondary rounded-full" />
            </Button>

            <div className="grid grid-cols-4 gap-4 mt-12">
              <PlaceholderBox
                id="HOME-ABOUTPREVIEW-LOGOSTRIP-1"
                type="[LOGO]"
                width="100%"
                height="110px"
                label="Fiverr logo"
              />
              <PlaceholderBox
                id="HOME-ABOUTPREVIEW-LOGOSTRIP-2"
                type="[LOGO]"
                width="100%"
                height="110px"
                label="Upwork logo"
              />
              <PlaceholderBox
                id="HOME-ABOUTPREVIEW-LOGOSTRIP-3"
                type="[LOGO]"
                width="100%"
                height="110px"
                label="Freelancer logo"
              />
              <PlaceholderBox
                id="HOME-ABOUTPREVIEW-LOGOSTRIP-4"
                type="[LOGO]"
                width="100%"
                height="110px"
                label="SND Design logo"
              />
            </div>
          </div>

          <div className="relative">
            <PlaceholderBox
              id="HOME-ABOUTPREVIEW-ILLUSTRATION"
              type="[ILLUSTRATION]"
              width="530px"
              height="450px"
              label="ILLUSTRATION — person painting colorful abstract splash, flat vector style"
              className="mx-auto"
            />
          </div>
        </div>
      </div>
    </section>
  )
}

export default AboutPreview
