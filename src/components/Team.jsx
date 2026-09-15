import { Play } from 'lucide-react'
import { Link } from 'react-router-dom'
import Button from './shared/Button'
import Reveal from './shared/Reveal'

const members = [
  {
    name: 'Saber Nasr',
    role: 'Project Manager',
    image: '/images/team/Saber-Nasr.jpg',
    socials: [
      { href: 'https://www.facebook.com/Saber.Nasr.Elbendary/', label: 'Facebook', iconPath: 'M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z' },
      { href: 'https://wa.me/201098083841', label: 'WhatsApp', iconPath: 'M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z' },
      { href: 'tel:+201098083841', label: 'Phone', iconPath: 'M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72 12.84 12.84 0 00.7 2.81 2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45 12.84 12.84 0 002.81.7A2 2 0 0122 16.92z' },
      { href: 'mailto:info@sabernasr.com', label: 'Email', iconPath: 'M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z' },
    ],
  },
  {
    name: 'Mohamed Maksoud',
    role: 'Graphic Designer',
    image: '/images/team/Mohamed-Maksoud.jpg',
    socials: [
      { href: 'https://smlancer.com/', label: 'Website', iconPath: 'M10 13a5 5 0 007.54.54l3-3a5 5 0 00-7.07-7.07l-1.72 1.71' },
      { href: 'tel:+201098083841', label: 'Phone', iconPath: 'M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72 12.84 12.84 0 00.7 2.81 2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45 12.84 12.84 0 002.81.7A2 2 0 0122 16.92z' },
      { href: 'mailto:info@sabernasr.com', label: 'Email', iconPath: 'M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z' },
    ],
  },
]

function Team() {
  return (
    <section className="section-padding bg-white">
      <div className="container-main">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <Reveal variant="fadeLeft">
            <div className="text-left">
              <span className="inline-block text-[0.722rem] font-semibold tracking-[2px] uppercase mb-4" style={{ fontFamily: "'europa', sans-serif", color: '#A5A6AA' }}>
                Our Team
              </span>
              <h2 className="text-[clamp(28px,1.5rem+1.2vw,42px)] font-bold leading-tight mb-8" style={{ fontFamily: "'sofia-pro', 'Poppins', sans-serif", color: '#222733' }}>
                Meet Our Team
              </h2>
            </div>
            <div className="flex items-center gap-6">
              <Button to="/about/">About Us</Button>
              <Link to="/contact-us/" className="flex items-center gap-3 group">
                <div className="w-[50px] h-[50px] border-2 border-text-dark rounded-full flex items-center justify-center group-hover:bg-text-dark group-hover:text-white transition-all duration-300">
                  <Play size={16} className="ml-0.5" fill="currentColor" />
                </div>
                <span className="text-[0.833rem] font-semibold group-hover:text-primary transition-colors" style={{ fontFamily: "'sofia-pro', 'Poppins', sans-serif", color: '#222733' }}>
                  Contact Us
                </span>
              </Link>
            </div>
          </Reveal>

          <Reveal variant="fadeRight">
            <div className="grid grid-cols-2 gap-5">
              {members.map((member) => (
                <div key={member.name} className="team-card">
                  <img
                    src={member.image}
                    alt={`${member.name} — ${member.role}`}
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                  <div className="team-card-overlay">
                    <div className="team-card-info">
                      <h4 className="text-white font-bold text-lg" style={{ fontFamily: "'sofia-pro', 'Poppins', sans-serif" }}>{member.name}</h4>
                      <p className="text-white/80 text-[0.833rem]" style={{ fontFamily: "'europa', sans-serif" }}>{member.role}</p>
                    </div>
                    <div className="team-card-socials">
                      {member.socials.map((social) => (
                        <a
                          key={social.label}
                          href={social.href}
                          target="_blank"
                          rel="noopener noreferrer"
                          aria-label={social.label}
                        >
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d={social.iconPath} />
                          </svg>
                        </a>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  )
}

export default Team
