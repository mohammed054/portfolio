import Button from './shared/Button'
import Reveal from './shared/Reveal'

const items = [
  { src: '/images/portfolio/mustadeem.jpg', alt: 'Mustadeem Store — laptop mockup on wooden desk', name: 'Mustadeem Store', category: 'Web', href: 'https://mustadeem.ae/' },
  { src: '/images/portfolio/mkayn-store.jpg', alt: 'food-delivery site — brand name unconfirmed', name: 'Mkayn Store', category: 'Web', href: 'https://mkayn.com/' },
  { src: '/images/portfolio/helix-catalog.jpg', alt: 'HELIX CATALOG — product brochure mockup', name: 'HELIX CATALOG', category: 'PDFs', href: 'https://sabernasr.com/portfolio/helix-catalog/' },
]

function PortfolioGrid() {
  return (
    <section className="section-padding bg-light-bg">
      <div className="container-main">
        <Reveal>
          <div className="grid grid-cols-1 lg:grid-cols-2 grid-rows-[auto_auto] gap-4 mb-14">
            <div className="row-span-2">
              <a href={items[0].href} target="_blank" rel="noopener noreferrer" className="block h-full">
                <div className="img-hover-mask h-full min-h-[690px] cursor-pointer relative">
                  <img
                    src={items[0].src}
                    alt={items[0].alt}
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                  <div className="mask" />
                  <div className="absolute inset-0 z-[5] flex flex-col justify-end p-6 bg-gradient-to-t from-black/70 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300">
                    <h3 className="text-white font-bold text-lg font-[Poppins]">{items[0].name}</h3>
                    <span className="text-white/70 text-[0.722rem] uppercase tracking-wider mt-1">{items[0].category}</span>
                  </div>
                </div>
              </a>
            </div>
            {items.slice(1).map((item) => (
              <div key={item.src}>
                <a href={item.href} target="_blank" rel="noopener noreferrer" className="block">
                  <div className="img-hover-mask h-[330px] cursor-pointer relative">
                    <img
                      src={item.src}
                      alt={item.alt}
                      className="w-full h-full object-cover"
                      loading="lazy"
                    />
                    <div className="mask" />
                    <div className="absolute inset-0 z-[5] flex flex-col justify-end p-6 bg-gradient-to-t from-black/70 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300">
                      <h3 className="text-white font-bold text-lg font-[Poppins]">{item.name}</h3>
                      <span className="text-white/70 text-[0.722rem] uppercase tracking-wider mt-1">{item.category}</span>
                    </div>
                  </div>
                </a>
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
