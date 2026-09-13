import Button from './shared/Button'
import Reveal from './shared/Reveal'

const items = [
  { src: '/images/portfolio/mustadeem.jpg', alt: 'Mustadeem Store — laptop mockup on wooden desk', name: 'Mustadeem Store', category: 'Web', href: 'https://mustadeem.ae/' },
  { src: '/images/portfolio/mkayn-store.jpg', alt: 'food-delivery site — brand name unconfirmed', name: 'Mkayn Store', category: 'Web', href: 'https://mkayn.com/' },
  { src: '/images/portfolio/helix-catalog.jpg', alt: 'HELIX CATALOG — product brochure mockup', name: 'HELIX CATALOG', category: 'PDFs', href: 'https://sabernasr.com/portfolio/helix-catalog/' },
]

function PortfolioGrid() {
  return (
    <section className="section-padding bg-white">
      <div className="container-main">
        <Reveal>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 mb-14">
            {items.map((item) => (
              <div key={item.src}>
                <a href={item.href} target="_blank" rel="noopener noreferrer" className="block">
                  <div className="img-hover-mask cursor-pointer relative" style={{ aspectRatio: '16/9' }}>
                    <img
                      src={item.src}
                      alt={item.alt}
                      className="w-full h-full object-cover"
                      loading="lazy"
                    />
                    <div className="mask" />
                    <div className="absolute inset-0 z-[5] flex flex-col justify-end p-6 bg-gradient-to-t from-black/70 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300">
                      <h5 className="text-white font-bold text-lg" style={{ fontFamily: "'sofia-pro', 'Poppins', sans-serif" }}>{item.name}</h5>
                      <span className="text-white/70 text-[0.722rem] uppercase tracking-wider mt-1" style={{ fontFamily: "'europa', sans-serif" }}>{item.category}</span>
                    </div>
                  </div>
                </a>
              </div>
            ))}
          </div>
        </Reveal>

        <Reveal delay={0.2}>
          <div className="text-center">
            <Button to="/our-portfolio/" variant="outline" className="inline-flex items-center gap-2">
              All Portfolios
            </Button>
          </div>
        </Reveal>
      </div>
    </section>
  )
}

export default PortfolioGrid
