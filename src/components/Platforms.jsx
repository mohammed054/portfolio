import SectionHeading from './shared/SectionHeading'
import Reveal from './shared/Reveal'

const platforms = [
  { id: 'HOME-PLATFORM-1', label: 'Site Of The Day', href: 'https://www.fiverr.com/saber_nasr', src: '/images/platforms/fiverr.png', year: '2017', index: '01' },
  { id: 'HOME-PLATFORM-2', label: 'Site Of The Day', href: 'https://www.upwork.com/freelancers/saber', src: '/images/platforms/upwork.png', year: '2017', index: '02' },
  { id: 'HOME-PLATFORM-3', label: 'Site Of The Day', href: 'https://www.freelancer.com/u/SaberElbendary', src: '/images/platforms/freelancer.png', year: '2018', index: '03' },
  { id: 'HOME-PLATFORM-4', label: 'Site Of The Day', href: 'https://sabernasr.com', src: '/images/platforms/snd-design.png', year: '2020', index: '04' },
]

function Platforms() {
  return (
    <section className="section-padding bg-white">
      <div className="container-main">
        <Reveal>
          <SectionHeading eyebrow="HUGE HONOR" title="Our Platforms" className="mb-16" />
        </Reveal>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
          {platforms.map((platform, i) => (
            <Reveal key={platform.id} delay={i * 0.1}>
              <a
                href={platform.href}
                target="_blank"
                rel="noopener noreferrer"
                className="group border border-card-border p-6 flex flex-col items-center justify-center hover:opacity-60 transition-opacity duration-300 bg-white gap-4"
              >
                <img
                  src={platform.src}
                  alt={platform.label}
                  className="w-[180px] h-[60px] object-contain"
                  loading="lazy"
                />
                <div className="text-center">
                  <h3 className="text-sm font-bold text-text-dark font-[Poppins]">{platform.label}</h3>
                  <span className="text-[0.778rem] text-text-muted">{platform.year}</span>
                </div>
              </a>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}

export default Platforms
