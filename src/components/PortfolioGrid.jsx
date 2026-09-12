import Button from './shared/Button'

function PortfolioGrid() {
  return (
    <section className="section-padding bg-light-bg">
      <div className="container-main">
        <div className="grid grid-cols-1 lg:grid-cols-2 grid-rows-[auto_auto] gap-4 mb-14">
          <div className="row-span-2">
            <div className="h-full min-h-[690px] overflow-hidden group cursor-pointer">
              <img
                src="/images/portfolio/mustadeem.jpg"
                alt="Mustadeem Store — laptop mockup on wooden desk"
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
            </div>
          </div>
          <div>
            <div className="h-[330px] overflow-hidden group cursor-pointer">
              <img
                src="/images/portfolio/mkayn-store.jpg"
                alt="Mkayn Store"
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
            </div>
          </div>
          <div>
            <div className="h-[330px] overflow-hidden group cursor-pointer">
              <img
                src="/images/portfolio/helix-catalog.jpg"
                alt="HELIX CATALOG — product brochure mockup"
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
            </div>
          </div>
        </div>

        <div className="text-center">
          <Button to="/our-portfolio/" className="inline-flex items-center gap-2">
            All Portfolios →
          </Button>
        </div>
      </div>
    </section>
  )
}

export default PortfolioGrid
