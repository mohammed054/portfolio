import { useParams } from 'react-router-dom'
import SectionHeading from '../components/shared/SectionHeading'

const categories = [
  { slug: '', label: 'All' },
  { slug: 'web', label: 'Web' },
  { slug: 'logo', label: 'Logo' },
  { slug: 'social-media', label: 'Social Media' },
  { slug: 'pdfs', label: 'PDFs' },
  { slug: 'video', label: 'Video' },
]

const portfolioItems = [
  'Mustadeem Store', 'Mkayn Store', 'HELIX CATALOG', 'Sealy Collection',
  'Sealy Products 2021', 'Sealy Middle East', 'Saudi Holiday Travel',
  'Crypto Sense', 'Maktabi', 'Sealy March 2024', 'Saudi Founding Day',
  'Sealy Feb 2024', 'Sealy Mattress', 'Valent Health Logo', 'Apachi Restaurant',
  'Zahi Company', 'ALtahrir Koshary', 'Tayebat Alsham', 'Asaad',
  'Latelierdenaila', 'Sealyme', 'Sweet Diet', 'Lean Community',
  'My It Guide', 'Emoji Pizza', 'Glassfitti', 'Blue Print',
  'Blue Blog', 'Lavanta Care', 'View Dubai',
]

function Portfolio() {
  const { category } = useParams()
  const activeCategory = category || ''

  return (
    <section className="section-padding bg-white">
      <div className="container-main">
        <SectionHeading
          eyebrow="PORTFOLIO"
          title="Our Portfolio"
          className="mb-12"
        />

        <div className="flex flex-wrap justify-center gap-3 mb-14">
          {categories.map((cat) => (
            <a
              key={cat.slug}
              href={cat.slug ? `/our-portfolio/${cat.slug}/` : '/our-portfolio/'}
              className={`px-6 py-2.5 rounded-full text-sm font-semibold font-[Poppins] transition-all duration-300 ${
                activeCategory === cat.slug
                  ? 'bg-primary text-white'
                  : 'bg-light-bg text-text-dark hover:bg-primary hover:text-white'
              }`}
            >
              {cat.label}
            </a>
          ))}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {portfolioItems.map((item, i) => (
            <div key={i} className="aspect-[4/3] overflow-hidden group cursor-pointer bg-light-bg border border-card-border">
              <img
                src={`/images/portfolio/mustadeem.jpg`}
                alt={item}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default Portfolio
