import SectionHeading from './shared/SectionHeading'
import PlaceholderBox from './shared/PlaceholderBox'

const platforms = [
  { id: 'HOME-PLATFORM-1', label: 'Fiverr logo', href: 'https://www.fiverr.com/saber_nasr' },
  { id: 'HOME-PLATFORM-2', label: 'Upwork logo', href: 'https://www.upwork.com/freelancers/saber' },
  { id: 'HOME-PLATFORM-3', label: 'Freelancer logo', href: 'https://www.freelancer.com/u/SaberElbendary' },
  { id: 'HOME-PLATFORM-4', label: 'SND Design logo', href: 'https://sabernasr.com' },
]

function Platforms() {
  return (
    <section className="section-padding bg-white">
      <div className="container-main">
        <SectionHeading eyebrow="HUGE HONOR" title="Our Platforms" className="mb-16" />

        <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
          {platforms.map((platform) => (
            <a
              key={platform.id}
              href={platform.href}
              target="_blank"
              rel="noopener noreferrer"
              className="border border-card-border p-6 flex items-center justify-center hover:opacity-60 transition-opacity duration-300 bg-white"
            >
              <PlaceholderBox
                id={platform.id}
                type="[LOGO]"
                width="180px"
                height="60px"
                label={platform.label}
              />
            </a>
          ))}
        </div>
      </div>
    </section>
  )
}

export default Platforms
