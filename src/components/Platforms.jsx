import { useRef } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import Reveal from './shared/Reveal'

const platforms = [
  { id: 'HOME-PLATFORM-1', label: 'Fiverr', href: 'https://www.fiverr.com/saber_nasr', src: '/images/platforms/fiverr.png' },
  { id: 'HOME-PLATFORM-2', label: 'Upwork', href: 'https://www.upwork.com/freelancers/saber', src: '/images/platforms/upwork.png' },
  { id: 'HOME-PLATFORM-3', label: 'Freelancer', href: 'https://www.freelancer.com/u/SaberElbendary', src: '/images/platforms/freelancer.png' },
  { id: 'HOME-PLATFORM-4', label: 'Saber Nasr', href: 'https://sabernasr.com', src: '/images/platforms/snd-design.png' },
]

function Platforms() {
  const scrollRef = useRef(null)

  const scroll = (dir) => {
    if (!scrollRef.current) return
    const amount = 300
    scrollRef.current.scrollBy({ left: dir === 'left' ? -amount : amount, behavior: 'smooth' })
  }

  return (
    <section className="section-padding bg-white">
      <div className="container-main">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_2fr] gap-12 items-center">
          <Reveal variant="fadeLeft">
            <div className="text-left">
              <span className="inline-block text-[0.722rem] font-semibold tracking-[2px] uppercase mb-4" style={{ fontFamily: "'europa', sans-serif", color: '#A5A6AA' }}>
                Huge Honor
              </span>
              <h2 className="text-[clamp(28px,1.5rem+1.2vw,42px)] font-bold leading-tight" style={{ fontFamily: "'sofia-pro', 'Poppins', sans-serif", color: '#222733' }}>
                Our Platforms
              </h2>
            </div>
            <div className="flex gap-3 mt-6">
              <button onClick={() => scroll('left')} className="w-12 h-12 border border-card-border rounded-full flex items-center justify-center hover:bg-primary hover:text-white hover:border-primary transition-all duration-300">
                <ChevronLeft size={18} />
              </button>
              <button onClick={() => scroll('right')} className="w-12 h-12 border border-card-border rounded-full flex items-center justify-center hover:bg-primary hover:text-white hover:border-primary transition-all duration-300">
                <ChevronRight size={18} />
              </button>
            </div>
          </Reveal>

          <Reveal variant="fadeRight">
            <div
              ref={scrollRef}
              className="flex gap-[30px] overflow-x-auto scrollbar-hide pb-4"
              style={{ scrollSnapType: 'x mandatory' }}
            >
              {platforms.map((platform) => (
                <a
                  key={platform.id}
                  href={platform.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex-shrink-0 hover:opacity-70 transition-opacity duration-300"
                  style={{ scrollSnapAlign: 'start', width: 'calc(33.333% - 20px)', minWidth: '200px' }}
                >
                  <img
                    src={platform.src}
                    alt={platform.label}
                    className="w-full h-[100px] object-contain"
                    loading="lazy"
                  />
                </a>
              ))}
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  )
}

export default Platforms
