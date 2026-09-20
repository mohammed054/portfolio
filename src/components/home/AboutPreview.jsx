import Button from '../shared/Button.jsx'
import EyebrowLabel from '../shared/EyebrowLabel.jsx'
import SectionHeading from '../shared/SectionHeading.jsx'
import PlaceholderBox from '../shared/PlaceholderBox.jsx'

const logos = ['Fiverr', 'Upwork', 'Freelancer', 'SND Design']

export default function AboutPreview() {
  return (
    <section id="about-preview" className="bg-surface px-6 py-20 md:px-10">
      <div className="mx-auto grid max-w-6xl items-start gap-12 lg:grid-cols-2">
        <div>
          <EyebrowLabel>More Effective</EyebrowLabel>
          <SectionHeading className="mt-3">We develop &amp; create digital future.</SectionHeading>
          <p className="mt-6 max-w-md text-muted">
            We appreciate your trust greatly. Our clients choose us and our products because they know we are
            the best.
          </p>
          <div className="mt-8 inline-block">
            <Button to="/about">
              About Us
            </Button>
            <span className="ml-2 inline-block h-2 w-2 rounded-full bg-teal-500" />
          </div>

          <div className="mt-10 grid grid-cols-2 gap-4 sm:grid-cols-4">
            {logos.map((name) => (
              <PlaceholderBox
                key={name}
                id={`HOME-ABOUTPREVIEW-LOGOSTRIP-${name.replace(/\s+/g, '')}`}
                type="[LOGO]"
                label={`${name} logo`}
                className="h-20"
              />
            ))}
          </div>
        </div>

        {/* Sized to ~5:4, aligned with the text column — Round 1 QA had
            this stretched to nearly double the text column's height. */}
        <PlaceholderBox
          id="HOME-ABOUTPREVIEW-ILLUSTRATION"
          type="[ILLUSTRATION]"
          label="Person painting colorful abstract splash, flat vector style"
          className="aspect-[5/4] w-full max-w-md lg:ml-auto"
        />
      </div>
    </section>
  )
}
