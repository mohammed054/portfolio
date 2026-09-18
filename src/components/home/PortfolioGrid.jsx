import { ArrowRight } from 'lucide-react'
import Button from '../shared/Button.jsx'
import PlaceholderBox from '../shared/PlaceholderBox.jsx'

export default function PortfolioGrid() {
  return (
    <section className="bg-white px-6 py-20 md:px-10">
      {/* Asymmetric grid: one large left cell spanning both rows, two
          stacked right cells — Round 1 QA had this as two equal boxes. */}
      <div className="mx-auto grid max-w-6xl grid-cols-2 grid-rows-2 gap-4">
        <PlaceholderBox
          id="HOME-PORTFOLIO-IMG-1"
          type="[IMAGE]"
          label="Mustadeem — Arabic/English skincare e-commerce mockup"
          className="row-span-2 min-h-[420px]"
        />
        <PlaceholderBox
          id="HOME-PORTFOLIO-IMG-2"
          type="[IMAGE]"
          label="Food-delivery site mockup — brand name unconfirmed, verify live"
          className="min-h-[200px]"
        />
        <PlaceholderBox
          id="HOME-PORTFOLIO-IMG-3"
          type="[IMAGE]"
          label="Helix brochure mockup"
          className="min-h-[200px]"
        />
      </div>

      <div className="mt-10 text-center">
        <Button to="/portfolio" className="inline-flex items-center gap-2">
          All Portfolios <ArrowRight size={16} />
        </Button>
      </div>
    </section>
  )
}
