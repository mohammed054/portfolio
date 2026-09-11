import PlaceholderBox from './shared/PlaceholderBox'
import Button from './shared/Button'

function PortfolioGrid() {
  return (
    <section className="py-[140px] bg-light-bg">
      <div className="container-main">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-12">
          <div className="row-span-2">
            <PlaceholderBox
              id="HOME-PORTFOLIO-IMG-1"
              type="[IMAGE]"
              width="100%"
              height="690px"
              label="Mustadeem Store — laptop mockup on wooden desk"
            />
          </div>
          <div>
            <PlaceholderBox
              id="HOME-PORTFOLIO-IMG-2"
              type="[IMAGE]"
              width="100%"
              height="330px"
              label="Mkayn Store — Arabic food-delivery site"
            />
          </div>
          <div>
            <PlaceholderBox
              id="HOME-PORTFOLIO-IMG-3"
              type="[IMAGE]"
              width="100%"
              height="330px"
              label="HELIX CATALOG — product brochure mockup"
            />
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
