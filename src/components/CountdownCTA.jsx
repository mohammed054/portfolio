import PlaceholderBox from './shared/PlaceholderBox'
import SectionHeading from './shared/SectionHeading'
import Button from './shared/Button'

function CountdownCTA() {
  return (
    <section className="py-[140px] bg-dark-bg text-white relative overflow-hidden">
      <PlaceholderBox
        id="ABOUT-CTA-BGPHOTO"
        type="[BACKGROUND_VIDEO]"
        width="100%"
        height="100%"
        label="CTA background — hands on tablet, dark overlay"
        className="absolute inset-0 opacity-30"
      />

      <div className="container-main relative z-10 text-center">
        <SectionHeading eyebrow="GET THE OFFER" title="Ask Us About Limited Discount" className="mb-12" />

        <div className="flex justify-center gap-4 mb-12">
          {['Days', 'Hours', 'Minutes', 'Seconds'].map((label, i) => (
            <div key={label} className="flex flex-col items-center">
              <div className="text-5xl font-bold mb-2 border-b-2 border-white/30 pb-4 px-4">00</div>
              <span className="text-sm text-footer-text">{label}</span>
            </div>
          ))}
        </div>

        <Button to="/contact-us/">Contact Us</Button>
      </div>
    </section>
  )
}

export default CountdownCTA
