import { Link } from 'react-router-dom'
import PlaceholderBox from './shared/PlaceholderBox'
import { Play } from 'lucide-react'
import ReactCountUp from 'react-countup'

const CountUp = ReactCountUp.default || ReactCountUp

const stats = [
  { end: 15, suffix: '+', label: 'Years of Experience' },
  { end: 500, suffix: '+', label: 'Completed Projects' },
  { end: 99, suffix: '%', label: 'Client Satisfaction' },
  { end: 30, suffix: '+', label: 'Team Members' },
]

function Hero() {
  return (
    <section className="relative bg-light-bg min-h-screen flex items-center overflow-hidden">
      <div className="container-main w-full">
        <div className="grid grid-cols-1 lg:grid-cols-[55%_45%] items-center gap-8 min-h-[calc(100vh-80px)]">
          <div className="relative z-10 py-20 max-lg:text-center max-lg:flex max-lg:flex-col max-lg:items-center">
            <h1 className="text-[clamp(36px,2.5rem+2vw,68px)] font-bold leading-[1.05] mb-6 text-text-dark font-[Poppins]">
              Build Innovative Digital Projects
            </h1>
            <p className="text-[clamp(15px,0.95rem+0.2vw,18px)] text-text-muted leading-[1.7] mb-8 max-w-[520px]">
              Saber is a digital agency consists of strategists, creative minds, technologists, designers, marketers, storytellers, and inventors. 🤘
            </p>
            <div className="flex items-center gap-8 max-lg:justify-center">
              <Link
                to="/about/"
                className="text-primary font-semibold text-[15px] relative group"
              >
                Discover More
                <span className="absolute bottom-0 left-0 w-full h-[2px] bg-primary scale-x-100 group-hover:scale-x-0 transition-transform duration-300 origin-left" />
              </Link>
              <div className="flex items-center gap-3 cursor-pointer group">
                <div className="w-[50px] h-[50px] border-2 border-secondary rounded-full flex items-center justify-center group-hover:bg-secondary group-hover:text-white transition-all duration-300 text-secondary">
                  <Play size={16} className="ml-0.5" fill="currentColor" />
                </div>
                <span className="text-[11px] font-bold tracking-[3px] uppercase text-text-dark">
                  WATCH INTRO
                </span>
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mt-14 max-lg:justify-center">
              {stats.map((stat, i) => (
                <div key={i} className="text-center lg:text-left">
                  <div className="text-[clamp(28px,2rem+1vw,40px)] font-bold text-text-dark font-[Poppins]">
                    <CountUp end={stat.end} duration={2.5} enableScrollSpy scrollSpyOnce />{stat.suffix}
                  </div>
                  <p className="text-text-muted text-[14px] mt-1">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="relative max-lg:hidden">
            <img
              src="/images/hero-saber.webp"
              alt="Saber Nasr — Professional portrait"
              className="max-w-[850px] w-full ml-auto object-contain"
              width="555"
              height="1000"
            />

            {/* Decorative elements */}
            <PlaceholderBox
              id="HOME-HERO-DECOR-DOTGRID"
              type="[DECORATIVE_GRAPHIC]"
              width="140px"
              height="130px"
              label="DOT GRID"
              className="absolute top-10 right-[20%]"
            />
            <PlaceholderBox
              id="HOME-HERO-DECOR-BLUERING"
              type="[DECORATIVE_GRAPHIC]"
              width="230px"
              height="230px"
              label="BLUE RING"
              className="absolute top-0 right-[10%] rounded-full"
            />
            <PlaceholderBox
              id="HOME-HERO-DECOR-REDRING"
              type="[DECORATIVE_GRAPHIC]"
              width="250px"
              height="250px"
              label="RED RING"
              className="absolute -bottom-20 left-0 rounded-full"
            />
            <PlaceholderBox
              id="HOME-HERO-DECOR-XMARKS"
              type="[DECORATIVE_GRAPHIC]"
              width="50px"
              height="50px"
              label="X MARKS — two white cross marks on hero photo"
              className="absolute top-[40%] left-[30%]"
            />
            <PlaceholderBox
              id="HOME-HERO-DECOR-DOTCLUSTER"
              type="[DECORATIVE_GRAPHIC]"
              width="150px"
              height="150px"
              label="DOT CLUSTER — white dots on lower-right of hero photo"
              className="absolute bottom-[10%] right-[5%]"
            />
          </div>
        </div>
      </div>
    </section>
  )
}

export default Hero
