import SectionHeading from './shared/SectionHeading'
import PlaceholderBox from './shared/PlaceholderBox'

const platforms = [
  { id: 'ABOUT-PLATFORM-1', label: 'Fiverr logo', href: 'https://www.fiverr.com/saber_nasr' },
  { id: 'ABOUT-PLATFORM-2', label: 'Upwork logo', href: 'https://www.upwork.com/freelancers/saber' },
  { id: 'ABOUT-PLATFORM-3', label: 'Freelancer logo', href: 'https://www.freelancer.com/u/SaberElbendary' },
  { id: 'ABOUT-PLATFORM-4', label: 'SND Design logo', href: 'https://sabernasr.com' },
]

function AboutPlatforms() {
  return (
    <section className="py-[140px] bg-section-bg">
      <div className="container-main">
        <SectionHeading eyebrow="HUGE HONOR" title="Our Platforms" className="mb-16" />

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {platforms.map((platform) => (
            <a
              key={platform.id}
              href={platform.href}
              target="_blank"
              rel="noopener noreferrer"
              className="border border-card-border p-6 flex items-center justify-center hover:opacity-70 transition-opacity"
            >
              <PlaceholderBox
                id={platform.id}
                type="[LOGO]"
                width="200px"
                height="80px"
                label={platform.label}
              />
            </a>
          ))}
        </div>
      </div>
    </section>
  )
}

export default AboutPlatforms
