import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Play } from 'lucide-react'

const slides = [
  {
    heading: 'Build Innovative Digital Projects',
    text: 'Saber is a digital agency consists of strategists, creative minds, technologists, designers, marketers, storytellers, and inventors. 🤘',
  },
  {
    heading: 'Creative Solutions for Your Brand',
    text: 'We craft unique digital experiences that elevate your brand and connect with your audience.',
  },
  {
    heading: 'Let\'s Build Something Amazing',
    text: 'From strategy to execution, we deliver results that drive growth and success for your business.',
  },
]

function Hero() {
  const [currentSlide] = useState(0)

  return (
    <section className="relative bg-light-bg min-h-screen flex items-center overflow-hidden">
      <div className="container-main w-full">
        <div className="grid grid-cols-1 lg:grid-cols-[55%_45%] items-center gap-8 min-h-[calc(100vh-80px)]">
          <div className="relative z-10 py-20 max-lg:text-center max-lg:flex max-lg:flex-col max-lg:items-center">
            <h1 className="text-[clamp(36px,2.5rem+2vw,68px)] font-bold leading-[1.05] mb-6 text-text-dark font-[Poppins]">
              {slides[currentSlide].heading}
            </h1>
            <p className="text-[clamp(15px,0.95rem+0.2vw,18px)] text-text-muted leading-[1.7] mb-8 max-w-[520px]">
              {slides[currentSlide].text}
            </p>
            <div className="flex items-center gap-8 max-lg:justify-center">
              <Link
                to="/about/"
                className="text-primary font-semibold text-[0.833rem] relative group"
              >
                Discover More
                <span className="absolute bottom-0 left-0 w-full h-[2px] bg-primary scale-x-100 group-hover:scale-x-0 transition-transform duration-300 origin-left" />
              </Link>
              <div className="watch-intro flex items-center gap-3 cursor-pointer group">
                <div className="play-ring w-[50px] h-[50px] border-2 border-secondary rounded-full flex items-center justify-center group-hover:bg-secondary group-hover:text-white transition-all duration-300 text-secondary">
                  <Play size={16} className="ml-0.5" fill="currentColor" />
                </div>
                <span className="text-[0.611rem] font-bold tracking-[3px] uppercase text-text-dark">
                  WATCH INTRO
                </span>
              </div>
            </div>

            {/* Slider navigation dots */}
            <div className="flex gap-2 mt-12 max-lg:justify-center">
              {slides.map((_, i) => (
                <button
                  key={i}
                  className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${
                    i === currentSlide ? 'bg-primary w-8' : 'bg-border'
                  }`}
                  aria-label={`Go to slide ${i + 1}`}
                />
              ))}
            </div>
          </div>

          <div className="relative max-lg:hidden">
            <img
              src="/images/hero-saber.webp"
              alt="Saber Nasr — Professional portrait"
              className="max-w-[850px] w-full ml-auto object-contain relative z-[2]"
              width="555"
              height="1000"
            />

            <div className="absolute top-10 right-[20%] w-[140px] h-[130px] border border-dashed border-text-muted/20 z-[1]" aria-hidden="true" />
            <div className="absolute top-0 right-[10%] w-[230px] h-[230px] border-2 border-secondary/30 rounded-full z-[1]" aria-hidden="true" />
            <div className="absolute -bottom-20 left-0 w-[250px] h-[250px] border-2 border-primary/30 rounded-full z-[1]" aria-hidden="true" />
            <div className="absolute top-[40%] left-[30%] z-[3]" aria-hidden="true">
              <svg width="50" height="50" viewBox="0 0 50 50" fill="none" xmlns="http://www.w3.org/2000/svg">
                <line x1="10" y1="10" x2="40" y2="40" stroke="white" strokeWidth="2" opacity="0.6"/>
                <line x1="40" y1="10" x2="10" y2="40" stroke="white" strokeWidth="2" opacity="0.6"/>
              </svg>
            </div>
            <div className="absolute bottom-[10%] right-[5%] z-[3]" aria-hidden="true">
              <svg width="150" height="150" viewBox="0 0 150 150" fill="none" xmlns="http://www.w3.org/2000/svg">
                {[...Array(25)].map((_, i) => (
                  <circle key={i} cx={15 + (i % 5) * 30} cy={15 + Math.floor(i / 5) * 30} r="2" fill="white" opacity="0.5"/>
                ))}
              </svg>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Hero
