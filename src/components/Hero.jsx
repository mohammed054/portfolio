import PlaceholderBox from './shared/PlaceholderBox'
import { Play } from 'lucide-react'

function Hero() {
  return (
    <section className="relative bg-light-bg min-h-screen flex items-center overflow-hidden">
      <div className="container-main w-full">
        <div className="grid grid-cols-1 lg:grid-cols-[55%_45%] items-center gap-8 min-h-[calc(100vh-80px)]">
          <div className="relative z-10 py-20">
            <h1 className="text-[clamp(40px,3rem+2vw,72px)] font-bold leading-[1.05] mb-6 text-text-dark">
              Build Innovative Digital Projects
            </h1>
            <p className="text-[clamp(16px,1rem+0.2vw,18px)] text-text-muted leading-relaxed mb-8 max-w-lg">
              Saber is a digital agency consists of strategists, creative minds, technologists, designers, marketers, storytellers, and inventors. 🤘
            </p>
            <div className="flex items-center gap-8">
              <a href="/about/" className="text-primary font-semibold underline underline-offset-4 hover:text-primary-hover transition-colors">
                Discover More
              </a>
              <div className="flex items-center gap-3 cursor-pointer group">
                <div className="w-12 h-12 border-2 border-secondary rounded-full flex items-center justify-center group-hover:bg-secondary group-hover:text-white transition-all">
                  <Play size={16} className="ml-1" />
                </div>
                <span className="text-xs font-bold tracking-[3px] uppercase text-text-dark">
                  WATCH INTRO
                </span>
              </div>
            </div>
          </div>

          <div className="relative">
            <PlaceholderBox
              id="HOME-HERO-PORTRAIT"
              type="[HERO_IMAGE]"
              width="100%"
              height="900px"
              label="HERO PORTRAIT — man in navy vest, professional headshot-style photo"
              className="max-w-[850px] ml-auto"
            />

            {/* Decorative elements */}
            <PlaceholderBox
              id="HOME-HERO-DECOR-DOTGRID"
              type="[DECORATIVE_GRAPHIC]"
              width="140px"
              height="130px"
              label="DOT GRID"
              className="absolute top-10 right-[20%] hidden lg:flex"
            />
            <PlaceholderBox
              id="HOME-HERO-DECOR-BLUERING"
              type="[DECORATIVE_GRAPHIC]"
              width="230px"
              height="230px"
              label="BLUE RING"
              className="absolute top-0 right-[10%] rounded-full hidden lg:flex"
            />
            <PlaceholderBox
              id="HOME-HERO-DECOR-REDRING"
              type="[DECORATIVE_GRAPHIC]"
              width="250px"
              height="250px"
              label="RED RING"
              className="absolute -bottom-20 left-0 rounded-full hidden lg:flex"
            />
            <PlaceholderBox
              id="HOME-HERO-DECOR-XMARKS"
              type="[DECORATIVE_GRAPHIC]"
              width="50px"
              height="50px"
              label="X MARKS — two white cross marks on hero photo"
              className="absolute top-[40%] left-[30%] hidden lg:flex"
            />
            <PlaceholderBox
              id="HOME-HERO-DECOR-DOTCLUSTER"
              type="[DECORATIVE_GRAPHIC]"
              width="150px"
              height="150px"
              label="DOT CLUSTER — white dots on lower-right of hero photo"
              className="absolute bottom-[10%] right-[5%] hidden lg:flex"
            />
          </div>
        </div>
      </div>
    </section>
  )
}

export default Hero
