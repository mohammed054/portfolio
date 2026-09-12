import SectionHeading from './shared/SectionHeading'

const items = [
  { name: 'Mustadeem Store', src: '/images/portfolio/mustadeem.jpg' },
  { name: 'Mkayn Store', src: '/images/portfolio/mkayn-store.jpg' },
  { name: 'HELIX CATALOG', src: '/images/portfolio/helix-catalog.jpg' },
  { name: 'Sealy Collection', src: '/images/portfolio/mustadeem.jpg' },
  { name: 'Sealy Products 2021', src: '/images/portfolio/mkayn-store.jpg' },
  { name: 'Sealy Middle East', src: '/images/portfolio/helix-catalog.jpg' },
  { name: 'Saudi Holiday Travel', src: '/images/portfolio/mustadeem.jpg' },
  { name: 'Crypto Sense', src: '/images/portfolio/mkayn-store.jpg' },
  { name: 'Maktabi', src: '/images/portfolio/helix-catalog.jpg' },
  { name: 'Sealy March 2024', src: '/images/portfolio/mustadeem.jpg' },
  { name: 'Saudi Founding Day', src: '/images/portfolio/mkayn-store.jpg' },
  { name: 'Sealy Feb 2024', src: '/images/portfolio/helix-catalog.jpg' },
  { name: 'Sealy Mattress', src: '/images/portfolio/mustadeem.jpg' },
  { name: 'Valent Health Logo', src: '/images/portfolio/mkayn-store.jpg' },
  { name: 'Apachi Restaurant', src: '/images/portfolio/helix-catalog.jpg' },
]

function PortfolioSlider() {
  return (
    <section className="section-padding bg-section-bg">
      <div className="container-main">
        <SectionHeading
          title="What makes us happy"
          className="mb-16"
        />

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {items.map((item, i) => (
            <div key={i} className="aspect-[4/3] overflow-hidden group cursor-pointer bg-white border border-card-border">
              <img
                src={item.src}
                alt={item.name}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default PortfolioSlider
