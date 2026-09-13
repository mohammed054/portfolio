import SectionHeading from './shared/SectionHeading'
import Reveal from './shared/Reveal'

const items = [
  { name: 'Mustadeem Store', src: '/images/portfolio/mustadeem.jpg', category: 'Web' },
  { name: 'Mkayn Store', src: '/images/portfolio/mkayn-store.jpg', category: 'Web' },
  { name: 'HELIX CATALOG', src: '/images/portfolio/helix-catalog.jpg', category: 'PDFs' },
  { name: 'Sealy Collection', src: '/images/portfolio/mustadeem.jpg', category: 'PDFs' },
  { name: 'Sealy Products 2021', src: '/images/portfolio/mkayn-store.jpg', category: 'PDFs' },
  { name: 'Sealy Middle East', src: '/images/portfolio/helix-catalog.jpg', category: 'Video' },
  { name: 'Saudi Holiday Travel', src: '/images/portfolio/mustadeem.jpg', category: 'Web' },
  { name: 'Crypto Sense', src: '/images/portfolio/mkayn-store.jpg', category: 'Web' },
  { name: 'Maktabi', src: '/images/portfolio/helix-catalog.jpg', category: 'Web' },
  { name: 'Sealy March 2024', src: '/images/portfolio/mustadeem.jpg', category: 'Social Media' },
  { name: 'Saudi Founding Day', src: '/images/portfolio/mkayn-store.jpg', category: 'Social Media' },
  { name: 'Sealy Feb 2024', src: '/images/portfolio/helix-catalog.jpg', category: 'Social Media' },
  { name: 'Sealy Mattress', src: '/images/portfolio/mustadeem.jpg', category: 'Video' },
  { name: 'Saudi Founding Day', src: '/images/portfolio/mkayn-store.jpg', category: 'Video', sub: '2' },
  { name: 'Saudi Founding Day', src: '/images/portfolio/helix-catalog.jpg', category: 'Video', sub: '3' },
  { name: 'Valent Health Logo', src: '/images/portfolio/mustadeem.jpg', category: 'Logo' },
  { name: 'Apachi Restaurant', src: '/images/portfolio/mkayn-store.jpg', category: 'Social Media' },
  { name: 'Zahi Company', src: '/images/portfolio/helix-catalog.jpg', category: 'Social Media' },
  { name: 'ALtahrir Koshary', src: '/images/portfolio/mustadeem.jpg', category: 'Social Media' },
  { name: 'Tayebat Alsham', src: '/images/portfolio/mkayn-store.jpg', category: 'Social Media' },
  { name: 'Asaad', src: '/images/portfolio/helix-catalog.jpg', category: 'Web' },
  { name: 'Latelierdenaila', src: '/images/portfolio/mustadeem.jpg', category: 'Web' },
  { name: 'Sealyme', src: '/images/portfolio/mkayn-store.jpg', category: 'Web' },
  { name: 'Sweet Diet', src: '/images/portfolio/helix-catalog.jpg', category: 'Web' },
  { name: 'Lean Community', src: '/images/portfolio/mustadeem.jpg', category: 'Web' },
  { name: 'My It Guide', src: '/images/portfolio/mkayn-store.jpg', category: 'Web' },
  { name: 'Emoji Pizza', src: '/images/portfolio/helix-catalog.jpg', category: 'Web' },
  { name: 'Glassfitti', src: '/images/portfolio/mustadeem.jpg', category: 'Web' },
  { name: 'Blue Print', src: '/images/portfolio/mkayn-store.jpg', category: 'Web' },
  { name: 'Blue Blog', src: '/images/portfolio/helix-catalog.jpg', category: 'Web' },
]

function PortfolioSlider() {
  return (
    <section className="section-padding bg-section-bg">
      <div className="container-main">
        <Reveal>
          <SectionHeading
            title="What makes us happy"
            className="mb-16"
          />
        </Reveal>

        <Reveal delay={0.1}>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {items.map((item, i) => (
              <div key={i} className="img-hover-mask aspect-[4/3] cursor-pointer bg-white border border-card-border">
                <img
                  src={item.src}
                  alt={item.name}
                  className="w-full h-full object-cover"
                />
                <div className="mask" />
              </div>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  )
}

export default PortfolioSlider
