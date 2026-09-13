import { useParams } from 'react-router-dom'
import SectionHeading from '../components/shared/SectionHeading'
import Reveal from '../components/shared/Reveal'

const categories = [
  { slug: '', label: 'All' },
  { slug: 'web', label: 'Web' },
  { slug: 'logo', label: 'Logo' },
  { slug: 'social-media', label: 'Social Media' },
  { slug: 'pdfs', label: 'PDFs' },
  { slug: 'video', label: 'Video' },
]

const portfolioItems = [
  { name: 'Mustadeem Store', category: 'web', href: 'https://mustadeem.ae/' },
  { name: 'Mkayn Store', category: 'web', href: 'https://mkayn.com/' },
  { name: 'HELIX CATALOG', category: 'pdfs', href: 'https://sabernasr.com/portfolio/helix-catalog/' },
  { name: 'Sealy Collection', category: 'pdfs', href: 'https://sabernasr.com/portfolio/sealy-collection/' },
  { name: 'Sealy Products 2021', category: 'pdfs', href: 'https://sabernasr.com/portfolio/sealy-products-2021/' },
  { name: 'Sealy Middle East', category: 'video', href: 'https://sabernasr.com/portfolio/sealy-middle-east/' },
  { name: 'Saudi Holiday Travel', category: 'web', href: 'https://saudiholidays.travel/' },
  { name: 'Crypto Sense', category: 'web', href: 'https://cryptosense.space/' },
  { name: 'Maktabi', category: 'web', href: 'https://maktabitech.com/' },
  { name: 'Sealy March 2024', category: 'social-media', href: 'https://sabernasr.com/portfolio/sealy-march-2024/' },
  { name: 'Saudi Founding Day', category: 'social-media', href: 'https://sabernasr.com/portfolio/saudi-founding-day-3/' },
  { name: 'Sealy Feb 2024', category: 'social-media', href: 'https://sabernasr.com/portfolio/sealy-social-media/' },
  { name: 'Sealy Mattress', category: 'video', href: 'https://sabernasr.com/portfolio/sealy-mattress/' },
  { name: 'Saudi Founding Day', category: 'video', href: 'https://sabernasr.com/portfolio/saudi-founding-day-2/' },
  { name: 'Saudi Founding Day', category: 'video', href: 'https://sabernasr.com/portfolio/saudi-founding-day/' },
  { name: 'Valent Health Logo', category: 'logo', href: 'https://sabernasr.com/portfolio/valent-health-logo/' },
  { name: 'Apachi Restaurant', category: 'social-media', href: 'https://sabernasr.com/portfolio/apachi/' },
  { name: 'Zahi Company', category: 'social-media', href: 'https://sabernasr.com/portfolio/zahi/' },
  { name: 'ALtahrir Koshary', category: 'social-media', href: 'https://sabernasr.com/portfolio/altahrir-koshary/' },
  { name: 'Tayebat Alsham', category: 'social-media', href: 'https://sabernasr.com/portfolio/tayebat-alsham/' },
  { name: 'Asaad', category: 'web', href: 'https://asaad.org/' },
  { name: 'Latelierdenaila', category: 'web', href: 'https://latelierdenaila.fr/' },
  { name: 'Sealyme', category: 'web', href: 'https://sealyme.com/' },
  { name: 'Sweet Diet', category: 'web', href: 'https://www.sweet-diet.com/' },
  { name: 'Lean Community', category: 'web', href: 'https://market.leancommunity.org/' },
  { name: 'My It Guide', category: 'web', href: 'https://myitguide.tech/' },
  { name: 'Emoji Pizza', category: 'web', href: 'https://emojipizzasa.com/' },
  { name: 'Glassfitti', category: 'web', href: 'https://glassfitti.com/' },
  { name: 'Blue Print', category: 'web', href: 'https://blueprintmanagement.ca/' },
  { name: 'Blue Blog', category: 'web', href: 'https://blueprintmanagement.ca/blog/' },
]

function Portfolio() {
  const { category } = useParams()
  const activeCategory = category || ''

  return (
    <section className="section-padding bg-white">
      <div className="container-main">
        <Reveal>
          <SectionHeading
            eyebrow="PORTFOLIO"
            title="Our Portfolio"
            className="mb-12"
          />
        </Reveal>

        <Reveal delay={0.1}>
          <div className="flex flex-wrap justify-center gap-3 mb-14">
            {categories.map((cat) => (
              <a
                key={cat.slug}
                href={cat.slug ? `/our-portfolio/${cat.slug}/` : '/our-portfolio/'}
                className={`px-6 py-2.5 rounded-full text-[0.833rem] font-semibold font-[Poppins] transition-all duration-300 ${
                  activeCategory === cat.slug
                    ? 'bg-primary text-white'
                    : 'bg-light-bg text-text-dark hover:bg-primary hover:text-white'
                }`}
              >
                {cat.label}
              </a>
            ))}
          </div>
        </Reveal>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {portfolioItems
            .filter((item) => !activeCategory || item.category === activeCategory)
            .map((item, i) => (
            <Reveal key={i} delay={i * 0.03}>
              <a
                href={item.href}
                target="_blank"
                rel="noopener noreferrer"
                className="block"
              >
                <div className="img-hover-mask aspect-[4/3] cursor-pointer bg-light-bg border border-card-border">
                  <img
                    src={`/images/portfolio/mustadeem.jpg`}
                    alt={item.name}
                    className="w-full h-full object-cover"
                  />
                  <div className="mask" />
                  <div className="absolute inset-0 z-[5] flex flex-col justify-end p-5 bg-gradient-to-t from-black/70 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300">
                    <h3 className="text-white font-bold text-lg font-[Poppins]">{item.name}</h3>
                    <span className="text-white/70 text-[0.722rem] uppercase tracking-wider mt-1">{item.category.replace('-', ' ')}</span>
                  </div>
                </div>
              </a>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}

export default Portfolio
