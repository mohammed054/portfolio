import Button from './shared/Button'
import Reveal from './shared/Reveal'

const items = [
  { src: '/images/portfolio/mustadeem.jpg', alt: 'Mustadeem Store — laptop mockup on wooden desk' },
  { src: '/images/portfolio/mkayn-store.jpg', alt: 'food-delivery site — brand name unconfirmed' },
  { src: '/images/portfolio/helix-catalog.jpg', alt: 'HELIX CATALOG — product brochure mockup' },
]

function PortfolioGrid() {
  return (
    <section className="section-padding bg-light-bg">
      <div className="container-main">
        <Reveal>
          <div className="grid grid-cols-1 lg:grid-cols-2 grid-rows-[auto_auto] gap-4 mb-14">
            <div className="row-span-2">
              <div className="img-hover-mask h-full min-h-[690px] cursor-pointer">
                <img
                  src={items[0].src}
                  alt={items[0].alt}
                  className="w-full h-full object-cover"
                />
                <div className="mask" />
              </div>
            </div>
            {items.slice(1).map((item) => (
              <div key={item.src}>
                <div className="img-hover-mask h-[330px] cursor-pointer">
                  <img
                    src={item.src}
                    alt={item.alt}
                    className="w-full h-full object-cover"
                  />
                  <div className="mask" />
                </div>
              </div>
            ))}
          </div>
        </Reveal>

        <Reveal delay={0.2}>
          <div className="text-center">
            <Button to="/our-portfolio/" className="inline-flex items-center gap-2">
              All Portfolios →
            </Button>
          </div>
        </Reveal>
      </div>
    </section>
  )
}

export default PortfolioGrid
