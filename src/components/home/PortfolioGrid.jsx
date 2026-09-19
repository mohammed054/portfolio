import { ArrowRight } from 'lucide-react'
import Button from '../shared/Button.jsx'
import PlaceholderBox from '../shared/PlaceholderBox.jsx'

const projects = [
  {
    id: 'HOME-PORTFOLIO-IMG-1',
    name: 'Mustadeem Store',
    category: 'Web',
    label: 'Mustadeem Store — Arabic/English skincare e-commerce mockup',
    className: 'row-span-2 min-h-[420px]',
  },
  {
    id: 'HOME-PORTFOLIO-IMG-2',
    name: 'Mkayn Store',
    category: 'Web',
    label: 'Mkayn Store — e-commerce web project',
    className: 'min-h-[200px]',
  },
  {
    id: 'HOME-PORTFOLIO-IMG-3',
    name: 'HELIX CATALOG',
    category: 'PDFs',
    label: 'HELIX CATALOG — product brochure mockup',
    className: 'min-h-[200px]',
  },
]

export default function PortfolioGrid() {
  return (
    <section className="bg-white px-6 py-20 md:px-10">
      <div className="mx-auto grid max-w-6xl grid-cols-2 grid-rows-2 gap-4">
        {projects.map((project) => (
          <div key={project.id} className={`relative ${project.className}`}>
            <PlaceholderBox
              id={project.id}
              type="[IMAGE]"
              label={project.label}
              className="h-full w-full"
            />
            <div className="pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent p-4">
              <p className="font-bold text-white">{project.name}</p>
              <p className="text-sm text-white/70">{project.category}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-10 text-center">
        <Button to="/portfolio" className="inline-flex items-center gap-2">
          All Portfolios <ArrowRight size={16} />
        </Button>
      </div>
    </section>
  )
}
