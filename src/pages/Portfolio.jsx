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
  { name: 'Mustadeem Store', category: 'web', href: 'https://mustadeem.ae/', img: '/images/portfolio/mustadeem.jpg' },
  { name: 'Mkayn Store', category: 'web', href: 'https://mkayn.com/', img: '/images/portfolio/mkayn-store.jpg' },
  { name: 'HELIX CATALOG', category: 'pdfs', href: 'https://sabernasr.com/portfolio/helix-catalog/', img: '/images/portfolio/helix-catalog.jpg' },
  { name: 'Sealy Collection', category: 'pdfs', href: 'https://sabernasr.com/portfolio/sealy-collection/', img: '/images/portfolio/sealy-collection.jpg' },
  { name: 'Sealy Products 2021', category: 'pdfs', href: 'https://sabernasr.com/portfolio/sealy-products-2021/', img: '/images/portfolio/sealy-products.jpg' },
  { name: 'Sealy Middle East', category: 'video', href: 'https://sabernasr.com/portfolio/sealy-middle-east/', img: '/images/portfolio/sealy-middle-east.jpg' },
  { name: 'Saudi Holiday Travel', category: 'web', href: 'https://saudiholidays.travel/', img: '/images/portfolio/saudi-holiday.jpg' },
  { name: 'Crypto Sense', category: 'web', href: 'https://cryptosense.space/', img: '/images/portfolio/crypto-sense.jpg' },
  { name: 'Maktabi', category: 'web', href: 'https://maktabitech.com/', img: '/images/portfolio/maktabi.jpg' },
  { name: 'Sealy March 2024', category: 'social-media', href: 'https://sabernasr.com/portfolio/sealy-march-2024/', img: '/images/portfolio/sealy-march.jpg' },
  { name: 'Saudi Founding Day', category: 'social-media', href: 'https://sabernasr.com/portfolio/saudi-founding-day-3/', img: '/images/portfolio/saudi-founding-3.jpg' },
  { name: 'Sealy Feb 2024', category: 'social-media', href: 'https://sabernasr.com/portfolio/sealy-social-media/', img: '/images/portfolio/sealy-social.jpg' },
  { name: 'Sealy Mattress', category: 'video', href: 'https://sabernasr.com/portfolio/sealy-mattress/', img: '/images/portfolio/sealy-mattress.jpg' },
  { name: 'Saudi Founding Day', category: 'video', href: 'https://sabernasr.com/portfolio/saudi-founding-day-2/', img: '/images/portfolio/saudi-founding-2.jpg' },
  { name: 'Saudi Founding Day', category: 'video', href: 'https://sabernasr.com/portfolio/saudi-founding-day/', img: '/images/portfolio/saudi-founding-1.jpg' },
  { name: 'Valent Health Logo', category: 'logo', href: 'https://sabernasr.com/portfolio/valent-health-logo/', img: '/images/portfolio/valent-health.jpg' },
  { name: 'Apachi Restaurant', category: 'social-media', href: 'https://sabernasr.com/portfolio/apachi/', img: '/images/portfolio/apachi.jpg' },
  { name: 'Zahi Company', category: 'social-media', href: 'https://sabernasr.com/portfolio/zahi/', img: '/images/portfolio/zahi.jpg' },
  { name: 'ALtahrir Koshary', category: 'social-media', href: 'https://sabernasr.com/portfolio/altahrir-koshary/', img: '/images/portfolio/altahrir.jpg' },
  { name: 'Tayebat Alsham', category: 'social-media', href: 'https://sabernasr.com/portfolio/tayebat-alsham/', img: '/images/portfolio/tayebat.jpg' },
  { name: 'Asaad', category: 'web', href: 'https://asaad.org/', img: '/images/portfolio/asaad.jpg' },
  { name: 'Latelierdenaila', category: 'web', href: 'https://latelierdenaila.fr/', img: '/images/portfolio/latelier.jpg' },
  { name: 'Sealyme', category: 'web', href: 'https://sealyme.com/', img: '/images/portfolio/sealyme.jpg' },
  { name: 'Sweet Diet', category: 'web', href: 'https://www.sweet-diet.com/', img: '/images/portfolio/sweet-diet.jpg' },
  { name: 'Lean Community', category: 'web', href: 'https://market.leancommunity.org/', img: '/images/portfolio/lean-community.jpg' },
  { name: 'My It Guide', category: 'web', href: 'https://myitguide.tech/', img: '/images/portfolio/my-it-guide.jpg' },
  { name: 'Emoji Pizza', category: 'web', href: 'https://emojipizzasa.com/', img: '/images/portfolio/emoji-pizza.jpg' },
  { name: 'Glassfitti', category: 'web', href: 'https://glassfitti.com/', img: '/images/portfolio/glassfitti.jpg' },
  { name: 'Blue Print', category: 'web', href: 'https://blueprintmanagement.ca/', img: '/images/portfolio/blue-print.jpg' },
  { name: 'Blue Blog', category: 'web', href: 'https://blueprintmanagement.ca/blog/', img: '/images/portfolio/blue-blog.jpg' },
  { name: 'Lavanta Care', category: 'web', href: 'https://lavantacare.com/', img: '/images/portfolio/lavanta-care.jpg' },
  { name: 'View Dubai', category: 'web', href: 'https://www.viewdubai.net/', img: '/images/portfolio/view-dubai.jpg' },
]

function Portfolio() {
  const { category } = useParams()
  const activeCategory = category || ''

  return (
    <section className="section-padding bg-white">
      <div className="container-main">
        <Reveal>
          <SectionHeading
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
                    src={item.img}
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
