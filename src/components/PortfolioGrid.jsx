import PlaceholderBox from './shared/PlaceholderBox'
import Button from './shared/Button'

function PortfolioGrid() {
  return (
    <section className="section-padding bg-light-bg">
      <div className="container-main">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-14">
          <div className="row-span-2">
            <div className="h-[690px] overflow-hidden group cursor-pointer">
              <PlaceholderBox
                id="HOME-PORTFOLIO-IMG-1"
                type="[IMAGE]"
                width="100%"
                height="100%"
                label="Mustadeem Store — laptop mockup on wooden desk"
                className="transition-transform duration-700 group-hover:scale-105"
              />
            </div>
          </div>
          <div>
            <div className="h-[330px] overflow-hidden group cursor-pointer">
              <PlaceholderBox
                id="HOME-PORTFOLIO-IMG-2"
                type="[IMAGE]"
                width="100%"
                height="100%"
                label="Mkayn Store — Arabic food-delivery site"
                className="transition-transform duration-700 group-hover:scale-105"
              />
            </div>
          </div>
          <div>
            <div className="h-[330px] overflow-hidden group cursor-pointer">
              <PlaceholderBox
                id="HOME-PORTFOLIO-IMG-3"
                type="[IMAGE]"
                width="100%"
                height="100%"
                label="HELIX CATALOG — product brochure mockup"
                className="transition-transform duration-700 group-hover:scale-105"
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
