import SectionHeading from './shared/SectionHeading'
import Reveal from './shared/Reveal'

const platforms = [
  { id: 'ABOUT-PLATFORM-1', label: 'Fiverr logo', href: 'https://www.fiverr.com/saber_nasr', src: '/images/platforms/fiverr.png' },
  { id: 'ABOUT-PLATFORM-2', label: 'Upwork logo', href: 'https://www.upwork.com/freelancers/saber', src: '/images/platforms/upwork.png' },
  { id: 'ABOUT-PLATFORM-3', label: 'Freelancer logo', href: 'https://www.freelancer.com/u/SaberElbendary', src: '/images/platforms/freelancer.png' },
]

function AboutPlatforms() {
  return (
    <section className="section-padding bg-dark-bg">
      <div className="container-main">
        <Reveal>
          <SectionHeading eyebrow="HUGE HONOR" title="Our Platforms" className="mb-16" />
        </Reveal>

        <Reveal delay={0.1}>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 max-w-[900px] mx-auto">
            {platforms.map((platform) => (
              <a
                key={platform.id}
                href={platform.href}
                target="_blank"
                rel="noopener noreferrer"
                className="border border-card-border p-6 flex items-center justify-center hover:opacity-60 transition-opacity duration-300 bg-white"
              >
                <img
                  src={platform.src}
                  alt={platform.label}
                  className="w-[180px] h-[60px] object-contain"
                />
              </a>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  )
}

export default AboutPlatforms
