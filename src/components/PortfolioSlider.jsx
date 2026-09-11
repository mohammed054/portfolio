import SectionHeading from './shared/SectionHeading'
import PlaceholderBox from './shared/PlaceholderBox'

const items = [
  'Mustadeem Store', 'Mkayn Store', 'HELIX CATALOG', 'Sealy Collection',
  'Sealy Products 2021', 'Sealy Middle East', 'Saudi Holiday Travel',
  'Crypto Sense', 'Maktabi', 'Sealy March 2024', 'Saudi Founding Day',
  'Sealy Feb 2024', 'Sealy Mattress', 'Valent Health Logo', 'Apachi Restaurant',
]

function PortfolioSlider() {
  return (
    <section className="py-[140px] bg-section-bg">
      <div className="container-main">
        <SectionHeading
          title="What makes us happy"
          className="mb-16"
        />

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {items.map((item, i) => (
            <div key={i} className="aspect-[4/3] overflow-hidden">
              <PlaceholderBox
                id={`ABOUT-PORTFOLIO-ITEM-${i + 1}`}
                type="[IMAGE]"
                width="100%"
                height="100%"
                label={item}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default PortfolioSlider
